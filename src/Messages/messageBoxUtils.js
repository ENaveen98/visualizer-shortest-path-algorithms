export function updateMessage(message = "") {
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
