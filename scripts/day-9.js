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

const grid = data.map((row) => row.split("").map((num) => parseInt(num)));

const basins = [];

grid.forEach((rowArray, row) => {
  rowArray.forEach((num, col) => {
    if (
      [
        grid[row - 1] === undefined ? undefined : grid[row - 1][col],
        grid[row] === undefined ? undefined : grid[row][col - 1],
        grid[row] === undefined ? undefined : grid[row][col + 1],
        grid[row + 1] === undefined ? undefined : grid[row + 1][col],
      ].every((checkNum) => checkNum > num || checkNum === undefined)
    )
      basins.push({
        risk: num + 1,
        size: 0,
        row,
        col,
      });
  });
});

console.log(
  "Part 1:",
  basins.reduce((acc, curr) => acc + curr.risk, 0)
);

// The below is fine for the test data, but exceeds maximum call stack depth when called on input data
// See day-9-solution.js for working part 2. Need to understand this solution and rewrite
const basinMap = (
  row,
  col,
  dirs = { above: true, below: true, left: true, right: true }
) => {
  let count = 1;
  if (dirs.above && grid[row - 1] && grid[row - 1][col] < 9) {
    count += basinMap(row - 1, col, {
      above: true,
      below: false,
      left: grid[row][col - 1] === 9,
      right: grid[row][col + 1] === 9,
    });
  }
  if (dirs.below && grid[row + 1] && grid[row + 1][col] < 9) {
    count += basinMap(row + 1, col, {
      above: false,
      below: true,
      left: grid[row][col - 1] === 9,
      right: grid[row][col + 1] === 9,
    });
  }
  if (dirs.left && grid[row][col - 1] < 9) {
    count += basinMap(row, col - 1, {
      above: true,
      below: true,
      left: true,
      right: false,
    });
  }
  if (dirs.right && grid[row][col + 1] < 9) {
    count += basinMap(row, col + 1, {
      above: true,
      below: true,
      left: false,
      right: true,
    });
  }
  return count;
};

const basinSizes = basins
  .map((basin) => {
    return basinMap(basin.row, basin.col);
  })
  .sort((a, b) => b - a);

console.log(
  "Part 2:",
  basinSizes.slice(0, 3).reduce((acc, curr) => acc * curr)
);
