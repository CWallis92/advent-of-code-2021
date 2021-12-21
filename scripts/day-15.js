const fs = require("fs");

const data = fs
  .readFileSync(
    `${__dirname}/../` +
      "testData" +
      // "data" +
      `/day-${__filename.split("/day-")[1].split(".")[0]}.txt`,
    "utf8"
  )
  .split("\n")
  .map((row) => row.split(""));

// https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-dijkstras-algorithm-8d16451eea34

class Node {
  constructor(value) {
    this.value = value;
    this.distances = {};
    this.visited = false;
  }

  addAdjacent(node, distance) {
    this.distances[node] = parseInt(distance);
  }

  getDistances() {
    return this.distances;
  }

  isAdjacent(node) {
    return Object.keys(this.distances).indexOf(node) > -1;
  }

  visitNode() {
    this.visited = true;
  }

  newVisitIsAllowed() {
    return !this.visited;
  }

  updateDistance(node, distance) {
    this.distances[node] = distance;
  }
}

class Graph {
  constructor(edgeDirection = Graph.UNDIRECTED) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  addEdge(source, destination) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);

    sourceNode.addAdjacent(
      destination,
      data[destination.split(",")[0]][destination.split(",")[1]]
    );

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationNode.addAdjacent(
        source,
        data[source.split(",")[0]][source.split(",")[1]]
      );
    }

    return [sourceNode, destinationNode];
  }

  addVertex(value) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    } else {
      const vertex = new Node(value);
      this.nodes.set(value, vertex);
      return vertex;
    }
  }

  vertexWithMinDistance(distances, visited) {
    // Missing!!!
  }

  // dijkstra(source) {
  //   let distances = {},
  //     parents = {},
  //     visited = new Set();
  //   for (const i in this.nodes.distances) {
  //     distances[i] = Infinity;
  //     parents[this.vertices[i]] = null;
  //   }

  //   let currVertex = this.vertexWithMinDistance(distances, visited);

  //   while (currVertex !== null) {
  //     let distance = distances[currVertex],
  //       neighbours = this.adjacencyList[currVertex];
  //     for (let neighbour in neighbours) {
  //       let newDistance = distance + neighbours[neighbour];
  //       if (distances[neighbour] > newDistance) {
  //         distances[neighbour] = newDistance;
  //         parents[neighbour] = currVertex;
  //       }
  //     }
  //     visited.add(currVertex);
  //     currVertex = this.vertexWithMinDistance(distances, visited);
  //   }

  //   console.log(parents);
  //   console.log(distances);
  // }
}

Graph.UNDIRECTED = Symbol("undirected graph");
Graph.DIRECTED = Symbol("directed graph");

const nodesGraph = new Graph();

function getAdjacent(x, y) {
  return [
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
    [x, y - 1],
  ];
}

data.forEach((row, rowIndex) => {
  row.forEach((_, colIndex) => {
    const availableAdjacents = getAdjacent(rowIndex, colIndex).filter(
      ([x, y]) => {
        return data[x] && data[x][y];
      }
    );
    availableAdjacents.forEach(([x, y]) => {
      nodesGraph.addEdge([rowIndex, colIndex].join(","), [x, y].join(","));
    });
  });
});

console.log(nodesGraph.nodes.get("1,1"));
