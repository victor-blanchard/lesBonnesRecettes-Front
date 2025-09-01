import { useRouter } from "next/router";
import { Button, Dropdown, Space } from "antd";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import styles from "../styles/Header.module.css";

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

function Header({ showBackButton = false, onBackClick }) {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.topHeader}>
      {showBackButton ? (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          className={styles.backButton}
          onClick={handleBack}
        />
      ) : (
        <div className={styles.spacer}></div>
      )}

      <div className={styles.logo} onClick={handleBackToHome}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Recette</h1>
        <h1 style={{ margin: 0, fontSize: "0.7rem", fontWeight: 600 }}>®</h1>
      </div>

      <Dropdown
        className={styles.dropdown}
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
  );
}

export default Header;
