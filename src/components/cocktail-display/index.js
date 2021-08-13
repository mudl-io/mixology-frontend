import React from "react";
import { Link } from "react-router-dom";
import { get } from "lodash";

import "./styles.scss";
import defaultImg from "../../assets/defaultimg.png";
import HeartCheckbox from "../heart-checkbox";
import ConfirmationModal from "../confirmation-modal";
import ProfileIcon from "../profile-icon";

class CocktailDisplay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      showDeleteConfirmation: false,
    };
  }

  showCocktailDetails = () => {
    if (this.props.name) {
      return this.cocktailDetails(this.props.cocktail);
    }
  };

  listIngredients = () => {
    if (this.props.ingredients && this.props.liquors) {
      const ingredients = [...this.props.liquors, ...this.props.ingredients];
      return (
        <ul className="ingredients-list">
          {ingredients.map((ingredient) => (
            <li key={`${ingredient.publicId}-${ingredient.name}`}>
              <span>
                {ingredient.name} - {ingredient.amount} {ingredient.unit}
              </span>
            </li>
          ))}
        </ul>
      );
    }
  };

  createdBy = () => {
    if (this.props.createdBy) {
      const createdBy = this.props.createdBy.username;
      const profilePicture = get(
        this.props.createdBy,
        "activeProfilePicture.image"
      );

      return (
        <span className="complexity stat">
          Created By:{" "}
          <Link to={`/user/${createdBy}/created-cocktails/`}>
            <ProfileIcon image={profilePicture} />
            {createdBy}
          </Link>
        </span>
      );
    }
  };

  getImage = () => {
    if (this.props.image) {
      return this.props.image.image;
    }

    return defaultImg;
  };

  toggleConfirmDelete = () => {
    this.setState({
      showDeleteConfirmation: !this.state.showDeleteConfirmation,
    });
  };

  cocktailDetails = () => {
    return (
      <div className="cocktail-details">
        <div className="img-and-stats">
          <img src={this.getImage()} alt="" />
          <h2>{this.props.name}</h2>
          <span className="heart-checkbox">
            <HeartCheckbox
              isChecked={this.props.isSaved}
              handleClick={this.props.toggleSaveCocktail}
              tabIndex="0"
            />
          </span>
          <span className="saved stat">
            Times Saved: {this.props.timesSaved}
          </span>
          <span className="complexity stat">
            Complexity: {this.props.complexity}/10
          </span>
          {this.createdBy()}
        </div>
        {this.props.userCanEdit && (
          <div className="edit-text">
            <Link to={`edit/`}>Edit</Link>
            <span className="delete-text" onClick={this.toggleConfirmDelete}>
              Delete
            </span>
          </div>
        )}
        <div>
          <h3 className="header">Description</h3>
          <p className="content">{this.props.description}</p>
        </div>
        <div className="ingredients-container">
          <h3 className="ingredients header">Ingredients</h3>
          {this.listIngredients()}
        </div>
        <div>
          <h3 className="header">Instructions</h3>
          <p className="content">{this.props.instructions}</p>
        </div>

        <ConfirmationModal
          cancelText="Cancel"
          confirmClass="deletion"
          confirmText="Delete"
          open={this.state.showDeleteConfirmation}
          question="Are you sure you want to delete this cocktail?"
          handleConfirm={this.props.deleteCocktail}
          handleClose={this.toggleConfirmDelete}
        />
      </div>
    );
  };

  render() {
    return <div>{this.showCocktailDetails()}</div>;
  }
}

export default CocktailDisplay;
