import React from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { DOWNLOAD_APK } from "../constants";

const DownloadApk = () => {
  const handleDownloadFile = async () => {
    const token = localStorage.getItem("token");
    console.log("token : ", token);
    
    fetch(DOWNLOAD_APK, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error downloading file');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trackspot.apk'; // Set the desired file name
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        window.alert(error);
        console.error('Download error:', error);
      });
  };


  return (
    <Card
      style={{
        backgroundColor: "#007dc6",
        color: "white",
        marginBottom: "30px",
        borderRadius: "1rem",
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
          style={{ marginTop: "2rem" }}
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

export default DownloadApk;