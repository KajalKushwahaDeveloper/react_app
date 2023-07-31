import ApiService from "../../ApiService.js"; 

import { EMULATOR_URL, EMULATOR_DELETE_URL, USER_ASSIGN_EMULATOR_URL } from "../../constants";

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
    console.log("Data Error: " + error);
    return { success: false, error: error.message };
  }
};

//delete emulator 
const deleteEmulatorApi = async (emulator) => {

    const confirmed = window.confirm('Delete this emulator : ' + emulator.emulatorSsid + '?');
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
  // const updateEmulator = async (row, token) => {
  //   console.log("row data in emulator_page:", row)
  //   if (row.user != null) {
  //     const token = localStorage.getItem("token");
  //     console.log("token : ", token);
  //     try {
  //       const response = await fetch(USER_ASSIGN_EMULATOR_URL + "/" + row.id, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log("response:", response);

  //       if (!response.ok || response.status !== 200) {
  //         showToast("Failed to unassign user", "error");
  //         return { success: false, error: "Failed to unassign user" };
  //       }
  //       // Send the removed user ID to refresh in user table
  //       const userAssignedEmulator = { 
  //         user: {
  //           id: row.user?.id, 
  //         },
  //       };
  //       setUserAssingedEmulator(userAssignedEmulator);

  //       console.log("Data Previous : " + data);
  //       const result = await response.text();
  //       console.log("result:", result);
  //       const updatedData = data.map((item) => {
  //         if (item.id === row.id) {
  //           console.log("Data Found");
  //           return { ...item, user: null };
  //         }
  //         return item;
  //       });
  //       showToast(`User Un-Assigned`, "success");
  //       console.log("Data Updated : " + data);
  //       setData(updatedData);
  //     } catch (error) {
  //       showToast(`Failed to unassign user ${error}`, "error");
  //     }
  //   } else {
  //     handleAssignUserButtonClick(row);
  //   }
  // };
// api/emulatorAPI.js

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


export { GetEmulatorApi ,deleteEmulatorApi};
