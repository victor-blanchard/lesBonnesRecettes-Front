import styles from "../styles/Home.module.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setLikedRecipes } from "../reducers/users";
import { toggleLike } from "../utils/toggleLike";
import { Skeleton, Input, Divider, Radio, Spin, ConfigProvider } from "antd";
import { SearchOutlined, ClockCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "./Header";
import { setRecipesToDisplay } from "../reducers/recipes";

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const recipesToDisplay = useSelector((state) => state.recipes?.recipesToDisplay?.recipes || []);
  const userId = useSelector((state) => state.users.value.userId);
  const userLikedRecipes = useSelector((state) => state.users.value.likedRecipes);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryToDisplay, setCategoryToDisplay] = useState("");
  const [searchToDisplay, setSearchToDisplay] = useState("");

  const onSearch = async (category, search) => {
    setCategoryToDisplay(category);
    setSearchToDisplay(search);
    setIsLoading(true);
    const response = await fetch(`/api/recipes/?category=${category}&search=${search}`);
    if (response.ok === false) {
      setIsLoading(false);
    } else {
      const data = await response.json();
      dispatch(
        setRecipesToDisplay({
          recipes: data.recipes,
          filters: {
            category: category,
            search: search,
          },
        })
      );
      setIsLoading(false);
    }
  };
  useEffect(() => {
    onSearch(categoryToDisplay, searchToDisplay);
  }, []);

  // Fonction pour rafraîchir toutes les recettes (sans filtres)
  const refreshAllRecipes = () => {
    setCategoryToDisplay("");
    setSearchToDisplay("");
    onSearch("", "");
  };

  return (
    <div>
      <main className={styles.main}>
        <Header showBackButton={false} onHomeRefresh={refreshAllRecipes} />

        {/* Contenu principal avec padding pour le Header flottant */}
        <div className={styles.mainContent}>
          <div className={styles.searchTab}>
            <SearchOutlined className={styles.searchIcon} />
            <Input
              value={searchToDisplay}
              // ref={searchInputRef}
              className={styles.search}
              placeholder="Rechercher une recette..."
              allowClear
              variant="borderless"
              onChange={(e) => setSearchToDisplay(e.target.value)}
              onPressEnter={(e) => onSearch(categoryToDisplay, searchToDisplay)}
            />
          </div>

          <Divider className={styles.divider} />

          <div className={styles.filtersTab}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#333333", // couleur principale (appliquée au bouton radio actif)
                },
              }}
            >
              <Radio.Group value={categoryToDisplay} defaultValue="" buttonStyle="solid">
                <Radio.Button onClick={() => onSearch("Starter", searchToDisplay)} value="Starter">
                  Entrées
                </Radio.Button>
                <Radio.Button onClick={() => onSearch("Main", searchToDisplay)} value="Main">
                  Plats
                </Radio.Button>
                <Radio.Button onClick={() => onSearch("Desert", searchToDisplay)} value="Desert">
                  Desserts
                </Radio.Button>
                <Radio.Button onClick={() => onSearch("Drink", searchToDisplay)} value="Drink">
                  Boissons
                </Radio.Button>
                <Radio.Button onClick={() => onSearch("", searchToDisplay)} value="">
                  Toutes
                </Radio.Button>
              </Radio.Group>
            </ConfigProvider>
          </div>
          <p className={styles.recipesNumber}>
            {isLoading ? (
              <>
                <Spin
                  indicator={<LoadingOutlined className={styles.recipesNumberSpin} spin />}
                  size="small"
                />
                <span>Patience - Ratatouille s'occupe de tout !</span>
              </>
            ) : (
              <>
                {Array.isArray(recipesToDisplay) ? recipesToDisplay.length : 0} recette
                {recipesToDisplay.length > 1 ? "s" : ""} trouvée
                {recipesToDisplay.length > 1 ? "s" : ""}
              </>
            )}
          </p>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.card}>
                  <div style={{ padding: "1rem" }}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className={styles.recipesGrid}>
                {Array.isArray(recipesToDisplay) &&
                  recipesToDisplay.map((recipe) => {
                    const isFavorite = userLikedRecipes.includes(recipe._id);
                    return (
                      <div
                        key={recipe._id}
                        className={styles.card}
                        onClick={() => router.push(`/recipe/${recipe._id}`)}
                      >
                        <Image
                          className={styles.cardImage}
                          alt="recipe"
                          src={
                            // recipe.picture ||
                            "https://res.cloudinary.com/dzo3ce7sk/image/upload/v1757608839/recipes/cdykphwryn5ktv9rwewq.jpg"
                          }
                          width={1536}
                          height={864}
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
                  })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
