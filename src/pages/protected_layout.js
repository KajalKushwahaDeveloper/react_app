import React, { useEffect } from 'react'
import { Navigate, useOutlet } from 'react-router-dom'
import Navbar from '../components/root/navbar'
import useMarkerStore from '../stores/emulator/markerStore'
import { useEmulatorStore } from '../stores/emulator/store.tsx'
import { useAuth } from './hooks/useAuth'

export const ProtectedLayout = () => {
  const { client } = useAuth()
  const outlet = useOutlet()

  const getEmulatorsSSE = useEmulatorStore.getState().getEmulatorsSSE
  const initMarkers = useMarkerStore.getState().initMarkers
  const createDevices = useEmulatorStore.getState().createDevices

  useEffect(() => {
    if (!client) {
      return
    }
    const token = client.token
    if (token) {
      getEmulatorsSSE()
      initMarkers()
      createDevices()
    }
  }, [client, getEmulatorsSSE, createDevices, initMarkers])

  if (!client) {
    return <Navigate to="/login" />
  }

  let isAdmin = false
  client?.role_TYPE?.forEach((role) => {
    if (role.authority.includes('ROLE_ADMIN')) {
      isAdmin = true
    }
  })
  // If the current path is the root path, redirect based on the user's role.
  if (location.pathname === '/') {
    if (isAdmin) {
      return <Navigate to="/license" />
    } else {
      return <Navigate to="/gps" />
    }
  }

  return (
    <div>
      <Navbar isAdmin={isAdmin} />
      {outlet}
    </div>
  )
}
