import React from "react";

import { shell } from "electron";
import { readdirSync, statSync } from "fs";
import { join } from "path";

import * as styles from "./fileList.scss";

import FileItem from "../FileItem/fileItem";

interface Props {
  dir: string;
  handleFolderChange: (path: string) => any;
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
      this.props.handleFolderChange(path);
    }
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 8) {
      this.props.handleFolderChange(join(this.props.dir, ".."));
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
      <div tabIndex={-1} onKeyDown={this.handleKeyDown} className={styles.fileList}>
        <div className={styles.holder}>
          {elements}
        </div>
      </div>
    );
  }
}

export default FileList;
