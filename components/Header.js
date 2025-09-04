import { useRouter } from "next/router";
import { Button, Dropdown, Space } from "antd";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import styles from "../styles/Header.module.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userIsConnected, setUserId } from "../reducers/users";
import { UserOutlined } from "@ant-design/icons";

function Header({ showBackButton = false, onBackClick }) {
  const router = useRouter();
  const displayMenu = useSelector((state) => state.users.value.userIsConnected);
  const dispatch = useDispatch();
  const handleBackToHome = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signOut`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      dispatch(userIsConnected(false));
      dispatch(setUserId(null));
    }
  };

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
        <a onClick={handleLogout} rel="noopener noreferrer">
          Se déconnecter
        </a>
      ),
      key: "3",
    },
  ];

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
      {displayMenu ? (
        <Dropdown
          className={styles.dropdown}
          placement="bottomLeft"
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
      ) : (
        <Dropdown
          className={styles.dropdown}
          placement="bottomLeft"
          menu={{
            items: [
              {
                label: (
                  <a href="/connexion" rel="noopener noreferrer">
                    Se connecter
                  </a>
                ),
                key: "0",
              },
            ],
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <MenuOutlined className={styles.topIcon} />
            </Space>
          </a>
        </Dropdown>
      )}
    </div>
  );
}

export default Header;
