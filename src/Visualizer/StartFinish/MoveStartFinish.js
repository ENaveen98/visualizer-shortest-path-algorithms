export function handleMoveStart() {
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
      "moveStartButton topButtons pressed";
    this.setState({ changingStart: true });
  } else {
    this.updateMessage("Changes saved successfully.");
    document.getElementById(`startButton`).className =
      "moveStartButton topButtons";
    this.setState({ changingStart: false });
  }
}

export function handleMoveFinish() {
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
      "Click a new box to move the Finish position. Toggle button when done."
    );
    document.getElementById(`finishButton`).className =
      "moveFinishButton topButtons pressed";
    this.setState({ changingFinish: true });
  } else {
    this.updateMessage("Changes saved successfully.");
    document.getElementById(`finishButton`).className =
      "moveFinishButton topButtons";
    this.setState({ changingFinish: false });
  }
}

export function getNewGridWithStartChanged(grid, row, col) {
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

export function getNewGridWithFinishChanged(grid, row, col) {
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
