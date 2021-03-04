import React, { Component } from "react";

import { Navbar, Container, Col } from "react-bootstrap";

export default class Footer extends Component {
  render() {
    let fullYear = new Date().getFullYear();

    return (
      <Navbar
        style={{
          backgroundColor: "white",
        }}
      >
        <Container
          style={{
            backgroundColor: "white",
          }}
        >
          <Col
            style={{
              backgroundColor: "white",
            }}
            lg={12}
            className="text-center text-muted"
          >
            <div
              style={{
                textShadow: "1px 1px 0px rgba(0,0,0,0.2)",
                marginTop: 40,
                marginLeft: 0,
                width: "100%",
                backgroundColor: "white",
                textAlign: "center",
              }}
            >
              {fullYear}-{fullYear + 1}, All Rights Reserved by Dan Gullings
            </div>
          </Col>
        </Container>
      </Navbar>
    );
  }
}
