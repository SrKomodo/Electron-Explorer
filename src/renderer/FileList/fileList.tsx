import React from "react";

import { shell } from "electron";
import { readdirSync, statSync } from "fs";
import { join } from "path";

import * as styles from "./fileList.scss";

import FileItem from "../FileItem/fileItem";

interface Props {
  dir: string;
  handleOpenFolder: (path: string) => any;
}

interface State {
  focused: string;
}

class FileList extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {focused: ""};
  }

  handleSelect = (path: string) => {
    this.setState({ focused: path });
  }

  handleOpen = (path: string) => {
    if (!statSync(path).isDirectory()) {
      shell.openItem(path);
    } else {
      this.props.handleOpenFolder(path);
    }
  }

  render() {
    const files = readdirSync(this.props.dir);
    const elements = files.map((file) => {
      const path = join(this.props.dir, file);
      const focused = path === this.state.focused;
      return <FileItem
        key={path}
        path={path}
        focused={focused}
        handleSelect={this.handleSelect}
        handleOpen={this.handleOpen}
      />;
    });

    return (
      <div className={styles.fileList}>
        <div className={styles.holder}>
          {elements}
        </div>
      </div>
    );
  }
}

export default FileList;
