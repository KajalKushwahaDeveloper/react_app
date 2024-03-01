import CallEndIcon from '@mui/icons-material/CallEnd'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import React from 'react'
import './incoming.css'

const Incoming = ({ callerName, acceptConnection, rejectConnection }) => {
  const callerNameFinal = callerName?.parameters?.From ?? 'Missed Call'

  return (
    <div className="incoming-container">
      <div className="caller-name d-flex align-items-center gap-2">
        {callerNameFinal}
      </div>
      {callerNameFinal !== 'Missed Call' && callerName !== null ? (
        <div className="incoming-buttons">
          <button className="accept-button" onClick={acceptConnection}>
            <LocalPhoneIcon />
          </button>
          <button className="reject-button" onClick={rejectConnection}>
            <CallEndIcon />
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Incoming
