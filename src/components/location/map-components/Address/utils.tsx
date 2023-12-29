import { Emulator, TripData } from "../../../../stores/emulator/types";

// custom equality function for Emulators
export function compareTripDataChangedNullOrId(oldTripData : TripData | null, newTripData : TripData | null) {
  if (
    (oldTripData === null && newTripData !== null) ||
    (oldTripData !== null && newTripData === null)
  ) {
    return true;
  }
  // neither was null but trip was different
  // FIXME: This is not a good way to compare trips.  
  // It should be done by comparing the trip id but id is similar and is based on emulator ID.
  if (oldTripData?.distance !== newTripData?.distance ) {
    return true;
  }
  return false;
}

//custom equality function for selectedEmulator
export function compareSelectedEmulatorChangedNullOrId(
  oldSelectedEmulator : Emulator | null,
  newSelectedEmulator: Emulator | null
) {
  // either one was null
  if (
    (oldSelectedEmulator === null && newSelectedEmulator !== null) ||
    (oldSelectedEmulator !== null && newSelectedEmulator === null)
  ) {
    return true;
  }

  // neither was null but id was different
  if (oldSelectedEmulator?.id !== newSelectedEmulator?.id) {
    return true;
  }

  if(oldSelectedEmulator?.address !== newSelectedEmulator?.address) {
    return true;
  }

  return false;
}