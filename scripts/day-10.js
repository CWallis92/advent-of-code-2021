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

const openingBrackets = ["(", "[", "{", "<"];
const closingBrackets = [")", "]", "}", ">"];
const points = [3, 57, 1197, 25137];

const output = data.map((line) => {
  const chunks = [];
  let uncheckedLine = line;

  while (uncheckedLine.length > 0) {
    let chunk = uncheckedLine[0],
      openingBracket = [chunk],
      letter = 1,
      errorBrackets = [],
      closingBracket;

    do {
      if (uncheckedLine[letter] === undefined) {
        chunks.push(chunk);
        return {
          line,
          chunks,
          errorBrackets,
          incomplete: errorBrackets.length === 0,
        };
      } else if (openingBrackets.includes(uncheckedLine[letter])) {
        openingBracket.push(uncheckedLine[letter]);
        closingBracket = null;
      } else {
        closingBracket = uncheckedLine[letter];
        if (
          closingBracket &&
          openingBrackets.indexOf(openingBracket[openingBracket.length - 1]) !==
            closingBrackets.indexOf(closingBracket)
        ) {
          errorBrackets.push(closingBracket);
        }
        openingBracket.pop();
      }

      chunk += uncheckedLine[letter];
      letter++;
    } while (openingBracket.length > 0);

    chunks.push(chunk);

    uncheckedLine = uncheckedLine.substring(letter);
  }

  return {
    line,
    chunks,
    errorBrackets,
    incomplete: false,
  };
});

const allErrorBrackets = output.flatMap((line) => line.errorBrackets);

console.log(
  "Part 1:",
  allErrorBrackets.reduce((acc, curr) => {
    return acc + points[closingBrackets.indexOf(curr)];
  }, 0)
);

const autoCompleteScores = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const incompleteLines = output
  .filter((line) => line.incomplete)
  .map(({ chunks }) => {
    return chunks[chunks.length - 1];
  });

const closersScores = incompleteLines.map((chunk) => {
  const remainingClosers = [];
  const existingClosers = [];

  for (let letter = chunk.length - 1; letter >= 0; letter--) {
    if (closingBrackets.includes(chunk[letter])) {
      existingClosers.unshift(chunk[letter]);
    } else {
      if (
        existingClosers.includes(
          closingBrackets[openingBrackets.indexOf(chunk[letter])]
        )
      ) {
        existingClosers.shift();
      } else {
        remainingClosers.push(
          closingBrackets[openingBrackets.indexOf(chunk[letter])]
        );
      }
    }
  }

  return remainingClosers.reduce((acc, curr) => {
    return 5 * acc + autoCompleteScores[curr];
  }, 0);
});

console.log(
  "Part 2:",
  closersScores.sort((a, b) => b - a)[Math.floor(closersScores.length / 2)]
);
