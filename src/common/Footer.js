import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    let fullYear = new Date().getFullYear();

    return (
      <div
        style={{
          marginTop: 40,
          marginLeft: 0,
          width: "100%",
          backgroundColor: "white",
          textAlign: "center",
          color: "darkgray",
        }}
      >
        {fullYear}-{fullYear + 1}, All Rights Reserved by Dan Gullings
      </div>
    );
  }
}
