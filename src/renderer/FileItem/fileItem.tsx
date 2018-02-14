import React from "react";

import { shell } from "electron";

import * as styles from "./fileItem.scss";

interface Props {
  path: string;
}

class FileItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleClick = () => {
    shell.openItem(this.props.path);
  }

  render() {
    return (
      <div className={styles.file} onClick={this.handleClick}>
        {this.props.path}
      </div>
    );
  }
}

export default FileItem;
