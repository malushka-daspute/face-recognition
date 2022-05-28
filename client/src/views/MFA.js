import React, { Component } from "react";
import Webcam from "react-webcam";
import { loadModels, getFullFaceDescription } from "../utilities/face";
import * as faceapi from "face-api.js";
import { Link } from "react-router-dom";

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

class MFA extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      detectionsVideo: null,
      descriptorsVideo: null,
      match: null,
      facingMode: null,
      faceEncoding: props.faceEncoding,
      isValidUser: false,
      faceNotRecognizeCount: 0,
    };
  }

  componentWillMount = async () => {
    await loadModels();

    getFullFaceDescription(this.state.faceEncoding, inputSize).then(
      (fullDesc) => {
        if (!!fullDesc) {
          this.setState({
            detectionsVideo: fullDesc.map((fd) => fd.detection),
            descriptorsVideo: fullDesc.map((fd) => fd.descriptor),
          });
        }
      }
    );
    //  });
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
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(async (fullDesc) => {
        console.log("Video  :  ", fullDesc);
        if (fullDesc && fullDesc.length > 0) {
          await this.setState({
            descriptors: fullDesc[0].descriptor,
            detections: fullDesc.map((fd) => fd.detection),
          });
          clearInterval(this.interval);
          if (
            !!fullDesc[0].descriptor &&
            !!this.state.descriptorsVideo[0] &&
            this.state.descriptorsVideo.length > 0
          ) {
            const distance = faceapi.euclideanDistance(
              fullDesc[0].descriptor,
              this.state.descriptorsVideo[0]
            );
            console.log(distance);
            if (distance < 0.62) {
              console.log("Congratulations!!!");
              this.setState({ isValidUser: true, faceNotRecognizeCount: 0 });
            } else {
              console.log("Bad");
              this.setState({
                isValidUser: false,
                faceNotRecognizeCount: this.state.faceNotRecognizeCount + 1,
              });
              if (this.state.faceNotRecognizeCount > 6) {
              } else {
                this.startCapture();
              }
            }
          }
        } else {
          this.setState({
            faceNotRecognizeCount: this.state.faceNotRecognizeCount + 1,
          });
        }
      });
    }
  };

  render() {
    const { detections, match, facingMode } = this.state;
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
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: "blue",
                    border: "solid",
                    borderColor: "blue",
                    width: _W,
                    marginTop: 0,
                    color: "#fff",
                    transform: `translate(-3px,${_H}px)`,
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return (
      <>
        {this.state.faceNotRecognizeCount >= 3 ? (
          <div class="alert alert-danger">Your face is not recognized</div>
        ) : this.state.isValidUser ? (
          <div class="alert alert-success">
            <strong>Congratulations !</strong> We have recognized your face.
            Please login.
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
        <br></br>
        <div className="col-md-12 text-center">
          <Link to={"/dashboard"}>
            <button
              disabled={!this.state.isValidUser}
              className="btn btn-primary "
            >
              Login
            </button>
          </Link>
        </div>
      </>
    );
  }
}

export default MFA;
