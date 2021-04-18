import React from "react";
import _ from "lodash";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import CocktailsList from "../cocktails-list";
import formatIngredientsFilter from "../../helpers/format-ingredients-filters";

class CocktailsOfLiquor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { cocktails: [], title: "" };
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

      this.setState({ cocktails, title }, () => console.log(this.state));
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="cocktails-by-liquor-display">
        <CocktailsList
          title={this.state.title}
          cocktails={_.sortBy(this.state.cocktails, ["name"])}
        />
      </div>
    );
  }
}

export default CocktailsOfLiquor;
