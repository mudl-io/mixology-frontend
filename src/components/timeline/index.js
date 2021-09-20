import { useCallback, useState, useEffect } from "react";
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
  const [canLoadNewPosts, setCanLoadNewPosts] = useState(false);
  const [clickedLoadNewPosts, setClickedLoadNewPosts] = useState(false);

  const retrieveGenericPosts = useCallback(async () => {
    setLoading(true);

    try {
      const postsRes = await axiosInstance.get("/posts/", {
        params: { default: true, page: page },
      });
      const newPosts = get(postsRes, "data.results");
      const hasMorePosts = !!get(postsRes, "data.next");

      setHasMorePosts(hasMorePosts);
      setPage(hasMorePosts ? page + 1 : null);
      setPosts([...posts, ...newPosts], "publicId");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [page, posts]);

  const retrieveFollowedPosts = useCallback(async () => {
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
  }, [page, posts]);

  const retrievePosts = useCallback(() => {
    if (hasMoreFollowPosts) {
      retrieveFollowedPosts();
    } else {
      retrieveGenericPosts();
    }
  }, [hasMoreFollowPosts, retrieveGenericPosts, retrieveFollowedPosts]);

  const loadNewPosts = () => {
    setClickedLoadNewPosts(true);
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

  /**
   * * retrieve posts on page load
   */
  useEffect(() => {
    retrievePosts();
  }, []);

  /**
   * * polling function that checks for new posts every 20 seconds
   */
  useEffect(() => {
    const pollingInterval = setInterval(async () => {
      const latestPostTime = get(posts, "0.createdAt");

      if (latestPostTime) {
        const res = await axiosInstance.get("/posts/has_new_posts/", {
          params: { time: latestPostTime },
        });

        const hasNewPosts = get(res, "data.hasNewPosts");

        if (hasNewPosts) {
          setCanLoadNewPosts(true);
        }
      }
    }, 20 * 1000);

    return () => clearInterval(pollingInterval);
  });

  /**
   * * function that retrieves new posts when new posts floating button is clicked on
   */
  useEffect(() => {
    async function fetchPosts() {
      if (clickedLoadNewPosts) {
        const postsRes = await axiosInstance.get("/posts/", {
          params: { page: 1 },
        });

        const newPosts = get(postsRes, "data.results");
        const hasMoreFollowPosts = !!get(postsRes, "data.next");

        setPosts(newPosts);
        setPage(hasMoreFollowPosts ? 2 : 1);
        setCanLoadNewPosts(false);
        setClickedLoadNewPosts(false);
        setHasMoreFollowPosts(hasMoreFollowPosts);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }

    fetchPosts();
  }, [clickedLoadNewPosts]);

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

        {canLoadNewPosts && (
          <div className="load-new-posts-button" onClick={loadNewPosts}>
            Load new posts
          </div>
        )}
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
