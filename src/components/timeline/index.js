import { useState, useEffect } from "react";
import { get } from "lodash";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";
import PostCreateForm from "../post-create-form";
import PostDisplay from "../post-display";
import InfiniteScroller from "../infinite-scroller";

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreFollowPosts, setHasMoreFollowPosts] = useState(true);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setLoading] = useState(false);

  /**
   * TODO:
   * Add a function that periodically pings the API to see if any new posts are available
   * If there are new posts available set a stateful variable, areNewPosts, to true
   * Make the useEffect hook dependent upon areNewPosts such that it will rerun when it is
   * to true
   */
  useEffect(() => {
    retrievePosts();
  }, []);

  const retrievePosts = () => {
    if (hasMoreFollowPosts) {
      retrieveFollowedPosts();
    } else {
      retrieveGenericPosts();
    }
  };

  const retrieveGenericPosts = async () => {
    setLoading(true);

    try {
      const postsRes = await axiosInstance.get("/posts/", {
        params: { default: true, page: page },
      });
      const newPosts = get(postsRes, "data.results");
      const hasMorePosts = !!get(postsRes, "data.next");

      console.log(page);
      console.log(postsRes);

      setHasMorePosts(hasMorePosts);
      setPage(hasMorePosts ? page + 1 : null);
      setPosts([...posts, ...newPosts], "publicId");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const retrieveFollowedPosts = async () => {
    setLoading(true);

    try {
      const postsRes = await axiosInstance.get("/posts/", {
        params: { page: page },
      });
      const newPosts = get(postsRes, "data.results");
      const hasMoreFollowPosts = !!get(postsRes, "data.next");

      setHasMoreFollowPosts(hasMoreFollowPosts);
      setPage(hasMoreFollowPosts ? page + 1 : 1);
      setPosts([...posts, ...newPosts], "publicId");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const postList = () => {
    return posts.map((post) => {
      return (
        <PostDisplay
          cocktail={post.cocktail}
          createdAt={post.createdAt}
          description={post.description}
          postedBy={post.postedBy}
          title={post.title}
          postId={post.publicId}
          key={post.publicId}
        />
      );
    });
  };

  return (
    <div className="timeline-container">
      <div className="post-create-wrapper">
        <PostCreateForm isPopup={false} />
      </div>
      <div className="timeline">
        <InfiniteScroller
          canLoadMore={hasMorePosts}
          isLoading={isLoading}
          fetchData={retrievePosts}
        >
          <div className="posts-list">{postList()}</div>
        </InfiniteScroller>
      </div>
      <div className="user-suggestions-wrapper">
        <div className="inner-content">
          <div className="header">Users You May Like</div>
          {/* //TODO: Create user suggestions list} */}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
