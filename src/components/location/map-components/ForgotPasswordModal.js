import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import ApiService from '../../../ApiService'
import { FORGOT_PASSWORD } from '../../../constants'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(null)
  const [responseError, setResponseError] = useState(null)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')

    if (!email) {
      setEmailError('Please enter your email address.')
    } else {
      try {
        const { success, data, error } = await ApiService.makeApiCall(
          FORGOT_PASSWORD,
          'GET',
          null,
          null,
          email
        )
        if (success) {
          const token = data.token
          localStorage.setItem('token', token)
          setResetSuccess('Sent reset password mail successful')
        } else {
          setResponseError(error || 'Invalid Email') // Display appropriate error message
        }
      } catch (error) {
        console.error('Error occurred while sending mail:', error)
        setResponseError('An error occurred while sending mail') // Display a generic error message
      }
    }
  }

  return (
    <Modal
      open={isOpen}
      // onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          paddingTop: '15px',
          position: 'absolute',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        className="shadow-sm p4 border rounded-4"
        style={{ maxWidth: '20rem', width: '20rem' }}
      >
        <span
          className="close"
          onClick={onClose}
          style={{
            float: 'right',
            marginTop: '-1.5rem',
            marginRight: '0.5rem',
            height: '2rem',
            width: '2rem',
            cursor: 'pointer',
            textAlign: 'center',
            position: 'absolute',
            right: 0
          }}
        >
          &times;
        </span>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="global-font fw-bold text-start mb-2 fs-4 pt-1"
        >
          Forgot Password
        </Typography>
        {resetSuccess ? (
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Password reset instructions have been sent to your email address.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ paddingTop: '10px' }}>
              <label htmlFor="email" className="global-font">
                Email Address:
              </label>
              <input
                style={{
                  marginTop: '7px',
                  marginBottom: '20px',
                  marginLeft: '0px',
                  marginRight: '0px'
                }}
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder='Enter email'
                className="form-control global-font custom-focus"
              />
              {emailError && <p className="error global-font">{emailError}</p>}
              {responseError && (
                <p className="error global-font">{responseError}</p>
              )}
            </div>
            <Button
              variant="dark"
              className="global-font w-50 mb-3 rounded-2 py-2 fw-medium ms-0 resetPasswordBtn"
              type="submit"
            >
              Send Email
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  )
}

export default ForgotPasswordModal
