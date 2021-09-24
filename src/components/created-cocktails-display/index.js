import React from "react";
import { connect } from "react-redux";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";
import {
  didGetCreatedCocktails,
  didUpdateCreatedCocktails,
} from "../../features/created-cocktails/createdCocktailsSlice";

import CocktailsList from "../cocktails-list";
import InfiniteScroller from "../infinite-scroller";

class CreatedCocktailsDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: false };
  }

  componentDidMount() {
    this.fetchCreatedCocktails();
  }

  componentDidUpdate(previousProps) {
    if (
      this.props.match.params.username !== previousProps.match.params.username
    ) {
      this.fetchCreatedCocktails();
    }
  }

  fetchCreatedCocktails = async () => {
    const nextPage = this.props.nextPage;

    try {
      this.setState({ isLoading: true });

      const res = await axiosInstance.get("/cocktails/", {
        params: {
          action: "created_cocktails",
          username: this.props.match.params.username,
          page: nextPage,
        },
      });

      const createdCocktails = res.data.results;
      const canLoadMore = !!res.data.next;

      const action =
        nextPage === 1 ? didGetCreatedCocktails : didUpdateCreatedCocktails;

      this.props.dispatch(
        action({
          user: this.props.match.params.username,
          cocktails: createdCocktails,
          canLoadMore: canLoadMore,
        })
      );
    } catch (e) {
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div className="created-cocktail-display">
        <InfiniteScroller
          canLoadMore={this.props.canLoadMore}
          isLoading={this.state.isLoading}
          fetchData={this.fetchCreatedCocktails}
        >
          <CocktailsList
            title={"Created Cocktails"}
            cocktails={this.props.createdCocktails}
            displayGrid={true}
          />
        </InfiniteScroller>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const data = state.createdCocktails[ownProps.match.params.username];
  const { createdCocktails, canLoadMore, nextPage } =
    data || state.createdCocktails;

  return {
    createdCocktails: createdCocktails,
    canLoadMore: canLoadMore,
    nextPage: nextPage,
  };
};

export default connect(mapStateToProps)(CreatedCocktailsDisplay);
