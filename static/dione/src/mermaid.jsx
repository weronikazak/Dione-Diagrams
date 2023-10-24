import React from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "forest",
  securityLevel: "loose",
  fontFamily: "verdana",
  fontSize: 12,
  primaryColor: "#7acfc7",
  secondaryColor: "#ffc35b",
  primaryTextColor: '#1c1c1c',
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
