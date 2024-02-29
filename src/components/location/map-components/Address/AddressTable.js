import React, { useCallback, useEffect, useRef } from 'react'
import { Resize, ResizeHorizon } from 'react-resize-layout'
import ApiService from '../../../../ApiService.js'
import { useViewPort } from '../../../../ViewportProvider.js'
import { TRIP_URL } from '../../../../constants.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import CreateTripButton from '../MapButtons.jsx'
import './ResizeContainer.css'

const AddressTable = () => {
  console.log('AddressTable')
  const elementParentRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ])
  const elementRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ])
  const { width } = useViewPort()
  const breakpoint = 620
  const isMobile = width < breakpoint
  const arrWidth = width - 25 // 25 is the width of the handles between each
  const widthArr = new Array(6).fill(arrWidth / 6)

  for (let i = 0; i < 6; i++) {
    let savedAddressWithI = localStorage.getItem(`addressWidth${i}`)
    if (savedAddressWithI === null || savedAddressWithI === undefined) {
      savedAddressWithI = arrWidth / 6
      localStorage.setItem(`addressWidth${i}`, arrWidth / 6)
    }
    widthArr[i] = savedAddressWithI
  }

  const getAddress = (address) =>
    address?.map((component) => component?.long_name || '').join(', ') || 'N/A'

  const setValues = useCallback((emulator, tripData, isHover) => {
    console.log('emulator', emulator)
    console.log('tripData', tripData)
    console.log('isHover', isHover)

    function readableTime(time) {
      const date = new Date(time)
      return date.toLocaleString()
    }

    const currentAddress = emulator && emulator.address ? emulator.address : 'N/A'

    const fromAddress = tripData ? getAddress(tripData.fromAddress) : 'N/A'
    const toAddress = tripData ? getAddress(tripData.toAddress) : 'N/A'

    const arrivalTime = tripData?.emulatorDetails
      ? readableTime(tripData.emulatorDetails.departTime) +
        '<br/>' +
        readableTime(tripData.emulatorDetails.arrivalTime)
      : 'N/A'
    const totalTime = tripData ? 'TODO' : 'N/A'
    const remainingDistance = tripData ? 'TODO' : 'N/A'

    setStringToElementRef(currentAddress, elementRefs.current[0])
    setStringToElementRef(fromAddress, elementRefs.current[1])
    setStringToElementRef(toAddress, elementRefs.current[2])
    setStringToElementRef(arrivalTime, elementRefs.current[3])
    setStringToElementRef(totalTime, elementRefs.current[4])
    setStringToElementRef(remainingDistance, elementRefs.current[5])

    // loop through the element refs and set their background color to lightblue
    elementParentRefs.current.forEach((elementRef) => {
      if (elementRef.current) {
        if (isHover) {
          elementRef.current.style.backgroundColor = 'lightpink'
        } else {
          elementRef.current.style.backgroundColor = 'white'
        }
      }
    })
  }, [])

  // function which sets the string to the passed element ref
  function setStringToElementRef(string, elementRef) {
    if (elementRef.current) {
      elementRef.current.innerHTML = string
    }
  }
  // function which sets the element ref's value to a loader
  function showLoaders() {
    elementRefs.current.forEach((elementRef) => {
      if (elementRef.current) {
        elementRef.current.innerHTML = `<div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>`
      }
    })
  }

  const connectedEmulatorRef = useRef(
    useEmulatorStore.getState().connectedEmulator
  )
  const hoveredEmulatorRef = useRef(useEmulatorStore.getState().hoveredEmulator)
  const tripDataRef = useRef(useEmulatorStore.getState().tripData)

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.tripData,
        (tripData) => {
          tripDataRef.current = tripData
          if (
            hoveredEmulatorRef.current !== null &&
            hoveredEmulatorRef.current !== undefined
          ) {
            return
          }
          setValues(
            connectedEmulatorRef.current
              ? connectedEmulatorRef.current
              : useEmulatorStore.getState().selectedEmulator,
            tripData
          )
        }
      ),
    [setValues]
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.connectedEmulator,
        (connectedEmulator) => {
          connectedEmulatorRef.current = connectedEmulator
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.hoveredEmulator,
        (hoveredEmulator) => {
          async function fetchAndUpdateTableValues(hoveredEmulator) {
            showLoaders()
            const token = localStorage.getItem('token')
            const { data, error } = await ApiService.makeApiCall(
              TRIP_URL,
              'POST',
              { distance: 0 },
              token,
              hoveredEmulator.id
            )
            if (error) {
              console.error('Error fetching trip data', error)
              if (hoveredEmulatorRef.current !== null) {
                setValues(hoveredEmulator, null, true)
              }
              return
            }
            if (data === null || data === undefined) {
              console.error('Data is null or undefined')
              if (hoveredEmulatorRef.current !== null) {
                setValues(hoveredEmulator, null, true)
              }
              return
            }
            if (
              data.data.tripPoints === null ||
              data.data.tripPoints === undefined ||
              data.data.tripPoints.length === 0
            ) {
              console.error('Trip points are null or undefined or empty')
              if (hoveredEmulatorRef.current !== null) {
                setValues(hoveredEmulator, null, true)
              }
              return
            }
            if (hoveredEmulatorRef.current !== null) {
              setValues(hoveredEmulator, data.data, true)
            }
          }

          hoveredEmulatorRef.current = hoveredEmulator

          if (
            hoveredEmulator &&
            hoveredEmulator.id !== connectedEmulatorRef.current?.id
          ) {
            fetchAndUpdateTableValues(hoveredEmulator, true)
            return
          }
          // if null or undefined, set the values to the connected emulator if it exists
          if (hoveredEmulator === null || hoveredEmulator === undefined) {
            if (
              connectedEmulatorRef.current !== null &&
              connectedEmulatorRef.current !== undefined
            ) {
              setValues(
                connectedEmulatorRef.current,
                tripDataRef.current,
                false
              )
              return
            }
            // if both hovered and connected are null or undefined, set the values to null
            if (
              (connectedEmulatorRef.current === null ||
                connectedEmulatorRef.current === undefined) &&
              (hoveredEmulator === null || hoveredEmulator === undefined)
            ) {
              setValues(null, null, false)
            }
          }
        }
      ),
    [setValues]
  )

  // Start observing the elements when the component is mounted
  useEffect(() => {
    let initialLoad = true
    const observer = new ResizeObserver((entries) => {
      if (initialLoad) {
        initialLoad = false
        return
      }
      for (const entry of entries) {
        // save the width in local storage unless they go to 0
        if (entry.target.clientWidth === 0) {
          return
        }
        localStorage.setItem(
          `addressWidth${entry.target.id}`,
          entry.target.clientWidth
        )
      }
    })

    elementRefs.current.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      // Cleanup the observer by unobserving all elements
      observer.disconnect()
    }
  }, [])

  return (
    <div className="main-address-table">
      {isMobile ? (
        <div className="row">
          {/* CURRENT ADDRESS */}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: '2px solid',
              color: 'black',
              alignItems: 'center',
              padding: '0',
              width: '200px'
            }}
          >
            <div className="address-table-heading">Current location</div>
            <div
              className="addressTable"
              style={{
                height: 'auto',
                fontSize: '10px',
                width: 'calc(100% - 5px)'
              }}
            >
              N/A
            </div>
          </div>
          {/* FROM ADDRESS */}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: '2px solid',
              alignItems: 'center',
              padding: '0',
              width: '200px'
            }}
          >
            <div className="address-table-heading">From address</div>
            <div
              className="addressTable"
              style={{
                height: 'auto',
                fontSize: '10px',
                width: 'calc(100% - 5px)'
              }}
            >
              N/A
            </div>
          </div>
          {/* TO ADDRESS */}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: '2px solid',
              alignItems: 'center',
              padding: '0',
              width: '200px'
            }}
          >
            <div className="address-table-heading">To address</div>
            <div
              className="addressTable"
              style={{
                height: 'auto',
                fontSize: '10px',
                width: 'calc(100% - 5px)'
              }}
            >
              N/A
            </div>
          </div>

          {/* ARRIVAL TIME */}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: '2px solid',
              alignItems: 'center',
              padding: '0px !important',
              width: '200px'
            }}
          >
            <div className="address-table-heading">Arrival Time</div>
            <div
              style={{
                marginTop: '5px !important',
                height: '30px',
                textAlign: 'center',
                maxWidth: '20vw'
              }}
              className="totalTimeSubContent"
            >
              <div className="addressTable" style={{ wordWrap: 'break-word' }}>
                N/A
              </div>
            </div>
          </div>

          {/* TIME */}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: '2px solid',
              alignItems: 'center',
              padding: '0px !important',
              width: '200px'
            }}
          >
            <div className="address-table-heading">Total Time</div>
            <div
              style={{
                marginTop: '5px !important'
              }}
              className="totalTimeSubContent"
            >
              <div
                className="addressTable"
                style={{
                  wordWrap: 'break-word',
                  height: 'auto',
                  fontSize: '10px',
                  width: 'calc(100% - 0px)'
                }}
              >
                N/A
              </div>
            </div>
          </div>

          {/* REMAING DISTANCE */}
          <div
            className="col-6 d-flex flex-column"
            style={{
              border: '2px solid',
              alignItems: 'center',
              padding: '0px !important',
              width: '200px'
            }}
          >
            <div className="address-table-heading">Remaining Distance</div>

            <div
              style={{
                marginTop: '5px !important',
                height: '30px',
                textAlign: 'center',
                maxWidth: '20vw'
              }}
              className=""
            >
              <div className="addressTable" style={{ wordWrap: 'break-word' }}>
                N/A miles
              </div>
            </div>
          </div>

          {/* PLUS MINUS ICONS */}

          <CreateTripButton />
        </div>
      ) : (
        <div
          style={{
            width: '100vw'
          }}
        >
          <Resize handleWidth={'5px'} handleColor={'#007DC66F'}>
            {/* CURRENT ADDRESS */}
            <ResizeHorizon width={`${widthArr[0]}px`} minWidth={'50px'}>
              <div
                ref={elementParentRefs.current[0]}
                style={{
                  border: '2px solid',
                  height: '64px'
                }}
              >
                <div className="address-table-heading">Current location</div>
                <div
                  className="addressTable"
                  ref={elementRefs.current[0]}
                  id="0"
                >
                  N/A
                </div>
              </div>
            </ResizeHorizon>
            {/* FROM ADDRESS */}
            <ResizeHorizon width={`${widthArr[1]}px`} minWidth={'50px'}>
              <div
                ref={elementParentRefs.current[1]}
                style={{
                  border: '2px solid',
                  alignItems: 'center',
                  height: '64px'
                }}
              >
                <div className="address-table-heading">From address</div>
                <div
                  className="addressTable"
                  id="1"
                  ref={elementRefs.current[1]}
                >
                  N/A
                </div>
              </div>
            </ResizeHorizon>
            {/* TO ADDRESS */}
            <ResizeHorizon width={`${widthArr[2]}px`} minWidth={'50px'}>
              <div
                ref={elementParentRefs.current[2]}
                style={{
                  border: '2px solid',
                  alignItems: 'center',
                  height: '64px'
                }}
              >
                <div className="address-table-heading">To address</div>
                <div
                  className="addressTable"
                  id="2"
                  ref={elementRefs.current[2]}
                >
                  N/A
                </div>
              </div>
            </ResizeHorizon>
            {/* ARRIVAL TIME */}
            <ResizeHorizon width={`${widthArr[3]}px`} minWidth={'50px'}>
              <div
                ref={elementParentRefs.current[3]}
                style={{
                  border: '2px solid',
                  alignItems: 'center',
                  height: '64px'
                }}
              >
                <div className="address-table-heading">
                  Depart/Arrival time{' '}
                </div>
                <div
                  className="addressTable"
                  id="3"
                  ref={elementRefs.current[3]}
                >
                  N/A
                </div>
              </div>
            </ResizeHorizon>
            {/* TIME */}
            <ResizeHorizon width={`${widthArr[4]}px`} minWidth={'50px'}>
              <div
                ref={elementParentRefs.current[4]}
                style={{
                  border: '2px solid',
                  height: '64px'
                }}
              >
                <div className="address-table-heading">Total Time</div>
                <div
                  className="addressTable"
                  id="4"
                  ref={elementRefs.current[4]}
                >
                  N/A
                </div>
              </div>
            </ResizeHorizon>

            {/* REMAING DISTANCE */}
            <ResizeHorizon width={`${widthArr[5]}px`} minWidth={'50px'}>
              <div
                ref={elementParentRefs.current[5]}
                style={{
                  border: '2px solid',
                  height: '64px'
                }}
              >
                <div className="address-table-heading">Remaining Distance</div>
                <div
                  className="addressTable"
                  id="5"
                  ref={elementRefs.current[5]}
                >
                  N/A
                </div>
              </div>
            </ResizeHorizon>
          </Resize>
        </div>
      )}
    </div>
  )
}

export default AddressTable
