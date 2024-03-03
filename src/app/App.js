import React from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer
} from 'react-router-dom'
import { CLIENT_CURRENT } from '../constants.js'
import AccessDenied from '../pages/accessDenied.js'
import { AuthLayout } from '../pages/components/AuthLayout.tsx'
import GPS from '../pages/gps'
import Home from '../pages/home.js'
import LoginPage from '../pages/login_page'
import PageNotFound from '../pages/pageNotFound.js'
import { ProtectedLayout } from '../pages/protected_layout'
import RedirectPage from '../pages/redirect_page.js'

const getUserData = () => {
  const client = window.localStorage.getItem('client')
  if (client === null || client === 'null') {
    window.localStorage.setItem('client', null)
    return null
  }
  // json to clientData
  const clientData = JSON.parse(client)
  // fetch client data from the server
  return fetch(CLIENT_CURRENT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientData.token}`
    }
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          window.localStorage.setItem('client', null)
        }
        return null
      }
      return response.json()
    })
    .then((data) => {
      // override client role with the role from the server and return the client
      return { ...clientData, role_TYPE: data.authorities }
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      )
      return null
    })
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="" element={<ProtectedLayout />}>
        <Route path="license" element={<Home />} />
        <Route path="gps" element={<GPS />} />
      </Route>
      <Route path="/redirect" element={<RedirectPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
)
