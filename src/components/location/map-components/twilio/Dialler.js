import React, { useState, useEffect } from "react";
import "./Dialler.css";
import KeypadButton from "./KeypadButton";
import DropDown from "../../../dropDown";

const Dialler = ({ number, setNumber }) => {
  const [history, setHistory] = useState([]);


console.log("setNumber11")

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("dialedNumbers")) || [];
    setHistory(savedHistory);
  }, []);

  const handleNumberChange = (event) => {
    const inputNumber = event.target.value;
    if (/^[\d\W]{0,13}$/.test(inputNumber)) {
    setNumber(inputNumber);
  }
  };
  

  const handleBackSpace = () => {
    setNumber(number.substring(0, number.length - 1));
  };

  const handleClear = () => {
    setNumber(""); // Clears the entire string
  }; 

  const handleNumberPressed = (newNumber) => {
    const updatedNumber = `${number}${newNumber}`;
    if (/^[\d\W]{0,13}$/.test(updatedNumber)) {
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


  // const handleCallButtonClick = () => {
  //   handleCall();
  //   addToHistory(number);
  //   setNumber(""); // Clear the input field
  // };

  return (
    <>
    {/* dropdown */}
    <div style={{float : "right"}}>
      <DropDown onSelect={handleSelectNumber}/>
      </div>
    
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
            <KeypadButton handleClick={() => handleBackSpace()}>&lt;&lt;</KeypadButton>
        </li>                        
        <li>
          <KeypadButton handleClick={() => handleNumberPressed("+")}>+</KeypadButton>
        </li> 
         <li>
        <KeypadButton handleClick={() => handleClear()}>Clear</KeypadButton>
        </li>  
      </ol>
    
        {/* <div className="call">
          <KeypadButton className="call_button" handleClick={handleCallButtonClick} color="green"  >
            <CallIcon /> Call
          </KeypadButton>
        </div> */}
    
    </>
  );
};

export default Dialler;
