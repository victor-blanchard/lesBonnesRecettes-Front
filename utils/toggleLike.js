import { message } from "antd";

/**
 * Bascule le like d'une recette côté client + API, avec mise à jour Redux.
 * Retourne true si la recette est désormais likée, false sinon.
 */
export async function toggleLike({
  recipeId,
  userId,
  userLikedRecipes,
  dispatch,
  setLikedRecipes,
  router,
}) {
  if (!recipeId) return false;
  if (!userId) {
    message.error("Vous devez être connecté pour ajouter une recette à vos favoris");
    if (router) router.push("/connexion");
    return false;
  }

  const isCurrentlyFavorite = userLikedRecipes.includes(recipeId);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/likeRecipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId }),
      credentials: "include",
    });

    if (!response.ok) {
      if (isCurrentlyFavorite) {
        message.error("Impossible de retirer la recette des favoris");
      } else {
        message.error("Impossible d'ajouter la recette aux favoris");
      }
      return isCurrentlyFavorite;
    }

    // Mise à jour du reducer seulement si l'API répond OK
    if (isCurrentlyFavorite) {
      dispatch(setLikedRecipes(userLikedRecipes.filter((id) => id !== recipeId)));
    } else {
      dispatch(setLikedRecipes([...userLikedRecipes, recipeId]));
    }
  } catch (error) {
    message.error("Une erreur est survenue");
    return isCurrentlyFavorite;
  }

  message.success(isCurrentlyFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  return !isCurrentlyFavorite;
}
