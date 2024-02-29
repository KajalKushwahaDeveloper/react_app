import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import GPS from '../../gps.js'
import Navbar from '../root/navbar.js'

const PrivateRoutes = ({ isAdmin, setIsAdmin }) => {
  console.log('TEST@ PrivateRoutes rendered')
  const auth = localStorage.getItem('token')
  return auth ? (
    <>
      <Navbar
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        style={{ zIndex: 9998 }}
      />
      {isAdmin === false ? <GPS /> : <Outlet />}
    </>
  ) : (
    <Navigate to="/login" />
  )
}

export default PrivateRoutes
