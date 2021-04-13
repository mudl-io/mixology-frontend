import React from "react";
import { connect } from "react-redux";

import "./styles.scss";
import axiosInstance from "../../axiosApi";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      savedCocktailsCount: 0,
      createdCocktailsCount: 0,
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
        username: response.data.username,
        email: response.data.email,
        savedCocktailsCount: response.data.savedCocktailsCount,
        createdCocktailsCount: response.data.createdCocktailsCount,
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

  render() {
    return (
      <div className="profile-page">
        <div className="inner-content">
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.users;
  return { user: user };
};

export default connect(mapStateToProps)(ProfilePage);
