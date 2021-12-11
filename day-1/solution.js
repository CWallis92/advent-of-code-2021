const fs = require("fs");

const inputs = fs.readFileSync(`${__dirname}/data.txt`, "utf8").split("\n");

const increases = inputs.reduce((acc, curr, index, array) => {
  if (parseInt(curr) > parseInt(array[index - 1])) acc = acc + 1;
  return acc;
}, 0);

console.log(increases);

const partTwo = inputs.reduce((acc, curr, index, array) => {
  const prevSum =
    parseInt(array[index - 1]) +
    parseInt(array[index - 2]) +
    parseInt(array[index - 3]);
  const currSum =
    parseInt(curr) + parseInt(array[index - 1]) + parseInt(array[index - 2]);
  if (currSum > prevSum) acc++;
  return acc;
}, 0);

console.log(partTwo);
