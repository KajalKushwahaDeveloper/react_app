import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../navbar.js'

import GPS from '../../gps.js'
import PropTypes from 'prop-types'
import React from 'react'

const PrivateRoutes = ({ isAdmin, setIsAdmin }) => {
  const auth = localStorage.getItem('token')
  return (
    auth
      ? <>
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} style={{ zIndex: 9998 }} />
        {isAdmin === false
          ? (
          <GPS />
            )
          : <Outlet />}
        </>
      : <Navigate to='/login' />
  )
}

PrivateRoutes.propTypes = {
  isAdmin: PropTypes.bool,
  setIsAdmin: PropTypes.func
}

export default PrivateRoutes
