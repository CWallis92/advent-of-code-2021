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

const instructions = data.map((instruction) => {
  const coordsOnly = instruction.replace(/[^\d\.,]/g, "").split(",");
  return {
    set: instruction.match(/\w{2,3}/)[0],
    x: coordsOnly[0].split("..").map((x) => parseInt(x)),
    y: coordsOnly[1].split("..").map((x) => parseInt(x)),
    z: coordsOnly[2].split("..").map((x) => parseInt(x)),
  };
});

console.log(instructions);

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

instructions.forEach(({ set, x, y, z }) => {
  if (onCuboids.length === 0) {
    onCuboids.push({ x, y, z });
  } else {
    let newCuboid = { x, y, z };

    /* Recurse this stuff */
    let checkIndex = 0;

    while (checkIndex < onCuboids.length) {
      if (checkOverlap(onCuboids[checkIndex], newCuboid)) {
        if (set === "on") {
          // Reset newCuboid to be the uncharted area(s) so far (smaller cuboids)
          // Needs recursion for smaller uncharted cuboids
          // Move the index along the required amount
          // If the newCuboid is empty, break
        } else {
          // Splice out the overlapped cuboid and re-add its still-active segments
          // Reset newCuboid to be the smaller cuboids that did not crossover
          // Needs recursion for smaller uncharted cuboids
          // Move the index along the required amount
          // If newCuboid is empty, break
        }
      } else {
        checkIndex++;
      }
    }
    if (checkIndex === onCuboids.length && newCuboid && set === "on") {
      onCuboids.push(newCuboid);
    }
    /* Recursion ends here */
  }
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
