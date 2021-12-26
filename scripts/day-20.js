const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      // "testData" +
      "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n\n");

const algorithm = data[0];

const inputImage = data[1].split("\n");

console.log(JSON.stringify(inputImage).replace(/[^#]/g, "").length);

const enhance = (arr, iterations = 1) => {
  if (iterations === 0) return arr;

  const largeInput = JSON.parse(JSON.stringify(arr)).map((row) => `..${row}..`);
  const rowLength = largeInput[0].length;
  largeInput.unshift(".".repeat(rowLength));
  largeInput.unshift(".".repeat(rowLength));
  largeInput.push(".".repeat(rowLength));
  largeInput.push(".".repeat(rowLength));

  let enhanced = largeInput.map((row) => row.split(""));

  enhanced = enhanced.map((row, rowIndex, array) => {
    return row.map((col, colIndex) => {
      if (
        rowIndex < 1 ||
        rowIndex >= enhanced.length - 1 ||
        colIndex < 1 ||
        colIndex >= enhanced[0].length - 1
      )
        return ".";

      const binary = `${array[rowIndex - 1][colIndex - 1]}${
        array[rowIndex - 1][colIndex]
      }${array[rowIndex - 1][colIndex + 1]}${
        array[rowIndex][colIndex - 1]
      }${col}${array[rowIndex][colIndex + 1]}${
        array[rowIndex + 1][colIndex - 1]
      }${array[rowIndex + 1][colIndex]}${array[rowIndex + 1][colIndex + 1]}`
        .replace(/\./g, "0")
        .replace(/#/g, "1");

      return algorithm[parseInt(binary, 2)];
    });
  });

  enhanced = enhanced.map((row) => row.join(""));

  enhanced.pop();
  enhanced.shift();

  enhanced = enhanced.map((row) => row.substring(1, row.length - 1));

  iterations--;

  return enhance(enhanced, iterations);
};

const output = enhance(inputImage, 2).join("\n");

fs.writeFileSync(`${__dirname}/day-20-output.txt`, output);

console.log("Part 1:", output.replace(/[^#]/g, "").length);
