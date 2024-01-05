// component with marker which will change position with animation on new props
// <EmulatorMarker
// emulator={emulator}
// emulatorIcon={emulatorIcon}
// isSelected={isSelected}
// rotationAngle={rotationAngle}
// hoveredMarker={hoveredMarker}
// handleMarkerMouseOver={handleMarkerMouseOver}
// handleMarkerMouseOut={handleMarkerMouseOut}
// handleEmulatorMarkerDragEnd={handleEmulatorMarkerDragEnd}
// selectEmulator={selectEmulator}
// markerRefs={markerRefs}
// />

import { Marker } from '@react-google-maps/api'
import React, { useEffect, useRef } from 'react'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import PropTypes from 'prop-types'

const EmulatorMarker = ({ emulator }) => {
  console.log('EmulatorMarker', emulator)

  const selectedEmulator = useEmulatorStore((state) => state.selectedEmulator)

  const dragEmulator = useEmulatorStore((state) => state.dragEmulator)

  const hoveredMarker = useEmulatorStore((state) => state.hoveredEmulator)
  const hoverEmulator = useEmulatorStore((state) => state.hoverEmulator)

  const selectEmulator = useEmulatorStore((state) => state.selectEmulator)

  const isSelected = selectedEmulator?.id === emulator?.id

  const isHovered = hoveredMarker?.id === emulator?.id
  // PAUSED RESTING RUNNING STOP //HOVER SELECT DEFAULT //ONLINE OFFLINE INACTIVE
  let iconUrl = `images/${emulator.tripStatus}/`
  if (isHovered) {
    iconUrl = iconUrl + 'HOVER'
  } else if (isSelected) {
    iconUrl = iconUrl + 'SELECT'
  } else {
    iconUrl = iconUrl + 'DEFAULT'
  }
  iconUrl = `${iconUrl}/${emulator.status}.svg`

  const emulatorIcon = {
    url: iconUrl,
    scaledSize: new window.google.maps.Size(20, 20),
    anchor: new window.google.maps.Point(10, 10)
  }

  const markerRef = useRef(null)
  // copy latLng to initialPosition but don't update it on latLng change
  useEffect(() => {
    if (
      markerRef.current === null ||
      markerRef.current === undefined ||
      emulator === undefined
    ) {
      return
    }
    console.log('animateMarkerTo', markerRef.current)
    console.log('animateMarkerTo', emulator)

    animateMarkerTo(markerRef.current, {
      lat: emulator.latitude,
      lng: emulator.longitude
    })
  }, [emulator, emulator.latitude, emulator.longitude, markerRef])

  // https://stackoverflow.com/a/55043218/9058905
  function animateMarkerTo (marker, newPosition) {
    const options = {
      duration: 1000,
      easing: function (x, t, b, c, d) {
        // jquery animation: swing (easeOutQuad)
        return -c * (t /= d) * (t - 2) + b
      }
    }

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame

    window.cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame

    // save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
    marker.AT_startPosition_lat = marker.getPosition().lat()
    marker.AT_startPosition_lng = marker.getPosition().lng()
    const newPositionLat = newPosition.lat
    let newPositionLng = newPosition.lng

    // crossing the 180° meridian and going the long way around the earth?
    if (Math.abs(newPositionLng - marker.AT_startPosition_lng) > 180) {
      if (newPositionLng > marker.AT_startPosition_lng) {
        newPositionLng -= 360
      } else {
        newPositionLng += 360
      }
    }

    const animateStep = function (marker, startTime) {
      const ellapsedTime = new Date().getTime() - startTime
      const durationRatio = ellapsedTime / options.duration // 0 - 1
      const easingDurationRatio = options.easing(
        durationRatio,
        ellapsedTime,
        0,
        1,
        options.duration
      )

      if (durationRatio < 1) {
        marker.setPosition({
          lat:
            marker.AT_startPosition_lat +
            (newPositionLat - marker.AT_startPosition_lat) *
            easingDurationRatio,
          lng:
            marker.AT_startPosition_lng +
            (newPositionLng - marker.AT_startPosition_lng) *
            easingDurationRatio
        })

        // use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
        if (window.requestAnimationFrame) {
          marker.AT_animationHandler = window.requestAnimationFrame(
            function () {
              animateStep(marker, startTime)
            }
          )
        } else {
          marker.AT_animationHandler = setTimeout(function () {
            animateStep(marker, startTime)
          }, 17)
        }
      } else {
        marker.setPosition(newPosition)
      }
    }

    // stop possibly running animation
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(marker.AT_animationHandler)
    } else {
      clearTimeout(marker.AT_animationHandler)
    }

    animateStep(marker, new Date().getTime())
  }

  const handleEmulatorMarkerDragEnd = (event) => {
    if (emulator === undefined) {
      console.error('DRAG Emulator not found in data')
      return
    }
    const { latLng } = event
    dragEmulator({
      emulator,
      latitude: latLng.lat(),
      longitude: latLng.lng()
    })
  }

  return (
    <Marker
      key={emulator.id}
      icon={emulatorIcon}
      position={{ lat: emulator.latitude, lng: emulator.longitude }}
      onLoad={(marker) => {
        markerRef.current = marker
      }}
      title={`${emulator.telephone} ${emulator.tripStatus}(${emulator.status})`}
      labelStyle={{
        textAlign: 'center',
        width: 'auto',
        color: '#037777777777',
        fontSize: '11px',
        padding: '0px'
      }}
      labelAnchor={{ x: 'auto', y: 'auto' }}
      onClick={() => selectEmulator(emulator)}
      onMouseOver={() => hoverEmulator(emulator)}
      onMouseOut={() => hoverEmulator(null)}
      draggable={true}
      onDragEnd={(event) => {
        handleEmulatorMarkerDragEnd(event)
      }}
      zIndex={1}
    />
  )
}

EmulatorMarker.propTypes = {
  emulator: PropTypes.object
}

export default EmulatorMarker
