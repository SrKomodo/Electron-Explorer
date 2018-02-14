import React from "react";

import * as styles from "./fileItem.scss";

interface Props {
  path: string;
  focused: boolean;
  handleSelect: (path: string) => any;
  handleOpen: (path: string) => any;
}

class FileItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleClick = () => {
    this.props.handleSelect(this.props.path);
  }

  handleDoubleClick = () => {
    this.props.handleOpen(this.props.path);
  }

  render() {
    return (
      <div
        className={styles.file + (this.props.focused ? " " + styles.focused : "")}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        {this.props.path}
      </div>
    );
  }
}

export default FileItem;
