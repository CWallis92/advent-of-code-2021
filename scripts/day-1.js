const fs = require("fs");

const inputs = fs
  .readFileSync(`${__dirname}/../data/day-1.txt`, "utf8")
  .split("\n")
  .map((val) => parseInt(val));

const increases = inputs.reduce((acc, curr, index, array) => {
  if (curr > array[index - 1]) acc++;
  return acc;
}, 0);

console.log("Part 1:", increases);

const partTwo = inputs.reduce((acc, curr, index, array) => {
  const prevSum = array[index - 3] + array[index - 2] + array[index - 1];
  const currSum = array[index - 2] + array[index - 1] + curr;
  if (currSum > prevSum) acc++;
  return acc;
}, 0);

console.log("Part 2:", partTwo);
