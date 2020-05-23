export function handleRowsChange(event) {
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
export function handleColsChange(event) {
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
