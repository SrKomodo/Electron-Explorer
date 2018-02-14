import React from "react";

import * as styles from "./urlBar.scss";

interface Props {
  dir: string;
  handleChange: (dir: string) => void;
}

class UrlBar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleChange(e.currentTarget.value);
  }

  render() {
    return (
      <input
        className={styles.urlBar}
        value={this.props.dir}
        onChange={this.handleChange}
      />
    );
  }
}

export default UrlBar;
