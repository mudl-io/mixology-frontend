import React from "react";
import { connect } from "react-redux";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Tooltip from "@material-ui/core/Tooltip";
import { NotificationManager } from "react-notifications";
import _ from "lodash";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import defaultProfilePic from "../../assets/cocktail-silhouette.png";
import ImageUploadModal from "../image-upload-modal";
import ClickableImagesModal from "../clickable-images-modal";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProfilePicture: null,
      createdCocktailsCount: 0,
      email: "",
      imageSelected: false,
      profilePictures: [],
      profilePictureToUpload: null,
      savedCocktailsCount: 0,
      showPicturesModal: false,
      showUploader: false,
      username: "",
      viewedCocktailsCount: 0,
    };
  }

  async componentDidMount() {
    try {
      const [userData, profilePicturesData] = await Promise.all([
        axiosInstance.get("/user/detail/", {
          params: {
            username: this.props.match.params.username,
          },
        }),
        axiosInstance.get("/profile_pictures/"),
      ]);

      const activeProfilePic = _.remove(
        profilePicturesData.data,
        (img) => img.isActive
      );

      const sortedImages = activeProfilePic.concat(profilePicturesData.data);
      const profilePictures = sortedImages.map((img) => img.image);

      this.setState({
        activeProfilePicture: userData.data.activeProfilePicture.image,
        createdCocktailsCount: userData.data.createdCocktailsCount,
        email: userData.data.email,
        profilePicturesWithMetadata: profilePicturesData.data,
        profilePictures: profilePictures,
        savedCocktailsCount: userData.data.savedCocktailsCount,
        username: userData.data.username,
        viewedCocktailsCount: userData.data.viewedCocktailsCount,
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

  handleActiveImageUpdate = (image) => async () => {
    const newActiveImg = this.state.profilePicturesWithMetadata.find(
      (img) => img.image === image
    );

    if (newActiveImg) {
      try {
        const res = await axiosInstance.patch(
          `/profile_pictures/${newActiveImg.publicId}/`,
          { isActive: true }
        );

        this.setState({ activeProfilePicture: newActiveImg.image });
      } catch (e) {
        NotificationManager.error(
          "Error updating your active profile picture",
          "Profile picture update error",
          2000
        );
      }
    }
  };

  handleUploadProfilePicture = (profilePicture) => {
    this.setState({
      profilePictureToUpload: profilePicture[0],
      imageSelected: true,
    });
  };

  toggleShowAllProfilePictures = () => {
    this.setState({ showPicturesModal: !this.state.showPicturesModal });
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
              onClick={this.toggleShowAllProfilePictures}
            />
            <div className="upload-icon" onClick={this.toggleShowUploader}>
              <Tooltip title="Upload a new profile picture" placement="top">
                <AddAPhotoIcon />
              </Tooltip>
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

        {this.state.profilePictures && (
          <ClickableImagesModal
            images={_.uniq(this.state.profilePictures)}
            canUpdate={true}
            open={this.state.showPicturesModal}
            updateText="Set as active profile picture"
            handleClose={this.toggleShowAllProfilePictures}
            handleUpdate={this.handleActiveImageUpdate}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.users;
  return { user: user };
};

export default connect(mapStateToProps)(ProfilePage);
