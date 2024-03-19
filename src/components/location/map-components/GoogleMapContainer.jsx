import React, { useEffect, useRef } from 'react'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

import { useEmulatorStore } from '../../../stores/emulator/store.tsx'
import { defaultLat, defaultLng } from '../../../stores/emulator/types_maps.tsx'
import { defaultMapStyle, roadMapStyle } from './MapStyles.js'
import EmulatorMarkers from './Markers/EmulatorMarkers.jsx'
import { ConnectedEmulatorComponent } from './Trip/ConnectedEmulatorComponent.jsx'
import { PathComponent } from './Trip/PathComponent.jsx'
import { StopComponents } from './Trip/StopComponents.jsx'

const libraries = ['drawing', 'places', 'autocomplete']

const GoogleMapContainer = () => {
  console.log('Google Map Rendered!')
  const mapRef = useRef(null)
  const styleRef = useRef('default')

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.draggedEmulator, // to show highlighted road map when dragging
        (draggedEmulator) => {
          if (mapRef.current === null || mapRef.current === undefined) {
            return
          }
          // not-dragged
          if (draggedEmulator && !draggedEmulator?.isDragMarkerDropped) {
            if (styleRef.current === 'roadmap') {
              return
            }
            styleRef.current = 'roadmap'
            mapRef.current?.setOptions({ styles: roadMapStyle })
          } else if (!draggedEmulator || draggedEmulator?.isDragMarkerDropped) {
            // dragged
            if (styleRef.current === 'default') {
              return
            }
            styleRef.current = 'default'
            mapRef.current?.setOptions({ styles: defaultMapStyle })
          }
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.movedEmulator,
        (movedEmulator) => {
          if (mapRef.current === null || mapRef.current === undefined) {
            return
          }
          // moved
          if (movedEmulator && movedEmulator.moveMarker) {
            mapRef.current?.setCenter({
              lat: movedEmulator.latitude,
              lng: movedEmulator.longitude
            })
            mapRef.current?.setZoom(10)
            // do something maybe
          } else if (!movedEmulator || movedEmulator?.isDragMarkerDropped) {
            // un-moved..
            // do something maybe
          }
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.center,
        (center) => {
          if (mapRef.current === null || mapRef.current === undefined) {
            return
          }
          // center changed
          if (center && center.lat && center.lng) {
            mapRef.current?.setCenter(center)
          }
        }
      ),
    []
  )

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.tripData,
        (tripData) => {
          if (mapRef.current === null || mapRef.current === undefined) {
            return
          }
          if (
            tripData &&
            tripData.tripPoints &&
            tripData.tripPoints.length > 0
          ) {
            const bounds = new window.google.maps.LatLngBounds()
            // extend bound for first middle and last element.
            bounds.extend(
              new window.google.maps.LatLng(
                tripData.tripPoints[0].lat,
                tripData.tripPoints[0].lng
              )
            )
            bounds.extend(
              new window.google.maps.LatLng(
                tripData.tripPoints[tripData.tripPoints.length - 1].lat,
                tripData.tripPoints[tripData.tripPoints.length - 1].lng
              )
            )
            bounds.extend(
              new window.google.maps.LatLng(
                tripData.tripPoints[
                  Math.floor(tripData.tripPoints.length / 2)
                ].lat,
                tripData.tripPoints[
                  Math.floor(tripData.tripPoints.length / 2)
                ].lng
              )
            )
            mapRef.current.fitBounds(bounds)
          }
        }
      ),
    []
  )

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E',
    libraries
  })

  const containerStyle = {
    position: 'unset !important',
    width: '100%',
    height: '100%'
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={4}
      center={{ lat: defaultLat, lng: defaultLng }}
      gestureHandling="none"
      zoomControl={false}
      options={{
        minZoom: 3,
        maxZoom: 20,
        scrollwheel: true,
        styles: defaultMapStyle,
        disableDefaultUI: true
      }}
      onLoad={(ref) => {
        mapRef.current = ref
      }}
      onUnmount={() => {
        mapRef.current = null
      }}
    >
      <PathComponent />
      <ConnectedEmulatorComponent />
      <StopComponents />
      <EmulatorMarkers />
    </GoogleMap>
  ) : (
    <>Loading...</>
  )
}

export default GoogleMapContainer
