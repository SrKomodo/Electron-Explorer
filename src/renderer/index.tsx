import React from "react";
import ReactDom from "react-dom";

import { statSync } from "fs";
import { resolve, sep } from "path";

import * as styles from "./stylesheet.scss";

import FileList from "./FileList/fileList";
import TitleBar from "./TitleBar/titlebar";
import UrlBar from "./UrlBar/urlbar";

interface State {
  inputDir: string;
  dir: string;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      dir: "C:\\",
      inputDir: "C:\\",
    };
  }

  handleChange = (dir: string) => {
    this.setState({ inputDir: dir });

    if (dir === this.state.dir) { return; }
    try {
      if (!statSync(dir).isDirectory()) { return; }
    } catch { return; }

    let newDir = resolve(dir);
    if (this.state.dir <= newDir) {
      newDir += sep;
    }
    this.setState({ dir: newDir, inputDir: newDir });
  }

  handleOpenFolder = (path: string) => {
    this.setState({ dir: path, inputDir: path });
  }

  render() {
    return (
      <div className={styles.root}>
        <TitleBar/>
        <UrlBar dir={this.state.inputDir} handleChange={this.handleChange}/>
        <FileList dir={this.state.dir} handleOpenFolder={this.handleOpenFolder}/>
      </div>
    );
  }
}

process.chdir("C:\\");
ReactDom.render(
  <App/>,
  document.getElementById("app"),
);
