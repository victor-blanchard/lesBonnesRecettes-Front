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
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recipe, setRecipe] = useState(null);

  // Données fictives des recettes (à remplacer par des données réelles)
  const recipesData = {
    1: {
      id: "1",
      title: "Carrot Cake",
      description:
        "Un délicieux gâteau aux carottes avec une texture moelleuse et un glaçage crémeux. Parfait pour les occasions spéciales ou simplement pour se faire plaisir !",
      image: "/carrotCake.jpeg",
      time: "30 mins",
      difficulty: "Facile",
      servings: 8,
      calories: 320,
      author: {
        name: "Jeff Dupont",
        avatar: "/alf.jpg",
        date: "15 Mars 2024",
      },
      stats: {
        prepTime: "15 mins",
        cookTime: "25 mins",
        totalTime: "40 mins",
        difficulty: "Facile",
      },
      ingredients: [
        { quantity: "200g", name: "farine tout usage" },
        { quantity: "2", name: "œufs" },
        { quantity: "150g", name: "sucre roux" },
        { quantity: "100ml", name: "huile végétale" },
        { quantity: "3", name: "carottes râpées" },
        { quantity: "1 c.à.c", name: "cannelle" },
        { quantity: "1/2 c.à.c", name: "bicarbonate de soude" },
        { quantity: "1 pincée", name: "sel" },
      ],
      instructions: [
        "Préchauffer le four à 180°C et beurrer un moule à cake.",
        "Dans un grand bol, mélanger la farine, le bicarbonate, la cannelle et le sel.",
        "Dans un autre bol, battre les œufs avec le sucre jusqu'à ce que le mélange soit mousseux.",
        "Ajouter l'huile et mélanger délicatement.",
        "Incorporer les carottes râpées au mélange.",
        "Ajouter progressivement les ingrédients secs en mélangeant doucement.",
        "Verser la pâte dans le moule et cuire 25-30 minutes.",
        "Laisser refroidir avant de démouler et déguster !",
      ],
      nutrition: {
        calories: 320,
        protein: "4g",
        carbs: "45g",
        fat: "15g",
        fiber: "2g",
        sugar: "25g",
      },
      tips: [
        "Utilisez des carottes fraîches et râpez-les finement pour une texture optimale.",
        "Ne pas trop mélanger la pâte pour garder le moelleux.",
        "Vous pouvez ajouter des noix ou des raisins secs pour plus de saveur.",
        "Le gâteau se conserve bien 3-4 jours dans une boîte hermétique.",
      ],
    },
    2: {
      id: "2",
      title: "Biscuit Cake",
      description:
        "Un gâteau simple et délicieux fait avec des biscuits. Idéal pour les débutants en pâtisserie !",
      image: "/carrotCake.jpeg",
      time: "45 mins",
      difficulty: "Très facile",
      servings: 6,
      calories: 280,
      author: {
        name: "Marie Martin",
        avatar: "/alf.jpg",
        date: "10 Mars 2024",
      },
      stats: {
        prepTime: "20 mins",
        cookTime: "25 mins",
        totalTime: "45 mins",
        difficulty: "Très facile",
      },
      ingredients: [
        { quantity: "300g", name: "biscuits secs" },
        { quantity: "100g", name: "beurre fondu" },
        { quantity: "200ml", name: "crème liquide" },
        { quantity: "100g", name: "chocolat noir" },
        { quantity: "2", name: "œufs" },
        { quantity: "80g", name: "sucre" },
      ],
      instructions: [
        "Écraser les biscuits en miettes fines.",
        "Mélanger avec le beurre fondu et presser dans un moule.",
        "Faire fondre le chocolat avec la crème au bain-marie.",
        "Battre les œufs avec le sucre.",
        "Mélanger le chocolat fondu avec les œufs.",
        "Verser sur la base de biscuits.",
        "Réfrigérer 2 heures avant de servir.",
      ],
      nutrition: {
        calories: 280,
        protein: "5g",
        carbs: "35g",
        fat: "18g",
        fiber: "1g",
        sugar: "20g",
      },
      tips: [
        "Utilisez des biscuits au beurre pour une base plus savoureuse.",
        "Laissez bien refroidir avant de couper.",
        "Vous pouvez décorer avec des fruits frais.",
      ],
    },
    3: {
      id: "3",
      title: "Velo Cake",
      description:
        "Un gâteau original en forme de vélo, parfait pour les anniversaires des passionnés de cyclisme !",
      image: "/carrotCake.jpeg",
      time: "60 mins",
      difficulty: "Difficile",
      servings: 12,
      calories: 350,
      author: {
        name: "Pierre Dubois",
        avatar: "/alf.jpg",
        date: "5 Mars 2024",
      },
      stats: {
        prepTime: "30 mins",
        cookTime: "30 mins",
        totalTime: "60 mins",
        difficulty: "Difficile",
      },
      ingredients: [
        { quantity: "400g", name: "farine" },
        { quantity: "4", name: "œufs" },
        { quantity: "200g", name: "sucre" },
        { quantity: "150ml", name: "lait" },
        { quantity: "100ml", name: "huile" },
        { quantity: "1 sachet", name: "levure" },
        { quantity: "2", name: "carottes" },
        { quantity: "100g", name: "chocolat" },
      ],
      instructions: [
        "Préparer la pâte en mélangeant tous les ingrédients secs.",
        "Ajouter les ingrédients liquides progressivement.",
        "Diviser la pâte en plusieurs parties pour former le vélo.",
        "Cuire chaque partie séparément.",
        "Assembler les pièces pour former un vélo.",
        "Décorer avec du glaçage coloré.",
      ],
    },
  };

  useEffect(() => {
    if (id && recipesData[id]) {
      setRecipe(recipesData[id]);
      setIsLoading(false);
    } else if (id) {
      // Recette non trouvée
      message.error("Recette non trouvée");
      router.push("/");
    }
  }, [id, router]);

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
          {/* Hero section avec image */}
          <div className={styles.recipeHero}>
            <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
            <div className={styles.recipeOverlay}>
              <h1 className={styles.recipeTitle}>{recipe.title}</h1>
              <div className={styles.recipeMeta}>
                <span>
                  <ClockCircleOutlined /> {recipe.time}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu de la recette */}
          <div className={styles.recipeContent}>
            {/* Description */}
            <p className={styles.recipeDescription}>{recipe.description}</p>

            {/* Statistiques */}
            <div className={styles.recipeStats}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{recipe.stats.prepTime}</div>
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
            </div>

            {/* Actions */}
            {/* <div className={styles.actionsSection}>
              <Button
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                className={`${styles.actionButton} ${styles.favoriteButton} ${
                  isFavorite ? styles.active : ""
                }`}
                onClick={handleFavorite}
              >
                {isFavorite ? "Favori" : "Favoris"}
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                className={`${styles.actionButton} ${styles.shareButton}`}
                onClick={handleShare}
              >
                Partager
              </Button>
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
                    <span className={styles.ingredientQuantity}>{ingredient.quantity}</span>
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
                {recipe.instructions.map((instruction, index) => (
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
                src={recipe.author.avatar}
                icon={<UserOutlined />}
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <h4>{recipe.author.name}</h4>
                <p>Publié le {recipe.author.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recette;
