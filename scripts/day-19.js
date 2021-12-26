const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      // "testData" +
      "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n\n---");

const scannerMaps = data.map((scanner, index) => {
  const full = scanner.split("\n");
  full.shift();
  const beaconCoords = full.map((coord) =>
    coord.split(",").map((val) => parseInt(val))
  );

  return {
    // scannerLoc: index === 0 ? [0, 0] : null,
    scannerLoc: index === 0 ? [0, 0, 0] : null,
    beaconVectors: {
      0: beaconCoords,
    },
    correctOrientation: index === 0 ? 0 : null,
  };
});

// Add all 3D variations on scannerMaps
if (scannerMaps[0].scannerLoc.length === 3) {
  scannerMaps.forEach(({ beaconVectors }) => {
    beaconVectors[1] = beaconVectors[0].map(([x, y, z]) => [-y, x, z]);
    beaconVectors[2] = beaconVectors[0].map(([x, y, z]) => [-x, -y, z]);
    beaconVectors[3] = beaconVectors[0].map(([x, y, z]) => [y, -x, z]);
    // 4: Set y as up: x = x, y = z, z = -y
    beaconVectors[4] = beaconVectors[0].map(([x, y, z]) => [x, z, -y]);
    beaconVectors[5] = beaconVectors[4].map(([x, y, z]) => [-y, x, z]);
    beaconVectors[6] = beaconVectors[4].map(([x, y, z]) => [-x, -y, z]);
    beaconVectors[7] = beaconVectors[4].map(([x, y, z]) => [y, -x, z]);
    // 8: Flip upside down in x: x = x, y = -y, z = -z
    beaconVectors[8] = beaconVectors[0].map(([x, y, z]) => [x, -y, -z]);
    beaconVectors[9] = beaconVectors[8].map(([x, y, z]) => [-y, x, z]);
    beaconVectors[10] = beaconVectors[8].map(([x, y, z]) => [-x, -y, z]);
    beaconVectors[11] = beaconVectors[8].map(([x, y, z]) => [y, -x, z]);
    // 12: Set -y as up: x = x, y = -z, z = y
    beaconVectors[12] = beaconVectors[0].map(([x, y, z]) => [x, -z, y]);
    beaconVectors[13] = beaconVectors[12].map(([x, y, z]) => [-y, x, z]);
    beaconVectors[14] = beaconVectors[12].map(([x, y, z]) => [-x, -y, z]);
    beaconVectors[15] = beaconVectors[12].map(([x, y, z]) => [y, -x, z]);
    // 16: Set x as up: x = z, y = y, z = -x
    beaconVectors[16] = beaconVectors[0].map(([x, y, z]) => [z, y, -x]);
    beaconVectors[17] = beaconVectors[16].map(([x, y, z]) => [-y, x, z]);
    beaconVectors[18] = beaconVectors[16].map(([x, y, z]) => [-x, -y, z]);
    beaconVectors[19] = beaconVectors[16].map(([x, y, z]) => [y, -x, z]);
    // 20: Set -x as up: x = -z, y = y, z = x
    beaconVectors[20] = beaconVectors[0].map(([x, y, z]) => [-z, y, x]);
    beaconVectors[21] = beaconVectors[20].map(([x, y, z]) => [-y, x, z]);
    beaconVectors[22] = beaconVectors[20].map(([x, y, z]) => [-x, -y, z]);
    beaconVectors[23] = beaconVectors[20].map(([x, y, z]) => [y, -x, z]);
  });
}

let currKnownScanner = 0,
  currUnknownScanner = 1,
  foundScanners = 1;

const checkedIndexes = [];

while (foundScanners < scannerMaps.length) {
  console.log(`Checking against scanner ${currKnownScanner}:`);

  const knownScannerOrientation =
    scannerMaps[currKnownScanner].correctOrientation;
  let knownScannerReferralBeaconIndex = 0;

  while (
    knownScannerReferralBeaconIndex <
      scannerMaps[currKnownScanner].beaconVectors[knownScannerOrientation]
        .length &&
    !scannerMaps[currUnknownScanner].scannerLoc
  ) {
    let knownScannerReferralBeacon =
        scannerMaps[currKnownScanner].beaconVectors[knownScannerOrientation][
          knownScannerReferralBeaconIndex
        ],
      unknownScannerOrientation = 0;

    while (
      unknownScannerOrientation < 24 &&
      scannerMaps[currUnknownScanner].correctOrientation === null
    ) {
      let unknownScannerReferralBeaconIndex = 0,
        unknownScannerOrientationMap =
          scannerMaps[currUnknownScanner].beaconVectors[
            unknownScannerOrientation
          ];

      while (
        unknownScannerReferralBeaconIndex <
        scannerMaps[currUnknownScanner].beaconVectors[unknownScannerOrientation]
          .length
      ) {
        let unknownScannerReferralBeacon =
          unknownScannerOrientationMap[unknownScannerReferralBeaconIndex];

        let unknownScannerRelativeVector = [
            knownScannerReferralBeacon[0] - unknownScannerReferralBeacon[0],
            knownScannerReferralBeacon[1] - unknownScannerReferralBeacon[1],
            knownScannerReferralBeacon[2] - unknownScannerReferralBeacon[2],
          ],
          matchedBeacons = 1;

        let remainingKnownBeacons = JSON.parse(
          JSON.stringify(
            scannerMaps[currKnownScanner].beaconVectors[knownScannerOrientation]
          )
        );
        remainingKnownBeacons.splice(knownScannerReferralBeaconIndex, 1);

        remainingKnownBeacons.forEach((beacon) => {
          let relativeVector = JSON.stringify(
            beacon.map(
              (coord, index) => coord - unknownScannerRelativeVector[index]
            )
          );
          if (
            JSON.stringify(
              scannerMaps[currUnknownScanner].beaconVectors[
                unknownScannerOrientation
              ]
            ).indexOf(relativeVector) > -1
          )
            matchedBeacons++;
        });

        // if (matchedBeacons >= 3) {
        if (matchedBeacons >= 12) {
          scannerMaps[currUnknownScanner].correctOrientation =
            unknownScannerOrientation;
          scannerMaps[currUnknownScanner].scannerLoc =
            unknownScannerRelativeVector.map(
              (axis, index) =>
                axis + scannerMaps[currKnownScanner].scannerLoc[index]
            );
          break;
        }

        unknownScannerReferralBeaconIndex++;
      }

      unknownScannerOrientation++;
    }

    knownScannerReferralBeaconIndex++;
  }

  if (scannerMaps[currUnknownScanner].scannerLoc) {
    foundScanners++;
    console.log(`\tFound scanner ${currUnknownScanner}`);
  }

  if (
    foundScanners < scannerMaps.length &&
    scannerMaps.filter(
      ({ scannerLoc }, index) => index > currUnknownScanner && !scannerLoc
    ).length === 0
  ) {
    currUnknownScanner = scannerMaps.findIndex(({ scannerLoc }) => !scannerLoc);
    checkedIndexes.push(currKnownScanner);
    currKnownScanner = scannerMaps.findIndex(
      ({ scannerLoc }, index) =>
        scannerLoc && checkedIndexes.indexOf(index) === -1
    );
  } else {
    currUnknownScanner =
      scannerMaps
        .filter((_, index) => index > currUnknownScanner)
        .findIndex(({ scannerLoc }) => !scannerLoc) +
      currUnknownScanner +
      1;
  }
}

let uniqueBeacons = scannerMaps[0].beaconVectors[0];

const remainingScanners = JSON.parse(JSON.stringify(scannerMaps));
const scannerIndexes = remainingScanners.map(({ scannerLoc }) => scannerLoc);
remainingScanners.shift();

remainingScanners.forEach((scanner) => {
  scanner.beaconVectors[scanner.correctOrientation].forEach((beacon) => {
    const relativeBeacon = beacon.map(
      (axis, index) => axis + scanner.scannerLoc[index]
    );
    if (
      !uniqueBeacons.find((uniqueBeacon) => {
        return (
          uniqueBeacon[0] === relativeBeacon[0] &&
          uniqueBeacon[1] === relativeBeacon[1] &&
          uniqueBeacon[2] === relativeBeacon[2]
        );
      })
    ) {
      uniqueBeacons.push(relativeBeacon);
    }
  });
});

console.log("Part 1:", uniqueBeacons.length);

const manhattanDistance = scannerIndexes.reduce((acc, curr, index) => {
  if (index === scannerIndexes.length - 1) return acc;

  let distance = 0;
  for (
    let checkIndex = index + 1;
    checkIndex < scannerIndexes.length;
    checkIndex++
  ) {
    const sum =
      Math.abs(curr[0] - scannerIndexes[checkIndex][0]) +
      Math.abs(curr[1] - scannerIndexes[checkIndex][1]) +
      Math.abs(curr[2] - scannerIndexes[checkIndex][2]);

    if (sum > distance) distance = sum;
  }

  return distance > acc ? distance : acc;
}, 0);

console.log("Part 2:", manhattanDistance);
