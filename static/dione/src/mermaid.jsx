import React from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "monospace",
});
export default class Mermaid extends React.Component {
  componentDidMount() {
    mermaid.contentLoaded();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chart !== this.props.chart) {
      document
        .getElementById("mermaid-chart")
        .removeAttribute("data-processed");
      mermaid.contentLoaded();
    }
  }
  render() {
    return <div id="mermaid-chart" className="mermaid">{this.props.chart}</div>;
  }
}
