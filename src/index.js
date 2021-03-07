import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.less";
import App from "./app/App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
