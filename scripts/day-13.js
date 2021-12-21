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

const folds = data
  .filter((line) => line.indexOf("fold") > -1)
  .map((instruction) => instruction.replace("fold along ", "").split("="));

const dots = data
  .filter((line) => /[0-9]/.test(line[0]))
  .map((coord) => coord.split(",").map((num) => parseInt(num)));

const grid = Array.from(
  { length: Math.max(...dots.map((coord) => coord[1])) + 1 },
  (_, rowIndex) => {
    return Array.from(
      {
        length: Math.max(...dots.map((coord) => coord[0])) + 1,
      },
      (_, colIndex) => {
        if (
          dots.find((coord) => coord[0] === colIndex && coord[1] === rowIndex)
        ) {
          return "#";
        }
        return ".";
      }
    );
  }
);

const fold = (grid, instruction) => {
  let newGrid = JSON.parse(JSON.stringify(grid));
  if (instruction[0] === "y") {
    for (let y = 0; y < parseInt(instruction[1]); y++) {
      newGrid[y].forEach((char, index) => {
        if (char === ".") {
          newGrid[y][index] = newGrid[parseInt(instruction[1]) * 2 - y][index];
        }
      });
    }
    return newGrid.slice(0, parseInt(instruction[1]));
  } else {
    newGrid = newGrid.map((row) => {
      for (let x = 0; x < parseInt(instruction[1]); x++) {
        if (row[x] === ".") {
          row[x] = row[parseInt(instruction[1]) * 2 - x];
        }
      }
      return row.slice(0, parseInt(instruction[1]));
    });
    return newGrid;
  }
};

console.log(
  "Part 1:",
  fold(grid, folds[0]).reduce((acc, curr) => {
    return acc + curr.filter((char) => char === "#").length;
  }, 0)
);

let currGrid = JSON.parse(JSON.stringify(grid));

for (let i = 0; i < folds.length; i++) {
  console.log("Fold along:", folds[i]);
  currGrid = fold(currGrid, folds[i]);
}

fs.writeFileSync(
  `${__dirname}/day-13-output.txt`,
  currGrid.map((line) => line.join("")).join("\n")
);

console.log("Part 2: See file 'day-13-output.txt'");
