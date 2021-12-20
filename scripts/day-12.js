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

// Adjacency list Graph implementation: https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/
class Cave {
  constructor(value) {
    this.value = value;
    this.adjacents = []; // Adjacency list
    this.visited = false;
  }

  addAdjacent(cave) {
    this.adjacents.push(cave);
  }

  removeAdjacent(cave) {
    const index = this.adjacents.indexOf(cave);
    if (index > -1) {
      this.adjacents.splice(index, 1);
      return cave;
    }
  }

  getAdjacents() {
    return this.adjacents;
  }

  isAdjacent(cave) {
    return this.adjacents.indexOf(cave) > -1;
  }

  visitCave() {
    if (this.visited === false && this.value === this.value.toLowerCase()) {
      this.visited = true;
    }
  }

  newVisitIsAllowed() {
    return !this.visited;
  }

  resetVisits() {
    this.visited = false;
  }
}

class Graph {
  constructor(edgeDirection = Graph.UNDIRECTED) {
    this.caves = new Map();
    this.secondVisitUsed = false; // Used for part 2
    this.edgeDirection = edgeDirection;
  }

  addEdge(source, destination) {
    const sourceCave = this.addVertex(source);
    const destinationCave = this.addVertex(destination);

    sourceCave.addAdjacent(destinationCave);

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationCave.addAdjacent(sourceCave);
    }

    return [sourceCave, destinationCave];
  }

  addVertex(value) {
    if (this.caves.has(value)) {
      return this.caves.get(value);
    } else {
      const vertex = new Cave(value);
      this.caves.set(value, vertex);
      return vertex;
    }
  }

  removeVertex(value) {
    const current = this.caves.get(value);
    if (current) {
      for (const cave of this.caves.values()) {
        cave.removeAdjacent(current);
      }
    }
    return this.caves.delete(value);
  }

  removeEdge(source, destination) {
    const sourceCave = this.caves.get(source);
    const destinationCave = this.caves.get(destination);

    if (sourceCave && destinationCave) {
      sourceCave.removeAdjacent(destinationCave);

      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationCave.removeAdjacent(sourceCave);
      }
    }

    return [sourceCave, destinationCave];
  }

  *findPaths(start, destination, partTwo = false, path = []) {
    if (start === destination) {
      yield path.concat(destination);
    } else {
      if (
        partTwo &&
        this.caves.get(start) &&
        this.caves.get(start).value !== "start" &&
        this.caves.get(start).value !== "end" &&
        !this.caves.get(start).newVisitIsAllowed() &&
        !this.secondVisitUsed
      ) {
        this.caves.get(start).resetVisits();
        this.secondVisitUsed = true;
      }
      if (this.caves.get(start) && this.caves.get(start).newVisitIsAllowed()) {
        path.push(start);
        this.caves.get(start).visitCave();
        for (const neighbour of this.caves.get(start).getAdjacents()) {
          yield* this.findPaths(neighbour.value, destination, partTwo, path);
        }
        this.caves.get(start).resetVisits();
        path.pop();
        // this.secondVisitUsed = false;
      }
    }
  }
}

Graph.UNDIRECTED = Symbol("undirected graph");
Graph.DIRECTED = Symbol("directed graph");

const cavesGraph = new Graph();

data.forEach((edge) => {
  const [startCave, destinationCave] = edge.split("-");
  cavesGraph.addEdge(startCave, destinationCave);
});

console.log("Part 1:", Array.from(cavesGraph.findPaths("start", "end")).length);

console.log(
  "Part 2:",
  Array.from(cavesGraph.findPaths("start", "end", true)).length
);