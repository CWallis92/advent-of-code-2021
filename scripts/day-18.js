const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      "testData" +
      // "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n")
  .map((array) => JSON.parse(array));

console.log(data);

const applyReducer = (arr) => {
  let i = 0;

  while (i < arr.length) {
    // Check current array item depth. If 4, return new array with explosion
    if (Array.isArray(arr[i])) {
      const nestedArr = arr[i];

      depth++;
      if (depth === 4) {
        const str = JSON.stringify(arr);
        const explodeLoc = str.indexOf(`[${arr[i]}]`);

        let preString = str.substring(0, explodeLoc);
        const preDigit = preString.match(/\d(?!.*\d)/);
        if (preDigit) {
          const newNum = parseInt(preDigit) + arr[0];
          preString = preString.replace(/\d(?!.*\d)/, newNum.toString());
        }

        let postString = str.substring(explodeLoc + 5);
        const postDigit = postString.match(/\d/);
        if (postDigit) {
          const newNum = parseInt(postDigit) + arr[1];
          postString.replace(/\d/, newNum);
        }

        return [JSON.parse(preString + "0" + postString), false];
      }
    }

    // This bit should be fine? Apply recursion
    else if (item >= 10) {
      arr[i] = [Math.floor(arr[i]), Math.ceil(arr[i])];
      return [arr, false];
    }

    i++;
  }

  return [arr, true];
};

const addPairs = (arr1, arr2) => {
  let sumArr = [arr1].concat([arr2]);
  let finished = false;
  while (!finished) {
    const [newArr, newFinished] = applyReducer(sumArr);
    sumArr = newArr;
    finished = newFinished;
  }
};

console.log(addPairs(data[0], data[1]));
