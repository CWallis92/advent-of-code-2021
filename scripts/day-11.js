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

let grid = data.map((row) => {
  return row.split("").map((num) => {
    return { num: parseInt(num), flashed: false };
  });
});

function getAdjacent(x, y) {
  // Clockwise from top
  return [
    [x - 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
    [x - 1, y - 1],
  ];
}

const propagate = (x, y) => {
  for (const [xx, yy] of getAdjacent(x, y)) {
    if (grid[xx] && grid[xx][yy] !== undefined && !grid[xx][yy].flashed) {
      if (grid[xx][yy].num < 9) {
        grid[xx][yy].num++;
      } else if (grid[xx][yy].num === 9) {
        grid[xx][yy].num = 0;
        grid[xx][yy].flashed = true;
        flashes++;
        propagate(xx, yy);
      }
    }
  }
};

let flashes = 0;

for (let day = 1; day <= 100; day++) {
  grid.forEach((row, x) => {
    row.forEach(({ num }, y) => {
      if (!grid[x][y].flashed) {
        if (num < 9) {
          grid[x][y].num++;
        } else {
          grid[x][y].num = 0;
          grid[x][y].flashed = true;
          flashes++;
          propagate(x, y);
        }
      }
    });
  });

  grid = grid.map((row) => {
    return row.map(({ num }) => {
      return {
        num,
        flashed: false,
      };
    });
  });
}

console.log("Part 1:", flashes);

// Part 2: Reset
grid = data.map((row) => {
  return row.split("").map((num) => {
    return { num: parseInt(num), flashed: false };
  });
});

let day = 1;

do {
  grid.forEach((row, x) => {
    row.forEach(({ num }, y) => {
      if (!grid[x][y].flashed) {
        if (num < 9) {
          grid[x][y].num++;
        } else {
          grid[x][y].num = 0;
          grid[x][y].flashed = true;
          flashes++;
          propagate(x, y);
        }
      }
    });
  });

  if (grid.flat().every(({ flashed }) => flashed)) break;

  grid = grid.map((row) => {
    return row.map(({ num }) => {
      return {
        num,
        flashed: false,
      };
    });
  });
  day++;
} while (true);

console.log("Part 2:", day);
