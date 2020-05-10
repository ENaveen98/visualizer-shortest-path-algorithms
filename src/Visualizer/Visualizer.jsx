import React from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";

import "./Visualizer.css";

class Visaulizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gridRows: 30,
      gridCols: 30,
      startRow: 10,
      startCol: 10,
      finishRow: 20,
      finsihCol: 20,
      mouseIsPressed: false,
      isRunning: false,
    };
    this.resetState = this.resetState.bind(this);
    this.visualizeDijkstra = this.visualizeDijkstra.bind(this);
    this.animateDijkstra = this.animateDijkstra.bind(this);
    this.resetAnimateDijkstra = this.resetAnimateDijkstra.bind(this);
  }

  resetState() {
    this.setState(
      {
        grid: this.getInitialGrid(),
        gridRows: 30,
        gridCols: 30,
        startRow: 10,
        startCol: 10,
        finishRow: 20,
        finsihCol: 20,
        mouseIsPressed: false,
        isRunning: false,
      },
      () => {
        for (let timeoutID of this.state.timeouts) {
          clearTimeout(timeoutID);
        }
        this.resetAnimateDijkstra();
      }
    );
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < this.state.gridRows; row++) {
      const currentRow = [];
      for (let col = 0; col < this.state.gridCols; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row) {
    return {
      col,
      row,
      isStart: row === this.state.startRow && col === this.state.startCol,
      isFinish: row === this.state.finishRow && col === this.state.finsihCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
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

  resetAnimateDijkstra() {
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

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    // this.state.isRunning = true;
    this.setState({ isRunning: true }, function () {
      console.log("In Visualize:", this.state.isRunning);
      const { grid } = this.state;
      const startNode = grid[this.state.startRow][this.state.startCol];
      const finishNode = grid[this.state.finishRow][this.state.finsihCol];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={this.visualizeDijkstra}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={this.resetState}>Press to Reset!</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

// const getInitialGrid = () => {
//   const grid = [];
//   for (let row = 0; row < 20; row++) {
//     const currentRow = [];
//     for (let col = 0; col < 50; col++) {
//       currentRow.push(createNode(col, row));
//     }
//     grid.push(currentRow);
//   }
//   return grid;
// };
// const createNode = (col, row) => {
//   return {
//     col,
//     row,
//     isStart: row === START_NODE_ROW && col === START_NODE_COL,
//     isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
//     distance: Infinity,
//     isVisited: false,
//     isWall: false,
//     previousNode: null,
//   };
// };
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default Visaulizer;
