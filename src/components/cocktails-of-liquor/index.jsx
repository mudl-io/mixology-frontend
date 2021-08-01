import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";
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
      canLoadMoreUserCocktails: false,
      canLoadMorePlatformCocktails: false,
      isLoadingMoreCocktails: false,
      title: "",
      showUserCreatedCocktails: false,
      platformCocktails: [],
      userCocktails: [],
    };
  }

  // only fetch cocktails on initial render when there are none in redux store
  componentDidMount() {
    if (!this.props.cocktails) this.fetchCocktails();
  }

  // make a call to fetchCocktails after selecting a different liquor while this component is rendered
  componentDidUpdate(previousProps) {
    if (
      previousProps.match.params.liquorId === this.props.match.params.liquorId
    ) {
      return;
    }

    if (!this.props.cocktails) {
      this.fetchCocktails(); // if redux store is empty, fetch cocktails via API
    } else {
      this.updateState(); // else use existing state
    }
  }

  fetchCocktails = async () => {
    const liquorId = this.props.match.params.liquorId;
    const nextPage = this.props.nextPage;

    try {
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
          cocktails: res.data.results,
        })
      );

      this.updateState(
        res.data.userCocktailsCount,
        res.data.platformCocktailsCount
      );
    } catch (e) {
      console.log(e);
    }
  };

  updateState = (userCocktailsCount, platformCocktailsCount) => {
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
      canLoadMoreUserCocktails: userCocktails.length < userCocktailsCount,
      canLoadMorePlatformCocktails:
        platformCocktails.length < platformCocktailsCount,
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
    const canLoadMoreCocktails = this.state.showUserCreatedCocktails
      ? this.state.canLoadMoreUserCocktails
      : this.state.canLoadMorePlatformCocktails;

    return (
      <div className="cocktails-by-liquor-display">
        <InfiniteScroller
          canLoadMore={canLoadMoreCocktails}
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