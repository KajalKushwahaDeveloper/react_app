import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import "./scss/global.scss";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { ViewportProvider } from "./ViewportProvider.js";


ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary>
      <ViewportProvider>
        <App />
      </ViewportProvider>
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById("root")
);
