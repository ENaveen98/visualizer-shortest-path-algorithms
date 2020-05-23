import React from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";

import "./Visualizer.css";

class Visaulizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gridRows: 20,
      gridCols: 30,
      startRow: 10,
      startCol: 10,
      finishRow: 17,
      finishCol: 25,
      mouseIsPressed: false,
      isRunning: false,
      timeouts: [],
      changingStart: false,
      changingFinish: false,
      status: "Welcome!",
    };
    this.resetState = this.resetState.bind(this);
    this.getInitialGrid = this.getInitialGrid.bind(this);
    this.createNode = this.createNode.bind(this);
    this.visualizeDijkstra = this.visualizeDijkstra.bind(this);
    this.animateDijkstra = this.animateDijkstra.bind(this);
    this.resetAnimateDijkstra = this.resetAnimateDijkstra.bind(this);
    this.handleColsChange = this.handleColsChange.bind(this);
    this.handleRowsChange = this.handleRowsChange.bind(this);
    this.handleMoveStart = this.handleMoveStart.bind(this);
    this.handleMoveFinish = this.handleMoveFinish.bind(this);
    this.getNewGridWithStartChanged = this.getNewGridWithStartChanged.bind(
      this
    );
    this.getNewGridWithFinishChanged = this.getNewGridWithFinishChanged.bind(
      this
    );
    this.updateMessage = this.updateMessage.bind(this);
  }

  // Function to reset/clear board
  resetState() {
    if (this.state.isRunning) {
      for (let timeoutID of this.state.timeouts) {
        clearTimeout(timeoutID);
      }
      this.resetAnimateDijkstra();
    }
    this.setState({
      grid: this.getInitialGrid(),
      mouseIsPressed: false,
      isRunning: false,
      changingStart: false,
      changingFinish: false,
    });
    this.updateMessage("Board has been reset.");
  }

  // after all the elements of the page is rendered correctly, this method is called.
  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
    this.updateMessage("Welcome!");
  }

  // Get grid when the page reloads/when reset.
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

  // Create node as an Object with various useful properties.
  createNode(col, row) {
    return {
      col,
      row,
      isStart: row === this.state.startRow && col === this.state.startCol,
      isFinish: row === this.state.finishRow && col === this.state.finishCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  getNewGridWithStartChanged(grid, row, col) {
    const newGrid = grid.slice();
    newGrid[this.state.startRow][this.state.startCol] = {
      ...newGrid[this.state.startRow][this.state.startCol],
      isStart: false,
    };
    newGrid[row][col] = {
      ...newGrid[row][col],
      isStart: true,
    };
    this.setState({ startRow: row, startCol: col });
    return newGrid;
  }

  getNewGridWithFinishChanged(grid, row, col) {
    const newGrid = grid.slice();
    newGrid[this.state.finishRow][this.state.finishCol] = {
      ...newGrid[this.state.finishRow][this.state.finishCol],
      isFinish: false,
    };
    newGrid[row][col] = {
      ...newGrid[row][col],
      isFinish: true,
    };
    this.setState({ finishRow: row, finishCol: col });
    return newGrid;
  }

  handleMouseDown(row, col) {
    console.log(this.state.changingStart);
    if (this.state.changingStart) {
      const newGrid = this.getNewGridWithStartChanged(
        this.state.grid,
        row,
        col
      );
      this.setState({ grid: newGrid });
    } else if (this.state.changingFinish) {
      const newGrid = this.getNewGridWithFinishChanged(
        this.state.grid,
        row,
        col
      );
      this.setState({ grid: newGrid });
    } else {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
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
    const timeoutArray = [];
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      let timeoutID = setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
      timeoutArray.push(timeoutID);
    }
    this.setState(
      { timeouts: this.state.timeouts.concat(timeoutArray) },
      () => {
        return 0;
      }
    );
  }

  visualizeDijkstra() {
    // this.state.isRunning = true;
    this.setState({ isRunning: true }, function () {
      console.log("In Visualize:", this.state.isRunning);
      this.updateMessage();

      // Reset Move Start Button
      document.getElementById(`startButton`).className = "moveStartButton";
      this.setState({ changingStart: false });

      // Reset Move Finish Button
      document.getElementById(`finishButton`).className = "moveFinishButton";
      this.setState({ changingFinish: false });

      // Algorithm in motion!
      const { grid } = this.state;
      const startNode = grid[this.state.startRow][this.state.startCol];
      const finishNode = grid[this.state.finishRow][this.state.finishCol];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }

  handleRowsChange(event) {
    if (!this.state.isRunning) {
      let gridRows = event.target.value;
      let prvStartRow = this.state.startRow;
      let startRow = gridRows < prvStartRow + 1 ? gridRows - 1 : prvStartRow;
      let prvFinishRow = this.state.finishRow;
      let finishRow = gridRows < prvFinishRow + 1 ? gridRows - 1 : prvFinishRow;
      // Quick hack to set state synchoronously.
      this.setState(
        { gridRows: gridRows, startRow: startRow, finishRow: finishRow },
        () => {
          this.setState({ grid: this.getInitialGrid() }, () => {
            return 0;
          });
        }
      );
    }
  }
  handleColsChange(event) {
    if (!this.state.isRunning) {
      let gridCols = event.target.value;
      let prvStartCol = this.state.startCol;
      let startCol = gridCols < prvStartCol + 1 ? gridCols - 1 : prvStartCol;
      let prvFinishCol = this.state.finishCol;
      let finishCol = gridCols < prvFinishCol + 1 ? gridCols - 1 : prvFinishCol;
      // Quick hack to set state synchoronously.
      this.setState(
        { gridCols: gridCols, startCol: startCol, finishCol: finishCol },
        () => {
          this.setState({ grid: this.getInitialGrid() }, () => {
            return 0;
          });
        }
      );
    }
  }

  handleMoveStart() {
    if (this.state.isRunning) {
      this.updateMessage(
        "Cannot change while running! Reset to change Start position."
      );
      return;
    }
    if (this.state.changingFinish) {
      this.updateMessage(
        "Please toggle 'Move Finish' button before choosing this option"
      );
      return;
    }
    if (!this.state.changingStart) {
      this.updateMessage(
        "Click a new box to move the Start position. Toggle button when done."
      );
      document.getElementById(`startButton`).className =
        "moveStartButton pressed";
      this.setState({ changingStart: true });
    } else {
      this.updateMessage("You have changed the Start position.");
      document.getElementById(`startButton`).className = "moveStartButton";
      this.setState({ changingStart: false });
    }
  }

  handleMoveFinish() {
    if (this.state.isRunning) {
      this.updateMessage(
        "Cannot change while running! Reset to change Finish position."
      );
      return;
    }
    if (this.state.changingStart) {
      this.updateMessage(
        "Please toggle 'Move Start' button before choosing this option"
      );
      return;
    }
    if (!this.state.changingFinish) {
      this.updateMessage(
        "Click a new box to move the Finish position.\n Toggle button when done."
      );
      document.getElementById(`finishButton`).className =
        "moveFinishButton pressed";
      this.setState({ changingFinish: true });
    } else {
      this.updateMessage("You have changed the Finish position.");
      document.getElementById(`finishButton`).className = "moveFinishButton";
      this.setState({ changingFinish: false });
    }
  }

  updateMessage(message = "") {
    let messageBox = document.getElementById("messageBox");
    //  Update displayed message using the passed argument.
    if (message) {
      messageBox.innerText = message;
    }
    //  If no message is passed change based on state values
    else {
      if (this.state.isRunning) {
        messageBox.innerText = "Running Dijkstra's Algorithm...";
      }
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        {/* Button to Reset State */}
        <button onClick={this.visualizeDijkstra}>
          Visualize Dijkstra's Algorithm
        </button>

        {/* Button to Reset State */}
        <button onClick={this.resetState}>Press to Reset!</button>

        {/* Button to Move Start node across grid */}
        <button
          onClick={this.handleMoveStart}
          className="moveStartButton"
          id="startButton"
        >
          Move Start!
        </button>

        {/* Button to Move Finish node across grid */}
        <button
          onClick={this.handleMoveFinish}
          className="moveFinishButton"
          id="finishButton"
        >
          Move Finish!
        </button>

        {/* Slider to change Rows */}
        <label>Rows (between 10 and 50):</label>
        <input
          type="range"
          id="vol"
          name="vol"
          min="10"
          max="50"
          value={this.state.gridRows}
          onChange={this.handleRowsChange}
        ></input>

        {/* Slider to change Columns */}
        <label>Columns (between 10 and 50):</label>
        <input
          type="range"
          id="vol"
          name="vol"
          min="10"
          max="50"
          value={this.state.gridCols}
          onChange={this.handleColsChange}
        ></input>

        <p id="messageBox"></p>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
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

export default Visaulizer;
