import React from "react";
import { connect } from "react-redux";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import { NotificationManager } from "react-notifications";
import { get, remove, uniq } from "lodash";
import TextField from "@material-ui/core/TextField";

import "./styles.scss";
import history from "../../history";
import { axiosInstance, axiosImageInstance } from "../../axiosApi";
import defaultProfilePic from "../../assets/cocktail-silhouette.png";
import ImageUploadModal from "../image-upload-modal";
import ClickableImagesModal from "../clickable-images-modal";
import CocktailsList from "../cocktails-list";
import PostDisplay from "../post-display";

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
      showEditProfile: false,
      profileDescription: "",
      mostLikedCocktails: [],
      posts: [],
      isFollowed: false,
    };
  }

  async componentDidMount() {
    this.getProfileInfo();
  }

  componentDidUpdate(previousProps) {
    if (!get(this.props, "match.params.username")) {
      history.push("/");
    }

    if (
      get(previousProps, "match.params.username") !==
      get(this.props, "match.params.username")
    ) {
      this.getProfileInfo();
    }
  }

  isCurrentUser = () => {
    return (
      get(this.props, "user.username") ===
      get(this.props, "match.params.username")
    );
  };

  getProfileInfo = async () => {
    try {
      const [userData, profilePicturesData, cocktailData, postData] =
        await Promise.all([
          axiosInstance.get("/user/detail/", {
            params: {
              username: this.props.match.params.username,
            },
          }),
          axiosInstance.get("/profile_pictures/"),
          axiosInstance.get("/cocktails/", {
            params: {
              action: "most_liked",
              username: this.props.match.params.username,
              limit: 5,
            },
          }),
          axiosInstance.get("/posts/", {
            params: { username: this.props.match.params.username },
          }),
        ]);

      const activeProfilePic = remove(
        profilePicturesData.data,
        (img) => img.isActive
      );

      const sortedImages = activeProfilePic.concat(profilePicturesData.data);
      const profilePictures = sortedImages.map((img) => img.image);

      this.setState({
        activeProfilePicture: get(userData, "data.activeProfilePicture.image"),
        createdCocktailsCount: userData.data.createdCocktailsCount,
        email: userData.data.email,
        profilePicturesWithMetadata: profilePicturesData.data,
        profilePictures: profilePictures,
        savedCocktailsCount: userData.data.savedCocktailsCount,
        username: userData.data.username,
        viewedCocktailsCount: userData.data.viewedCocktailsCount,
        profileDescription: userData.data.profileDescription,
        isFollowed: userData.data.isFollowed,
        followersCount: userData.data.followersCount,
        followingCount: userData.data.followingCount,
        mostLikedCocktails: get(cocktailData, "data.results"),
        posts: get(postData, "data.results"),
      });
    } catch (e) {
      console.log(e);
      // if the network request fails, user the redux store's user state
      this.setState({
        username: this.props.user.username,
        email: this.props.user.email,
      });
    }
  };

  handleSaveProfilePicture = async () => {
    if (this.state.profilePictureToUpload) {
      const imageData = new FormData();
      imageData.append("image", this.state.profilePictureToUpload);

      try {
        const res = await axiosImageInstance.post(
          "/profile_pictures/",
          imageData
        );

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
        await axiosInstance.patch(
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

  handleProfileDescriptionChange = (event) => {
    this.setState({ profileDescription: event.target.value });
  };

  handleUploadProfilePicture = (profilePicture) => {
    this.setState({
      profilePictureToUpload: profilePicture[0],
      imageSelected: true,
    });
  };

  toggleEditProfile = () => {
    this.setState({ showEditProfile: !this.state.showEditProfile });
  };

  toggleShowAllProfilePictures = () => {
    if (!this.isCurrentUser()) return;

    this.setState({ showPicturesModal: !this.state.showPicturesModal });
  };

  toggleShowUploader = () => {
    this.setState({ showUploader: !this.state.showUploader });
  };

  saveProfileChanges = async () => {
    const username = this.props.user.username;

    try {
      await axiosInstance.patch(`users/${username}/`, {
        profileDescription: this.state.profileDescription,
      });
    } catch (e) {
    } finally {
      this.toggleEditProfile();
    }
  };

  followUser = async () => {
    const username = get(this.props, "match.params.username");

    try {
      await axiosInstance.post(`users/${username}/follow/`);

      const amtChange = this.state.isFollowed ? -1 : 1;

      this.setState({
        isFollowed: !this.state.isFollowed,
        followersCount: this.state.followersCount + amtChange,
      });
    } catch (e) {}
  };

  descriptionElement = () => {
    if (this.state.showEditProfile) {
      return (
        <div className="description-display edit">
          <TextField
            multiline
            className="profile-description-editor"
            label="Profile Description"
            minRows={5}
            maxRows={5}
            name="profileDescription"
            value={this.state.profileDescription}
            variant="outlined"
            onChange={this.handleProfileDescriptionChange}
          />
          <div className="save-cancel-buttons">
            <div className="cancel button" onClick={this.toggleEditProfile}>
              Cancel
            </div>
            <div className="save button" onClick={this.saveProfileChanges}>
              Save
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="description-display">
          {this.state.profileDescription}
        </div>
      );
    }
  };

  mostLikedCocktailsList = () => {
    const redirectToCreatedCocktails = () =>
      history.push(
        `/user/${get(this.props, "match.params.username")}/created-cocktails/`
      );

    return (
      <div className="created-cocktails-container">
        <CocktailsList
          title="Most liked cocktails"
          cocktails={this.state.mostLikedCocktails}
        />
        <div className="view-more-text" onClick={redirectToCreatedCocktails}>
          View More
        </div>
      </div>
    );
  };

  postList = () => {
    return this.state.posts.map((post) => {
      return (
        <PostDisplay
          cocktail={post.cocktail}
          createdAt={post.createdAt}
          description={post.description}
          postedBy={post.postedBy}
          title={post.title}
          postId={post.publicId}
          key={post.publicId}
        />
      );
    });
  };

  render() {
    if (!this.props.user) {
      history.push("/");
    }

    return (
      <div className="profile-page">
        <div className="profile-content-wrapper">
          <div className="profile-content">
            <div
              className="edit-icon-container"
              onClick={this.toggleEditProfile}
            >
              {this.isCurrentUser() && <EditIcon className="edit-icon" />}
            </div>

            <div className="profile-card container">
              <div className="profile-image-follow-column">
                <div className="profile-image-and-uploader">
                  <img
                    className={`profile-picture ${
                      this.isCurrentUser() ? "enabled" : "disabled"
                    }`}
                    src={this.state.activeProfilePicture || defaultProfilePic}
                    alt=""
                    onClick={this.toggleShowAllProfilePictures}
                  />
                  {this.isCurrentUser() && (
                    <div
                      className="upload-icon"
                      onClick={this.toggleShowUploader}
                    >
                      <Tooltip
                        title="Upload a new profile picture"
                        placement="top"
                      >
                        <AddAPhotoIcon />
                      </Tooltip>
                    </div>
                  )}
                </div>

                {!this.isCurrentUser() && (
                  <span className="follow-button" onClick={this.followUser}>
                    {!this.state.isFollowed ? "Follow" : "Unfollow"}
                  </span>
                )}
              </div>

              <div className="profile-name-and-description">
                <div className="username">
                  <div>{this.state.username}</div>
                </div>
                <div className="profile-description">
                  {this.descriptionElement()}
                </div>
              </div>
            </div>

            <div className="profile-stats container">
              <div className="followers-stats">
                <div className="stat">
                  <span className="stat-title">Followers: </span>
                  <span>{this.state.followersCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-title">Following: </span>
                  <span>{this.state.followingCount}</span>
                </div>
              </div>

              <div className="cocktail-stats">
                <div className="stat">
                  <span className="stat-title">Liked Cocktails: </span>
                  <span>{this.state.savedCocktailsCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-title">Created Cocktails: </span>
                  <span>{this.state.createdCocktailsCount}</span>
                </div>
                {this.isCurrentUser() && (
                  <div className="stat">
                    <span className="stat-title">Viewed Cocktails: </span>
                    <span>{this.state.viewedCocktailsCount}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="most-liked-cocktails container">
              {this.mostLikedCocktailsList()}
            </div>
          </div>
        </div>

        <div className="user-posts-container">{this.postList()}</div>

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
            images={uniq(this.state.profilePictures)}
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
