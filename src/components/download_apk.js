import React from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { DOWNLOAD_APK_URL , COPY_DOWNLOAD_APK_URL} from "../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DownloadApk = () => {
  const handleDownloadFile = async () => {
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
        backgroundColor: "#007dc6",
        color: "white",
        marginBottom: "1rem",
        borderRadius: "1rem",
        width: "100%",
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

        <button className="login_button" onClick={handleCopyUrl}>
          COPY DOWNLOAD LINK
        </button>
      </CardContent>
    </Card>
  );
};

export default DownloadApk;
