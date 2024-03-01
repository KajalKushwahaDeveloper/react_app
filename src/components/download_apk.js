import GetAppIcon from '@mui/icons-material/GetApp'
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useViewPort } from '../../src/ViewportProvider.js'
import { COPY_DOWNLOAD_APK_URL, DOWNLOAD_APK_URL } from '../constants'

const DownloadApk = () => {
  const [loading, setLoading] = useState(false)

  const { width } = useViewPort()
  const breakpoint = 376
  const isMobile = width < breakpoint

  const handleDownloadFile = async () => {
    setLoading(true) // Set loading to true before starting the fetch

    const token = localStorage.getItem('token')

    fetch(DOWNLOAD_APK_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error downloading file')
        }
        return response.blob()
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'trackspot.apk' // Set the desired file name
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch((error) => {
        window.alert(error)
        console.error('Download error:', error)
      })
      .finally(() => {
        setLoading(false) // Set loading back to false after downloading is complete or an error occurs
      })
  }

  const handleCopyUrl = async () => {
    setLoading(true) // Set loading to true before starting the copy operation

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      toast.error('Clipboard access not supported, use https')
      setLoading(false) // Set loading back to false if clipboard access is not supported
      return
    }

    // Copy the download URL to clipboard
    navigator.clipboard
      .writeText(COPY_DOWNLOAD_APK_URL)
      .then(() => {
        toast.success('Download URL copied')
      })
      .catch((error) => {
        toast.success('Could Not Copy Link' + error)
      })
      .finally(() => {
        setLoading(false) // Set loading back to false after copying is complete or an error occurs
      })
  }

  return (
    <Card
      style={{
        backgroundColor: 'white',
        color: '#007dc6',
        marginBottom: '1rem',
        boxShadow: '-3px -3px 7px #bfbdbd73, 2px 2px 7px rgb(222, 241, 252)'
      }}
    >
      <CardContent style={{ padding: '1rem' }}>
        <div className="d-flex justify-content-around">
          <Typography
            variant="h5"
            component="h2"
            style={{ fontSize: isMobile ? '1rem' : '1.5rem' }}
          >
            Mock Application APK
          </Typography>
          <Button
            variant="contained"
            className="btn btn-main d-flex flex-column flex-sm-row px-5"
            startIcon={<GetAppIcon />} // Add the GetAppIcon at the starting of the button
            onClick={handleDownloadFile}
            style={{ marginLeft: '1.2rem', width: '12rem !important' }}
            endIcon={loading && <CircularProgress color="inherit" size={20} />}
            disabled={loading}
          >
            Download File
          </Button>

          <button
            className="btn btn-green"
            onClick={handleCopyUrl}
            style={{
              fontSize: isMobile ? '.7rem' : '.875rem'
            }}
          >
            <i className="fa-solid fa-copy"></i> COPY DOWNLOAD LINK
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DownloadApk
