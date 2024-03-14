import React, { useEffect, useState } from 'react'

import TablePagination from '@mui/base/TablePagination'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import ApiService from '../ApiService'
import { EMULATOR_DELETE_URL, EMULATOR_URL, USER_ASSIGN_EMULATOR_URL } from '../constants'
import '../scss/button.scss'

import { Tooltip } from '@mui/material'
import { GetEmulatorApi } from '../components/api/emulator'

const EmulatorTable = ({
  showToast,
  handleAssignUserButtonClick,
  userAssingedEmulator,
  setUserAssingedEmulator,
  handleEmulatorTelephonePopup,
  handleGeneratedIdButtonClick,
  emulatorEditedId,
  emulatorData,
  updateSerial
}) => {
  // State variables
  const [emulators, setEmulators] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setEmulators(emulatorData)
  }, [emulatorData])

  useEffect(() => {
    if (emulatorEditedId != null) {
      if (emulatorEditedId == 0) {
        fetchData()
      } else {
        refreshEditedEmulator(emulatorEditedId)
      }
    }
  }, [emulatorEditedId])

  useEffect(() => {
    const updateSerialEmu = async () => {
      const { success, data, error } = await GetEmulatorApi()
      if (success) {
        setEmulators(data)
      }
    }
    updateSerialEmu()
  }, [updateSerial])

  // Fetch data from API
  const refreshEditedEmulator = async (emulatorEditedId) => {
    const token = localStorage.getItem('token')
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_URL,
      'GET',
      null,
      token,
      emulatorEditedId
    )
    if (success) {
      const updatedData = emulators.map((item) => {
        if (item.id === data.id) {
          return data
        }
        return item
      })
      // showToast('Updated emulator table!', 'success')
      setEmulators(updatedData)
    } else {
      showToast('Failed to update emulator table' + error, 'error')
      return { success: false, error: 'Failed to unassign user' }
    }
  }

  // assign/unassign button
  const handleActionButtonClick = async (row) => {
    if (row.user != null) {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch(USER_ASSIGN_EMULATOR_URL + '/' + row.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok || response.status !== 200) {
          showToast('Failed to unassign user', 'error')
          return { success: false, error: 'Failed to unassign user' }
        }
        // Send the removed user ID to refresh in user table
        const userAssignedEmulator = {
          user: {
            id: row.user?.id
          }
        }
        setUserAssingedEmulator(userAssignedEmulator)
        const updatedData = emulators.map((item) => {
          if (item.id === row.id) {
            return { ...item, user: null }
          }
          return item
        })
        showToast('User Un-Assigned', 'success')
        setEmulators(updatedData)
      } catch (error) {
        showToast(`Failed to unassign user ${error}`, 'error')
      }
    } else {
      handleAssignUserButtonClick(row)
    }
  }

  // Fetch data from API // GET  API
  const fetchData = async () => {
    setLoading(true)
    const { success, data, error } = await GetEmulatorApi()

    if (success) {
      setEmulators(data)
      setLoading(false)
    } else {
      setError(error)
      setLoading(false)
    }
  }

  // delete button
  const handleDeleteButtonClick = async (emulator) => {
    const confirmed = window.confirm(
      'Delete this emulator : ' + emulator.emulatorSsid + '?'
    )
    if (confirmed) {
      const token = localStorage.getItem('token')
      const { success, data, error } = await ApiService.makeApiCall(
        EMULATOR_DELETE_URL,
        'DELETE',
        null,
        token,
        emulator.id
      )

      if (success) {
        showToast('emulator deleted', 'success')
        fetchData()
      } else {
        showToast('emulator not deleted', 'error')
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    const { success, error } = fetchData()
    if (success) {
      showToast('Fetched Emulators successfully', 'success')
    } else {
      showToast(error, 'error')
    }
  }, [])

  useEffect(() => {
    if (userAssingedEmulator != null) {
      const updatedData = emulators.map((item) => {
        if (item.id === userAssingedEmulator.id) {
          return { ...item, user: userAssingedEmulator.user }
        }
        return item
      })
      setEmulators(updatedData)
    }
  }, [userAssingedEmulator])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, emulators.length - page * rowsPerPage)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="tableBox">
      <table
        aria-label="custom pagination table"
        className="table shadow mb-0 n="
      >
        <thead style={{ background: '#007dc6' }}>
          <tr>
            <th>STATUS</th>
            <th>SERIAL NO</th>
            <th>NUMBER</th>
            <th>ASSIGNED</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? emulators.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )
            : emulators
          ).map((row) => (
            <tr key={row.id || 'N/A'}>
              <td>{row.status || 'N/A'}</td>
              <td
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  borderTop: 'none'
                }}
              >
                <div
                  style={{
                    maxWidth: '60px',
                    margin: '1rem 0rem'
                  }}
                >
                  <Tooltip
                    title={row.emulatorSsid || 'N/A'}
                    placement="top"
                    alignItems="center"
                    display="flex"
                  >
                    <div
                      style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: '150px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                      align="right"
                    >
                      {row.emulatorSsid || 'N/A'}
                    </div>
                  </Tooltip>
                </div>

                <div>
                  <IconButton
                    size="small"
                    style={{
                      height: 'auto',
                      width: '35px',
                      float: 'right'
                    }}
                    aria-label="edit"
                  >
                    <EditIcon
                      fontSize="small"
                      onClick={() => handleGeneratedIdButtonClick(row)}
                    />
                  </IconButton>
                </div>
              </td>
              <td align="right">{row.telephone || 'N/A'}</td>
              <td align="right">
                {row.user?.firstName || 'N/A'} {row.user?.lastName || 'N/A'}
              </td>
              <td
                style={{ display: 'flex', width: 'auto', borderBottom: 'none' }}
                align="right"
              >
                <IconButton
                  size="small"
                  style={{
                    margin: '2px'
                  }}
                  aria-label="delete"
                  onClick={() => handleDeleteButtonClick(row)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <div>
                  <button
                    style={{
                      backgroundColor: row.user === null ? 'green' : 'red',
                      // width: row.user === null ? "95px" : "",
                      width: '6.5rem',
                      padding: '.4rem 0'
                    }}
                    onClick={() => handleActionButtonClick(row)}
                  >
                    {row.user === null ? 'assign' : 'unassign'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="table_footer" style={{ border: 'none' }}>
          <tr style={{ textAlign: 'center' }}>
            <td colSpan={5} style={{ textAlign: 'right', paddingTop: '.5rem' }}>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30, { label: 'All', value: -1 }]}
                colSpan={5}
                count={emulators.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <span style={{ color: '#bbbaba', fontSize: '.9rem' }}>
                Emulator Table
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default EmulatorTable

const blue = {
  200: '#A5D8FF',
  400: '#3399FF'
}

const grey = {
  50: '#F3F6F9',
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027'
}
