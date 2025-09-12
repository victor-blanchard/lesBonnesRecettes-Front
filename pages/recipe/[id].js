import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styles from "../../styles/Recette.module.css";
import { Button, Avatar, Divider, message, Skeleton, Modal, Dropdown, Space } from "antd";
import {
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FireOutlined,
  StarOutlined,
  BulbOutlined,
  MenuOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import { formatDate } from "../../../utils/formatDate";
import { useDispatch } from "react-redux";
import { setLikedRecipes } from "../../reducers/users";

function Recipe() {
  const router = useRouter();
  const [recipeId, setRecipeId] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [picture, setPicture] = useState(null);
  const userId = useSelector((state) => state.users.value.userId);
  const userLikedRecipes = useSelector((state) => state.users.value.likedRecipes);
  const dispatch = useDispatch();
  const handleDataFetch = async (id) => {
    try {
      console.log("id", id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRecipe(data.recipe);
        setIsLoading(false);
      } else {
        throw new Error("Recette introuvable");
      }
    } catch (error) {
      message.error("Recette introuvable");
      router.push("/");
    }
  };

  useEffect(() => {
    if (router.query.id) {
      const recipeId = router.query.id;
      console.log("recipeId", recipeId);
      setRecipeId(recipeId);
      handleDataFetch(recipeId);
      if (userLikedRecipes.includes(recipeId)) {
        setIsFavorite(true);
      }
    }
  }, [router.query.id, userLikedRecipes, userId]);

  const handleFavorite = async () => {
    console.log("recipeId", recipeId);
    if (!userId) {
      message.error("Vous devez être connecté pour ajouter une recette à vos favoris");
      router.push("/connexion");
      return;
    }
    if (isFavorite) {
      dispatch(setLikedRecipes(userLikedRecipes.filter((id) => id !== recipeId)));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/likeRecipe`, {
        method: "POST",
        body: JSON.stringify(recipeId),
        credentials: "include",
      });
      if (!response.ok) {
        message.error("Impossible de retirer la recette des favoris");
        return;
      }
    } else {
      if (userLikedRecipes.length === 0) {
        dispatch(setLikedRecipes([recipeId]));
      } else {
        dispatch(setLikedRecipes([...userLikedRecipes, recipeId]));
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/likeRecipe`, {
        method: "POST",
        body: JSON.stringify(recipeId),
        credentials: "include",
      });
      if (!response.ok) {
        message.error("Impossible d'ajouter la recette aux favoris");
        return;
      }
    }
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };
  const handleEdit = () => {
    router.push(`/recipe/edit/${recipeId}`);
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        message.success("Recette supprimée avec succès");
        router.push("/profil");
      } else {
        message.error("Impossible de supprimer la recette");
      }
    } catch (error) {
      message.error("Impossible de supprimer la recette");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Découvrez cette délicieuse recette : ${recipe.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
      message.success("Lien copié dans le presse-papiers !");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.main}>
        <div className={styles.pageContainer}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className={styles.main}>
      {/* Header avec bouton retour */}
      <Header showBackButton={true} />

      <div className={styles.pageContainer}>
        {/* Container principal de la recette */}
        <div className={styles.recipeContainer}>
          <div className={styles.recipeHero}>
            {recipe.isDraft && (
              <div className={styles.draftBadge}>
                <span>Brouillon</span>
              </div>
            )}
            <img
              src={
                recipe.picture ||
                "https://res.cloudinary.com/dzo3ce7sk/image/upload/v1757608839/recipes/cdykphwryn5ktv9rwewq.jpg"
              }
              alt={recipe.name}
              className={styles.recipeImage}
            />
            <div className={styles.recipeOverlay}>
              <h1 className={styles.recipeTitle}>{recipe.name}</h1>
              <div className={styles.recipeMeta}>
                <span>
                  <ClockCircleOutlined /> {recipe.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu de la recette */}
          <div className={styles.recipeContent}>
            {/* Description */}
            <p className={styles.recipeDescription}>{recipe.description}</p>

            {/* <div className={styles.recipeStats}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{recipe.duration}</div>
                <div className={styles.statLabel}>Préparation</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{recipe.stats.cookTime}</div>
                <div className={styles.statLabel}>Cuisson</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{recipe.stats.totalTime}</div>
                <div className={styles.statLabel}>Total</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{recipe.stats.difficulty}</div>
                <div className={styles.statLabel}>Difficulté</div>
              </div>
            </div> */}

            {/* Actions */}
            <div className={styles.actionsSection}>
              <Button
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                className={`${styles.actionButton} ${styles.favoriteButton} ${
                  isFavorite ? styles.active : ""
                }`}
                onClick={handleFavorite}
              ></Button>
              <Button
                icon={<ShareAltOutlined />}
                className={`${styles.actionButton} ${styles.shareButton}`}
                onClick={handleShare}
              >
                Partager
              </Button>
            </div>

            {/* Ingrédients */}
            <div className={styles.ingredientsSection}>
              <h3 className={styles.sectionTitle}>
                <FireOutlined />
                Ingrédients
              </h3>
              <div className={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className={styles.ingredientItem}>
                    <span className={styles.ingredientQuantity}>
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                    <span className={styles.ingredientName}>{ingredient.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className={styles.instructionsSection}>
              <h3 className={styles.sectionTitle}>
                <ClockCircleOutlined />
                Instructions
              </h3>
              <div className={styles.instructionsList}>
                {recipe.steps.map((instruction, index) => (
                  <div key={index} className={styles.instructionStep}>
                    <p className={styles.instructionText}>{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Auteur */}
            <div className={styles.authorSection}>
              <Avatar
                size={60}
                src={recipe.author?.profilePicture}
                icon={<UserOutlined />}
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <h4>{recipe.author?.firstName}</h4>
                <p>{formatDate(recipe.createdAt)}</p>
              </div>
            </div>
            <div className={styles.actionsSection}>
              {recipe.author?._id === userId && (
                <Button
                  icon={<EditOutlined />}
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={handleEdit}
                >
                  {recipe.isDraft ? "Modifier le brouillon" : "Modifier la recette"}
                </Button>
              )}
              {recipe.author?._id === userId && (
                <Button
                  icon={<DeleteOutlined />}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={handleDelete}
                >
                  {recipe.isDraft ? "Supprimer le brouillon" : "Supprimer la recette"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
