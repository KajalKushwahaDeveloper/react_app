import { Emulator } from "../../../../stores/emulator/types";

// custom equality function for Emulators
export function compareEmulatorsForMarkers(
  oldEmulators: Emulator[] | [],
  newEmulators: Emulator[] | []
) {
  // if the size of the arrays are different
  if (oldEmulators?.length !== newEmulators?.length) {
        console.log("MARKERS length is different, returning true");
    return true;
  }

  // check if all the emulators are the same i.e same length and same ids
  let returnVal = false;
  for (const newEmulator of newEmulators) {
    const oldEmulator = oldEmulators.find(
      (oldEmulator) => oldEmulator.id === newEmulator.id
    );
    if (oldEmulator === undefined) {
        console.log("MARKERS oldEmulator is undefined, returning true");
      returnVal = true;
    }
    if (returnVal === true) {
      break; // Stops the loop when not return val will be false
    }
  }

  return returnVal;
}
