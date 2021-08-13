import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { motion, AnimatePresence } from "framer-motion";
import { get } from "lodash";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";
import PostCreateForm from "../post-create-form";
import PostDisplay from "../post-display";

const Timeline = () => {
  const [showPostCreateForm, setShowPostCreateForm] = useState(false);
  const [posts, setPosts] = useState([]);

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

  const retrievePosts = async () => {
    try {
      const postsRes = await axiosInstance.get("/posts/");
      const posts = get(postsRes, "data.results");

      setPosts(posts);
    } catch (e) {}
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
      <div className="timeline">
        <Button
          className="create-post-button"
          variant="contained"
          onClick={() => setShowPostCreateForm(true)}
        >
          Create Post
        </Button>

        <div className="animation-container">
          <AnimatePresence>
            {showPostCreateForm && (
              <motion.div
                animate={{ x: 35, y: 65 }}
                transition={{
                  x: { type: "spring", stiffness: 50 },
                  default: { duration: 0.4 },
                }}
                exit={{ opacity: 0 }}
              >
                <PostCreateForm onClose={() => setShowPostCreateForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="posts-list">{postList()}</div>
      </div>
    </div>
  );
};

export default Timeline;
