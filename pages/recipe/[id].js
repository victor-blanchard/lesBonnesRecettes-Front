import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styles from "../../styles/Recette.module.css";
import { Button, Avatar, message, Spin, Modal } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FireOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import { formatDate } from "../../utils/formatDate";
import { useDispatch } from "react-redux";
import { setLikedRecipes } from "../../reducers/users";
import { toggleLike } from "../../utils/toggleLike";

function Recipe() {
  const router = useRouter();
  const [recipeId, setRecipeId] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = useSelector((state) => state.users.value.userId);
  const userLikedRecipes = useSelector((state) => state.users.value.likedRecipes);
  const dispatch = useDispatch();
  const handleDataFetch = async (id) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
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
      setRecipeId(recipeId);
      handleDataFetch(recipeId);
      if (userLikedRecipes.includes(recipeId)) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [router.query.id, userLikedRecipes, userId]);

  const handleFavorite = async () => {
    const newState = await toggleLike({
      recipeId,
      userId,
      userLikedRecipes,
      dispatch,
      setLikedRecipes,
      router,
    });
    setIsFavorite(newState);
  };
  const handleEdit = () => {
    router.push(`/recipe/edit/${recipeId}`);
  };
  const handleDeleteRecipe = () => {
    Modal.confirm({
      title: "Supprimer la recette",
      content: "Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible.",
      okText: "Oui",
      cancelText: "Non",
      onOk: async () => {
        try {
          const response = await fetch(`/api/recipes/${recipeId}`, {
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
      },
    });
  };

  const handleShare = async () => {
    try {
      if (!recipe) return;
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Découvrez cette délicieuse recette : ${recipe.title}`,
          url: window.location.href,
        });
        return;
      }
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        message.success("Lien copié dans le presse-papiers !");
      }
    } catch (error) {
      // L'utilisateur peut annuler le partage : ne pas afficher d'erreur dans ce cas
      if (
        error &&
        (error.name === "AbortError" ||
          String(error.message || "")
            .toLowerCase()
            .includes("share canceled"))
      ) {
        return; // annulation silencieuse
      }
      message.error("Impossible de partager ce contenu");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.main}>
        <Spin indicator={<LoadingOutlined className={styles.recipeSpin} spin />} size="large" />
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className={styles.main}>
      {/* Header avec bouton retour */}
      <Header showBackButton={false} />

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
            {recipe.isDraft !== true && (
              <>
                {isFavorite ? (
                  <HeartFilled
                    className={`${styles.heartButton} ${styles.heartActive}`}
                    aria-label="Retirer des favoris"
                    onClick={handleFavorite}
                  />
                ) : (
                  <HeartOutlined
                    className={styles.heartButton}
                    aria-label="Ajouter aux favoris"
                    onClick={handleFavorite}
                  />
                )}
                <ShareAltOutlined
                  className={styles.shareButton}
                  aria-label="Partager la recette"
                  onClick={handleShare}
                />
              </>
            )}

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
                  Modifier
                </Button>
              )}
              {recipe.author?._id === userId && (
                <Button
                  icon={<DeleteOutlined />}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={handleDeleteRecipe}
                >
                  Supprimer
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
