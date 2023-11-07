import React, { Component } from "react";
import UploadService from "../services/upload-files.service";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../../../../../scss/ContactForm.scss";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);

    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",

      fileInfos: [],
    };
  }

  handleDeleteButtonClick(index) {
    console.log('index', this.state.fileInfos);
    console.log('index', index);
    console.log('name', this.state.fileInfos[index].name);
    UploadService.deleteFile(this.state.fileInfos[index].name).then((response) => {
      console.log("deleteFile response", response);
      UploadService.getFiles().then((response) => {
        this.setState({
          fileInfos: response.data,
        });
        this.props.setFileNames(response.data)
      });
    });
  }

  
  componentDidMount() {
    UploadService.resetFiles().then((response) => {
        UploadService.getFiles().then((response) => {
          this.setState({
            fileInfos: response.data,
          });
          this.props.setFileNames(response.data)
        });
    });
  }

  selectFile(event) {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedDocumentTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    const allowedVideoTypes = ["video/mp4"];
    const allowedAudioTypes = ["audio/ogg"];

    const selectedFiles = event.target.files;

    for (let i = 0; i < selectedFiles.length; i++) {
      const fileType = selectedFiles[i].type;
  
      if (
        !allowedImageTypes.includes(fileType) &&
        !allowedDocumentTypes.includes(fileType) &&
        !allowedVideoTypes.includes(fileType) &&
        !allowedAudioTypes.includes(fileType)
      ) {
        console.error("Invalid file type. Please select files of type JPG, JPEG, PNG, PDF, DOC, DOCX, PPTX, XLSX, MP4 (with H.264 video codec and AAC audio), or OGG.");
        this.props.showToast("Invalid file type.", "error")
        return; // Prevent further processing or setting state
      }
    }

    this.setState({
      selectedFiles: event.target.files,
    });
  }

  upload() {
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
        this.props.setFileNames(files.data)
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }

  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
    } = this.state;
    
    return (
      <div>
        {currentFile && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <label className="btn btn-default" style={{width:"93%"}}>
          <input type="file" onChange={this.selectFile} className="smsInput"/>
          
        </label>

        <button
          className="btn btn-success"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </button>

        <div className="alert alert-light" role="alert">
          {message}
        </div>

        <div className="card sms_list_card" >
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a className="card_list" href={file.url}>{file.name}</a>
                  <DeleteIcon onClick={() => this.handleDeleteButtonClick(index)} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
