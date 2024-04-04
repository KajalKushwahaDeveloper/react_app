import InsightsIcon from '@mui/icons-material/Insights'
import { Modal } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import React, { useState } from 'react'
import '../../../scss/button.scss'
import { CustomTablePagination } from '../../CustomTablePagination'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: '-3px -3px 7px #97949473, 2px 2px 7px rgb(137, 138, 138)',
  pt: 2,
  px: 4,
  pb: 3
}
const mobileStyle = {
  width: '90%',
  maxWidth: '90vw' // Adjust the maximum width for smaller screens
}

const PopupEmulatorHistoryTable = ({ data, showToast }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(3)
  const [historyRowSelected, setHistoryRowSelected] = useState(false)
  const [showAdditionalDialog, setShowAdditionalDialog] = useState(false)

  const handleShowAdditionalDialog = () => {
    setShowAdditionalDialog(true)
  }

  const handleCloseAdditionalDialog = () => {
    setShowAdditionalDialog(false)
  }

  const handleActionButtonClick = async (row) => {
    setHistoryRowSelected(row)
    handleShowAdditionalDialog(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <div className='emulator_history_table'>
      {/* Additional Dialog */}
      {showAdditionalDialog && historyRowSelected && (
        <Modal
          open={showAdditionalDialog}
          onClose={handleCloseAdditionalDialog}
          aria-labelledby="additional-modal-title"
          aria-describedby="additional-modal-description"
        >
          <Box sx={{ ...style, ...mobileStyle }}>
            {/* Display cancelDetails if cancelled */}
            {historyRowSelected.cancelDetails && (
              <div>
                <h4>Cancelled:</h4>
                <ol style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  <li>
                    Latitude: {historyRowSelected.cancelDetails.latitude} <br />
                    Longitude: {historyRowSelected.cancelDetails.longitude}
                    <br />
                    deleteTime: {historyRowSelected.cancelDetails.deleteTime}
                  </li>
                </ol>
              </div>
            )}
            {/* Display Trip Points */}
            <div>
              <h4>Route:</h4>
              <ol style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {historyRowSelected.tripPoints.map((point, index) => (
                  <li key={index}>
                    Latitude: {point.lat}
                    <br />
                    Longitude: {point.lng}
                    <br />
                    Bearing:{point.bearing}
                    <br />
                    Distance: {point.distance}
                  </li>
                ))}
              </ol>
            </div>
            <h3>Stops</h3>
            {/* Display Stop Points */}
            <div>
              <ul style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {historyRowSelected.stops.map((stop, index) => {
                  const address =
                    stop?.address[0]?.long_name +
                      ', ' +
                      stop?.address[1]?.long_name +
                      ', ' +
                      stop?.address[2]?.long_name +
                      ', ' +
                      stop?.address[3]?.long_name || 'N/A'

                  const gasStationAddress =
                    stop?.gasStation[0]?.long_name +
                      ', ' +
                      stop?.gasStation[1]?.long_name +
                      ', ' +
                      stop?.gasStation[2]?.long_name +
                      ' ,' +
                      stop?.gasStation[3]?.long_name || 'N/A'

                  return (
                    <li key={index}>
                      Latitude: {stop.lat}, Longitude: {stop.lng}, Bearing:
                      {stop.bearing}, Distance: {stop.distance}, Address:
                      {address}, gasStationAddress: {gasStationAddress}
                      <h4>Gas Station Route:</h4>
                      <ol style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {stop?.tripPoints.map((point, index) => (
                          <li key={index}>
                            Lat: {point.lat}
                            <br />
                            Lng: {point.lng}
                            <br />
                            Bearing:{point.bearing}
                            <br />
                            Distance: {point.distance}
                          </li>
                        ))}
                      </ol>
                    </li>
                  )
                })}
              </ul>
            </div>
            <button
              className="login_button"
              onClick={handleCloseAdditionalDialog}
            >
              CLOSE
            </button>
          </Box>
        </Modal>
      )}

      {data.length !== 0 ? (
        <table aria-label="custom pagination table">
          <thead>
            <tr style={{ borderBottom: '1px solid #D9DDDC' }}>
              <th>FROM</th>
              <th>TO</th>
              <th>DISTANCE</th>
              <th>TIME</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {(rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row) => {
              const fromAddress =
                row?.fromAddress[0]?.long_name +
                  ', ' +
                  row?.fromAddress[1]?.long_name +
                  ', ' +
                  row?.fromAddress[2]?.long_name +
                  ', ' +
                  row?.fromAddress[3]?.long_name || 'N/A'

              const toAddress =
                row?.toAddress[0]?.long_name +
                  ', ' +
                  row?.toAddress[1]?.long_name +
                  ', ' +
                  row?.toAddress[2]?.long_name +
                  ' ,' +
                  row?.toAddress[3]?.long_name || 'N/A'

              const distance = row.distance
                ? row.distance.toFixed(2) + ' Miles'
                : 'N/A'
              const time = row.distance
                ? ((row.distance / row.velocity) * 60).toFixed(2)
                : null

              const hours = time ? Math.floor(time / 60) : null
              const minutes = time ? (time % 60).toFixed() : null

              const formattedTime =
                time && !isNaN(hours) && !isNaN(minutes)
                  ? `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${
                      minutes !== '1' ? 's' : ''
                    }`
                  : 'N/A'

              return (
                <tr key={row.id || 'N/A'} className="emulator_history">
                  <td>{fromAddress || 'N/A'}</td>
                  <td>{toAddress || 'N/A'}</td>
                  <td>{distance}</td>
                  <td>{formattedTime}</td>
                  <td>
                    <IconButton
                      style={{
                        height: 'auto',
                        width: '40px',
                        margin: '2px',
                        color: '#ffffff',
                        backgroundColor: '#666666'
                      }}
                      aria-label="delete"
                      text
                      onClick={() => handleActionButtonClick(row)}
                    >
                      <InsightsIcon />
                    </IconButton>
                  </td>
                </tr>
              )
            })}
            {/* {emptyRows > 0 && (
            <tr style={{ height: 34 * emptyRows }}>
              <td colSpan={5} />
            </tr>
          )} */}
          </tbody>
          <tfoot>
            <tr style={{ position: 'fixed', bottom: 0 }}>
              <CustomTablePagination
                rowsPerPageOptions={[3, 5, 10, { label: 'All', value: -1 }]}
                colSpan={5}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{ overflow: 'hidden' }}
              />
            </tr>
          </tfoot>
        </table>
      ) : (
        <div style={{ display: 'flex' }}>
          <p style={{ margin: '15px 0px -15px auto' }}>No records found!</p>
        </div>
      )}
    </div>
  )
}

export default PopupEmulatorHistoryTable
