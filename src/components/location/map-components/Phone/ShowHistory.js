import React from "react";
import {
  Typography,
  List,
  Grid,
  Card
} from "@mui/material";

export function ShowHistory({ dialogType, data }) {
  return (
    <div>
      {data.length ? (
        dialogType === "call" ? (
          data.map((callData) => {
            return (
              <List style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Card
                  style={{ padding: "0.5rem", boxShadow: "0px 0px 8px -4px" }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>From:</Typography>
                      <Typography fontWeight={400}>{callData.from}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>To:</Typography>
                      <Typography fontWeight={400}>{callData.to}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Start Time:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(callData.startTime).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>End Time:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(callData.endTime).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Duration:</Typography>
                      <Typography fontWeight={400}>
                        {callData.duration}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Status:</Typography>
                      <Typography fontWeight={400}>
                        {callData.status}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>AnsweredBy:</Typography>
                      <Typography fontWeight={400}>
                        {callData.answeredBy === null
                          ? "N/A"
                          : callData.answeredBy}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Price:</Typography>
                      <Typography fontWeight={400}>
                        {callData.price + " " + callData.priceUnit}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Direction:</Typography>
                      <Typography fontWeight={400}>
                        {callData.direction}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Caller Name:</Typography>
                      <Typography fontWeight={400}>
                        {callData.callerName === null ||
                          callData.callerName === ""
                          ? "N/A"
                          : callData.callerName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </List>
            );
          })
        ) : dialogType === "messages" ? (
          data.map((msgData) => {
            return (
              <List style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <Card
                  style={{ padding: "0.5rem", boxShadow: "0px 0px 8px -4px" }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>From:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.from.endpoint}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>To:</Typography>
                      <Typography fontWeight={400}>{msgData.to}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Sent Date:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(msgData.dateSent).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Sent Time:</Typography>
                      <Typography fontWeight={400}>
                        {new Date(msgData.dateSent).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Status:</Typography>
                      <Typography fontWeight={400}>{msgData.status}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Durations:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.direction}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      display={"flex"}
                      direction={"row"}
                      gap={1}
                    >
                      <Typography fontWeight={800}>Price:</Typography>
                      <Typography fontWeight={400}>
                        {msgData.price + " " + msgData.priceUnit}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} display={"flex"} gap={1}>
                      <Typography fontWeight={800}>Message:</Typography>
                      <Typography fontWeight={400}>{msgData.body}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </List>
            );
          })
        ) : null
      ) : (
        <Typography fontSize={20} display={"flex"} justifyContent={"center"}>
          No history found at present.
        </Typography>
      )}
    </div>
  );
}
