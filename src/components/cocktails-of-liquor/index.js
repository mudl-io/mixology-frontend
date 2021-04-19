import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import CocktailsList from "../cocktails-list";
import InfiniteScroller from "../infinite-scroller";
import formatIngredientsFilter from "../../helpers/format-ingredients-filters";

// redux actions
import {
  didGetCocktailsByLiquor,
  didUpdateCocktailsByLiquor,
} from "../../features/cocktails-by-liquor/cocktailsByLiquorSlice";

class CocktailsOfLiquor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canLoadMoreCocktails: false,
      isLoadingMoreCocktails: false,
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
    const nextPage = this.props.nextPage;

    try {
      // if no cocktails in the redux store or a user scrolls down and needs to load more cocktails
      // make a request to the API for the next page of cocktails
      this.setState({ isLoadingMoreCocktails: true });

      const res = await axiosInstance.get("cocktails/filtered_cocktails/", {
        params: {
          liquors_filter: formatIngredientsFilter(liquorId),
          page: nextPage,
        },
      });

      const action =
        nextPage === 1 ? didGetCocktailsByLiquor : didUpdateCocktailsByLiquor;

      this.props.dispatch(
        action({
          liquorId: liquorId,
          cocktails: res.data,
        })
      );

      this.updateState();
    } catch (e) {
      console.log(e);
    }
  }

  updateState = () => {
    const liquorId = this.props.match.params.liquorId;
    const cocktails = this.props.cocktails; // should be available via props after the dispatch call to the redux store
    const title = cocktails[0].liquors.find(
      (liquor) => liquor.publicId === liquorId
    ).name;

    const userCocktails = _.filter(cocktails, (cocktail) => cocktail.createdBy);
    const platformCocktails = _.filter(
      cocktails,
      (cocktail) => !cocktail.createdBy
    );

    this.setState({
      title,
      canLoadMore: cocktails.length % 30 === 0,
      isLoadingMoreCocktails: false,
      userCocktails: userCocktails,
      platformCocktails: platformCocktails,
    });
  };

  handleToggle = (event, index) => {
    this.setState({ showUserCreatedCocktails: index === 1 });
  };

  render() {
    const cocktailsToShow = this.state.showUserCreatedCocktails
      ? this.state.userCocktails
      : this.state.platformCocktails;

    return (
      <div className="cocktails-by-liquor-display">
        <InfiniteScroller
          canLoadMore={this.state.canLoadMoreCocktails}
          isLoading={this.state.isLoadingMoreCocktails}
          fetchData={this.fetchCocktails}
        >
          <CocktailsList
            cocktails={cocktailsToShow}
            hasToggle={true}
            isToggled={this.state.showUserCreatedCocktails}
            title={this.state.title}
            handleToggle={this.handleToggle}
          />
        </InfiniteScroller>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { cocktailsByLiquor } = state;
  const liquorId = ownProps.match.params.liquorId;
  const cocktails = cocktailsByLiquor[liquorId]
    ? cocktailsByLiquor[liquorId].cocktails
    : null;
  const nextPage = cocktailsByLiquor[liquorId]
    ? cocktailsByLiquor[liquorId].nextPage
    : 1;

  return { cocktails, nextPage };
};

export default connect(mapStateToProps)(CocktailsOfLiquor);
