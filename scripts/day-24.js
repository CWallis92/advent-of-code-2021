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

let w = 0,
  x = 0,
  y = 0,
  z = 0;

// Lines 1-18 are arbitrary: first digit is 9
// Lines 19-36 is same: first digit is 9
// Lines 37-54 is same: first digit is 9
// Lines 55-72: 9
// 73-90: 9
// 91-108: 9
// 109-126: 9
// 127-144: 9
// 145-162: 9
// 163-180: 9
// 181-198: 9
// 199-216: 9
// 217-234: 9
// 235-252: 9

data.forEach((line) => {});
