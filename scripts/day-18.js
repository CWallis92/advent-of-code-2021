const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      // "testData" +
      "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n");

const getExplodeIndex = (arr) => {
  let bracketCount = 0,
    char = 0;
  while (char < arr.length) {
    if (arr[char] === "[") bracketCount++;
    if (arr[char] === "]") bracketCount--;
    if (bracketCount === 5) break;
    char++;
  }
  return char === arr.length ? -1 : char;
};

const fishReduce = (arr) => {
  let explodeIndex = getExplodeIndex(arr);
  if (explodeIndex > -1) {
    const explodeArr = arr.substring(explodeIndex).match(/\[[\d,]+\]/)[0];
    const parsedExplode = JSON.parse(explodeArr);

    let leftArr = arr.substring(0, explodeIndex);
    const leftNum = leftArr.match(/\d+(?!.*\d+)/);
    if (leftNum) {
      leftArr = leftArr.replace(
        /\d+(?!.*\d+)/,
        parseInt(leftNum[0]) + parsedExplode[0]
      );
    }

    let rightArr = arr.substring(explodeIndex + explodeArr.length);
    const rightNum = rightArr.match(/\d+/);
    if (rightNum) {
      rightArr = rightArr.replace(
        /\d+/,
        parseInt(rightNum[0]) + parsedExplode[1]
      );
    }

    return fishReduce(leftArr + "0" + rightArr);
  }

  let splitIndex = arr.search(/\d{2}/);
  if (splitIndex > -1) {
    const splitNum = arr.substring(splitIndex).match(/\d{2}/)[0];

    const leftArr = arr.substring(0, splitIndex);
    const rightArr = arr.substring(splitIndex + splitNum.length);

    return fishReduce(
      leftArr +
        "[" +
        Math.floor(parseInt(splitNum) / 2) +
        "," +
        Math.ceil(parseInt(splitNum) / 2) +
        "]" +
        rightArr
    );
  }

  return arr;
};

const summedArray = data.reduce((acc, curr) => {
  if (acc === "") return fishReduce(curr);
  acc = "[" + acc + "," + curr + "]";
  acc = fishReduce(acc);

  return acc;
}, "");

const getMagnitude = (input) => {
  let out = 0;
  out += Array.isArray(input[0]) ? 3 * getMagnitude(input[0]) : 3 * input[0];
  out += Array.isArray(input[1]) ? 2 * getMagnitude(input[1]) : 2 * input[1];
  return out;
};

console.log("Part 1:", getMagnitude(JSON.parse(summedArray)));

let max = 0,
  index = 0;
while (index < data.length) {
  const splicedData = JSON.parse(JSON.stringify(data));
  const currNum = splicedData.splice(index, 1);

  splicedData.forEach((arr) => {
    const sum = "[" + currNum + "," + arr + "]";
    const magnitude = getMagnitude(JSON.parse(fishReduce(sum)));
    if (magnitude > max) max = magnitude;
  });

  index++;
}

console.log("Part 2:", max);
