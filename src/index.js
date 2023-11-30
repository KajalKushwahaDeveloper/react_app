import React from "react";
import ReactDOM from "react-dom";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.js";
import { Provider } from 'react-redux'
import "./scss/global.scss";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { ViewportProvider } from "./ViewportProvider.js";
import { StateProvider } from "./StateProvider.js";

ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary>
      <ViewportProvider>
        <StateProvider>
          <App />
        </StateProvider>
      </ViewportProvider>
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById("root")
);