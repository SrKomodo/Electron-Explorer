import React from "react";

import { readdir } from "fs";
import { join } from "path";

import FileItem from "../FileItem/fileItem";

interface Props {
  dir: string;
}

interface State {
  files: string[];
}

class FileList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {files: []};

    readdir(this.props.dir, (err, files) => {
      this.setState({files: files.map((file) => join(this.props.dir, file))});
    });
  }

  render() {
    return (
      <div>
        {this.state.files.map((path) => <FileItem key={path} path={path}/>)}
      </div>
    );
  }
}

export default FileList;
