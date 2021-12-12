const fs = require("fs");

const data = fs
  // .readFileSync(`${__dirname}/../data/day-4.txt`, "utf8")
  .readFileSync(`${__dirname}/../tests/day-4.txt`, "utf8")
  .split("\n\n");

const inputs = data.shift().split(",");

class Board {
  constructor(grid) {
    this.flatGrid = [].concat(...grid);
    this.rows = [];
    grid.forEach((row, rowIndex) => {
      this.rows.push(row);
    });
    this.cols = this.rows[0].map((_, colIndex) =>
      this.rows.map((row) => row[colIndex])
    );
    this.won = false;
  }

  updateGrid(val) {
    if (this.flatGrid.indexOf(val) > -1) {
      const rowToShrink = this.rows.findIndex((row) => row.indexOf(val) > -1);
      const colToShrink = this.cols.findIndex((row) => row.indexOf(val) > -1);
      this.rows[rowToShrink].splice(this.rows[rowToShrink].indexOf(val), 1);
      this.cols[colToShrink].splice(this.cols[colToShrink].indexOf(val), 1);
      this.flatGrid.splice(this.flatGrid.indexOf(val), 1);
      return this.checkWinner();
    }
    return false;
  }

  checkWinner() {
    if (
      Math.min(...this.rows.map((row) => row.length)) === 0 ||
      Math.min(...this.cols.map((col) => col.length)) === 0
    ) {
      this.won = true;
      return true;
    }
    return false;
  }
}

const grids = data.map((grid) => {
  const gridArray = grid
    .split("\n")
    .map((row) => row.split(/[^0-9]+/).filter((item) => item));
  return new Board(gridArray);
});

// Part 1
let win = false,
  calledNum = "",
  callIndex = 0,
  winningGridSum = 0;

while (callIndex < inputs.length) {
  calledNum = inputs[callIndex];
  grids.forEach((grid) => {
    if (grid.updateGrid(calledNum)) {
      winningGridSum = grid.flatGrid.reduce(
        (acc, curr) => parseInt(acc) + parseInt(curr)
      );
      win = true;
    }
  });
  if (win) break;
  callIndex++;
}

console.log("Part 1:", winningGridSum * parseInt(calledNum));

// Part 2
//   calledNum = "",
//   callIndex = 0,
//   winningGridSum = 0;

// while (callIndex < inputs.length) {
//   calledNum = inputs[callIndex];
//   grids.forEach((grid) => {
//     if (grid.updateGrid(calledNum)) {
//       winningGridSum = grid.flatGrid.reduce(
//         (acc, curr) => parseInt(acc) + parseInt(curr)
//       );
//       win = true;
//     }
//   });
//   if (win) break;
//   callIndex++;
// }

console.log("Part 2:");
