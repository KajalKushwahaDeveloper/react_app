import React, { useState, useEffect } from "react";
import "./Dialler.css";
import KeypadButton from "./KeypadButton";
import CallIcon from "@mui/icons-material/Call";
import CloseIcon from "@mui/icons-material/Close";

const Dialler = ({ number, setNumber, handleCall }) => {
  const [history, setHistory] = useState([]);


console.log("setNumber11")

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("dialedNumbers")) || [];
    setHistory(savedHistory);
  }, []);

  const handleNumberChange = (event) => {
    const inputNumber = event.target.value;
  if (/^\d{0,13}$/.test(inputNumber)) {
    setNumber(inputNumber);
  }
    // Check if the input consists of only digits and is no longer than 13 characters
    // if (/^[0-9]+$/.test(inputNumber) && inputNumber.length <= 13) {
    //   setNumber(inputNumber);
    // } else if (/^[*#+]+$/.test(inputNumber) && inputNumber.length <= 13) {
    //   setNumber(inputNumber);
    // }
  };
  

  const handleBackSpace = () => {
    setNumber(number.substring(0, number.length - 1));
  };

  const handleClear = () => {
    setNumber(""); // Clears the entire string
  };  
  const handleNumberPressed = (newNumber) => {
    const updatedNumber = `${number}${newNumber}`;
    if (/^\d{0,13}$/.test(updatedNumber)) {
      setNumber(updatedNumber);
    }
  };
  const handleSelectNumber = (selectedNumber) => {
    setNumber(selectedNumber);
  };

  const addToHistory = (newNumber) => {
    if (!history.includes(newNumber)) {
      const newHistory = [...history, newNumber];
      setHistory(newHistory);
      localStorage.setItem("dialedNumbers", JSON.stringify(newHistory)); // Save to local storage
    }
  };

  // const handleDeleteNumber = (numberToDelete) => {
  //   const newHistory = history.filter((dialledNumber) => dialledNumber !== numberToDelete);
  //   setHistory(newHistory);
  //   localStorage.setItem("dialedNumbers", JSON.stringify(newHistory)); // Save updated history to local storage
  // };

  const handleCallButtonClick = () => {
    handleCall();
    addToHistory(number);
    setNumber(""); // Clear the input field
  };

  return (
    <>
      <input
        type="tel"
        list="history"
        value={number}
        onChange={handleNumberChange}
        className="input"
        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" 
        title="Please enter a valid input"
      />
      <datalist id="history" className="history-dropdown">
        {history.map((dialledNumber, index) => (
          <option key={index}>{dialledNumber}</option>
        ))}
      </datalist>
      <ol className="keypad">
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("1")}>1</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("2")}>2</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("3")}>3</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("4")}>4</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("5")}>5</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("6")}>6</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("7")}>7</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("8")}>8</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("9")}>9</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("*")}>*</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("0")}>0</KeypadButton>
        </li>
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("#")}>#</KeypadButton>
        </li>  
        <li>
            <KeypadButton handleClick={() => handleBackSpace}>&lt;&lt;</KeypadButton>
        </li>                        
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("+")}>+</KeypadButton>
        </li> 
         <li>
        <KeypadButton handleClick={() => handleClear()}>Clear</KeypadButton>
        </li>  
      </ol>
      {number?.length > 0 && (
        <div className="call">
          <KeypadButton handleClick={handleCallButtonClick} color="green">
            <CallIcon />
          </KeypadButton>
        </div>
      )}
    </>
  );
};

export default Dialler;
