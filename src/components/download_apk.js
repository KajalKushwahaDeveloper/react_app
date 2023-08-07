import React, { useState } from "react";
import { Typography, Button, Card, CardContent, CircularProgress } from "@mui/material";
import { DOWNLOAD_APK_URL, COPY_DOWNLOAD_APK_URL } from "../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetAppIcon from '@mui/icons-material/GetApp';

const DownloadApk = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadFile = async () => {
    setLoading(true); // Set loading to true before starting the fetch

    const token = localStorage.getItem("token");
    console.log("token : ", token);

    fetch(DOWNLOAD_APK_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error downloading file");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "trackspot.apk"; // Set the desired file name
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        window.alert(error);
        console.error("Download error:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading back to false after downloading is complete or an error occurs
      });
  };

  const handleCopyUrl = async () => {
    setLoading(true); // Set loading to true before starting the copy operation

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      toast.error("Clipboard access not supported, use https");
      setLoading(false); // Set loading back to false if clipboard access is not supported
      return;
    }

    // Copy the download URL to clipboard
    navigator.clipboard
      .writeText(COPY_DOWNLOAD_APK_URL)
      .then(() => {
        toast.success("Download URL copied");
      })
      .catch((error) => {
        toast.success("Could Not Copy Link");
      })
      .finally(() => {
        setLoading(false); // Set loading back to false after copying is complete or an error occurs
      });
  };

  return (
    <Card
      style={{
        backgroundColor: "white",
        color: "#007dc6",
        marginBottom: "3rem",
        borderRadius: "1rem",
        boxShadow: "-3px -3px 7px #bfbdbd73, 2px 2px 7px rgb(222, 241, 252)"
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          Mock Application Version
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={<GetAppIcon />} // Add the GetAppIcon at the starting of the button
          onClick={handleDownloadFile}
          style={{ marginTop: "2rem", marginLeft: "1.2rem",width:"12rem !important" }}
          endIcon={loading && <CircularProgress color="inherit" size={20} />} // Show the circular progress only when loading is true
          disabled={loading} // Disable the button while loading is true
        >
          Download File
        </Button>

        <button className="login_button" onClick={handleCopyUrl}>
          COPY DOWNLOAD LINK
        </button>
      </CardContent>
    </Card>
  );
};

export default DownloadApk;
