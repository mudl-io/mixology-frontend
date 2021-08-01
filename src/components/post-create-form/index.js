import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { get } from "lodash";
import { NotificationManager } from "react-notifications";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";
import SearchBar from "../search-bar";

const PostCreateForm = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCocktailId, setSelectedCocktailId] = useState(null);
  const user = useSelector((state) => state.users.user);

  const searchCreatedCocktails = async (queryTerm) => {
    const searchRes = await axiosInstance.get("/cocktails/", {
      params: {
        action: "search",
        username: user.username,
        search_value: queryTerm,
      },
    });

    const cocktails = get(searchRes, "data.results") || [];

    const formattedCocktails = cocktails.map((cocktail) => {
      return { value: cocktail, label: cocktail.name };
    });

    return formattedCocktails;
  };

  const submitPost = async () => {
    const isValid = validatePost();

    try {
      if (!isValid) {
        throw new Error();
      }

      await axiosInstance.post("/posts/", {
        title,
        description,
        cocktail_id: selectedCocktailId,
      });
    } catch (e) {
      NotificationManager.error(
        "There was an error submitting your post, please sure you fill out at least one of the fields!",
        "Creation Error",
        2000
      );
    }
  };

  const validatePost = () => {
    const hasTitle = title.length > 0;
    const hasDescription = description.length > 0;
    const hasCocktail = selectedCocktailId;

    return hasTitle || hasDescription || hasCocktail;
  };

  return (
    <div className="post-create-form">
      <div className="inputs-container">
        <TextField
          label="Title"
          name="postTitle"
          value={title}
          variant="outlined"
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          multiline
          label="Description"
          name="description"
          value={description}
          variant="outlined"
          minRows={4}
          maxRows={4}
          onChange={(event) => setDescription(event.target.value)}
        />
        <SearchBar
          placeholder="Add one of your cocktails"
          loadOptions={(queryTerm) => searchCreatedCocktails(queryTerm)}
          handleSelect={(selectedCocktail) =>
            setSelectedCocktailId(selectedCocktail.value.publicId)
          }
        />
        <Button
          className="post-submit-button"
          variant="contained"
          onClick={submitPost}
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};

export default PostCreateForm;
