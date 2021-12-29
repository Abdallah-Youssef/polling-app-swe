import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import fetchIntercept from "fetch-intercept";
import {  nonAuthenticatedURL } from "./api/url";

fetchIntercept.register({
  request: function (url, config) {
    if (nonAuthenticatedURL(url)) {
        console.log(url)
        console.log("No token needed");
        return [url, config];
    }

    console.log("Incoming request " + url, config);
    console.log("token in interceptor " + localStorage.getItem("token"));
    let myHeaders = new Headers();

    myHeaders.append("Authorization", localStorage.getItem("token"));

    if (!config) {
      console.log([url, { headers: myHeaders }]);
      return [url, { headers: myHeaders }];
    }

    if (!config.headers) {
      config.headers = myHeaders;
      console.log([url, config]);
      return [url, config];
    }

    if (!config.headers.get("Authorization")) {
      config.headers.append("Authorization", localStorage.getItem("token"));
    }

    return [url, config];
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
