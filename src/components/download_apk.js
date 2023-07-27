import React,{useState} from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { DOWNLOAD_APK_URL, COPY_DOWNLOAD_APK_URL } from "../constants";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DownloadApk = () => {

  const [loading, setLoading] = useState(false);
  const [loadingCopyLink, setLoadingCopyLink] = useState(false);

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
    setLoadingCopyLink(true);
  
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      toast.error("Clipboard access not supported, use https");
      setLoadingCopyLink(false); // Make sure to set loading state to false when clipboard access is not supported
      return;
    }
  
    // Copy the download URL to clipboard
    try {
      await navigator.clipboard.writeText(COPY_DOWNLOAD_APK_URL);
      toast.success("Download URL copied");
    } catch (error) {
      toast.error("Could Not Copy Link");
    } finally {
      setLoadingCopyLink(false);
    }
  };
  
  return (
    <div className="p-3 rounded">
      <h2 className="mb-4">Mock Application Version</h2>
      <div className="btnBox text-center mb-4">
        <button
          className="btn btn-main me-3 mt-3 position-relative"
          onClick={handleDownloadFile}
          disabled={loading}
        >
          <span className="me-2"><i class="fa-solid fa-download"></i> Download File</span>
          {/* Conditional rendering of CircularProgress inside the button */}
          {loading && (
            <CircularProgress
              size={24}
              color="inherit"
              style={{ position: "absolute", top: "50%", right: "8px", marginTop: -12 }}
            />
          )}
        </button>

        <button
          className="btn btn-green mt-3 position-relative"
          onClick={handleCopyUrl}
          disabled={loadingCopyLink}
        >
          <span className="me-2"><i class="fa-solid fa-copy"></i> COPY DOWNLOAD LINK</span>
          {/* Conditional rendering of CircularProgress inside the button */}
          {loadingCopyLink && (
            <CircularProgress
              size={24}
              color="inherit"
              style={{ position: "absolute", top: "50%", right: "8px", marginTop: -12 }}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default DownloadApk;
