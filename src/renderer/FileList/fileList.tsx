import React from "react";

import { readdirSync } from "fs";
import { join } from "path";

import * as styles from "./fileList.scss";

import FileItem from "../FileItem/fileItem";

interface Props {
  dir: string;
}

class FileList extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    const files = readdirSync(this.props.dir);
    const elements = files.map((file) => {
      const path = join(this.props.dir, file);
      return <FileItem key={path} path={path} />;
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
