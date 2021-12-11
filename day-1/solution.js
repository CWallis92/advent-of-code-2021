const fs = require("fs");

const text = fs.readFileSync(`${__dirname}/data.txt`, "utf8");
console.log(text);

const textByLine = text.split("\n");

console.log(textByLine);
