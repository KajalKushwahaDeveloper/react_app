import React from 'react'
import { Link } from 'react-router-dom'
import './redirect.scss'

const PageNotFound = () => {
  return (
    <div className="mainFourZeroFour">
      <h1 className="headerFourZeroFour">404</h1>
      <p className="paraFourZeroFour">Oops! Something is wrong.</p>
      <Link className="buttonFourZeroFour" to="/">
        Return to Home Page
      </Link>
    </div>
  )
}

export default PageNotFound
