import { remote } from "electron";
import React from "react";

import * as styles from "./titleBar.scss";

import close from "./close.svg";
import maximize from "./maximize.svg";
import minimize from "./minimize.svg";
import restore from "./restore.svg";

const win = remote.getCurrentWindow();

interface State {
  isMaximized: boolean;
}

class TitleBar extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isMaximized: win.isMaximized(),
    };

    win.on("maximize", () => {
      this.setState({ isMaximized: true });
    });

    win.on("unmaximize", () => {
      this.setState({ isMaximized: false });
    });
  }

  handleMinimize() {
    win.minimize();
  }

  handleMaximize = () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }

  handleClose() {
    win.close();
  }

  render() {
    return (
      <div className={styles.titleBar}>
        <div className={styles.controls}>
          <img src={minimize} onClick={this.handleMinimize}/>
          <img src={this.state.isMaximized ? restore : maximize} onClick={this.handleMaximize}/>
          <img src={close} onClick={this.handleClose}/>
        </div>
      </div>
    );
  }
}

export default TitleBar;
