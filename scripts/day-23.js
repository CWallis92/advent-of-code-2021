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

let startingNooks = [data[2], data[3]]
  .map((line) => line.replace(/[^A-D]/g, ""))
  .join("");

startingNooks =
  startingNooks[0] +
  startingNooks[4] +
  startingNooks[1] +
  startingNooks[5] +
  startingNooks[2] +
  startingNooks[6] +
  startingNooks[3] +
  startingNooks[7];

const startingNooksArray = [];

startingNooks.split("").forEach((letter, index) => {
  if (index % 2 === 0) {
    const nook = [];
    if (startingNooks.substring(0, index).indexOf(letter) > -1) {
      nook.push(`${letter}2`);
    } else {
      nook.push(`${letter}1`);
    }
    if (
      startingNooks.substring(0, index + 1).indexOf(startingNooks[index + 1]) >
      -1
    ) {
      nook.push(`${startingNooks[index + 1]}2`);
    } else {
      nook.push(`${startingNooks[index + 1]}1`);
    }
    startingNooksArray.push(nook);
  }
});

const startingConfig = {
  corridor: Array.from({ length: 11 }, (x) => null),
  nooks: startingNooksArray,
};

const canMove = (currFish, currConfig) => {
  const fishNook = currConfig.nooks.findIndex((nook) =>
    nook.includes(currFish)
  );
  const correctNook = currFish.charCodeAt(0) - 65;
  if (fishNook === -1) {
    // Fish is in corridor and can only return to its own nook
    const correctCorridorPos = 2 * correctNook + 2;
    const fishPos = currConfig.corridor.indexOf(currFish);
    const requiredCorridor = currConfig.corridor.slice(
      Math.min(correctCorridorPos, fishPos),
      Math.max(correctCorridorPos, fishPos) + 1
    );
    if (requiredCorridor.every((pos) => pos === null || pos === currFish)) {
      // Corridor is clear. Is nook clear or containing only correct fish?
      return currConfig.nooks[correctNook].every(
        (pos) => pos === null || pos[0] === currFish[0]
      );
    }
    return false;
  } else {
    if (fishNook === correctNook) {
      // Must return true if there is nothing below it that is in the wrong slot
      return !(
        currConfig.nooks[fishNook].indexOf(currFish) === 1 ||
        currConfig.nooks[fishNook][1][0] === currFish[0]
      );
    } else {
      // Check if anything is above it
      return (
        currConfig.nooks[fishNook].indexOf(currFish) === 0 ||
        currConfig.nooks[fishNook][0] === null
      );
    }
  }
};

const getValidMoves = (currFish, currConfig) => {
  // Array returned is [<Move type>, <Nook index>, <Corridor pos to move to>, <Distance>]
  const validMoves = [];

  const fishNook = currConfig.nooks.findIndex((nook) =>
    nook.includes(currFish)
  );
  let distance;

  if (fishNook === -1) {
    const corrIndex = currConfig.corridor.indexOf(currFish);
    const availableNook =
      currConfig.nooks[currFish.charCodeAt(0) - 65].lastIndexOf(null);
    distance = Math.abs(corrIndex - (2 * fishNook + 2)) + availableNook + 1;
    validMoves.push(["toNook", currFish.charCodeAt(0) - 65, null, distance]);
  } else {
    const precedingCorridor = currConfig.corridor.slice(0, 2 * fishNook + 2);
    const firstFishExists = precedingCorridor
      .reverse()
      .findIndex((pos) => pos !== null);
    const firstBlockingFish =
      firstFishExists === -1 ? 0 : precedingCorridor.length - firstFishExists;
    const lastFishExists = currConfig.corridor
      .slice(2 * fishNook + 3)
      .findIndex((pos) => pos !== null);
    const lastBlockingFish =
      lastFishExists === -1 ? 10 : lastFishExists + (2 * fishNook + 2);
    for (let i = firstBlockingFish; i <= lastBlockingFish; i++) {
      if (![2, 4, 6, 8].includes(i)) {
        const currNookIndex = currConfig.nooks[fishNook].indexOf(currFish);
        distance = Math.abs(i - (2 * fishNook + 2)) + currNookIndex + 1;
        validMoves.push(["toCorridor", fishNook, i, distance]);
      }
    }
  }

  return validMoves;
};

const checkSolved = (currConfig) => {
  return currConfig.nooks.every((nook, index) => {
    return nook.every((pos) => {
      return pos !== null && pos[0] === String.fromCharCode(index + 65);
    });
  });
};

const countSolutions = (
  lastMovedFish = null,
  currConfig = startingConfig,
  currCost = 0,
  level = 0
) => {
  const winningCosts = [];

  if (checkSolved(currConfig)) {
    winningCosts.push(currCost);
    return winningCosts;
  }

  const allFish = ["D2", "D1", "C2", "C1", "B2", "B1", "A2", "A1"];
  for (const currFish of allFish) {
    if (currFish === lastMovedFish || !canMove(currFish, currConfig)) continue;

    const validMoves = getValidMoves(currFish, currConfig);

    for (const move of validMoves) {
      const fishUnits = 10 ** (currFish.charCodeAt(0) - 65);

      const newConfig = JSON.parse(JSON.stringify(currConfig));

      if (move[0] === "toNook") {
        newConfig.corridor.splice(
          newConfig.corridor.indexOf(currFish),
          1,
          null
        );
        newConfig.nooks[move[1]].splice(
          newConfig.nooks[move[1]].lastIndexOf(null),
          1,
          currFish
        );
      } else {
        newConfig.nooks[move[1]].splice(
          newConfig.nooks[move[1]].indexOf(currFish),
          1,
          null
        );
        newConfig.corridor.splice(move[2], 1, currFish);
      }
      const newCost = currCost + move[3] * fishUnits;

      const routeWinningCosts = countSolutions(
        currFish,
        newConfig,
        newCost,
        level + 1
      );
      const uniqueCosts = [...new Set(routeWinningCosts)];
      uniqueCosts.forEach((cost) => {
        if (!winningCosts.includes(cost)) winningCosts.push(cost);
      });
    }
  }

  return winningCosts;
};

console.log("Part 1:", countSolutions());
