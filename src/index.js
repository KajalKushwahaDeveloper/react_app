import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import { StateProvider } from './StateProvider.js'
import { ViewportProvider } from './ViewportProvider.js'
import App from './app/App.js'
import './scss/global.scss'

createRoot(document.getElementById('root')).render(
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
  </StrictMode>
)
