import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import ScanUser from "./ScanUser";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScanFaceEnable: false,
      faceImage: null,
      field: {
        email: "",
        password: "",
      },
      error: {
        email: "",
        password: "",
        confirm_password: "",
      },
      isValidField: {
        email: false,
        password: false,
        confirm_password: false,
      },
      isSubmitDisable: true,
    };
  }

  onChangeForm = async (field, e) => {
    let error = this.state.error;
    let isValidField = this.state.isValidField;
    let fieldFromState = this.state.field;
    fieldFromState[field] = e.target.value;
    if (field === "email") {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)
      ) {
        isValidField[field] = true;
        error[field] = "";
      } else {
        error[field] = "Enter Valid Email Address";
        isValidField[field] = false;
      }
    }
    if (field === "password") {
      if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/.test(e.target.value)) {
        isValidField[field] = true;
        error[field] = "";
      } else {
        error[field] =
          "Password should contain at least one number and one uppercase and lowercase letter, and at least 8 to 12 characters";
        isValidField[field] = false;
      }
    }
    if (field === "confirm_password") {
      if (this.state.field.password === e.target.value) {
        isValidField[field] = true;
        error[field] = "";
      } else {
        error[field] = "Please make sure your password match";
        isValidField[field] = false;
      }
    }
    await this.setState({ field: fieldFromState });
    await this.setState({ error: error });
    await this.setState({ isValidField: isValidField });
    if (
      this.state.isValidField.email &&
      this.state.isValidField.password &&
      this.state.isValidField.confirm_password
    ) {
      await this.setState({ isSubmitDisable: false });
    } else {
      await this.setState({ isSubmitDisable: true });
    }
  };
  onSubmitForm = async (event) => {
    event.preventDefault();
    this.setState({ isScanFaceEnable: true });
  };

  userImageLoad = (faceImage) => {
    console.log("faceImage   ::    ", faceImage);
    this.setState({ faceImage: faceImage, isModalOpen: false });
  };

  render() {
    return (
      <>
        <div className=" container centered ">
          <div class="shadow-lg p-3 mb-5 bg-body rounded">
            <div class="card " style={{ width: "40rem" }}>
              {!this.state.isScanFaceEnable ? (
                <>
                  <h5 class="card-header text-center">Welcome</h5>
                  <div class="card-body">
                    <h5 class="card-title text-center">Create an Account</h5>
                    <br></br>
                    <div class="card-text">
                      <div className="iconmelon">
                        <img
                          id="profile-img"
                          class="profile-img-card"
                          data-toggle="modal"
                          data-target="#exampleModal"
                          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                          alt="profile"
                        />
                      </div>
                      <form
                        className="form"
                        name="SignUp"
                        // action="/mfa"
                        // method="POST"
                        onSubmit={this.onSubmitForm}
                      >
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="email"
                            id="email"
                            placeholder="Email"
                            name="username"
                            title="Enter Valid Email"
                            value={this.state.field.email}
                            onChange={this.onChangeForm.bind(this, "email")}
                            autoFocus
                            required
                          />
                          <small style={{ color: "red" }}>
                            {this.state.error.email}
                          </small>
                        </div>
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="password"
                            placeholder="Password"
                            name="password"
                            id="password"
                            title="Enter Password"
                            value={this.state.field.password}
                            onChange={this.onChangeForm.bind(this, "password")}
                            required
                          />
                          <small style={{ color: "red" }}>
                            {this.state.error.password}
                          </small>
                        </div>
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="password"
                            placeholder="ConfirmPassword"
                            name="confirm_password"
                            id="confirm_password"
                            title="Confirm your password"
                            onChange={this.onChangeForm.bind(
                              this,
                              "confirm_password"
                            )}
                            required
                          />
                          <small style={{ color: "red" }}>
                            {this.state.error.confirm_password}
                          </small>
                        </div>
                        <div className="col-md-12 text-right">
                          <button
                            disabled={this.state.isSubmitDisable}
                            className="btn btn-info"
                          >
                            Scan your Face
                          </button>
                        </div>
                        <span>
                          Already Have an account? <Link to={"/"}>Login</Link>
                        </span>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <ScanUser field={this.state.field}></ScanUser>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
