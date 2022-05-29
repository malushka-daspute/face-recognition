import React, { Component } from "react";
import Webcam from "react-webcam";
import { loadModels, getFullFaceDescription } from "../utilities/face";
import axios from "axios";
import { Link } from "react-router-dom";

// import { Redirect } from 'react-router';

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

class ScanUser extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      detections: null,
      descriptors: null,
      facingMode: null,
      image: null,
      userInfo: props.field,
      isFaceDetected: false,
      faceNotRecognizeCount: 0,
      isUserUpdatedInDB: false,
      message: null,
      messageError: null,
    };
  }

  componentWillMount = async () => {
    await loadModels();
    this.setInputDevice();
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: "user",
        });
      } else {
        await this.setState({
          facingMode: { exact: "environment" },
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      const img = this.webcam.current.getScreenshot();
      await getFullFaceDescription(img, inputSize).then(async (fullDesc) => {
        if (fullDesc && fullDesc.length === 1) {
          clearInterval(this.interval);
          this.setState({
            detections: fullDesc.map((fd) => fd.detection),
            descriptors: fullDesc.map((fd) => fd.descriptor),
            isFaceDetected: true,
            image: img,
            faceNotRecognizeCount: 0,
            message: "",
          });
        } else if (fullDesc.length > 1) {
          this.setState({ messageError: "Multiple faces detected" });
        } else {
          this.setState({
            faceNotRecognizeCount: this.state.faceNotRecognizeCount + 1,
            messageError: "Your face is not recognized",
          });
        }
      });
    }
  };

  sendData = () => {
    let userInfo = this.state.userInfo;
    userInfo["faceEncoding"] = this.state.image;

    axios
      .post("http://localhost:8000/newUser", userInfo)
      .then((data) => {
        this.setState({
          isUserUpdatedInDB: true,
          facingMode: null,
          message: "SUCCESS",
          facingMode : null
        });
      })
      .catch((err) => {
        console.error(err);
        if (err) {
          this.setState({
            isUserUpdatedInDB: false,
            message: "DUPLICATE",
            facingMode : null
          });
        }
      });
  };

  render() {
    const { detections, facingMode } = this.state;
    let videoConstraints = null;
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode,
      };
    }

    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                border: "solid",
                borderColor: "blue",
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`,
              }}
            ></div>
          </div>
        );
      });
    }

    return (
      <>
        {this.state.message ? (
          <>
            {this.state.message === "SUCCESS" ? (
              <>
                <div class="alert alert-success" role="alert">
                  <h4 class="alert-heading">Congratulations!</h4>
                  <p>
                    Your account has been successfully created. Check your mail
                    for more information
                  </p>
                  <hr />
                  <p class="mb-0">
                    Please click on Login to enjoy the services.
                  </p>
                </div>{" "}
              </>
            ) : (
              <>
                <div class="alert alert-warning" role="alert">
                  <p>
                    You have been already registered with us. Please click on{" "}
                    <strong>Login </strong>to enjoy the services.
                  </p>
                </div>
              </>
            )}
            <Link to={"/"}>
              <div className="col-md-12 text-center">
                <button className="btn btn-primary "> Login </button>
              </div>
            </Link>
          </>
        ) : (
          <>
            {this.state.faceNotRecognizeCount >= 3 ? (
              <div class="alert alert-danger">{this.state.messageError}</div>
            ) : this.state.isFaceDetected ? (
              <div class="alert alert-success">
                <strong>Congratulations !</strong> We have detected your face.
                Please click on <strong>Add Account</strong>.
              </div>
            ) : (
              <></>
            )}
            <div
              className="Camera"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: WIDTH,
                  height: HEIGHT,
                }}
              >
                <div style={{ position: "relative", width: WIDTH }}>
                  {!!videoConstraints ? (
                    <div style={{ position: "absolute" }}>
                      <Webcam
                        audio={false}
                        width={WIDTH}
                        height={HEIGHT}
                        ref={this.webcam}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                      />
                    </div>
                  ) : null}
                  {!!drawBox ? drawBox : null}
                </div>
              </div>
            </div>
            <br></br>
            <div className="col-md-12 text-center">
              <button
                disabled={!this.state.isFaceDetected}
                className="btn btn-primary "
                onClick={this.sendData}
              >
                Add Account
              </button>
              {/* </Link> */}
            </div>
            <br></br>
          </>
        )}
      </>
    );
  }
}

export default ScanUser;
