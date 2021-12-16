const { count } = require("console");
const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/../data/day-8.txt`, "utf8");
// .readFileSync(`${__dirname}/../testData/day-8.txt`, "utf8");

const lines = data.split("\n");

const outputs = lines.map((line) => line.split(" | ")[1].split(" "));

const uniquesCount = outputs.reduce((acc, curr) => {
  const count = curr.filter((digit) => {
    return (
      digit.length === 2 ||
      digit.length === 3 ||
      digit.length === 4 ||
      digit.length === 7
    );
  });
  return acc + count.length;
}, 0);

console.log("Part 1:", uniquesCount);

const decipher = (inputs) => {
  const digits = {
    one: inputs
      .filter((digit) => digit.length === 2)[0]
      .split("")
      .sort(),
    four: inputs
      .filter((digit) => digit.length === 4)[0]
      .split("")
      .sort(),
    seven: inputs
      .filter((digit) => digit.length === 3)[0]
      .split("")
      .sort(),
    eight: inputs
      .filter((digit) => digit.length === 7)[0]
      .split("")
      .sort(),
  };
  const unknownFives = inputs.filter((digit) => digit.length === 5);
  const unknownSixes = inputs.filter((digit) => digit.length === 6);

  const top = digits.seven.find((letter) => digits.one.indexOf(letter) === -1);

  digits.six = unknownSixes.find((digit) =>
    digits.seven.some((letter) => digit.indexOf(letter) === -1)
  );
  unknownSixes.splice(unknownSixes.indexOf(digits.six), 1);
  digits.six = digits.six.split("").sort();

  const topRight = digits.seven.find(
    (letter) => digits.six.indexOf(letter) === -1
  );

  const bottomRight = digits.seven.find(
    (letter) => [top, topRight].indexOf(letter) === -1
  );

  digits.five = unknownFives.find((digit) => digit.indexOf(topRight) === -1);
  unknownFives.splice(unknownFives.indexOf(digits.five), 1);
  digits.five = digits.five.split("").sort();

  const topLeft = digits.five.find((letter) =>
    unknownFives.every((digit) => digit.indexOf(letter) === -1)
  );

  const middle = digits.four.find(
    (letter) => [topRight, topLeft, bottomRight].indexOf(letter) === -1
  );

  digits.zero = unknownSixes.find((digit) => digit.indexOf(middle) === -1);
  unknownSixes.splice(unknownSixes.indexOf(digits.zero), 1);
  digits.zero = digits.zero.split("").sort();
  digits.nine = unknownSixes[0].split("").sort();

  digits.two = unknownFives
    .find((digit) => digit.indexOf(bottomRight) === -1)
    .split("")
    .sort();
  digits.three = unknownFives
    .find((digit) => digit.indexOf(bottomRight) > -1)
    .split("")
    .sort();

  return [
    digits.zero.join(""),
    digits.one.join(""),
    digits.two.join(""),
    digits.three.join(""),
    digits.four.join(""),
    digits.five.join(""),
    digits.six.join(""),
    digits.seven.join(""),
    digits.eight.join(""),
    digits.nine.join(""),
  ];
};

const config = lines.map((line) => {
  const inputs = line.split(" | ")[0].split(" ");
  const outputs = line.split(" | ")[1].split(" ");
  const solvedDigits = decipher(inputs);
  return parseInt(
    outputs
      .map((digit) => {
        return solvedDigits.indexOf(digit.split("").sort().join(""));
      })
      .join("")
  );
});

const answer = config.reduce((acc, curr) => acc + curr);
console.log("Part 2:", answer);
