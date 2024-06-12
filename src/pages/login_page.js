import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import ForgotPasswordModal from '../components/location/map-components/ForgotPasswordModal'
import '../scss/login.scss'
import { useAuth } from './hooks/useAuth'

const LoginPage = () => {
  const { login, client } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [responseError, setResponseError] = useState('')
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false)
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResponseError('')
    setEmailError('')
    setPasswordError('')
    if (!email) {
      setEmailError('Please enter an email')
    } else if (!password) {
      setPasswordError('Please enter a password')
    } else {
      try {
        const data = await login({
          email,
          password
        })
        if (!data.success) {
          setResponseError(data.error)
        }
      } catch (error) {
        console.error('Error occurred during login:', error)
        setResponseError('An error occurred during login') // Display a generic error message
      }
    }
  }

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false) // Close the "Forgot Password" modal
  }

  const handleForgotPasswordClick = async () => {
    setIsForgotPasswordModalOpen(true)
  }
  if (client) {
    let isAdmin = false
    client.role_TYPE?.forEach((role) => {
      if (role.authority.includes('ROLE_ADMIN')) {
        isAdmin = true
      }
    })
    if (isAdmin) {
      return <Navigate to="/license" />
    } else {
      return <Navigate to="/gps" />
    }
  }

  return (
    <>
      <div className="authScreen">
        <div className="container_div container-fluid h-100">
          <div className="row h-100">
            <div
              className="col-md-6 centerMid d-none d-md-flex"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="Left_content">
                <img
                  src="images/logo/logbookgps_logo.png"
                  className="FrontImg"
                />
                <hr className="hr"></hr>
              </div>
            </div>
            <div
              className="col-md-6 formBox bg-light  centerMid flex-column"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="authCard shadow">
                <div className="Left_content d-block d-md-none">
                  {/* <img src="images/logo/logbookgps_logo.png" /> */}
                  <img src="images/logo/logbookgps_logo.svg" />
                  {/* <p className="para">
                    Vivamus at dui consequat, dapibus tellus vitae
                  </p> */}
                </div>
                <form onSubmit={handleSubmit}>
                  <h1>Log in </h1>
                  <div className="row">
                    <div className="col-12">
                      <div className="inputField">
                        <input
                          style={{ margin: '0px' }}
                          type="email"
                          id="content_input"
                          name="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={handleEmailChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="inputField">
                        <input
                          style={{ margin: '0px' }}
                          type="password"
                          id="content_input"
                          name="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={handlePasswordChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-12 mt-3 btns" style={{}}>
                      <button
                        className="btn btn-main"
                        type="submit"
                        style={{
                          background: '#007dc6',
                          color: 'white',
                          width: '6rem'
                        }}
                      >
                        Login
                      </button>
                    </div>
                    {emailError && <p className="error">{emailError}</p>}
                    {passwordError && <p className="error">{passwordError}</p>}
                    <div className="col-12 mt-3 btns">
                      {responseError && (
                        <p className="error">Invalid Ceredentials</p>
                      )}
                      <a
                        href="#forgot-password"
                        onClick={handleForgotPasswordClick}
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                </form>
              </div>
              {isForgotPasswordModalOpen === true && (
                <ForgotPasswordModal
                  isOpen={isForgotPasswordModalOpen}
                  onClose={closeForgotPasswordModal}
                />
              )}
            </div>
            <img src="images/map-location.svg" alt="" className="gps" />
            <img src="images/middleImg.svg" alt="" className="middle" />
          </div>
        </div>
      </div>
    </>
  )
}
export default LoginPage
