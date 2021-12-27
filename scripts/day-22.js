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

const instructions = data
  .map((instruction) => {
    const coordsOnly = instruction.replace(/[^\d\.,-]/g, "").split(",");
    return {
      set: instruction.match(/\w{2,3}/)[0],
      x: coordsOnly[0].split("..").map((x) => parseInt(x)),
      y: coordsOnly[1].split("..").map((x) => parseInt(x)),
      z: coordsOnly[2].split("..").map((x) => parseInt(x)),
    };
  })
  .filter(({ x, y, z }) => {
    return (
      x[0] >= -50 &&
      x[1] <= 50 &&
      y[0] >= -50 &&
      y[1] <= 50 &&
      z[0] >= -50 &&
      z[0] <= 50
    );
  });

const onCuboids = [];

const checkOverlap = (cuboid1, cuboid2) => {
  return !(
    cuboid2.x[1] < cuboid1.x[0] ||
    cuboid2.x[0] > cuboid1.x[1] ||
    cuboid2.y[1] < cuboid1.y[0] ||
    cuboid2.y[0] > cuboid1.y[1] ||
    cuboid2.z[1] < cuboid1.z[0] ||
    cuboid2.z[0] > cuboid1.z[1]
  );
};

const getDistinctCuboids = (newCuboid, existingCuboid) => {
  const reducedCuboids = [];
  if (newCuboid.x[0] < existingCuboid.x[0]) {
    reducedCuboids.push({
      x: [newCuboid.x[0], existingCuboid.x[0] - 1],
      y: newCuboid.y,
      z: newCuboid.z,
    });
  }
  if (newCuboid.x[1] > existingCuboid.x[1]) {
    reducedCuboids.push({
      x: [existingCuboid.x[1] + 1, newCuboid.x[1]],
      y: newCuboid.y,
      z: newCuboid.z,
    });
  }
  if (newCuboid.y[0] < existingCuboid.y[0]) {
    reducedCuboids.push({
      x: [
        Math.max(newCuboid.x[0], existingCuboid.x[0]),
        Math.min(newCuboid.x[1], existingCuboid.x[1]),
      ],
      y: [newCuboid.y[0], existingCuboid.y[0] - 1],
      z: newCuboid.z,
    });
  }
  if (newCuboid.y[1] > existingCuboid.y[1]) {
    reducedCuboids.push({
      x: [
        Math.max(newCuboid.x[0], existingCuboid.x[0]),
        Math.min(newCuboid.x[1], existingCuboid.x[1]),
      ],
      y: [existingCuboid.y[1] + 1, newCuboid.y[1]],
      z: newCuboid.z,
    });
  }
  if (newCuboid.z[0] < existingCuboid.z[0]) {
    reducedCuboids.push({
      x: [
        Math.max(newCuboid.x[0], existingCuboid.x[0]),
        Math.min(newCuboid.x[1], existingCuboid.x[1]),
      ],
      y: [
        Math.max(newCuboid.y[0], existingCuboid.y[0]),
        Math.min(newCuboid.y[1], existingCuboid.y[1]),
      ],
      z: [newCuboid.z[0], existingCuboid.z[0] - 1],
    });
  }
  if (newCuboid.y[1] > existingCuboid.y[1]) {
    reducedCuboids.push({
      x: [
        Math.max(newCuboid.x[0], existingCuboid.x[0]),
        Math.min(newCuboid.x[1], existingCuboid.x[1]),
      ],
      y: [
        Math.max(newCuboid.y[0], existingCuboid.y[0]),
        Math.min(newCuboid.y[1], existingCuboid.y[1]),
      ],
      z: [existingCuboid.z[1] + 1, newCuboid.z[1]],
    });
  }

  return reducedCuboids;
};

instructions.forEach(({ set, x, y, z }) => {
  let newCuboids = [{ x, y, z }],
    checkIndex = 0;

  while (checkIndex < onCuboids.length) {
    if (set === "on") {
      let overlappingCuboid = newCuboids.findIndex((cuboid) =>
        checkOverlap(onCuboids[checkIndex], cuboid)
      );
      while (overlappingCuboid > -1) {
        const removedCuboid = newCuboids[overlappingCuboid];
        const reducedCuboids = getDistinctCuboids(
          removedCuboid,
          onCuboids[checkIndex]
        );
        newCuboids.splice(overlappingCuboid, 1, ...reducedCuboids);
        overlappingCuboid = newCuboids.findIndex((cuboid) =>
          checkOverlap(onCuboids[checkIndex], cuboid)
        );
      }

      if (newCuboids.length === 0) break;
    } else if (checkOverlap(onCuboids[checkIndex], newCuboids[0])) {
      const stillOnCuboids = getDistinctCuboids(
        onCuboids[checkIndex],
        newCuboids[0]
      );
      onCuboids.splice(checkIndex, 1, ...stillOnCuboids);
      checkIndex += stillOnCuboids.length;
      continue;
    }
    checkIndex++;
  }

  if (set === "on" && newCuboids.length > 0) {
    onCuboids.push(...newCuboids);
  }
  // console.log(onCuboids);
});

const onCount = onCuboids.reduce((acc, { x, y, z }) => {
  return (
    acc +
    (Math.abs(x[1] - x[0]) + 1) *
      (Math.abs(y[1] - y[0]) + 1) *
      (Math.abs(z[1] - z[0]) + 1)
  );
}, 0);

console.log(onCount);
