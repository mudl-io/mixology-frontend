import React, { useCallback, useEffect, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./styles.scss";

const InfiniteScroller = (props) => {
  const loaderComponent = useRef(null);
  const loadMore = useCallback(
    (entries) => {
      // entries are the references/DOM elements being observed by the IntersectionObserver
      // there should only be one value in entries - the loader reference
      // which is attached to the "end-scroll" div
      const target = entries[0];
      if (target.isIntersecting && props.canLoadMore && !props.isLoading) {
        props.fetchData();
      }
    },
    [props.canLoadMore, props.isLoading, props.fetchData]
  );

  // runs after render and attaches IntersectionObserver to the loader div
  // depends on loader and loadMore, so only runs on rerender if either of those
  // values changes
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };

    const loadMoreObserver = new IntersectionObserver(loadMore, options);

    // make sure component containing the loader reference is properly rendered
    if (loaderComponent && loaderComponent.current) {
      loadMoreObserver.observe(loaderComponent.current);
    }

    // remove observer after component unmounts
    return () => {
      if (loaderComponent.current) {
        loadMoreObserver.unobserve(loaderComponent.current);
      }
    };
  }, [loaderComponent, loadMore]);

  const loadingSpinner = (canLoadMore) => {
    return (
      <div ref={loaderComponent} className="end-scroll">
        {canLoadMore && <CircularProgress />}
      </div>
    );
  };

  return (
    <div>
      {props.children}
      {loadingSpinner(props.canLoadMore)}
    </div>
  );
};

export default InfiniteScroller;
