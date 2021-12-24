const fs = require("fs");

const data = fs.readFileSync(
  `${__dirname}/../` +
    // "testData" +
    "data" +
    `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
  "utf8"
);

const targetCoords = data.match(/[-0-9]+/g).map((coord) => parseInt(coord));
const targetArea = {
  xMin: targetCoords[0],
  xMax: targetCoords[1],
  yBottom: targetCoords[2],
  yTop: targetCoords[3],
};

const checkTrajectory = (x, y) => {
  let currX = 0,
    currY = 0,
    currXSpeed = x,
    currYSpeed = y;

  while (currY >= targetArea.yBottom) {
    if (
      currX > targetArea.xMax ||
      (currXSpeed === 0 && currX < targetArea.xMin) ||
      currY < targetArea.yBottom
    ) {
      return false;
    }

    if (
      currX <= targetArea.xMax &&
      currX >= targetArea.xMin &&
      currY <= targetArea.yTop
    ) {
      return true;
    }

    currX += currXSpeed;
    currY += currYSpeed;
    if (currXSpeed !== 0) {
      currXSpeed += currXSpeed > 0 ? -1 : 1;
    }
    currYSpeed -= 1;
  }
  return false;
};

let firstAcceptedXSpeed = 0;
while (
  0.5 * Math.abs(firstAcceptedXSpeed) * (Math.abs(firstAcceptedXSpeed) + 1) <
  Math.abs(targetArea.xMin)
) {
  firstAcceptedXSpeed += targetArea.xMin > 0 ? 1 : -1;
}

let maxYSpeed = Math.abs(targetArea.yBottom) - 1;
while (!checkTrajectory(firstAcceptedXSpeed, maxYSpeed)) {
  maxYSpeed--;
}

console.log("Part 1:", 0.5 * maxYSpeed * (maxYSpeed + 1));

let countValidArcs = 0;
for (let x = firstAcceptedXSpeed; x <= targetArea.xMax; x++) {
  for (let y = targetArea.yBottom; y <= maxYSpeed; y++) {
    if (checkTrajectory(x, y)) countValidArcs++;
  }
}

console.log("Part 2:", countValidArcs);
