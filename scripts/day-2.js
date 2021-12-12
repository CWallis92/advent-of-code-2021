const fs = require("fs");

const inputs = fs
  .readFileSync(`${__dirname}/../data/day-2.txt`, "utf8")
  .split("\n");

const { hor, depth } = inputs.reduce(
  (acc, curr) => {
    const [direction, distance] = curr.split(" ");
    if (direction == "forward") acc.hor += parseInt(distance);
    else {
      acc.depth += direction == "up" ? -parseInt(distance) : parseInt(distance);
    }
    return acc;
  },
  { hor: 0, depth: 0 }
);

console.log("Part 1:", hor * depth);

const { newHor, newDepth } = inputs.reduce(
  (acc, curr) => {
    const [command, magnitude] = curr.split(" ");
    if (command == "forward") {
      acc.newHor += parseInt(magnitude);
      acc.newDepth += parseInt(magnitude) * acc.aim;
    } else {
      acc.aim += command == "up" ? -parseInt(magnitude) : parseInt(magnitude);
    }
    return acc;
  },
  { newHor: 0, newDepth: 0, aim: 0 }
);

console.log("Part 2:", newHor * newDepth);
