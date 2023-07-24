import React, { useEffect, useState } from "react";
import { CREATE_TRIP_URL } from "../../../constants.js";
import ApiService from "../../../ApiService.js";
import CreateTripDialogBox from "./dialog_box.js";

const CreateTripTable = ({
  showToast,
  selectedEmId,
  setIsTableVisible,
  setUpdatedTripPath,
  setSelectedEmId,
  setCreateTripInfo,
}) => {
  const [fromLat, setFromLat] = useState();
  const [fromLong, setFromLong] = useState();
  const [toLat, setToLat] = useState();
  const [toLong, setToLong] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [toAddress, setToAddress] = useState();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleTableClose = () => {
    setIsTableVisible(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = async () => {
    if ((!fromLat && !fromLong) || (!toLat && !toLong)) {
      setError("Please fill both locations.");
      return;
    }

    setError("");

    console.log("selectedEmId:", selectedEmId);
    const token = localStorage.getItem("token");

    const payload = {
      startLat: fromLat,
      startLong: fromLong,
      endLat: toLat,
      endLong: toLong,
      fromAddress: fromAddress,
      toAddress: toAddress,
      speed: 60,
      emulatorDetailsId: selectedEmId,
    };
    console.log("payload create trip: ", payload);

    const { success, data, error } = await ApiService.makeApiCall(
      CREATE_TRIP_URL,
      "POST",
      payload,
      token
    );
    if (success) {
      showToast("Added successfully // TODO HANDLE CHANGES TO MAP", "success");
      setSelectedEmId(0);
      setSelectedEmId(selectedEmId);
      setCreateTripInfo(data);
    } else {
      showToast(error, "error");
    }

    setIsTableVisible(false);
  };
  console.log("selectedEmId......:", selectedEmId);
  return (
    <div>
      <CreateTripDialogBox
        setLat={setFromLat}
        setLong={setFromLong}
        setAddress={setFromAddress}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default CreateTripTable;
