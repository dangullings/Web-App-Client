import React, { Component } from "react";
import { Carousel, Image } from "antd";

import imgStart from "../img/stair.jpg";
import imgKid from "../img/kid.jpg";
import imgGym from "../img/gym.jpg";

import "../styles/style.less";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const aboutBlock = [];

    const historyBlock = [];

    const testimonialBlock = [];

    const contentStyle = {
      height: "100%",
      width: "100%",
      color: "#fff",
      lineHeight: "160px",
      textAlign: "center",
      background: "white",
    };

    const introBlock = [
      <div class="container-intro">
        <Image preview={false} width="100%" height="100%" src={imgStart} />
        <h1>Take The Next Step</h1>
        <h2>520-943-0094</h2>
        <button type="button" className="btn">
          Sign Up
        </button>
      </div>,
    ];

    const headingBlock = [
      <div class="container-heading">
        <Image preview={false} width="100%" height="100%" src={imgKid} />
        <h2>It Won't Be Easy</h2>
        <h1>But It Will Be Worth It</h1>
      </div>,
    ];

    const sessionsBlock = [
      <div class="container-sessions">
        <h1>Upcoming Sessions</h1>
        <p>Buffalo ColorBelt</p>
        <p>Waconia ColorBelt</p>
      </div>,
    ];

    const thirdBlock = [
      <div class="container-third">
        <Image preview={false} width="100%" height="100%" src={imgGym} />
        <h2>Classes Begin This Fall</h2>
      </div>,
    ];

    return (
      <div className="home-style">
        {headingBlock}
        {introBlock}
        {thirdBlock}
        {sessionsBlock}
      </div>
    );
  }
}

export default Home;

{
  /* <button type="button" className="btn">
          Learn More
        </button>; */
}
