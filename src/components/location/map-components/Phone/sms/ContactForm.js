import { Button } from '@mui/material'
import React, { useState } from 'react'
import ApiService from '../../../../../ApiService'
import { MESSAGE_SEND_MSG } from '../../../../../constants'
import '../../../../../scss/ContactForm.scss'
import UploadFiles from './components/upload-files.component.js'

export function ContactForm({ emulatorId, showToast }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  // Remove the unused variable declaration
  const [messageError, setMessageError] = useState('')
  const [numberError, setPhoneNumberError] = useState('')

  const [fileNames, setFileNames] = useState([])

  const validatePhoneNumber = (number) => {
    if (!number) {
      setPhoneNumberError('Phone number is required.')
      return false
    }

    if (number.replace(/\D/g, '').length > 13) {
      setPhoneNumberError('Phone number is too long.')
      return false
    }

    setPhoneNumberError('')
    return true
  }

  const validateMessage = (text) => {
    if (!text) {
      setMessageError('Message is required.')
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
        setPhoneNumberError('')
        setMessageError('')
        showToast('Message Submit Successfully', 'success')
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
        {numberError && <p className="error">{numberError}</p>}
        <textarea
          className="smsTextarea"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {messageError && <p className="error">{messageError}</p>}

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
