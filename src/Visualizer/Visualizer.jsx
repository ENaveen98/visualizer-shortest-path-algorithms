import React from "react";
import Node from "./Node/Node";
import {
  handleMoveStart,
  handleMoveFinish,
  getNewGridWithStartChanged,
  getNewGridWithFinishChanged,
} from "./StartFinish/MoveStartFinish";
import { handleRowsChange, handleColsChange } from "./RowsCols/ChangeRowsCols";
import {
  animateDijkstra,
  resetAnimateDijkstra,
  animateShortestPath,
} from "./Animation/Animate";
import { updateMessage } from "../Messages/messageBoxUtils";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";

import "./Visualizer.css";

class Visaulizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      gridRows: 18,
      gridCols: 50,
      startRow: 5,
      startCol: 10,
      finishRow: 15,
      finishCol: 40,
      mouseIsPressed: false,
      isRunning: false,
      timeouts: [],
      changingStart: false,
      changingFinish: false,
      status: "Welcome!",
    };

    // Add Functions exported to the class.
    this.handleMoveStart = handleMoveStart;
    this.handleMoveFinish = handleMoveFinish;
    this.getNewGridWithStartChanged = getNewGridWithStartChanged;
    this.getNewGridWithFinishChanged = getNewGridWithFinishChanged;
    this.updateMessage = updateMessage;
    this.handleRowsChange = handleRowsChange;
    this.handleColsChange = handleColsChange;
    this.animateDijkstra = animateDijkstra;
    this.resetAnimateDijkstra = resetAnimateDijkstra;
    this.animateShortestPath = animateShortestPath;

    // Bind the function to get access to this.state
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

  visualizeDijkstra() {
    if (this.state.isRunning) {
      return;
    }
    // this.state.isRunning = true;
    this.setState({ isRunning: true }, function () {
      console.log("In Visualize:", this.state.isRunning);
      this.updateMessage();

      // Reset Move Start Button
      document.getElementById(`startButton`).className =
        "moveStartButton topButtons";
      this.setState({ changingStart: false });

      // Reset Move Finish Button
      document.getElementById(`finishButton`).className =
        "moveFinishButton topButtons";
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

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
        <div className="firstBar">
          {/* Button to Reset State */}
          <button
            onClick={this.visualizeDijkstra}
            className="algorithmButton topButtons"
          >
            <span>Visualize Dijkstra's Algorithm</span>
          </button>

          {/* Button to Reset State */}
          <button onClick={this.resetState} className="resetButton topButtons">
            <span>Press to Reset!</span>
          </button>
          <div className="messageBox">
            <p id="messageBox"></p>
          </div>
          {/* <p id="messageBox"></p> */}

          {/* Button to Move Start node across grid */}
          <button
            onClick={this.handleMoveStart}
            className="moveStartButton topButtons"
            id="startButton"
          >
            <span>Move Start!</span>
          </button>

          {/* Button to Move Finish node across grid */}
          <button
            onClick={this.handleMoveFinish}
            className="moveFinishButton topButtons"
            id="finishButton"
          >
            <span>Move Finish!</span>
          </button>
        </div>
        <div>
          {/* Slider to change Rows */}
          <label id="numRows">{"Rows: " + this.state.gridRows}</label>
          <input
            type="range"
            id="vol"
            className="rowSlider"
            name="vol"
            min="10"
            max="20"
            value={this.state.gridRows}
            onChange={this.handleRowsChange}
          ></input>
          {/* Slider to change Columns */}
          <label id="numCols">{"Columns: " + this.state.gridCols}</label>
          <input
            type="range"
            id="vol"
            className="colSlider"
            name="vol"
            min="10"
            max="65"
            value={this.state.gridCols}
            onChange={this.handleColsChange}
          ></input>
        </div>
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
