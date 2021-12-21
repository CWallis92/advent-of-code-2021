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

let out = data[0];

// const template = data.slice(2).map((input) => input.split(" -> "));

// const letters = [...new Set(template.flatMap((rule) => rule[0].split("")))];

// for (let step = 1; step <= 10; step++) {
//   let pos = 0;

//   while (pos < out.length - 1) {
//     const ruleIndex = template.findIndex(
//       (item) => item[0] === out.substring(pos, pos + 2)
//     );
//     out =
//       out.substring(0, pos + 1) +
//       template[ruleIndex][1] +
//       out.substring(pos + 1);
//     pos += 2;
//   }
// }

// const occurences = letters
//   .map((letter) => {
//     const re = new RegExp(letter, "g");
//     return out.match(re).length;
//   })
//   .sort((a, b) => b - a);

// console.log("Part 1:", occurences[0] - occurences[occurences.length - 1]);

// Part 2
const template = data.slice(2).map((input) => input.split(" -> "));

const rules = {};
for (const rule of template) {
  rules[rule[0]] = rule[1];
}

const letters = [...new Set(template.flatMap((rule) => rule[0].split("")))];
const total = {};
for (const letter of letters) {
  const re = new RegExp(letter, "g");
  total[letter] = out.match(re) ? out.match(re).length : 0;
}

const pairCounts = {};
for (pair of Object.keys(rules)) {
  pairCounts[pair] = 0;
}

for (let i = 0; i < out.length - 1; i++) {
  pairCounts[out.substring(i, i + 2)] += 1;
}

for (let step = 1; step <= 10; step++) {
  const currPairCounts = JSON.parse(JSON.stringify(pairCounts));
  // for (let x )
}

console.log(total);
