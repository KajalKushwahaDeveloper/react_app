import React from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { DOWNLOAD_APK } from "../constants";

const Download_Apk = () => {
  const handleDownloadFile = async () => {
    const token = localStorage.getItem("token");
    console.log("token : ", token);
    fetch(DOWNLOAD_APK, {
      method: 'GET',
      responseType: 'blob', // Specify the response type as blob,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.blob())
      .then(blob => {
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'trackspot.apk'; // Set the desired filename
        link.click();

        // Clean up the temporary URL
        window.URL.revokeObjectURL(url);

        // Copy the download link to clipboard
        navigator.clipboard.writeText(url)
          .then(() => {
            console.log('Download link copied to clipboard:', url);
          })
          .catch(error => {
            console.error('Error copying download link to clipboard:', error);
          });
      })
      .catch(error => {
        // Handle error
        console.error('Error downloading file:', error);
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

export default Download_Apk;