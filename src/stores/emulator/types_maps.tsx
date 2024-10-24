/* eslint-disable no-undef, no-unused-vars */
import { Emulator, TripData } from './types'

export interface Center {
  lat: number
  lng: number
}
export const defaultLat = 37.0902 // Default latitude (center of US)
export const defaultLng = -95.7129 // Default longitude (center of US)

// custom equality function for selectedEmulator
export function compareSelectedEmulator(
  oldSelectedEmulator: Emulator | null,
  newSelectedEmulator: Emulator | null
) {
  // both were null
  if (oldSelectedEmulator === null && newSelectedEmulator === null) {
    return false
  }

  // either one was null
  if (
    (oldSelectedEmulator === null && newSelectedEmulator !== null) ||
    (oldSelectedEmulator !== null && newSelectedEmulator === null)
  ) {
    return true
  }

  // neither was null but id was different
  if (oldSelectedEmulator?.id !== newSelectedEmulator?.id) {
    return true
  }

  // neither was null but currentTripPointIndex was different
  if (
    oldSelectedEmulator?.currentTripPointIndex !==
    newSelectedEmulator?.currentTripPointIndex
  ) {
    return true
  }

  // neither was null but current lat and lng was different
  if (
    oldSelectedEmulator?.latitude !== newSelectedEmulator?.latitude &&
    oldSelectedEmulator?.longitude !== newSelectedEmulator?.longitude
  ) {
    return true
  }

  return false
}

// custom equality function for Emulators
export function compareEmulators(
  oldEmulators: Emulator[] | [],
  newEmulators: Emulator[] | []
) {
  // if the size of the arrays are different
  if (oldEmulators?.length !== newEmulators?.length) {
    return true
  }

  let returnVal = false
  for (const newEmulator of newEmulators) {
    const oldEmulator = oldEmulators.find(
      (oldEmulator) => oldEmulator.id === newEmulator.id
    )
    if (oldEmulator) {
      returnVal = compareSelectedEmulator(oldEmulator, newEmulator)
    }
    if (returnVal === true) {
      break // Stops the loop when not return val will be false
    }
  }

  return returnVal
}

// custom equality function for Emulators
export function compareTripData(
  oldTripData: TripData | null,
  newTripData: TripData | null
) {
  // both were null
  if (oldTripData === null && newTripData === null) {
    return false
  }
  // either one was null
  if (
    (oldTripData === null && newTripData !== null) ||
    (oldTripData !== null && newTripData === null)
  ) {
    return false
  }
  // neither was null but trip was different
  // FIXME: This is not a good way to compare trips.
  // It should be done by comparing the trip id but id is similar and is based on emulator ID.
  if (oldTripData?.distance !== newTripData?.distance) {
    return false
  }

  return true
}

// custom equality function for Emulators
export function compareEmulatorsCompletely(
  oldEmulators: Emulator[] | [],
  newEmulators: Emulator[] | []
) {
  // if the size of the arrays are different
  if (oldEmulators?.length !== newEmulators?.length) {
    return true
  }

  let returnVal = false
  for (const newEmulator of newEmulators) {
    const oldEmulator = oldEmulators.find(
      (oldEmulator) => oldEmulator.id === newEmulator.id
    )
    if (oldEmulator) {
      returnVal = compareEmulatorCompletely(oldEmulator, newEmulator)
    }
    if (returnVal === true) {
      break // Stops the loop when not return val will be false
    }
  }

  return returnVal
}

// custom equality function for selectedEmulator
export function compareEmulatorCompletely(
  oldSelectedEmulator: Emulator | null,
  newSelectedEmulator: Emulator | null
) {
  // both were null
  if (oldSelectedEmulator === null && newSelectedEmulator === null) {
    return false
  }

  // either one was null
  if (
    (oldSelectedEmulator === null && newSelectedEmulator !== null) ||
    (oldSelectedEmulator !== null && newSelectedEmulator === null)
  ) {
    return true
  }

  // id was different
  if (oldSelectedEmulator?.id !== newSelectedEmulator?.id) {
    return true
  }

  // currentTripPointIndex was different
  if (
    oldSelectedEmulator?.currentTripPointIndex !==
    newSelectedEmulator?.currentTripPointIndex
  ) {
    return true
  }

  // status was different
  if (oldSelectedEmulator?.status !== newSelectedEmulator?.status) {
    return true
  }

  // trip status was different
  if (oldSelectedEmulator?.status !== newSelectedEmulator?.status) {
    return true
  }

  // trip status was different
  if (oldSelectedEmulator?.tripStatus !== newSelectedEmulator?.tripStatus) {
    return true
  }

  // neither was null but current lat and lng was different
  if (
    oldSelectedEmulator?.latitude !== newSelectedEmulator?.latitude &&
    oldSelectedEmulator?.longitude !== newSelectedEmulator?.longitude
  ) {
    return true
  }

  return false
}
