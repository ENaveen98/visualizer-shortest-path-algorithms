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
      "moveStartButton pressed";
    this.setState({ changingStart: true });
  } else {
    this.updateMessage("Changes saved successfully.");
    document.getElementById(`startButton`).className = "moveStartButton";
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
      "Click a new box to move the Finish position.\n Toggle button when done."
    );
    document.getElementById(`finishButton`).className =
      "moveFinishButton pressed";
    this.setState({ changingFinish: true });
  } else {
    this.updateMessage("Changes saved successfully.");
    document.getElementById(`finishButton`).className = "moveFinishButton";
    this.setState({ changingFinish: false });
  }
}
