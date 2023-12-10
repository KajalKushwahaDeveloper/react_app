import React, { useState, useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Emulator } from "../../../stores/emulator/types.tsx";

const serverBaseURL = "http://localhost:8080";

const AppStomp: React.FC = () => {
  const [data, setData] = useState<Emulator[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      await fetchEventSource(`${serverBaseURL}/sse`, {
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
          console.log(event.data);
          const parsedData: Emulator[] = JSON.parse(event.data);
          console.log(parsedData);
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
            <p>{item.user.email}</p>
            <p>{item.telephone}</p>
          </div>
        ))}
      </p>
    </div>
  );
};

export default AppStomp;
