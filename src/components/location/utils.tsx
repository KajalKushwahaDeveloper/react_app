import { Emulator } from "../../stores/emulator/types.tsx";

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

  return false;
}