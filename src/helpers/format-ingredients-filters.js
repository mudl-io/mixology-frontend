function formatIngredientsFilter(ingredients) {
  if (!ingredients || ingredients.length === 0) return [];

  if (typeof ingredients !== "object") {
    return JSON.stringify([ingredients]);
  }

  return JSON.stringify(ingredients.map((ingredients) => ingredients.publicId));
}

export default formatIngredientsFilter;
