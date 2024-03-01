import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './../node_modules/bootstrap/dist/js/bootstrap.min.js'
import ErrorBoundary from './ErrorBoundary'
import { StateProvider } from './StateProvider.js'
import { ViewportProvider } from './ViewportProvider.js'
import App from './app/App.js'
import './scss/global.scss'
import * as serviceWorker from './serviceWorker.js'

// eslint-disable-next-line react/no-deprecated
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
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
