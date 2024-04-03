import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ApiService from '../ApiService.js'
import { GetEmulatorApi } from '../components/api/emulator.js'
import DownloadApk from '../components/download_apk.js'
import ChangeEmulatorSsidPopup from '../components/generated_id_popup.js'
import EmulatorTable from '../components/home/emulator/EmulatorTable.jsx'
import UserTable from '../components/home/user/UserTable.jsx'
import PopUpAssignUser from '../components/popup_assign_user.js'
import PopUpEmulatorTelephone from '../components/popup_emulator_update_telephone.js'
import PopUpUser from '../components/popup_user.js'
import { EMULATOR_CREATE_RANDOM_URL, USER_URL } from '../constants.js'
import { useEmulatorStore } from '../stores/emulator/store.tsx'
import { useAuth } from './hooks/useAuth.js'

const Home = () => {
  const { client } = useAuth()
  const [openUserPopup, setOpenUserPopup] = useState(false)
  const [openEmulatorPopup, setOpenEmulatorPopup] = useState(false)
  const [openUserAssignPopup, setOpenUserAssignPopup] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)
  const [emulatorToAssignUser, setEmulatorToAssignUser] = useState(null)
  const [userAssingedEmulator, setUserAssingedEmulator] = useState(null)
  const [userEditedId, setUserEditedId] = useState(null)
  const [emulatorEditedId, setEmulatorEditedId] = useState(null)

  const [openChangeSsidPopup, setOpenChangeSsidPopup] = useState(false)
  const [emulatorToChangeSsid, setEmulatorToChangeSsid] = useState(null)
  const [emulatorData, setEmulatorData] = useState([])
  const [updatedData, setUpdatedData] = useState([])
  const [updateSerial, setUpdateSerial] = useState(false)

  const updateEmulators = useEmulatorStore((state) => state.updateEmulators)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    resetField,
    control,
    formState: { errors }
  } = useForm()

  const showToast = (message, type) => {
    toast[type](message) // Use the 'type' argument to determine the toast type
  }

  const handleOpen = () => {
    setOpenUserPopup(true)
    setUserToEdit(null)
  }

  const updatedEmulator = async () => {
    const { success, data, error } = await GetEmulatorApi()
    if (success) {
      updateEmulators(data)
      setEmulatorData(data)
    } else {
      console.error('Failed to fetch Emulator Data', error)
      showToast('Failed to fetch Emulator Data', 'error')
    }
  }

  const handleCreateEmulator = async () => {
    showToast('Creating Emulator', 'info')
    const { success, error } = await ApiService.makeApiCall(
      EMULATOR_CREATE_RANDOM_URL,
      'POST',
      null,
      null
    )
    if (success) {
      showToast(' Emulator Created ', 'success')
      updatedEmulator()
    } else {
      console.error('Failed to create Emulator', error)
      showToast(' Failed to create Emulator ', 'error')
    }
  }

  const token = localStorage.getItem('token')
  const handleClose = async (userEditedId, emulatorEditedId) => {
    reset()
    resetField()
    // handle User edit
    setOpenUserPopup(false)
    const response = await fetch(USER_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    response.json().then((data) => {
      setUpdatedData(data)
    })
    setUserToEdit(null)

    // handle user assign
    setOpenUserAssignPopup(false)
    setEmulatorToAssignUser(null)

    // handle Ssid changes
    setOpenChangeSsidPopup(false)
    setEmulatorToChangeSsid(false)

    // handle Emulator Edit Changes
    setOpenEmulatorPopup(false)
    if (userEditedId != null && !isNaN(+userEditedId)) {
      setUserEditedId(userEditedId)
    }
    if (emulatorEditedId != null && !isNaN(+emulatorEditedId)) {
      setEmulatorEditedId(emulatorEditedId)
    }
  }

  // Edit PHONE NUMBER button click
  const handleEditButtonClick = (data) => {
    setUserToEdit(data)
    setOpenUserPopup(true)
  }

  // emulator generated id button click
  const handleGeneratedIdButtonClick = (data) => {
    setUserToEdit(data)
    setEmulatorToChangeSsid(data)
    setOpenChangeSsidPopup(true)
    setUpdateSerial(false)
  }

  // telephone update
  const handleEmulatorTelephonePopup = (data) => {
    setUserToEdit(data)
    setOpenEmulatorPopup(true)
  }
  // assign user button
  const handleAssignUserButtonClick = (data) => {
    setEmulatorToAssignUser(data)
    setOpenUserAssignPopup(true)
  }
  // assign user to an emulator
  const handleAssignedUserToEmulator = (success, error, data) => {
    setUserAssingedEmulator(data)
    setEmulatorToAssignUser(null)
    setOpenUserAssignPopup(false)
  }

  const handleEmulatorSsidChanged = (success, error, data) => {}

  if (client) {
    let isAdmin = false
    client.role_TYPE?.forEach((role) => {
      if (role.authority.includes('ROLE_ADMIN')) {
        isAdmin = true
      }
    })
    if (!isAdmin) {
      return <Navigate to="/access-denied" />
    }
  }

  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} /> {/* to show above all */}
      <section className="dashboard">
        <div className="container-fluid">
          <div className="row">
            <DownloadApk />
            <div className="col-lg-6">
              <EmulatorTable
                showToast={showToast}
                handleAssignUserButtonClick={handleAssignUserButtonClick}
                userAssingedEmulator={userAssingedEmulator}
                setUserAssingedEmulator={setUserAssingedEmulator}
                handleEmulatorTelephonePopup={handleEmulatorTelephonePopup}
                emulatorEditedId={emulatorEditedId}
                handleGeneratedIdButtonClick={handleGeneratedIdButtonClick}
                emulatorData={emulatorData}
                updateSerial={updateSerial}
                handleCreateEmulator={handleCreateEmulator}
              />
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="mb-5">
                <PopUpUser
                  showToast={showToast}
                  handleClose={handleClose}
                  open={openUserPopup}
                  userToEdit={userToEdit}
                  setValue={setValue}
                  register={register}
                  reset={reset}
                  resetField={resetField}
                  handleSubmit={handleSubmit}
                  errors={errors}
                  control={control}
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
                  setUpdateSerial={setUpdateSerial}
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
                  updatedData={updatedData}
                  handleOpen={handleOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
