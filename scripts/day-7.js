const fs = require("fs");

const data = fs
  .readFileSync(`${__dirname}/../data/day-7.txt`, "utf8")
  // .readFileSync(`${__dirname}/../testData/day-7.txt`, "utf8")
  .split(",")
  .map((item) => parseInt(item));

// SOlution 1: Only used values in the input, which did not work for part 2
// const values= [...new Set(data)];
// .reduce((acc, curr) => {
//   if (data.filter((item) => item === curr).length >= 3) {
//     acc.push(curr);
//   }
//   return acc;
// }, []);
// .sort((a, b) => {
//   return (
//     data.filter((item) => item === b).length -
//     data.filter((item) => item === a).length
//   );
// });

const highest = Math.max(...data);
const lowest = Math.min(...data);

const values = Array.from({ length: highest - lowest + 1 }, (_, i) => i);

const part1Distances = values.map((item) => {
  return data.reduce((acc, curr) => {
    return acc + Math.abs(curr - item);
  }, 0);
});

console.log("Part 1:", Math.min(...part1Distances));

const part2Distances = values.map((item) => {
  return data.reduce((acc, curr) => {
    const linearDist = Math.abs(curr - item);
    return acc + 0.5 * linearDist * (linearDist + 1);
  }, 0);
});

console.log("Part 2:", Math.min(...part2Distances));
