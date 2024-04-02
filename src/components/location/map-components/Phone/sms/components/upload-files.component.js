import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import React, { Component } from 'react'
import '../../../../../../scss/ContactForm.scss'
import UploadService from '../services/upload-files.service'

export default class UploadFiles extends Component {
  constructor(props) {
    super(props)

    this.selectFile = this.selectFile.bind(this)
    this.upload = this.upload.bind(this)
    this.resetState = this.resetState.bind(this); 

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: '',

      fileInfos: []
    }
  }

  resetState() {
    // Reset state to initial values
    this.setState({
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: '',
      fileInfos: []
    });
  }

  handleDeleteButtonClick(index) {
    UploadService.deleteFile(this.state.fileInfos[index].name).then(
      (response) => {
        UploadService.getFiles().then((response) => {
          this.setState({
            fileInfos: response.data
          })
          this.props.setFileNames(response.data)
        })
      }
    )
  }

  componentDidMount() {
    UploadService.resetFiles().then((response) => {
      UploadService.getFiles().then((response) => {
        this.setState({
          fileInfos: response.data
        })
        this.props.setFileNames(response.data)
      })
    })
  }

  selectFile(event) {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const allowedDocumentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    const allowedVideoTypes = ['video/mp4']
    const allowedAudioTypes = ['audio/ogg']

    const selectedFiles = event.target.files

    for (let i = 0; i < selectedFiles.length; i++) {
      const fileType = selectedFiles[i].type

      if (
        !allowedImageTypes.includes(fileType) &&
        !allowedDocumentTypes.includes(fileType) &&
        !allowedVideoTypes.includes(fileType) &&
        !allowedAudioTypes.includes(fileType)
      ) {
        console.error(
          'Invalid file type. Please select files of type JPG, JPEG, PNG, PDF, DOC, DOCX, PPTX, XLSX, MP4 (with H.264 video codec and AAC audio), or OGG.'
        )
        this.props.showToast('Invalid file type.', 'error')
        return // Prevent further processing or setting state
      }
    }

    this.setState({
      selectedFiles: event.target.files
    })
  }

  upload() {
    const currentFile = this.state.selectedFiles[0]

    this.setState({
      progress: 0,
      currentFile
    })

    UploadService.upload(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total)
      })
    })
      .then((response) => {
        this.setState({
          message: response.data.message
        })
        return UploadService.getFiles()
      })
      .then((files) => {
        this.setState({
          progress: 0,
          fileInfos: files.data
        })
        this.props.setFileNames(files.data)
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: 'Could not upload the file!',
          currentFile: undefined
        })
      })

    this.setState({
      selectedFiles: undefined
    })
  }

  render() {
    const { selectedFiles, currentFile, progress, message, fileInfos } =
      this.state

    return (
      <div>
        {currentFile && (
          <div
            className="progress mt-3 mb-3"
            style={{ width: '93%', display: 'block', margin: 'auto' }}
          >
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + '%' }}
            >
              {progress}%
            </div>
          </div>
        )}

        <label className="btn btn-default" style={{ width: '100%' }}>
          <input
            type="file"
            onChange={this.selectFile}
            className="inputField"
          />
        </label>

        <button
          className="btn btn-success ms-4 align-items-center"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </button>

        <div className="alert alert-light pb-2" role="alert">
          {message}
        </div>

        <div className="card sms_list_card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    {/* //image */}
                    {file.url.includes('.jpg') ||
                    file.url.includes('.jpeg') ||
                    file.url.includes('.png') ? (
                      <img
                        className="card_list"
                        src={file.url}
                        alt={file.name}
                        style={{ width: 100 }}
                      />
                        ) : null}
                    {/* //video */}
                    <a
                      className="card_list"
                      href={file.url}
                      style={{ fontSize: 14 }}
                    >
                      {file.name}
                    </a>
                    <IconButton
                      onClick={() => this.handleDeleteButtonClick(index)}
                      size="small"
                    >
                      <DeleteIcon color="error" fontSize="10" />
                    </IconButton>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
}
