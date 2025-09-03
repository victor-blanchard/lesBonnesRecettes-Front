import styles from "../styles/Home.module.css";
import { Skeleton, Card, Button, Input, Divider, Avatar, Dropdown, Space, Spin, Flex } from "antd";
import {
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import Header from "./Header";
// const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const { Meta } = Card;

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div>
      {isLoading && (
        <Flex align="center" gap="middle">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            spinning={isLoading}
            className={styles.loading}
          />
        </Flex>
      )}
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
              onSearch={onSearch}
            />
          </div>

          <Divider className={styles.divider} />

          <div className={styles.filtersTab}>
            <Button className={styles.filterButton} shape="round">
              Entrées
            </Button>
            <Button className={styles.filterButton} shape="round">
              Plats
            </Button>
            <Button className={styles.filterButton} shape="round">
              Desserts
            </Button>
            <Button className={styles.filterButton} shape="round">
              Boissons
            </Button>
          </div>

          <p className={styles.recipesNumber}>15 recettes trouvées</p>

          <div className={styles.recipesGrid}>
            <div className={styles.card} onClick={() => router.push("/recette/1")}>
              <img className={styles.cardImage} alt="recipe" src="carrotCake.jpeg" />
              <div className={styles.cardData}>
                <p className={styles.cardName}>Carrot cake</p>
                <p className={styles.cardLength}>
                  <ClockCircleOutlined /> 30 mins
                </p>
              </div>
            </div>
            <div className={styles.card} onClick={() => router.push("/recette/2")}>
              <img className={styles.cardImage} alt="recipe" src="carrotCake.jpeg" />
              <div className={styles.cardData}>
                <p className={styles.cardName}>Biscuit cake</p>
                <p className={styles.cardLength}>
                  <ClockCircleOutlined /> 45 mins
                </p>
              </div>
            </div>
            <div className={styles.card} onClick={() => router.push("/recette/3")}>
              <img className={styles.cardImage} alt="recipe" src="carrotCake.jpeg" />
              <div className={styles.cardData}>
                <p className={styles.cardName}>Velo cake</p>
                <p className={styles.cardLength}>
                  <ClockCircleOutlined /> 60 mins
                </p>
              </div>
            </div>
          </div>

          {/* Loading skeletons */}
          <div className={styles.loadingContainer}>
            <div className={styles.skeletonCard}>
              <Skeleton.Image active style={{ height: "200px", width: "100%" }} />
              <div style={{ padding: "1rem" }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </div>
            <div className={styles.skeletonCard}>
              <Skeleton.Image active style={{ height: "200px", width: "100%" }} />
              <div style={{ padding: "1rem" }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
