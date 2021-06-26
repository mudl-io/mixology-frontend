import React from "react";
import _ from "lodash";
import { NotificationManager } from "react-notifications";

import "../created-cocktails-display/styles.scss";
import { axiosInstance } from "../../axiosApi";

import CocktailsList from "../cocktails-list";

class CocktailsByUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = { createdCocktails: [] };
  }

  async componentDidMount() {
    try {
      const createdCocktails = await axiosInstance.get(
        "/cocktails/created_cocktails",
        {
          params: {
            username: this.props.match.params.username,
          },
        }
      );

      this.setState({ createdCocktails: createdCocktails.data });
    } catch (e) {
      NotificationManager.error(
        "Please try refreshing the page",
        "Error retrieving created cocktails",
        5000
      );
    }
  }

  render() {
    return (
      <div className="created-cocktail-display">
        <CocktailsList
          title={"Created Cocktails"}
          cocktails={_.sortBy(this.state.createdCocktails, ["name"])}
        />
      </div>
    );
  }
}

export default CocktailsByUser;
