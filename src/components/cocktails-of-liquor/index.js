import React from "react";
import _ from "lodash";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import CocktailsList from "../cocktails-list";
import formatIngredientsFilter from "../../helpers/format-ingredients-filters";

class CocktailsOfLiquor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cocktails: [],
      title: "",
      showUserCreatedCocktails: false,
      platformCocktails: [],
      userCocktails: [],
    };
  }

  componentDidMount() {
    this.fetchCocktails();
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.match.params.liquorId === this.props.match.params.liquorId
    ) {
      return;
    }

    this.fetchCocktails();
  }

  async fetchCocktails() {
    const liquorId = this.props.match.params.liquorId;

    try {
      const res = await axiosInstance.get("cocktails/filtered_cocktails/", {
        params: {
          liquors_filter: formatIngredientsFilter(liquorId),
        },
      });

      const cocktails = res.data;
      const title = cocktails[0].liquors.find(
        (liquor) => liquor.publicId === liquorId
      ).name;

      const userCocktails = _.filter(
        res.data,
        (cocktail) => cocktail.createdBy
      );
      const platformCocktails = _.filter(
        res.data,
        (cocktail) => !cocktail.createdBy
      );

      this.setState(
        { cocktails, title, userCocktails, platformCocktails },
        () => console.log(this.state)
      );
    } catch (e) {
      console.log(e);
    }
  }

  handleToggle = (event, index) => {
    this.setState({ showUserCreatedCocktails: index === 1 });
  };

  render() {
    const cocktailsToShow = this.state.showUserCreatedCocktails
      ? this.state.userCocktails
      : this.state.platformCocktails;

    return (
      <div className="cocktails-by-liquor-display">
        <CocktailsList
          cocktails={_.sortBy(cocktailsToShow, ["name"])}
          hasToggle={true}
          isToggled={this.state.showUserCreatedCocktails}
          title={this.state.title}
          handleToggle={this.handleToggle}
        />
      </div>
    );
  }
}

export default CocktailsOfLiquor;
