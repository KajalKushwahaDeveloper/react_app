export interface Center {
  lat: number;
  lng: number;
}
export const defaultLat = 37.0902; // Default latitude (center of US)
export const defaultLng = -95.7129; // Default longitude (center of US)

//custom equality function for selectedEmulator
export function compareSelectedEmulator(
  oldSelectedEmulator,
  newSelectedEmulator
) {
  // both were null
  if (oldSelectedEmulator === null && newSelectedEmulator === null) {
    return false;
  }

  // either one was null
  if (
    (oldSelectedEmulator == null && newSelectedEmulator != null) ||
    (oldSelectedEmulator != null && newSelectedEmulator == null)
  ) {
    return true;
  }

  // neither was null but id was different
  if (oldSelectedEmulator?.id !== newSelectedEmulator?.id) {
    return true;
  }

  // neither was null but currentTripPointIndex was different
  if (
    oldSelectedEmulator?.currentTripPointIndex !==
    newSelectedEmulator?.currentTripPointIndex
  ) {
    return true;
  }

  return false;
}

// custom equality function for Emulators
export function compareEmulators(oldEmulators, newEmulators) {
  // if both were null
  if (oldEmulators === null && newEmulators === null) {
    return false;
  }

  // if one of them was null
  if (
    (oldEmulators === null && newEmulators !== null) ||
    (oldEmulators !== null && newEmulators === null)
  ) {
    return true;
  }

  // if the size of the arrays are different
  if (oldEmulators.length !== newEmulators.length) {
    return true;
  }

  let returnVal = false;
  for (const newEmulator of newEmulators) {
    const oldEmulator = oldEmulators.find(
      (oldEmulator) => oldEmulator.id === newEmulator.id
    );
    if (oldEmulator) {
      returnVal = compareSelectedEmulator(oldEmulator, newEmulator);
    }
    if (returnVal === true) {
      break; // Stops the loop when not return val will be false
    }
  }

  return returnVal;
}
