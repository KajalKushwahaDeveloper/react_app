import React from 'react'
import { Link } from 'react-router-dom'
import './access_denied.scss'
import { useAuth } from './hooks/useAuth.js'

const AccessDenied = () => {
  const { client } = useAuth()
  let isUser = false
  client.role_TYPE?.forEach((role) => {
    if (role.authority.includes('ROLE_USER')) {
      isUser = true
    }
  })

  return (
    <div className="mainAccessDenied">
      <h1 className="headerAccessDenied">ACCESS DENIED</h1>
      <p className="paraAccessDenied">
        It seems you do not have permission to view this page.
      </p>
      <p className="paraAccessDenied">
        <Link className="buttonAccessDenied" to={isUser ? '/' : '/login'}>
          Return to Home Page
        </Link>
      </p>
    </div>
  )
}

export default AccessDenied
