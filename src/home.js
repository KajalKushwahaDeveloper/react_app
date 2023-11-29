import React, { useEffect, useState } from "react";
import "./scss/home.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CLIENT_CURRENT,
  EMULATOR_CREATE_RANDOM_URL,
  EMULATOR_URL,
} from "./constants.js";
import EmulatorTable from "./components/emulator_table.js";
import UserTable from "./components/user_table.js";
import { Button } from "@mui/material";
import DownloadApk from "./components/download_apk.js";
import PopUpUser from "./components/popup_user.js";
import PopUpAssignUser from "./components/popup_assign_user.js";
import PopUpEmulatorTelephone from "./components/popup_emulator_update_telephone.js";
import ChangeEmulatorSsidPopup from "./components/generated_id_popup.js";
import ApiService from "./ApiService.js";

/**
 * Renders the Home component.
 * 
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const [openEmulatorPopup, setOpenEmulatorPopup] = useState(false);
  const [openUserAssignPopup, setOpenUserAssignPopup] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [emulatorToAssignUser, setEmulatorToAssignUser] = useState(null);
  const [userAssingedEmulator, setUserAssingedEmulator] = useState(null);
  const [userEditedId, setUserEditedId] = useState(null);
  const [emulatorEditedId, setEmulatorEditedId] = useState(null);

  const [openChangeSsidPopup, setOpenChangeSsidPopup] = useState(false);
  const [emulatorToChangeSsid, setEmulatorToChangeSsid] = useState(null);

    /**
   * Show a toast with the given message and type.
   *
   * @param {string} message - The message to be displayed in the toast.
   * @param {string} type - The type of toast to be shown.
   */
  const showToast = (message, type) => {
    console.log("Showing toast...");
    toast[type](message); // Use the 'type' argument to determine the toast type
  };

  /**
   * Handles the action of opening the user popup.
   *
   * @return {void} This function does not return a value.
   */
  const handleOpen = () => {
    setOpenUserPopup(true);
    setUserToEdit(null);
  };

    /**
   * Handles the creation of an emulator.
   *
   * @return {Promise<void>} - A promise that resolves when the emulator has been created.
   */
  const handleCreateEmulator = async () => {
    showToast("Creating Emulator", "info");
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_CREATE_RANDOM_URL,
      "POST",
      null,
      null
    );
    if (success) {
      showToast(" Emulator Created ", "success");
    } else {
      showToast(" Failed to create Emulator ", "error");
    }
  };

    /**
   * Closes the popups and resets the state variables after handling user edits, user assigns, SSID changes, and emulator edit changes.
   *
   * @param {number} userEditedId - The ID of the user being edited
   * @param {number} emulatorEditedId - The ID of the emulator being edited
   */
  const handleClose = (userEditedId, emulatorEditedId) => {
    // handle User edit
    setOpenUserPopup(false);
    setUserToEdit(null);

    // handle user assign
    setOpenUserAssignPopup(false);
    setEmulatorToAssignUser(null);

    // handle Ssid changes
    setOpenChangeSsidPopup(false);
    setEmulatorToChangeSsid(false);

    // handle Emulator Edit Changes
    setOpenEmulatorPopup(false);
    if (userEditedId != null && !isNaN(+userEditedId))
      setUserEditedId(userEditedId);
    if (emulatorEditedId != null && !isNaN(+emulatorEditedId))
      setEmulatorEditedId(emulatorEditedId);
  };

  /**
   * Handles the click event of the edit button.
   *
   * @param {Object} data - The data associated with the button.
   * @return {void}
   */
  const handleEditButtonClick = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setOpenUserPopup(true);
  };

  /**
   * Handles the click event of the generated ID button.
   *
   * @param {Object} data - The data associated with the button.
   * @return {undefined} No return value.
   */
  const handleGeneratedIdButtonClick = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setEmulatorToChangeSsid(data);
    setOpenChangeSsidPopup(true);
  };

  /**
   * Handles the emulator telephone popup.
   *
   * @param {any} data - The data passed to the function.
   * @return {void} This function does not return anything.
   */
  const handleEmulatorTelephonePopup = (data) => {
    console.log("IconButton clicked with data:", data);
    setUserToEdit(data);
    setOpenEmulatorPopup(true);
  };

  /**
   * Handles the click event for the Assign User button.
   *
   * @param {object} data - The data associated with the event.
   * @return {undefined} This function does not return a value.
   */
  const handleAssignUserButtonClick = (data) => {
    console.log("Assign Button clicked with data:", data);
    setEmulatorToAssignUser(data);
    setOpenUserAssignPopup(true);
  };

  /**
   * Handles the assigned user to the emulator.
   *
   * @param {boolean} success - The success flag.
   * @param {function} error - The error function.
   * @param {any} data - The data object.
   */
  const handleAssignedUserToEmulator = (success, error, data) => {
    console.log("assignedUserToEmulator with data:", data);
    setUserAssingedEmulator(data);
    setEmulatorToAssignUser(null);
    setOpenUserAssignPopup(false);
  };

  /**
   * Handles the change of the emulator SSID.
   *
   * @param {boolean} success - Whether the operation was successful.
   * @param {function} error - The error callback function.
   * @param {any} data - The data associated with the change event.
   * @return {undefined} This function does not return anything.
   */
  const handleEmulatorSsidChanged = (success, error, data) => {
    console.log("handleEmulatorSsidChanged with data:", data);
  };

  // JSX rendering and other details...
  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} /> {/* zIndex set to 9999 to show above all */}
      <section className="dashboard">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 hello">
              <DownloadApk />

              <Button
                style={{
                  width: "10rem",
                  background: "#007dc6",
                  color: "white",
                  marginBottom: "1rem",
                }}
                onClick={handleCreateEmulator}
              >
                Create Emulator
              </Button>
              <EmulatorTable
                showToast={showToast}
                handleAssignUserButtonClick={handleAssignUserButtonClick}
                userAssingedEmulator={userAssingedEmulator}
                setUserAssingedEmulator={setUserAssingedEmulator}
                handleEmulatorTelephonePopup={handleEmulatorTelephonePopup}
                emulatorEditedId={emulatorEditedId}
                handleGeneratedIdButtonClick={handleGeneratedIdButtonClick}
              />
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="mb-5">
                <button className="btn btn-green mb-4" onClick={handleOpen}>
                  Add User
                </button>
                <PopUpUser
                  showToast={showToast}
                  handleClose={handleClose}
                  open={openUserPopup}
                  userToEdit={userToEdit}
                />

                {/* emulator telephone number edit popup */}
                <PopUpEmulatorTelephone
                  showToast={showToast}
                  handleClose={handleClose}
                  open={openEmulatorPopup}
                  userToEdit={userToEdit}
                />

                <ChangeEmulatorSsidPopup
                  showToast={showToast}
                  open={openChangeSsidPopup}
                  handleClose={handleClose}
                  emulatorToChangeSsid={emulatorToChangeSsid}
                  handleEmulatorSsidChanged={handleEmulatorSsidChanged}
                  handleAssignedUserToEmulator={handleAssignedUserToEmulator}
                />

                {/* assign user popup */}
                <PopUpAssignUser
                  showToast={showToast}
                  close={handleClose}
                  open={openUserAssignPopup}
                  emulatorToAssignUser={emulatorToAssignUser}
                  handleAssignedUserToEmulator={handleAssignedUserToEmulator}
                />

                {/* user table */}
                <UserTable
                  showToast={showToast}
                  handleEditButtonClick={handleEditButtonClick}
                  userEditedId={userEditedId}
                  userAssingedEmulator={userAssingedEmulator}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
