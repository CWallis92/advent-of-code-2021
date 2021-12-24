const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      "testData" +
      // "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n");
// .map((array) => JSON.parse(array));

const getExplodeIndex = (arrStr) => {
  let bracketCount = 0,
    char = 0;
  while (char < arrStr.length) {
    if (arrStr[char] === "[") bracketCount++;
    if (arrStr[char] === "]") bracketCount--;
    if (bracketCount === 5) break;
    char++;
  }
  return char === arrStr.length ? -1 : char;
};

const addPairs = (arrStr1, arrStr2) => {
  let sumArrStr = `[${arrStr1},${arrStr2}]`,
    explodeIndex = getExplodeIndex(sumArrStr),
    splitIndex = sumArrStr.search(/\d{2}/);

  while (explodeIndex > -1 || splitIndex > -1) {
    if ((splitIndex > -1 && splitIndex < explodeIndex) || explodeIndex === -1) {
      const num = parseInt(sumArrStr.substring(splitIndex).match(/\d{2}/)[0]);
      const preString = sumArrStr.substring(0, splitIndex);
      const postString = sumArrStr.substring(splitIndex + 2);
      sumArrStr = `${preString}[${Math.floor(num / 2)},${Math.ceil(
        num / 2
      )}]${postString}`;
    } else {
      const deepArr = JSON.parse(
        sumArrStr.substring(explodeIndex).match(/\[[\d,]+\]/)
      );
      let preString = sumArrStr.substring(0, explodeIndex);

      const preDigit = preString.match(/\d(?!.*\d)/);

      if (preDigit) {
        const newNum = parseInt(preDigit[0]) + deepArr[0];
        preString = preString.replace(/\d(?!.*\d)/, newNum.toString());
      }

      let postString = sumArrStr.substring(explodeIndex);
      let x = postString.indexOf("]") + 1;
      postString = postString.substring(x);
      const postDigit = postString.match(/\d+/);

      if (postDigit) {
        const newNum = parseInt(postDigit[0]) + deepArr[1];
        postString = postString.replace(/\d+/, newNum);
      }

      sumArrStr = `${preString}0${postString}`;
    }
    explodeIndex = getExplodeIndex(sumArrStr);
    splitIndex = sumArrStr.search(/\d{2}/);
  }
  return sumArrStr;
};

let outStr = addPairs(data[0], data[1]),
  index = 2;

// while (index < data.length) {
//   outStr = addPairs(outStr, data[index]);
//   index++;
// }

console.log("Part 1:", outStr);
