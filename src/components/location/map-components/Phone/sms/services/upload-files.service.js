import http from "../http-common.js";

class UploadFilesService {
  upload(file, onUploadProgress) {
    const token = localStorage.getItem("token");
  
    let formData = new FormData();

    formData.append("file", file);
    return http.post("/message/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress,
    });
  }

  getFiles() {
    const token = localStorage.getItem("token");

    return http.get("/message/files", {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }}, );
  }

  deleteFile(file) {
    const token = localStorage.getItem("token");
    return http.delete(`/message/files/${file}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }}, );
  }
}

export default new UploadFilesService();
