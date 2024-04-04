import { Button, CircularProgress } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import ApiService from '../../../../../ApiService'
import { MESSAGE_SEND_MSG } from '../../../../../constants'
import '../../../../../scss/ContactForm.scss'
import UploadFiles from './components/upload-files.component.js'

export function ContactForm({ emulatorId, showToast }) {
  const { control, handleSubmit, reset } = useForm()
  const [message, setMessage] = useState('')
  const uploadFilesRef = useRef()
  const inputFile = useRef(null)
  // Remove the unused variable declaration
  const [messageError, setMessageError] = useState('')
  const [numberError, setPhoneNumberError] = useState('')

  const [fileNames, setFileNames] = useState([])
  const [loading, setLoading] = useState(false) // State for loading

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

  const handleSubmitForm = async (data) => {
    inputFile.current.value = ''
    inputFile.current.type = 'file'
    const { telephone } = data
    setLoading(true) // Set loading state to true

    if (validatePhoneNumber(telephone) && validateMessage(message)) {
      const extractedNames = fileNames.map((file) => file.name)

      const payload = {
        emulatorId,
        message,
        number: telephone,
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
        setMessage('')
        setPhoneNumberError('')
        setMessageError('')
        setFileNames([])
        reset({ telephone: '' })
        setFileNames([])
        uploadFilesRef.current.resetState()
        showToast('Message Submit Successfully', 'success')
      } else if (error) {
        showToast(`error: ${error}`, 'error')
      }
      setLoading(false) // Set loading state to false after request completes
    }
  }
  return (
    <div className="sms_form" style={{ zIndex: '100' }}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        {/* Form inputs */}
        <PhoneInputWithCountry
          name="telephone"
          control={control}
          international
          countryCallingCodeEditable={false}
          defaultCountry="US"
          limitMaxLength={10}
          rules={{
            required: {
              value: true,
              message: 'Telephone is required!'
            }
          }}
          className="smsInput"
          style={{ marginBottom: '12px' }}
        />
        {numberError && <p className="error">{numberError}</p>}
        <textarea
          className="smsTextarea"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {messageError && <p className="error">{messageError}</p>}

        <UploadFiles ref={uploadFilesRef} setFileNames={setFileNames} showToast={showToast} inputFile={inputFile} />

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: '1rem' }}
        >
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />} {/* Show loader when loading */}
          {!loading && 'SEND'}
        </Button>
      </form>
    </div>
  )
}
