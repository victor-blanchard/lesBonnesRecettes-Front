import styles from "../styles/Home.module.css";
import {
  Skeleton,
  Card,
  Button,
  Input,
  Divider,
  Avatar,
  Dropdown,
  Space,
  Spin,
  Flex,
  Radio,
} from "antd";
import {
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { setRecipesToDisplay } from "../reducers/recipes";

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const recipesToDisplay = useSelector((state) => state.recipes?.recipesToDisplay?.recipes || []);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryToDisplay, setCategoryToDisplay] = useState("");
  const [searchToDisplay, setSearchToDisplay] = useState("");

  const onSearch = async (category, search) => {
    setCategoryToDisplay(category);
    setSearchToDisplay(search);
    console.log(categoryToDisplay, searchToDisplay);
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recipes/?category=${category}&search=${search}`
    );
    setTimeout(() => {
      setIsLoading(false);

      console.log("1 seconde plus tard...");
    }, 300);
    if (response.ok) {
      const data = await response.json();
      dispatch(
        setRecipesToDisplay({
          recipes: data.recipes || data, // S'assurer que nous avons un tableau
          filters: {
            category: category,
            search: search,
          },
        })
      );
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    onSearch(categoryToDisplay, searchToDisplay);
    console.log(" useEffect");
  }, []);

  return (
    <div>
      <main className={styles.main}>
        <Header showBackButton={false} />

        {/* Contenu principal avec padding pour le Header flottant */}
        <div className={styles.mainContent}>
          <div className={styles.searchTab}>
            <SearchOutlined className={styles.searchIcon} />
            <Input
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
            <Radio.Group defaultValue={categoryToDisplay} buttonStyle="solid">
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
            {/* <Button
              type={categoryToDisplay === "Starter" ? "active" : "default"}
              active={categoryToDisplay === "Starter"}
              className={styles.filterButton}
              onClick={() => onSearch("Starter", searchToDisplay)}
              shape="round"
            >
              Entrées
            </Button>
            <Button
              type={categoryToDisplay === "Main" ? "active" : "default"}
              active={categoryToDisplay === "Main"}
              className={styles.filterButton}
              onClick={() => onSearch("Main", searchToDisplay)}
              shape="round"
            >
              Plats
            </Button>
            <Button
              type={categoryToDisplay === "Desert" ? "primary" : "default"}
              active={categoryToDisplay === "Desert"}
              className={styles.filterButton}
              primaryColor={styles.colorPrimary}
              onClick={() => onSearch("Desert", searchToDisplay)}
              shape="round"
            >
              Desserts
            </Button>
            <Button
              type={categoryToDisplay === "Drink" ? "primary" : "default"}
              className={styles.filterButton}
              onClick={() => onSearch("Drink", searchToDisplay)}
              shape="round"
            >
              Boissons
            </Button>
            <Button
              type={categoryToDisplay === "" ? "active" : "default"}
              active={categoryToDisplay === ""}
              className={styles.filterButton}
              onClick={() => onSearch("", searchToDisplay)}
              shape="round"
            >
              Toutes
            </Button> */}
          </div>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              {Array.from({ length: 9 }).map((_, index) => (
                <div className={styles.card}>
                  <div style={{ padding: "1rem" }}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className={styles.recipesNumber}>
                {Array.isArray(recipesToDisplay) ? recipesToDisplay.length : 0} recette
                {recipesToDisplay.length > 1 ? "s" : ""} trouvée
                {recipesToDisplay.length > 1 ? "s" : ""}
              </p>
              <div className={styles.recipesGrid}>
                {Array.isArray(recipesToDisplay) &&
                  recipesToDisplay.map((recipe) => {
                    return (
                      <div
                        key={recipe._id}
                        className={styles.card}
                        onClick={() => router.push(`/recette/${recipe._id}`)}
                      >
                        <img className={styles.cardImage} alt="recipe" src={recipe.picture} />
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
