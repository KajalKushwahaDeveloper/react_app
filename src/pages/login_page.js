import React, { useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
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
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card
          className="shadow-sm p-3 border rounded-4"
          style={{ maxWidth: '24rem', width: '100%' }}
        >
          <Card.Body>
            <h2 className="global-font fw-bold text-start mb-2 fs-4">Login</h2>

            <p
              className="custom-muted-text text-start mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Enter your email below to login to your account
            </p>

            <Form>
              <Form.Group className="global-font mb-3">
                <label>Email</label>
                <Form.Control
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="rounded-2 ms-0 mt-2 custom-focus"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label className=" global-font fw-medium">
                    Password
                  </Form.Label>
                  <a
                    href="#"
                    className="global-font text-decoration-underline text-dark small"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Form.Control
                  type="password"
                  required
                  className="rounded-2 ms-0 mt-1 custom-focus"
                  placeholder="Enter Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Form.Group>

              <Button
                variant="dark"
                className="global-font w-100 mb-3 rounded-2 py-2 fw-medium ms-0"
                type="submit"
                onClick={handleSubmit}
              >
                Login
              </Button>
              {emailError && (
                <p className="error text-danger text-center">{emailError}</p>
              )}
              {passwordError && (
                <p className="error text-danger text-center">{passwordError}</p>
              )}
              {responseError && (
                <p className="error text-danger text-center">
                  {'Invalid Credentials'}
                </p>
              )}
              <Button
                variant="outline-secondary"
                className="global-font w-100 rounded-2 py-2 fw-medium ms-0 custom-google-btn text-black"
              >
                Login with Google
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span className="global-font text-black">
                {"Don't have an account?"}
              </span>
              <Link
                href="#"
                className="global-font text-decoration-underline text-black fs-6 ms-2"
              >
                {'Sign up'}
              </Link>
            </div>
            {isForgotPasswordModalOpen === true && (
              <ForgotPasswordModal
                isOpen={isForgotPasswordModalOpen}
                onClose={closeForgotPasswordModal}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
export default LoginPage
