import MenuIcon from '@mui/icons-material/Menu'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CLIENT_CURRENT } from '../../constants.js'
import { useAuth } from '../../pages/hooks/useAuth.js'
import '../../scss/navbar.scss'
import { useEmulatorStore } from '../../stores/emulator/store.tsx'
import LinearProgressBar from './StyledLinearProgressBar.js'

const Navbar = ({ isAdmin }) => {
  const { logout } = useAuth()
  const [menuIcon, setMenuIcon] = useState(false)
  const [data, setData] = useState()

  const isMicEnabled = useEmulatorStore((state) => state.isMicEnabled)

  const fetchClientData = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(CLIENT_CURRENT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok || response.status !== 200) {
        return { success: false, error: 'Invalid credentials' }
      } else {
        const responseData = await response.text()
        const deserializedData = JSON.parse(responseData)
        setData(deserializedData)
        return { success: true, error: null }
      }
    } catch (error) {
      console.error('Data Error: ' + error)
    }
  }

  useEffect(() => {
    fetchClientData()
  }, [])

  useEffect(() => {
    // Check if getUserMedia is available in the browser
    if (window.location.pathname === '/gps') {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request access to the microphone
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function (stream) {
            // Microphone access granted
            useEmulatorStore.getState().setMicEnabled(true)
            // Stop the stream (optional)
            stream.getTracks().forEach((track) => track.stop())
          })
          .catch(function (error) {
            // Microphone access denied
            console.log(error)
            useEmulatorStore.getState().setMicEnabled(false)
          })
      } else {
        console.log('getUserMedia is not supported in this browser')
      }
    }
  }, [window.location.pathname])

  return (
    <>
      <div className="header">
        <div className="main-nav">
          {/* 1st logo part  */}
          <div className="logo">
            <img
              className="logo_image"
              style={{ width: '8rem', height: 'auto' }}
              src="images/logo/logbookgps_logo.png"
              alt="logo"
            />
            {window.location.pathname === '/gps' &&
              isMicEnabled !== null &&
              isMicEnabled !== undefined &&
              isMicEnabled === false && (
                <div className="microstyle">Microphone is not connected!</div>)}
          </div>

          {/* 2nd menu part  */}
          <div
            className={menuIcon ? 'menu-link mobile-menu-link' : 'menu-link'}
          >
            <ul>
              {isAdmin && (
                <li>
                  <NavLink
                    to="/license"
                    className="navbar-link"
                    onClick={() => setMenuIcon(false)}
                  >
                    Licenses
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/gps"
                  className="navbar-link"
                  onClick={() => setMenuIcon(false)}
                >
                  GPS
                </NavLink>
              </li>

              <p className="username_para" style={{ margin: '1rem 0' }}>
                {data?.firstName || 'N/A'} {data?.lastName || 'N/A'} (
                {data?.username || 'N/A'})
              </p>
              <li>
                <NavLink to="/" onClick={() => logout()}>
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
          {/* 3rd social media links */}
          <div className="social-media">
            {/* hamburger menu start  */}
            <div className="hamburger-menu">
              <a href="#" onClick={() => setMenuIcon(!menuIcon)}>
                <MenuIcon
                  style={{
                    width: '4rem',
                    height: '4rem',
                    paddingBottom: '2.5rem'
                  }}
                />
              </a>
            </div>
          </div>
        </div>
        {/* <div>
          Error
        </div> */}
        <LinearProgressBar />
      </div>
    </>
  )
}

export default Navbar
