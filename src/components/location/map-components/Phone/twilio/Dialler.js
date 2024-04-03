import React from 'react'
import PhoneInput from 'react-phone-number-input'
import './Dialler.css'
import KeypadButton from './KeypadButton'

const Dialler = ({ number, setNumber }) => {
  const handleNumberChange = (event) => {
    setNumber(event)
  }

  const handleBackSpace = () => {
    setNumber(number.substring(0, number.length - 1))
  }

  const handleNumberPressed = (newNumber) => {
    return () => {
      setNumber(`${number}${newNumber}`)
    }
  }

  return (
    <>
      <PhoneInput
        country="US"
        defaultCountry="US"
        value={number}
        onChange={handleNumberChange}
        className="smsInput"
        // maxLength='11'
      />

      <ol className="keypad">
        <li>
          <KeypadButton handleClick={handleNumberPressed('1')}>1</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('2')}>2</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('3')}>3</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('4')}>4</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('5')}>5</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('6')}>6</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('7')}>7</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('8')}>8</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('9')}>9</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('+')}>+</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={handleNumberPressed('0')}>0</KeypadButton>
        </li>
        {number?.length > 0 && (
          <li>
            <KeypadButton handleClick={handleBackSpace}>&lt;&lt;</KeypadButton>
          </li>
        )}
      </ol>
    </>
  )
}

export default Dialler
