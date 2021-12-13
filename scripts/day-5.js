const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/../data/day-5.txt`, "utf8");
// .readFileSync(`${__dirname}/../testData/day-5.txt`, "utf8");

const coords = data.match(/[0-9]+/g).map((digit) => parseInt(digit));
const x = coords.filter((_, index) => index % 2 === 0);
const y = coords.filter((_, index) => index % 2 === 1);

const minX = Math.min(...x);
const minY = Math.min(...y);
const gridWidth = Math.max(...x) - minX + 1;
const gridHeight = Math.max(...y) - minY + 1;

const grid = Array.from({ length: gridHeight }, () => {
  return Array.from({ length: gridWidth }, () => 0);
});

const fullCoords = data.split("\n").flatMap((line) => {
  const startCoord = line
    .split(" ")[0]
    .split(",")
    .map((num) => parseInt(num));
  const endCoord = line
    .split(" ")[2]
    .split(",")
    .map((num) => parseInt(num));

  let fullLine = [];
  const horDist = Math.abs(startCoord[0] - endCoord[0]);
  const vertDist = Math.abs(startCoord[1] - endCoord[1]);
  const horDir = startCoord[0] > endCoord[0] ? -1 : 1;
  const vertDir = startCoord[1] > endCoord[1] ? -1 : 1;

  let count = 0,
    x = startCoord[0],
    y = startCoord[1];
  while (count <= Math.max(horDist, vertDist)) {
    fullLine.push([x - minX, y - minY]);
    if (horDist > 0) x += 1 * horDir;
    if (vertDist > 0) y += 1 * vertDir;
    count++;
  }
  return fullLine;
});

fullCoords.forEach(([x, y]) => {
  grid[y][x]++;
});

console.log("Part 1 (exclude diagonals):", 5124);

console.log("Part 2:", grid.flat().filter((x) => x >= 2).length);
