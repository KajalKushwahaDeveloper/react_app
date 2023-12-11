import React, { useState, useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Emulator } from "../../../stores/emulator/types.tsx";
import { BASE_URL } from "../../../constants.js";


const AppStomp: React.FC = () => {
  const [data, setData] = useState<Emulator[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      await fetchEventSource(`${BASE_URL}/sse`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
        onopen: async (res: Response) => {
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          const parsedData: Emulator[] = JSON.parse(event.data);
          setData(parsedData);
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from the server", err);
        },
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <p>
        {data.map((item) => (
          <div key={item.id}>
            <p>{item.user?.email}</p>
            <p>{item.telephone}</p>
          </div>
        ))}
      </p>
    </div>
  );
};

export default AppStomp;
