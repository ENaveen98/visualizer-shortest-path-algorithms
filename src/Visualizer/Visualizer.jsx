import React from "react";
import Node from "./Node/Node";

import "./Visualizer.css";

class Visaulizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodes: [] };
  }

  componentDidMount() {
    const nodes = [];
    for (let row = 0; row < 15; row++) {
      let currRow = [];
      for (let col = 0; col < 45; col++) {
        currRow.push([]);
      }
      nodes.push(currRow);
    }
    this.setState({ nodes: nodes });
  }

  render() {
    const nodes = this.state.nodes;
    return (
      <div className="grid">
        {nodes.map((row, rowIndex) => {
          return (
            <div>
              {row.map((node, nodeIndex) => (
                <Node></Node>
              ))}{" "}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Visaulizer;
