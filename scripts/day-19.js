const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      "testData" +
      // "data" +
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
    scannerLoc: index === 0 ? [0, 0, 0] : null,
    beaconVectors: {
      0: beaconCoords,
    },
    correctOrientation: index === 0 ? 0 : null,
  };
});

let currUnknownScanner = 1,
  currKnownScanner = 0,
  matches;

while (!scannerMaps.every((scanner) => scanner.scannerLoc)) {
  currKnownScannerIndex = 0;
  let unknownScannerRelativeVector,
    orientation = 0;

  while (
    orientation <
    Object.keys(scannerMaps[currUnknownScanner].beaconVectors).length
  ) {
    matches = 0;

    while (
      currKnownScannerIndex <
      scannerMaps[currKnownScanner].beaconVectors[0].length
    ) {
      let currMatches = 0;

      unknownScannerRelativeVector = [
        scannerMaps[currKnownScanner].beaconVectors[
          scannerMaps[currKnownScanner].correctOrientation
        ][currKnownScannerIndex][0] -
          scannerMaps[currUnknownScanner].beaconVectors[orientation][
            currKnownScannerIndex
          ][0],
        scannerMaps[currKnownScanner].beaconVectors[
          scannerMaps[currKnownScanner].correctOrientation
        ][currKnownScannerIndex][1] -
          scannerMaps[currUnknownScanner].beaconVectors[orientation][
            currKnownScannerIndex
          ][1],
        scannerMaps[currKnownScanner].beaconVectors[
          scannerMaps[currKnownScanner].correctOrientation
        ][currKnownScannerIndex][2] -
          scannerMaps[currUnknownScanner].beaconVectors[orientation][
            currKnownScannerIndex
          ][2],
      ];
      currMatches++;

      let remainingBeacons = JSON.parse(
        JSON.stringify(scannerMaps[currKnownScanner].beaconVectors[orientation])
      );
      remainingBeacons.splice(currKnownScannerIndex, 1);

      remainingBeacons.forEach((beacon) => {
        let relativeVector = JSON.stringify(
          beacon.map(
            (coord, index) => coord - unknownScannerRelativeVector[index]
          )
        );
        if (
          JSON.stringify(
            scannerMaps[currUnknownScanner].beaconVectors[orientation]
          ).indexOf(relativeVector) > -1
        )
          currMatches++;
      });

      if (currMatches > matches) {
        matches = currMatches;
        scannerMaps[currUnknownScanner].correctOrientation = orientation;
      }

      currKnownScannerIndex++;
    }

    // if (matches >= 12) break;
    if (matches >= 3) break;

    orientation++;
  }

  // if (matches >= 12) {
  if (matches >= 3) {
    scannerMaps[currUnknownScanner].scannerLoc = unknownScannerRelativeVector;
    currUnknownScanner = scannerMaps.findIndex(
      (scanner) => !scanner.scannerLoc
    );
  }

  currUnknownScanner = scannerMaps
    .filter((_, index) => index !== currUnknownScanner)
    .findIndex((scanner) => !scanner.scannerLoc);

  if (currUnknownScanner === scannerMaps.length) {
    currKnownScanner = scannerMaps
      .filter((_, index) => index !== currKnownScanner)
      .findIndex((scanner) => scanner.scannerLoc);
    currUnknownScanner = scannerMaps.findIndex(
      (scanner) => !scanner.scannerLoc
    );
  }
}

console.log(scannerMaps);

const getOrientationVectors = (scannerObj) => {
  return scannerObj;
};
