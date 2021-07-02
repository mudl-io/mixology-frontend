import React from "react";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import TextField from "@material-ui/core/TextField";

import history from "../../history";
import "./styles.scss";
import { axiosInstance } from "../../axiosApi";

// redux actions
import { loginUser } from "../../features/users/usersSlice";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let response;
    try {
      response = await axiosInstance.post("/token/obtain/", {
        username: this.state.username,
        password: this.state.password,
      });

      if (!response) {
        NotificationManager.error(
          "There was an error logging you in. Please make sure your username and password are correct.",
          "Login Error",
          3000
        );
        return;
      }

      axiosInstance.defaults.headers["Authorization"] =
        "JWT " + response.data.access;
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // update store with user here
      const payload = {
        id: response.data.id,
        username: response.data.user,
        email: response.data.email,
      };
      this.props.dispatch(loginUser(payload));
      return response;
    } catch (error) {
      throw error;
    }
  };

  redirectToForgotPassword = () => {
    history.push("/reset-password/");
  };

  render() {
    return (
      <div className="login-form-container">
        <h1>Login</h1>
        <form className="login-form" onSubmit={this.handleSubmit}>
          <div>
            <TextField
              required
              label="Username"
              name="username"
              value={this.state.username}
              variant="outlined"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <TextField
              required
              label="Password"
              name="password"
              type="password"
              value={this.state.password}
              variant="outlined"
              onChange={this.handleChange}
            />
          </div>
          <div
            className="forgot-password-text"
            onClick={this.redirectToForgotPassword}
          >
            Forgot Password?
          </div>
          <input
            className="signup-submit-button"
            type="submit"
            value="Submit"
          />
        </form>
      </div>
    );
  }
}
export default connect()(Login);
