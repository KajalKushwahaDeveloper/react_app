import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";

import themes from 'devextreme/ui/themes';
themes.initialized(() => ReactDOM.render(
  <BrowserRouter>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById("root")
));
