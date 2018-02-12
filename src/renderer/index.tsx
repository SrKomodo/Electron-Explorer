import "./stylesheet.scss";

import React from "react";
import ReactDom from "react-dom";

import FileList from "./FileList/fileList";
import TitleBar from "./TitleBar/titlebar";

class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <>
        <TitleBar/>
        <FileList dir="C:\"/>
      </>
    );
  }
}

ReactDom.render(
  <App/>,
  document.getElementById("app"),
);
