const fs = require("fs");
const Graph = require("node-dijkstra");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      // "testData" +
      "data" +
      `/day-15.txt`,
    "utf8"
  )
  .split("\n")
  .map((row) => row.split("").map((num) => parseInt(num)));

function getAdjacent(x, y) {
  return [
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
    [x, y - 1],
  ];
}

const route = new Graph();

data.forEach((row, rowIndex) => {
  row.forEach((_, colIndex) => {
    const availableAdjacents = getAdjacent(rowIndex, colIndex).filter(
      ([x, y]) => {
        return data[x] && data[x][y];
      }
    );
    const adjacents = {};
    availableAdjacents.forEach(([x, y]) => {
      adjacents[`${x},${y}`] = data[x][y];
    });
    route.addNode(`${rowIndex},${colIndex}`, adjacents);
  });
});

const shortestRoute = route.path(
  "0,0",
  `${data.length - 1},${data[0].length - 1}`
);

const weights = shortestRoute.map((coord) => {
  const [x, y] = coord.split(",");
  return data[x][y];
});

weights.shift();

console.log(
  "Part 1:",
  weights.reduce((acc, curr) => acc + curr)
);

// Add new cols
const fullGrid = JSON.parse(JSON.stringify(data));
fullGrid.forEach((_, row) => {
  const origRow = [...fullGrid[row]];
  for (let i = 1; i < 5; i++) {
    const newCols = origRow.map((col) =>
      col + i >= 10 ? col + i - 9 : col + i
    );
    fullGrid[row].push(...newCols);
  }
});

const origGrid = JSON.parse(JSON.stringify(fullGrid));
for (let i = 1; i < 5; i++) {
  const newGrid = origGrid.map((row) => {
    return row.map((col) => (col + i >= 10 ? col + i - 9 : col + i));
  });
  fullGrid.push(...newGrid);
}

const newRoute = new Graph();

fullGrid.forEach((row, rowIndex) => {
  row.forEach((_, colIndex) => {
    const availableAdjacents = getAdjacent(rowIndex, colIndex).filter(
      ([x, y]) => {
        return fullGrid[x] && fullGrid[x][y];
      }
    );
    const adjacents = {};
    availableAdjacents.forEach(([x, y]) => {
      adjacents[`${x},${y}`] = fullGrid[x][y];
    });
    newRoute.addNode(`${rowIndex},${colIndex}`, adjacents);
  });
});

const newShortestRoute = newRoute.path(
  "0,0",
  `${fullGrid.length - 1},${fullGrid[0].length - 1}`
);

const newWeights = newShortestRoute.map((coord) => {
  const [x, y] = coord.split(",");
  return fullGrid[x][y];
});

newWeights.shift();

console.log(
  "Part 2:",
  newWeights.reduce((acc, curr) => acc + curr)
);
