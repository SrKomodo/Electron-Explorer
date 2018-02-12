import React from "react";

import FileList from "../FileList/fileList";
import TitleBar from "../TitleBar/titlebar";

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

export default App;
