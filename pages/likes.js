import styles from "../styles/Likes.module.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setLikedRecipes } from "../reducers/users";
import { toggleLike } from "../utils/toggleLike";
import { Divider, Empty } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function Likes() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.value.userId);
  const userLikedRecipes = useSelector((state) => state.users.value.likedRecipes);
  const [likedRecipesToDisplay, setLikedRecipesToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserLikedRecipes = async () => {
    setIsLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/likedRecipes`, {
      method: "GET",
      credentials: "include",
    });
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 200);
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      if (data.user?.likedRecipes?.length > 0) {
        setLikedRecipesToDisplay(data.user.likedRecipes);
      } else {
        setLikedRecipesToDisplay([]);
      }
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUserLikedRecipes();
  }, [userLikedRecipes]);

  return (
    <div>
      <main className={styles.main}>
        <Header showBackButton={false} />

        {/* Contenu principal avec padding pour le Header flottant */}
        <div className={styles.mainContent}>
          <div className={styles.topHeader}>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Mes favoris</h1>
            <div style={{ width: 48 }}></div> {/* Spacer pour centrer le titre */}
          </div>
          <Divider className={styles.divider} />

          {/* {isLoading ? (
            <div className={styles.loadingContainer}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.card}>
                  <div style={{ padding: "1rem" }}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : ( */}
          <>
            {likedRecipesToDisplay.length > 0 ? (
              <div className={styles.recipesGrid}>
                {likedRecipesToDisplay.length > 0 ? (
                  Array.isArray(likedRecipesToDisplay) &&
                  likedRecipesToDisplay.map((recipe) => {
                    const isFavorite = userLikedRecipes.includes(recipe._id);
                    return (
                      <div
                        key={recipe._id}
                        className={styles.card}
                        onClick={() => router.push(`/recipe/${recipe._id}`)}
                      >
                        <img
                          className={styles.cardImage}
                          alt="recipe"
                          src={
                            recipe.picture ||
                            "https://res.cloudinary.com/dzo3ce7sk/image/upload/v1757608839/recipes/cdykphwryn5ktv9rwewq.jpg"
                          }
                        />
                        <button
                          className={`${styles.heartButton} ${
                            isFavorite ? styles.heartActive : ""
                          }`}
                          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                          onClick={async (e) => {
                            e.stopPropagation();
                            const newState = await toggleLike({
                              recipeId: recipe._id,
                              userId,
                              userLikedRecipes,
                              dispatch,
                              setLikedRecipes,
                              router,
                            });
                          }}
                        >
                          {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                        </button>
                        <div className={styles.cardData}>
                          <p className={styles.cardName}>{recipe.name}</p>
                          <p className={styles.cardLength}>
                            <ClockCircleOutlined /> {recipe.duration}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>
                    <Empty description="Aucune recette en favoris" />
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Empty description="Aucune recette en favoris" />
              </div>
            )}
          </>
        </div>
      </main>
    </div>
  );
}

export default Likes;
