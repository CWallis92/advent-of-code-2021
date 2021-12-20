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

function getAdjacent(x, y) {
  return [
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
    [x, y - 1],
  ];
}

const propagate = (x, y, basin = []) => {
  for (const [xx, yy] of getAdjacent(x, y)) {
    if (
      grid[xx] &&
      grid[xx][yy] !== undefined &&
      !basin.find((point) => point[0] === xx && point[1] === yy)
    ) {
      if (grid[xx][yy] < 9) {
        basin.push([xx, yy]);
        propagate(xx, yy, basin);
      }
    }
  }
  return basin;
};

const basinMaps = basins
  .map(({ row, col }) => {
    return propagate(row, col, [[row, col]]).length;
  })
  .sort((a, b) => b - a);

console.log(
  "Part 2:",
  basinMaps.slice(0, 3).reduce((acc, curr) => acc * curr)
);
