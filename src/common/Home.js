import React, { Component } from "react";
import { Carousel, Image } from "antd";

import imgSplashOne from "../img/BackgroundOne.jpg";
import imgSplashThree from "../img/BackgroundThree.jpg";

import "../styles/style.less";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const contentStyle = {
      height: "100%",
      width: "100%",
      color: "#fff",
      lineHeight: "160px",
      textAlign: "center",
      background: "white",
    };

    const pageOne = [
      <div class="container">
        <Image
          preview={false}
          width="100%"
          height="100%"
          src={imgSplashThree}
        />
        <h1>Welcome</h1>
        <h2>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </span>
        </h2>
        <button type="button" className="btn">
          Learn More
        </button>
        <br />
      </div>,
    ];
    const pageTwo = [
      <div class="container">
        <Image preview={false} width="100%" height="100%" src={imgSplashOne} />
        <h1>Culture</h1>
        <h2>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </span>
        </h2>
        <button type="button" className="btn">
          Learn More
        </button>
        <br />
      </div>,
    ];
    const pageThree = [
      <div class="container">
        <Image
          preview={false}
          width="100%"
          height="100%"
          src={imgSplashThree}
        />
        <h1>What To Expect</h1>
        <h2>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </span>
        </h2>
        <button type="button" className="btn">
          Learn More
        </button>
        <br />
      </div>,
    ];
    const pageFour = [
      <div class="container">
        <Image preview={false} width="100%" height="100%" src={imgSplashOne} />
        <h1>History</h1>
        <h2>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </span>
        </h2>
        <button type="button" className="btn">
          Learn More
        </button>
        <br />
      </div>,
    ];

    this.contentStyle;
    return (
      <Carousel style={contentStyle}>
        <div>
          <h3>{pageOne}</h3>
        </div>
        <div>
          <h3>{pageTwo}</h3>
        </div>
        <div>
          <h3>{pageThree}</h3>
        </div>
        <div>
          <h3>{pageFour}</h3>
        </div>
      </Carousel>
    );
  }
}

export default Home;
