import { combineReducers } from "redux";

import usersReducer from "../features/users/usersSlice";
import liquorsReducer from "../features/liquors/liquorsSlice";
import defaultLiquorsReducer from "../features/liquors/defaultLiquorsSlice";
import ingredientsReducer from "../features/ingredients/ingredientsSlice";
import savedCocktailsReducer from "../features/saved-cocktails/savedCocktailsSlice";
import cocktailsByLiquorReducer from "../features/cocktails-by-liquor/cocktailsByLiquorSlice";
import createdCocktailsReducer from "../features/created-cocktails/createdCocktailsSlice";

export default combineReducers({
  users: usersReducer,
  liquors: liquorsReducer,
  ingredients: ingredientsReducer,
  savedCocktails: savedCocktailsReducer,
  cocktailsByLiquor: cocktailsByLiquorReducer,
  createdCocktails: createdCocktailsReducer,
  defaultLiquors: defaultLiquorsReducer,
});
