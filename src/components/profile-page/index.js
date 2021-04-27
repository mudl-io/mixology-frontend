import React from "react";
import { connect } from "react-redux";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { NotificationManager } from "react-notifications";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import defaultProfilePic from "../../assets/cocktail-silhouette.png";
import ImageUploadModal from "../image-upload-modal";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProfilePicture: null,
      createdCocktailsCount: 0,
      email: "",
      imageSelected: false,
      profilePictureToUpload: null,
      savedCocktailsCount: 0,
      showUploader: false,
      username: "",
      viewedCocktailsCount: 0,
    };
  }

  async componentDidMount() {
    try {
      const response = await axiosInstance.get("/user/detail/", {
        params: {
          username: this.props.match.params.username,
        },
      });

      this.setState({
        createdCocktailsCount: response.data.createdCocktailsCount,
        email: response.data.email,
        activeProfilePicture: response.data.activeProfilePicture.image,
        savedCocktailsCount: response.data.savedCocktailsCount,
        username: response.data.username,
        viewedCocktailsCount: response.data.viewedCocktailsCount,
      });
    } catch (e) {
      // if the network request fails, user the redux store's user state
      this.setState({
        username: this.props.user.username,
        email: this.props.user.email,
      });
    }
  }

  handleSaveProfilePicture = async () => {
    if (this.state.profilePictureToUpload) {
      const imageData = new FormData();
      imageData.append("image", this.state.profilePictureToUpload);
      axiosInstance.defaults.headers["Content-Type"] = "multipart/form-data";

      try {
        const res = await axiosInstance.post("/profile_pictures/", imageData);

        this.setState({
          activeProfilePicture: res.data.image,
        });

        this.toggleShowUploader();

        NotificationManager.success(
          "Profile picture successfully uploaded",
          "Upload Success",
          2000
        );
      } catch (e) {
        NotificationManager.error(
          "Error uploading profile picture. Please try again or refresh the page",
          "Upload failure",
          2000
        );
      } finally {
        axiosInstance.defaults.headers["Content-Type"] = "application/json";
      }
    } else {
      NotificationManager.error("No image selected", "Upload failure", 2000);
    }
  };

  handleUploadProfilePicture = (profilePicture) => {
    this.setState({
      profilePictureToUpload: profilePicture[0],
      imageSelected: true,
    });
  };

  toggleShowUploader = () => {
    this.setState({ showUploader: !this.state.showUploader });
  };

  render() {
    return (
      <div className="profile-page">
        <div className="inner-content">
          <div className="profile-image-and-uploader">
            <img
              className="profile-picture"
              src={this.state.activeProfilePicture || defaultProfilePic}
            />
            <div className="upload-icon">
              <AddAPhotoIcon onClick={this.toggleShowUploader} />
            </div>
          </div>
          <div className="username">
            <h3>Username:</h3>
            <div>{this.state.username}</div>
          </div>

          <div className="email">
            <h3>Email:</h3>
            <div>{this.state.email}</div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-title">Liked Cocktails: </span>
              <span>{this.state.savedCocktailsCount}</span>
            </div>
            <div className="stat">
              <span className="stat-title">Created Cocktails: </span>
              <span>{this.state.createdCocktailsCount}</span>
            </div>
            <div className="stat">
              <span className="stat-title">Viewed Cocktails: </span>
              <span>{this.state.viewedCocktailsCount}</span>
            </div>
          </div>
        </div>

        <ImageUploadModal
          buttonText={"Upload a new profile picture"}
          imageSelected={this.state.imageSelected}
          open={this.state.showUploader}
          handleClose={this.toggleShowUploader}
          uploadImage={this.handleUploadProfilePicture}
          saveImage={this.handleSaveProfilePicture}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.users;
  return { user: user };
};

export default connect(mapStateToProps)(ProfilePage);
