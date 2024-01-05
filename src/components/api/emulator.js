import ApiService from "../../ApiService.js";

import {
  EMULATOR_URL,
  EMULATOR_DELETE_URL,
  USER_ASSIGN_EMULATOR_URL,
} from "../../constants";

// Fetch data from API // GET  API
const GetEmulatorApi = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(EMULATOR_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok || response.status !== 200) {
      return { success: false, error: "Invalid credentials" };
    } else {
      const responseData = await response.text();
      const deserializedData = JSON.parse(responseData);
      return { success: true, data: deserializedData, error: null };
    }
  } catch (error) {
    console.error("Data Error: " + error);
    return { success: false, error: error.message };
  }
};

//delete emulator
const deleteEmulatorApi = async (emulator) => {
  const confirmed = window.confirm(
    "Delete this emulator : " + emulator.emulatorSsid + "?"
  );
  if (confirmed) {
    const token = localStorage.getItem("token");
    const { success, data, error } = await ApiService.makeApiCall(
      EMULATOR_DELETE_URL,
      "DELETE",
      null,
      token,
      emulator.id
    );

    return success;
  }
};

// update emulator

export const updateUserAssignmentApi = async (row, token) => {
  try {
    const response = await fetch(USER_ASSIGN_EMULATOR_URL + "/" + row.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok || response.status !== 200) {
      throw new Error("Failed to unassign user");
    }

    const result = await response.text();
    return result;
  } catch (error) {
    throw new Error(`Failed to unassign user ${error}`);
  }
};

export { GetEmulatorApi, deleteEmulatorApi };
