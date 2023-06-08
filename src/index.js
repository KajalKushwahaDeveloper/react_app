import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './../node_modules/bootstrap/dist/js/bootstrap.min.js';
import DropDown from './components/dropDown';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* <App /> */}
    <DropDown/>
  </BrowserRouter>
);

