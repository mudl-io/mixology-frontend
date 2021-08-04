import { useState, useRef, useEffect } from "react";
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
  const componentRef = useRef(null);

  // attach onClick listener in a componentDidMount and componentDidUnmount fashion
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, false);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
    };
  });

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      props.onClose();
    }
  };

  const searchCreatedCocktails = async (queryTerm) => {
    if (queryTerm.length < 3) return;

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

      NotificationManager.success(
        "Your post was successfully created! Your followers should see it shortly.",
        "Creation Success",
        2000
      );

      props.onClose();
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
    <div className="post-create-form" ref={componentRef}>
      <div className="inputs-container">
        <TextField
          className="title input"
          label="Title"
          name="postTitle"
          value={title}
          variant="outlined"
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          multiline
          className="description input"
          label="Description"
          name="description"
          value={description}
          variant="outlined"
          minRows={5}
          maxRows={5}
          onChange={(event) => setDescription(event.target.value)}
        />
        <SearchBar
          placeholder="Add a cocktail"
          styles={{
            container: (provided) => ({ ...provided, height: 56 }),
            control: (provided) => ({ ...provided, height: 56 }),
          }}
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
