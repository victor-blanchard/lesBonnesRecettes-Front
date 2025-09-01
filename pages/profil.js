import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Profil.module.css";
import { Button, Avatar, Divider, Switch, Modal, Form, Input, message, Skeleton } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Header from "../components/Header";

const { TextArea } = Input;

function Profil() {
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  // Données fictives du profil (à remplacer par des données réelles)
  const [profileData, setProfileData] = useState({
    name: "Jeff Dupont",
    email: "jeff.dupont@email.com",
    avatar: "/alf.jpg",
    bio: "Passionné de cuisine depuis toujours. J'aime partager mes recettes et découvrir de nouveaux plats.",
    recipesCount: 15,
    favoritesCount: 8,
    totalTime: "12h 30m",
  });

  // Données fictives des recettes (à remplacer par des données réelles)
  const [userRecipes] = useState([
    {
      id: 1,
      title: "Carrot Cake",
      time: "30 mins",
      image: "/carrotCake.jpeg",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Biscuit Cake",
      time: "45 mins",
      image: "/carrotCake.jpeg",
      isFavorite: false,
    },
    {
      id: 3,
      title: "Velo Cake",
      time: "60 mins",
      image: "/carrotCake.jpeg",
      isFavorite: true,
    },
  ]);

  const handleBack = () => {
    router.push("/");
  };

  const handleEditProfile = () => {
    form.setFieldsValue({
      name: profileData.name,
      email: profileData.email,
      bio: profileData.bio,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async (values) => {
    setIsLoading(true);
    try {
      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfileData((prev) => ({
        ...prev,
        name: values.name,
        email: values.email,
        bio: values.bio,
      }));

      message.success("Profil mis à jour avec succès !");
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Se déconnecter",
      content: "Êtes-vous sûr de vouloir vous déconnecter ?",
      okText: "Oui",
      cancelText: "Non",
      onOk: () => {
        message.success("Déconnexion réussie");
        router.push("/");
      },
    });
  };

  const renderRecipeCard = (recipe) => (
    <div key={recipe.id} className={styles.recipeCard}>
      <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
      <div className={styles.recipeInfo}>
        <h3 className={styles.recipeTitle}>{recipe.title}</h3>
        <div className={styles.recipeTime}>
          <ClockCircleOutlined />
          {recipe.time}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.header}>
          <Header showBackButton={true} />
          <div className={styles.topHeader}>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Mon Profil</h1>
            <div style={{ width: 48 }}></div> {/* Spacer pour centrer le titre */}
          </div>

          {/* Section profil */}
          <div className={styles.profileSection}>
            <Avatar
              size={120}
              src={profileData.avatar}
              icon={<UserOutlined />}
              className={styles.profileAvatar}
            />
            <h2 className={styles.profileName}>{profileData.name}</h2>
            <p className={styles.profileEmail}>{profileData.email}</p>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "1rem" }}>
              {profileData.bio}
            </p>
            <Button
              type="default"
              icon={<EditOutlined />}
              className={styles.editButton}
              onClick={handleEditProfile}
            >
              Modifier le profil
            </Button>
          </div>

          {/* Section statistiques */}
          <div className={styles.statsSection}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{profileData.recipesCount}</div>
              <div className={styles.statLabel}>Recettes créées</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{profileData.favoritesCount}</div>
              <div className={styles.statLabel}>Favoris</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{profileData.totalTime}</div>
              <div className={styles.statLabel}>Temps total</div>
            </div>
          </div>

          {/* Section mes recettes */}
          <h3 className={styles.sectionTitle}>
            <BookOutlined style={{ marginRight: "0.5rem" }} />
            Mes Recettes
          </h3>

          {userRecipes.length > 0 ? (
            <div className={styles.recipesGrid}>{userRecipes.map(renderRecipeCard)}</div>
          ) : (
            <div className={styles.emptyState}>
              <PlusOutlined className={styles.emptyStateIcon} />
              <h3>Aucune recette créée</h3>
              <p>Commencez par créer votre première recette !</p>
              <Button type="primary" size="large" style={{ marginTop: "1rem" }}>
                Créer une recette
              </Button>
            </div>
          )}

          {/* Section paramètres */}
          <h3 className={styles.sectionTitle}>
            <SettingOutlined style={{ marginRight: "0.5rem" }} />
            Paramètres
          </h3>

          <div className={styles.settingsSection}>
            {/* <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Notifications push</span>
              <Switch defaultChecked />
            </div> */}
            {/* <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Notifications email</span>
              <Switch defaultChecked />
            </div> */}
            {/* <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Mode sombre</span>
              <Switch />
            </div> */}
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Langue</span>
              <span className={styles.settingValue}>Français</span>
            </div>
          </div>

          {/* Bouton de déconnexion */}
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </div>
      </main>

      {/* Modal d'édition du profil */}
      <Modal
        title="Modifier le profil"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProfile}>
          <Form.Item
            name="name"
            label="Nom complet"
            rules={[{ required: true, message: "Veuillez saisir votre nom" }]}
          >
            <Input placeholder="Votre nom complet" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez saisir votre email" },
              { type: "email", message: "Veuillez saisir un email valide" },
            ]}
          >
            <Input placeholder="votre.email@example.com" />
          </Form.Item>

          <Form.Item name="bio" label="Bio">
            <TextArea rows={4} placeholder="Parlez-nous un peu de vous..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button style={{ marginRight: 8 }} onClick={() => setIsEditModalVisible(false)}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Sauvegarder
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Profil;
