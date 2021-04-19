import React, { useCallback, useEffect, useRef } from "react";
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";

const InfiniteScroller = (props) => {
  const loader = useRef(null);
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
    if (loader && loader.current) {
      loadMoreObserver.observe(loader.current);
    }

    // remove observer after component unmounts
    return () => loadMoreObserver.unobserve(loader.current);
  }, [loader, loadMore]);

  const loadingSpinner = (canLoadMore) => {
    return (
      <div ref={loader} className="end-scroll">
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
