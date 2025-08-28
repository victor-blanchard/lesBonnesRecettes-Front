import styles from "../styles/Home.module.css";
import { Skeleton, Card, Button, Input, Divider, Avatar, Dropdown, Space } from "antd";
import {
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
// const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const items = [
  {
    label: (
      <a href="/creer-recette" rel="noopener noreferrer">
        Ajouter une recette
      </a>
    ),
    key: "0",
  },
  {
    label: (
      <a href="/profil" rel="noopener noreferrer">
        Mon profil
      </a>
    ),
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: (
      <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">
        Se déconnecter
      </a>
    ),
    key: "3",
  },
];

const { Meta } = Card;

function Home() {
  const router = useRouter();

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.topHeader}>
            <img className={styles.avatar} alt="avatar" src="alf.jpg" />

            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <MenuOutlined className={styles.topIcon} />
                </Space>
              </a>
            </Dropdown>
          </div>

          <h1 className={styles.title}>On cuisine quoi aujourd'hui ?</h1>

          <div className={styles.searchTab}>
            <SearchOutlined className={styles.searchIcon} />
            <Input
              className={styles.search}
              placeholder="Recherche une recette..."
              allowClear
              variant="borderless"
              onSearch={onSearch}
            />
          </div>

          <Divider className={styles.divider} />

          <div className={styles.filtersTab}>
            <Button className={styles.filterButton} shape="round">
              Tout
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
        </div>
        <div className={styles.container}>
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
