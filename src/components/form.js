import '../scss/form.scss'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Form = ({ fcmToken }) => {
  const [long, setLong] = useState('')
  const [lat, setLat] = useState('')
  const [isLoading, setLoading] = useState(false)

  const handleUserChange = (e) => {
    setLong(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setLat(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    const myHeaders = new Headers()
    myHeaders.append(
      'Authorization',
      'key=AAAA80oZcs4:APA91bHjx0_uMP7t4ZQY2WTrh6tLNiR7Rc82fkySOp1Y7Jdfe0oKb_e3qFSns-kfZUtFhzJD0DQLcbAk-68b8M_g6Z6KY7fThG3Ls1JkQF2lHfvt2TG9v21ELgwcWLlv-ZZnrSK2YAPP'
    )
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      data: {
        data: {
          latitude: lat,
          longitude: long
        }
      },
      priority: 10,
      to: fcmToken
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setLat('')
        setLong('')
        setLoading(false)
        toast.success('Sent Lat Long to device')
      })
      .catch((error) => {
        toast.error('Error sending Lat Long')
        console.error('FCM error', error)
        setLoading(false)
      })
  }

  return (
    <div className="center_div">
      <ToastContainer />
      <div className="content">
        <form onSubmit={handleSubmit}>
          {/* <label>current latitude</label>
          <input
            type="text"
            id="content_input"
            name="lat"
            placeholder="Enter your current latitude"
            value={lat}
            onChange={handlePasswordChange}
          /> */}

          <label>latitude</label>

          <input
            type="text"
            id="content_input"
            name="lat"
            placeholder="Enter your latitude"
            value={lat}
            onChange={handlePasswordChange}
          />
          {/* <label>current longitude</label>
          <input
            type="text"
            id="content_input"
            name="long"
            placeholder="Enter your current longitude"
            value={long}
            onChange={handleUserChange}
          /> */}
          <label>longitude</label>
          <input
            type="text"
            id="content_input"
            name="long"
            placeholder="Enter your longitude"
            value={long}
            onChange={handleUserChange}
          />

          {isLoading
            ? (
            <div className="loader">
              <CircularProgress />
            </div>
              )
            : (
            <button className="login_button" type="submit">
              Submit
            </button>
              )}
        </form>
      </div>
    </div>
  )
}

export default Form
