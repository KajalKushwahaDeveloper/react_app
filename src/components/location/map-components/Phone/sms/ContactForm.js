import React, { useState } from 'react'
import { Button } from '@mui/material'
import ApiService from '../../../../../ApiService'
import { MESSAGE_SEND_MSG } from '../../../../../constants'
import UploadFiles from './components/upload-files.component.js'
import '../../../../../scss/ContactForm.scss'
import PropTypes from 'prop-types'

export function ContactForm ({ emulatorId, showToast }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')

  const [fileNames, setFileNames] = useState([])

  const validatePhoneNumber = (number) => {
    if (!number) {
      return false
    }

    if (number.replace(/\D/g, '').length > 13) {
      return false
    }

    return true
  }

  const validateMessage = (text) => {
    if (!text) {
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (validatePhoneNumber(phoneNumber) && validateMessage(message)) {
      const extractedNames = fileNames.map((file) => file.name)

      const payload = {
        emulatorId,
        message,
        number: phoneNumber,
        fileNames: extractedNames
      }
      const token = localStorage.getItem('token')
      const { success, error } = await ApiService.makeApiCall(
        MESSAGE_SEND_MSG,
        'POST',
        payload,
        token,
        null
      )
      if (success) {
        setPhoneNumber('')
        setMessage('')
        showToast('Data submit Successfully', 'success')
      } else if (error) {
        showToast(`error: ${error}`, 'error')
      }
    }
  }

  return (
    <div className="sms_form">
      <form onSubmit={handleSubmit}>
        {/* Form inputs */}
        <input
          className="smsInput"
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <textarea
          className="smsTextarea"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <UploadFiles setFileNames={setFileNames} showToast={showToast} />

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: '1rem' }}
        >
          SEND
        </Button>
      </form>
    </div>
  )
}

ContactForm.propTypes = {
  emulatorId: PropTypes.number,
  showToast: PropTypes.func
}
