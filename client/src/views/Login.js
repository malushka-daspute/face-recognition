import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import MFA from "./MFA";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: {
        email: "",
        password: "",
      },
      error: {
        email: "",
        password: "",
      },
      isValidField: {
        email: false,
        password: false,
      },
      isSubmitDisable: true,
      faceEncoding: null,
      errorFromApi: "",
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
    await this.setState({ field: fieldFromState });
    await this.setState({ error: error });
    await this.setState({ isValidField: isValidField });
    if (this.state.isValidField.email && this.state.isValidField.password) {
      await this.setState({ isSubmitDisable: false });
    } else {
      await this.setState({ isSubmitDisable: true });
    }
  };
  onSubmitForm = async (event) => {
    event.preventDefault();
    let user = this.state.field;
    axios
      .post("http://54.227.162.67:5000/login", user)
      .then((data) => {
        this.setState({ faceEncoding: data.data });
      })
      .catch((err) => {
        this.setState({ errorFromApi: err.response.data.message });
      });
  };

  render() {
    return (
      <div className=" container centered ">
        <div class="shadow-lg p-3 mb-5 bg-body rounded">
          <div class="card " style={{ width: "40rem" }}>
            <div class="card-body">
              {this.state.faceEncoding === null ? (
                <>
                  {this.state.errorFromApi !== "" ? (
                    <div class="alert alert-danger">
                      {this.state.errorFromApi}
                    </div>
                  ) : (
                    <></>
                  )}
                  <h5 className="card-title text-center">Welcome</h5>
                  <br></br>
                  <div className="card-text">
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
                      name="login"
                      // action="/mfa"
                      // method="POST"
                      onSubmit={this.onSubmitForm}
                      noValidate
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
                      <div className="col-md-12 text-right">
                        {/* <Link to={"/mfa"}> */}
                        <button
                          disabled={this.state.isSubmitDisable}
                          className="btn btn-primary "
                        >
                          Next
                        </button>
                        {/* </Link> */}
                      </div>
                      <span>
                        New User?{" "}
                        <Link to={"/create-account"}>Create An Account</Link>
                      </span>
                    </form>
                  </div>
                </>
              ) : (
                <>
                  <MFA faceEncoding={this.state.faceEncoding}></MFA>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
