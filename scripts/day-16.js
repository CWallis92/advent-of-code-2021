const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      // "testData" +
      "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n")[0];

let initialPacket = "";
for (let i = 0; i < data.length; i++) {
  let bit = parseInt(data[i], 16).toString(2);
  while (bit.length < 4) {
    bit = "0" + bit;
  }
  initialPacket += bit;
}

const findLiteral = (packet) => {
  let binaryNum = "",
    checker = 0;
  while (packet[checker] === "1") {
    binaryNum += packet.substring(checker + 1, checker + 5);
    checker += 5;
  }
  binaryNum += packet.substring(checker + 1, checker + 5);
  return [packet.substring(checker + 5), parseInt(binaryNum, 2)];
};

const parsePacket = (packet) => {
  let newPacket = packet;
  const versions = [];
  const outNums = [];

  versions.push(parseInt(newPacket.substring(0, 3), 2));
  newPacket = newPacket.substring(3);

  const type = parseInt(newPacket.substring(0, 3), 2);
  newPacket = newPacket.substring(3);

  if (type === 4) {
    [newPacket, outNum] = findLiteral(newPacket);
    outNums.push(outNum);
  } else {
    const operatorOutNums = [];
    const lengthType = newPacket.substring(0, 1);
    newPacket = newPacket.substring(1);
    if (lengthType === "0") {
      let subPacketsBitLength = parseInt(newPacket.substring(0, 15), 2);
      newPacket = newPacket.substring(15);
      while (subPacketsBitLength > 0) {
        const [subPacketVersions, subPacket, subPacketOuts] =
          parsePacket(newPacket);
        versions.push(...subPacketVersions);
        operatorOutNums.push(...subPacketOuts);
        subPacketsBitLength -= newPacket.length - subPacket.length;
        newPacket = subPacket;
      }
    } else {
      let subPacketsCount = parseInt(newPacket.substring(0, 11), 2);
      newPacket = newPacket.substring(11);
      while (subPacketsCount > 0) {
        const [subPacketVersions, subPacket, subPacketOuts] =
          parsePacket(newPacket);
        versions.push(...subPacketVersions);
        operatorOutNums.push(...subPacketOuts);
        subPacketsCount--;
        newPacket = subPacket;
      }
    }
    operatorOut = operatorOutNums.reduce((acc, curr, index, nums) => {
      switch (type) {
        case 0:
          acc += curr;
          break;
        case 1:
          acc = index === 0 && acc === 0 ? curr : acc * curr;
          break;
        case 2:
          acc = index === 0 && acc === 0 ? curr : Math.min(acc, curr);
          break;
        case 3:
          acc = index === 0 && acc === 0 ? curr : Math.max(acc, curr);
          break;
        case 5:
          acc = nums[0] > nums[1] ? 1 : 0;
          break;
        case 6:
          acc = nums[0] < nums[1] ? 1 : 0;
          break;
        case 7:
          acc = nums[0] === nums[1] ? 1 : 0;
          break;
        default:
          break;
      }
      return acc;
    }, 0);
    outNums.push(operatorOut);
  }
  return [versions, newPacket, outNums];
};

console.log(
  "Part 1:",
  parsePacket(initialPacket)[0].reduce((acc, curr) => acc + curr)
);

console.log("Part 2:", parsePacket(initialPacket)[2][0]);
