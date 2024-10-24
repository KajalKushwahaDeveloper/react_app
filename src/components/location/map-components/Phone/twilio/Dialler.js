import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Importing the default styles of PhoneInput
import "./Dialler.css";
import KeypadButton from "./KeypadButton";

const Dialler = ({ number, setNumber }) => {
  const handleNumberChange = (newNumber) => {
    setNumber(newNumber);
  };

  const handleBackSpace = () => {
    if (number) {
      setNumber(number.substring(0, number.length - 1));
    }
  };

  const handleNumberPressed = (newNumber) => () => {
    setNumber(`${number || ""}${newNumber}`);
  };

  return (
    <>
      <PhoneInput
        country="US"
        value={number}
        onChange={handleNumberChange}
        className="smsInput"
        placeholder="Enter phone number"
        defaultCountry="US"
      />

      <ol className="keypad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "0"].map(
          (digit) => (
            <li key={digit}>
              <KeypadButton handleClick={handleNumberPressed(digit)}>
                {digit}
              </KeypadButton>
            </li>
          )
        )}
        {number?.length > 0 && (
          <li>
            <KeypadButton handleClick={handleBackSpace}>&lt;&lt;</KeypadButton>
          </li>
        )}
      </ol>
    </>
  );
};

export default Dialler;
