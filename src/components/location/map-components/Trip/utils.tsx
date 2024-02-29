import { TripData } from "../../../../stores/emulator/types";

// custom equality function for Emulators
export function compareTripDataChangedNullOrId(
  oldTripData: TripData | null,
  newTripData: TripData | null
) {
  // either one was null
  if (
    (oldTripData === null && newTripData !== null) ||
    (oldTripData !== null && newTripData === null)
  ) {
    return true;
  }
  // neither was null but trip was different
  // FIXME: This is not a good way to compare trips.
  // It should be done by comparing the trip id but id is similar and is based on emulator ID.
  if (oldTripData?.distance !== newTripData?.distance) {
    return true;
  }

  if (oldTripData?.stops?.length !== newTripData?.stops?.length) {
    return true;
  }

  return false;
}

export function toHumanReadableTime(time: number) {
  const date = new Date(time);
  return date.toLocaleString();
}