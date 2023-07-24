import React, { useEffect, useState } from "react";
import ODataStore from "devextreme/data/odata/store";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Button } from "@mui/material";
import { EMULATOR_URL, USER_ASSIGN_EMULATOR_URL } from "../constants";

const pageSizes = [3, 5, 10, -1];

const dataSourceOptions = {
  store: new ODataStore({
    url: EMULATOR_URL,
    key: "id",
    beforeSend(request) {
      const year = new Date().getFullYear() - 1;
      request.params.startDate = `${year}-05-10`;
      request.params.endDate = `${year}-5-15`;
    },
  }),
};

const NewTable = ({
  showToast,
  handleAssignUserButtonClick,
  userAssignedEmulator,
  setUserAssignedEmulator,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
{
  // console.log("row data in emulator_page:", data);

}
  const onContentReady = (e) => {
    if (!collapsed) {
      e.component.expandRow(["EnviroCare"]);
      setCollapsed(true);
    }
  };

  const handleActionButtonClick = async (row) => {
    console.log("row in emulator_page:", row);
    if (row.user != null) {
      const token = localStorage.getItem("token");
      console.log("token : ", token);
      try {
        const response = await fetch(USER_ASSIGN_EMULATOR_URL + "/" + row.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response:", response);

        if (!response.ok || response.status !== 200) {
          showToast("Failed to unassign user", "error");
          return { success: false, error: "Failed to unassign user" };
        }
        // Send the removed user ID to refresh in the user table
        const userAssignedEmulator = {
          user: {
            id: row.user?.id,
          },
        };
        setUserAssignedEmulator(userAssignedEmulator);

        console.log("Data Previous : " + data);
        const result = await response.text();
        console.log("result:", result);
        const updatedData = data.map((item) => {
          if (item.id === row.id) {
            console.log("Data Found");
            return { ...item, user: null };
          }
          return item;
        });
        showToast(`User Un-Assigned`, "success");
        setData(updatedData); // Update the 'data' state
      } catch (error) {
        showToast(`Failed to unassign user ${error}`, "error");
      }
    } else {
      console.log("handleAssignUserButtonClick", row);
      handleAssignUserButtonClick(row);
    }
  };

  // Fetch data from API
  const fetchData = async () => {
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
        console.log("");
        setData(deserializedData);
        setLoading(false);
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("Data Error: " + error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData()
      .then(({ success, error }) => {
        if (success) {
          showToast("Fetched Emulators successfully", "success");
        } else {
          showToast(error, "error");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Refresh component after 30000 ms/ 30 seconds
  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      setLoading(true);
      const { success, error } = fetchData();
      if (success) {
        showToast("Fetched Emulators successfully", "success");
      } else {
        showToast(error, "error");
      }
    }, 30000);

    return () => {
      clearInterval(fetchDataInterval);
    };
  }, []);

  useEffect(() => {
    if (userAssignedEmulator != null) {
      const updatedData = data.map((item) => {
        if (item.id === userAssignedEmulator.id) {
          return { ...item, user: userAssignedEmulator.user };
        }
        return item;
      });
      setData(updatedData);
    }
  }, [userAssignedEmulator]);

  const handleRowClick = (rowData) => {
    handleActionButtonClick(rowData);
    console.log("rowData:::::", rowData);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <DataGrid
          onContentReady={onContentReady}
          dataSource={data} 
          remoteOperations={{ paging: true }} 
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          onRowClick={handleRowClick}
          >



        <Column dataField="status" caption="STATUS" dataType="string" />
        <Column
          dataField="emulatorSsid"
          caption="SERIAL NO"
          dataType="string"
          alignment="right"
        />
        <Column
          dataField="telephone"
          caption="NUMBER"
          dataType="string"
          alignment="right"
        />
        <Column
          dataField="user.firstName"
          caption="ASSIGNED"
          dataType="string"
          alignment="right"
        >
          <Button
            style={{
              height: "45px",
              width: "85px",
              backgroundColor: "#fff",
              color: "black",
            }}
          >
            {data.user ? "unassign" : "assign"}
          </Button>
        </Column>
        <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
        <Paging defaultPageSize={10} />
      </DataGrid>
    </div>
  );
};

export default NewTable;
