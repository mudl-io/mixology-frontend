import React from "react";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { NotificationManager } from "react-notifications";

import axiosInstance from "../../axiosApi";
import history from "../../history";
import LoadingScreen from "../loading-screen";
import "./styles.scss";

class ResetPasswordForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      hasSubmittedEmail: false,
      hasSubmittedVerificationCode: false,
      isLoading: false,
      matchingPassword: "",
      newPassword: "",
      verificationCode: "",
    };
  }

  emailIsValid() {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.state.email).toLowerCase());
  }

  passwordsMatch = () => {
    return this.state.newPassword === this.state.matchingPassword;
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitEmail = async () => {
    if (!this.emailIsValid()) {
      NotificationManager.error(
        "Your entered email address is of an invalid format",
        "Invalid email address",
        5000
      );
      return;
    }

    try {
      this.setState({ isLoading: true });
      const res = await axiosInstance.post(
        "/password_reset/send_verification_code_email/",
        {
          email: this.state.email,
        }
      );

      if (res.status !== 200) throw new Error();

      this.setState({ hasSubmittedEmail: true });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  submitNewPassword = async () => {
    if (!this.passwordsMatch()) {
      NotificationManager.error(
        "The entered passwords do not match",
        "Password Invalid",
        5000
      );
      return;
    }

    if (this.state.newPassword.trim().length < 8) {
      NotificationManager.error(
        "Please make sure your password is at least 8 characters long",
        "Password Invalid",
        5000
      );
      return;
    }

    try {
      const res = await axiosInstance.post("password_reset/reset_password/", {
        email: this.state.email,
        newPassword: this.state.newPassword,
      });

      if (res.status !== 200) throw new Error();

      NotificationManager.success(
        "Password successfully changed!",
        "Password Change Success",
        3000
      );
      history.push("/login/");
    } catch (e) {
      NotificationManager.error(
        "Error updating your password. Please try again.",
        "Password Reset Error",
        5000
      );
    }
  };

  submitVerificationCode = async () => {
    if (this.state.verificationCode.trim().length === 0) {
      NotificationManager.error(
        "Please enter a verification code",
        "Verification Code Error",
        5000
      );
      return;
    }

    try {
      this.setState({ isLoading: true });

      const res = await axiosInstance.post("/password_reset/verify_code/", {
        email: this.state.email,
        verificationCode: this.state.verificationCode,
      });

      if (res.status !== 200) throw new Error();

      this.setState({ hasSubmittedVerificationCode: true });
    } catch (e) {
      NotificationManager.error(
        "Verification code does not match, please check your email and try again.",
        "Verification Code Invalid",
        5000
      );
    } finally {
      this.setState({ isLoading: false });
    }

    this.setState({ hasSubmittedVerificationCode: true });
  };

  inputBlock = (params) => {
    const { label, name, onSubmit } = params;
    const informationHeader = {
      verificationCode: "Please check your email for a verification code.",
      email:
        "Please enter your email that you would like use to send a verification code to.",
    };

    return (
      <div>
        <div className="sub-text">{informationHeader[name]}</div>
        <TextField
          required
          className={this.state.isValidEmail ? "invalid" : ""}
          label={label}
          name={name}
          value={this.state[name]}
          variant="outlined"
          onChange={this.handleChange}
        />

        <div className="button-container">
          <Button
            className="email button"
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  };

  passwordResetBlock = () => {
    return (
      <div>
        <div>
          <TextField
            required
            className={this.state.isValidEmail ? "invalid" : ""}
            label="Enter New Password"
            name="newPassword"
            type="password"
            variant="outlined"
            onChange={this.handleChange}
          />
        </div>

        <div className="second-password-input">
          <TextField
            required
            className={this.state.isValidEmail ? "invalid" : ""}
            label="Re-enter password to verify"
            name="matchingPassword"
            type="password"
            variant="outlined"
            onChange={this.handleChange}
          />
        </div>

        <div className="button-container">
          <Button
            className="email button"
            variant="contained"
            onClick={this.submitNewPassword}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  };

  innerContents = () => {
    if (this.state.hasSubmittedVerificationCode) {
      return this.passwordResetBlock();
    } else if (this.state.hasSubmittedEmail) {
      return this.inputBlock({
        label: "Verification Code",
        name: "verificationCode",
        onSubmit: this.submitVerificationCode,
      });
    } else {
      return this.inputBlock({
        label: "Email",
        name: "email",
        onSubmit: this.submitEmail,
      });
    }
  };

  render() {
    return (
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        {this.innerContents()}
        <LoadingScreen isOpen={this.state.isLoading} />
      </div>
    );
  }
}

export default ResetPasswordForm;
