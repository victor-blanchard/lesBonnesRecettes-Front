import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
} from "@ant-design/icons";
import Header from "../../components/Header";

function Recette() {
  const router = useRouter();
  const [recipeId, setRecipeId] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [picture, setPicture] = useState(null);

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `publié le ${day} ${month} ${year}`;
  };

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
        throw new Error("Failed to fetch recipe");
      }
    } catch (error) {
      message.error("Failed to fetch recette");
      // router.push("/");
    }
  };

  useEffect(() => {
    if (router.query.id) {
      const id = router.query.id;
      console.log("recipeId", id);
      handleDataFetch(id);
    }
  }, [router.query.id]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
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
            <img
              src={
                recipe.picture ||
                "https://res.cloudinary.com/dzo3ce7sk/image/upload/v1757090943/recipes/kf2n6h2mhgddruhtqxzv.png"
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
              {/* <Button
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                className={`${styles.actionButton} ${styles.favoriteButton} ${
                  isFavorite ? styles.active : ""
                }`}
                onClick={handleFavorite}
              >
                {isFavorite ? "Favori" : "Favoris"}
              </Button> */}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recette;
