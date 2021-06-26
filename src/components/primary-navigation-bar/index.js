import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dropdown, DropdownButton } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import _ from "lodash";

import "./styles.scss";
import history from "../../history";
import { axiosInstance } from "../../axiosApi";
import LeftLiquorsSidenav from "../left-liquors-sidenav";
import SearchBar from "../search-bar";

// redux actions
import { logoutUser } from "../../features/users/usersSlice";

class PrimaryNavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { drawerOpen: false };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  logout = async () => {
    let response;
    try {
      response = await axiosInstance.post("/blacklist/", {
        refresh_token: localStorage.getItem("refresh_token"),
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      axiosInstance.defaults.headers["Authorization"] = null;

      this.props.dispatch(logoutUser());

      window.location.href = "/login/";
    } catch (e) {
      console.log(e);
    } finally {
      return response;
    }
  };

  leftNavContent = () => {
    let content;

    if (this.props.user) {
      content = (
        <span className="cocktail-options-buttons">
          <Link className="nav-link" to="/create-cocktail/">
            Create a Cocktail
          </Link>
        </span>
      );
    }

    return content;
  };

  rightNavContent = () => {
    let content;

    if (this.props.user) {
      content = (
        <DropdownButton
          className="user-options-dropdown"
          variant="Secondary"
          title={this.props.user.username}
        >
          <Dropdown.Item as={Link} to={`/user/${this.props.user.username}`}>
            Profile
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to={`/user/${this.props.user.username}/saved-cocktails`}
          >
            Saved Cocktails
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to={`/user/${this.props.user.username}/created-cocktails`}
          >
            Created Cocktails
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
        </DropdownButton>
      );
    } else {
      content = (
        <span className="login-signup-buttons">
          <Link className="nav-link" to="/login/">
            Login
          </Link>
          <Link className="nav-link" to="/signup/">
            Sign Up
          </Link>
        </span>
      );
    }

    return content;
  };

  handleClickOutside = (event) => {
    if (event.target.className === "liquor-type") {
      setTimeout(() => {
        this.setState({ drawerOpen: false });
      }, 100);
    }
  };

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  handleSearchBarChange = (inputValue) => {
    return inputValue.trim();
  };

  handleSearchSelect = (selectedValue) => {
    const cocktailId = _.get(selectedValue, "value.publicId");

    if (cocktailId) {
      history.push(`/cocktail/${cocktailId}/`);
    }
  };

  getSearchResults = async (inputValue) => {
    if (inputValue.length < 3) return;

    try {
      const searchRes = await axiosInstance.get("/cocktails/", {
        params: {
          action: "search",
          search_value: inputValue,
        },
      });

      const searchData = _.get(searchRes, "data.results") || [];

      const results = searchData.map((cocktail) => {
        return { value: cocktail, label: cocktail.name };
      });

      return results;
    } catch (e) {
      console.log(e);
    }
  };

  drawerStateIcon = () => {
    return this.state.drawerOpen ? <MenuOpenIcon /> : <MenuIcon />;
  };

  render() {
    return (
      <div>
        <div className="primary-navigation-bar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            edge="start"
          >
            {this.drawerStateIcon()}
          </IconButton>
          <nav className="left-nav">
            <Link className="nav-link homepage" to="/">
              <img className="site-logo-nav" src="/defaultimg.png" />
              <span className="logo-text">Cocktail</span>
            </Link>
            {this.leftNavContent()}
          </nav>
          <SearchBar
            placeholder="Search for a cocktail"
            loadOptions={this.getSearchResults}
            onInputChange={this.handleSearchBarChange}
            handleSelect={this.handleSearchSelect}
          />
          <nav className="right-nav">{this.rightNavContent()}</nav>
        </div>
        <div>
          <LeftLiquorsSidenav open={this.state.drawerOpen} />
        </div>
      </div>
    );
  }
}

export default connect()(PrimaryNavigationBar);
