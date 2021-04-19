import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import CocktailsList from "../cocktails-list";
import formatIngredientsFilter from "../../helpers/format-ingredients-filters";

// redux actions
import { didGetCocktailsByLiquor } from "../../features/cocktails-by-liquor/cocktailsByLiquorSlice";

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
      let data;

      if (this.props.cocktails[liquorId]) {
        data = this.props.cocktails[liquorId];
      } else {
        const res = await axiosInstance.get("cocktails/filtered_cocktails/", {
          params: {
            liquors_filter: formatIngredientsFilter(liquorId),
          },
        });

        data = res.data;

        this.props.dispatch(
          didGetCocktailsByLiquor({ liquorId: liquorId, cocktails: data })
        );
      }

      const cocktails = data;
      const title = cocktails[0].liquors.find(
        (liquor) => liquor.publicId === liquorId
      ).name;

      const userCocktails = _.sortBy(
        _.filter(data, (cocktail) => cocktail.createdBy),
        ["name"]
      );
      const platformCocktails = _.sortBy(
        _.filter(data, (cocktail) => !cocktail.createdBy),
        ["name"]
      );

      this.setState({ cocktails, title, userCocktails, platformCocktails });
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
          cocktails={cocktailsToShow}
          hasToggle={true}
          isToggled={this.state.showUserCreatedCocktails}
          title={this.state.title}
          handleToggle={this.handleToggle}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { cocktailsByLiquor } = state;
  return { cocktails: cocktailsByLiquor };
};

export default connect(mapStateToProps)(CocktailsOfLiquor);
