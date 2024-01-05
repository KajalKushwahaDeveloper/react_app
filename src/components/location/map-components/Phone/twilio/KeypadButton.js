import React from 'react'
import PropTypes from 'prop-types'
import './KeypadButton.css'

const KeypadButton = ({ children, handleClick, color = '' }) => {
  return (
    <button className={`keypad-button ${color}`} onClick={handleClick}>
      {children}
    </button>
  )
}

KeypadButton.propTypes = {
  children: PropTypes.node,
  handleClick: PropTypes.func,
  color: PropTypes.string
}

export default KeypadButton
