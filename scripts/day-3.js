const fs = require("fs");

const inputs = fs
  .readFileSync(`${__dirname}/../data/day-3.txt`, "utf8")
  .split("\n");

const inputsLength = inputs.length;

let gamma = "",
  epsilon = "";

for (let i = 0; i < inputs[0].length; i++) {
  const zeros = inputs.filter((val) => val[i] == 0).length;
  if (zeros < inputsLength / 2) {
    gamma += "1";
    epsilon += "0";
  } else {
    gamma += "0";
    epsilon += "1";
  }
}

console.log("Part 1:", parseInt(gamma, 2) * parseInt(epsilon, 2));

const generator = (input, mostPopular = true) => {
  let index = 0;

  while (input.length > 1 && index < inputs[0].length) {
    const zeros = input.filter((val) => val[index] == 0);
    const ones = input.filter((val) => val[index] == 1);

    if (mostPopular) {
      input = zeros.length <= ones.length ? ones : zeros;
    } else {
      input = zeros.length <= ones.length ? zeros : ones;
    }
    index++;
  }

  return input[0];
};

const oxygen = generator([...inputs]);
const c02 = generator([...inputs], false);

console.log("Part 2:", parseInt(oxygen, 2) * parseInt(c02, 2));
