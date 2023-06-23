import React from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";

const Download_Apk = () => {
 const handleDownloadFile = async () => {
  try {
    const response = await fetch("http://64.226.112.239/root/trackspot/frontend/README.md");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "file.apk"; // Set the desired file name
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.log("Error occurred while downloading file:", error);
  }
};


  return (
    <Card
      style={{
        backgroundColor: "#007dc6",
        color: "white",
        marginBottom: "30px",
        borderRadius : "1rem",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          Mock Application Version
        </Typography>

        <Button
          variant="contained"
          color="success"
          onClick={handleDownloadFile}
        >
          Download File
        </Button>

        <button className="login_button" onClick={handleDownloadFile}>
          COPY DOWNLOAD LINK
        </button>
      </CardContent>
    </Card>
  );
};

export default Download_Apk;
