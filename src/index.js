import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.js";
import "./scss/global.scss";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { ViewportProvider } from "./ViewportProvider.js";
import { StateProvider } from "./StateProvider.js";

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <ViewportProvider>
          <StateProvider>
            <App />
          </StateProvider>
        </ViewportProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);