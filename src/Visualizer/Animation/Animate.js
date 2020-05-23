export function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
  console.log("In Animate:", this.state.isRunning);
  const timeoutArray = [];
  // Iterate through up until one before last element.
  for (let i = 0; i <= visitedNodesInOrder.length - 1; i++) {
    let timeoutID = setTimeout(() => {
      const node = visitedNodesInOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-visited";
    }, 10 * i);
    timeoutArray.push(timeoutID);
  }
  // The last element is finish node.
  let timeoutID = setTimeout(() => {
    this.animateShortestPath(nodesInShortestPathOrder);
  }, 10 * visitedNodesInOrder.length);
  timeoutArray.push(timeoutID);
  this.setState({ timeouts: timeoutArray }, () => {
    return 0;
  });
  return;
}

export function resetAnimateDijkstra() {
  for (let row = 0; row < this.state.gridRows; row++) {
    for (let col = 0; col < this.state.gridCols; col++) {
      if (this.state.grid[row][col].isStart) {
        document.getElementById(`node-${row}-${col}`).className =
          "node node-start";
      } else if (this.state.grid[row][col].isFinish) {
        document.getElementById(`node-${row}-${col}`).className =
          "node node-finish";
      } else {
        document.getElementById(`node-${row}-${col}`).className = "node";
      }
    }
  }
}

export function animateShortestPath(nodesInShortestPathOrder) {
  const timeoutArray = [];
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    let timeoutID = setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-shortest-path";
    }, 50 * i);
    timeoutArray.push(timeoutID);
  }
  this.setState({ timeouts: this.state.timeouts.concat(timeoutArray) }, () => {
    return 0;
  });
}
