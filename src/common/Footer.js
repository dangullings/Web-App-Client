import React, { Component } from "react";
import { VERSION } from "../constants";

export default class Footer extends Component {
  render() {
    let fullYear = new Date().getFullYear();

    return (
      <div
        style={{
          marginTop: 0,
          marginLeft: 0,
          width: "100%",
          backgroundColor: "rgb(250, 250, 250)",
          textAlign: "center",
          color: "darkgray",
        }}
      >
        v{VERSION} | {fullYear} | Dan Gullings
      </div>
    );
  }
}
