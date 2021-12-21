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

let out = data[0];

const template = data.slice(2).map((input) => input.split(" -> "));

//Pairs are always replaced in the string by 2 other pairs, as defined by the rules
const rules = {};
for (const rule of template) {
  rules[rule[0]] = rule[1];
}

// Letters are never removed from the string, so we never need to recount
const letterCounts = {};
for (const letter of [
  ...new Set(template.flatMap((rule) => rule[0].split(""))),
]) {
  const re = new RegExp(letter, "g");
  const matches = out.match(re);
  letterCounts[letter] = matches ? matches.length : 0;
}

// Pairs, however, are replaced. We iterate through the oriinal pairs to work out the new ones
const pairCounts = {};
for (pair of Object.keys(rules)) {
  pairCounts[pair] = 0;
}
for (let i = 0; i < out.length - 1; i++) {
  pairCounts[out.substring(i, i + 2)] += 1;
}

const answer = (steps) => {
  let pairCountsClone = JSON.parse(JSON.stringify(pairCounts));
  const letterCountsClone = JSON.parse(JSON.stringify(letterCounts));

  for (let step = 1; step <= steps; step++) {
    const newPairCounts = {};
    for (pair of Object.keys(rules)) {
      newPairCounts[pair] = 0;
    }

    for (const pair of Object.keys(pairCounts)) {
      newPairCounts[pair[0] + rules[pair]] += pairCountsClone[pair];
      newPairCounts[rules[pair] + pair[1]] += pairCountsClone[pair];
      letterCountsClone[rules[pair]] += pairCountsClone[pair];
    }

    pairCountsClone = newPairCounts;
  }

  const counts = Object.values(letterCountsClone).sort((a, b) => b - a);

  return counts[0] - counts[counts.length - 1];
};

console.log("Part 1:", answer(10));

console.log("Part 2:", answer(40));
