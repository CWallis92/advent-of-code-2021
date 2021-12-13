const fs = require("fs");

const data = fs
  .readFileSync(`${__dirname}/../data/day-6.txt`, "utf8")
  // .readFileSync(`${__dirname}/../testData/day-6.txt`, "utf8")
  .split(",");

// Brute force - doesn't work for part 2
class Lanternfish {
  constructor(days = 8) {
    this.days = days;
    this.reprodCount = 0;
  }

  countdown() {
    if (this.days === 0) {
      this.days = 6;
      this.reprodCount++;
      reproduce();
    } else {
      this.days--;
    }
  }
}

const population = data.map((days) => new Lanternfish(days));

const reproduce = () => {
  population.push(new Lanternfish());
};

const getPopulation = (days) => {
  for (let i = 0; i < days; i++) {
    population.forEach((fish) => {
      fish.countdown();
    });
  }
  return population;
};

console.log("Part 1:", getPopulation(80).length);

// Novel approach - computationally efficient
const efficientPopulation = (days) => {
  const buckets = Array.from({ length: 9 }, () => 0);
  data.forEach((fish) => {
    buckets[fish]++;
  });

  for (let i = 0; i < days; i++) {
    const birthingFish = buckets.shift();
    buckets.push(birthingFish);
    buckets[6] += birthingFish;
  }

  return buckets.reduce((acc, curr) => acc + curr);
};

console.log("Part 2:", efficientPopulation(256));
