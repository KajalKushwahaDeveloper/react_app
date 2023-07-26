import React, { useState } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { DOWNLOAD_APK_URL, COPY_DOWNLOAD_APK_URL } from "../constants";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../scss/button.scss";

const DownloadApk = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadFile = async () => {
    setLoading(true);
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
        setLoading(false);
      });
  };

  const handleCopyUrl = async () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      toast.error("Clipboard access not supported, use https");
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
      });
  };
  return (
    <Card
      style={{
        boxShadow: "-3px -3px 7px #DFDCDC73, 2px 2px 7px rgb(137, 138, 138)",
        // backgroundColor: "#007dc6",
        color: "black",
        marginBottom: "2rem",
        borderRadius: ".5rem",
        width: "100%",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          Mock Application Version
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",
            margin: "1rem 0rem",
          }}
        >
          <Button
            className="button dark-single"
            variant="contained"
            color="success"
            onClick={handleDownloadFile}
            style={{ marginTop: "2rem" ,width:"auto"}}
            disabled={loading}
          >
            Download File
            {loading && (
              <CircularProgress size={24} className="loading-spinner" />
            )}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCopyUrl}
            style={{ marginTop: "2rem" ,width:"auto"}}
          >
            COPY DOWNLOAD LINK
          </Button>
        </div>
        {/* <button className="login_button" onClick={handleCopyUrl}>
          COPY DOWNLOAD LINK
        </button> */}
      </CardContent>
    </Card>
  );
};

export default DownloadApk;
