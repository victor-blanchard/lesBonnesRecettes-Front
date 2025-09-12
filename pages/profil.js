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
  FileOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { userIsConnected, setUserId } from "../reducers/users";
import { useEffect } from "react";

const { TextArea } = Input;

function Profil() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.value.userId);
  const userConnected = useSelector((state) => state.users.value.userIsConnected);
  const { userAuthorized } = useAuthGuard();
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRecipes, setUserRecipes] = useState([]);
  const [form] = Form.useForm();
  const [profileData, setProfileData] = useState({});
  const [userDrafts, setUserDrafts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, recipesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/user/${userId}`),
        ]);
        const [profileData, recipesData] = await Promise.all([
          profileResponse.json(),
          recipesResponse.json(),
        ]);
        setProfileData(profileData.user);
        const publishedRecipes = recipesData.recipes?.filter((recipe) => recipe.isDraft === false);
        setUserRecipes(publishedRecipes);
        const drafts = recipesData.recipes?.filter((recipe) => recipe.isDraft === true);
        setUserDrafts(drafts);
        console.log(profileData, recipesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleEditProfile = () => {
    form.setFieldsValue({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
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

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Supprimer le compte",
      content:
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible. Vous perdrez toutes vos recettes et brouillons.",
      okText: "Oui",
      cancelText: "Non",
      onOk: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delete`, {
            method: "DELETE",
            credentials: "include",
          });

          // Transformer la réponse en JSON
          const data = await response.json();
          console.log("response data: ", data);

          if (data.result) {
            dispatch(userIsConnected(false));
            dispatch(setUserId(null));
            message.success("Compte supprimé avec succès");
            router.push("/");
          } else {
            message.error(data.error || "Erreur lors de la suppression du compte");
          }
        } catch (error) {
          console.error("Error deleting account:", error);
          message.error("Erreur lors du fetch");
        }
      },
    });
  };

  const renderRecipeCard = (recipe) => (
    <div
      key={recipe._id}
      className={styles.recipeCard}
      onClick={() => router.push(`/recipe/${recipe._id}`)}
    >
      <img
        src={
          recipe.picture ||
          "https://res.cloudinary.com/dzo3ce7sk/image/upload/v1757608839/recipes/cdykphwryn5ktv9rwewq.jpg"
        }
        alt={recipe.title}
        className={styles.recipeImage}
      />
      <div className={styles.recipeInfo}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        <div className={styles.recipeTime}>
          <ClockCircleOutlined />
          {recipe.duration}
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
              src={profileData?.profilePicture}
              icon={<UserOutlined />}
              className={styles.profileAvatar}
            />
            <h2 className={styles.profileName}>
              {profileData?.firstName} {profileData?.lastName}
            </h2>
            <p className={styles.profileEmail}>{profileData?.email}</p>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "1rem" }}></p>
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
              <div className={styles.statNumber}>{userRecipes?.length}</div>
              <div className={styles.statLabel}>Recette{userRecipes?.length > 1 ? "s" : ""}</div>
            </div>
            {/* <div className={styles.statItem}>
              <div className={styles.statNumber}>{profileData.likedRecipes.length}</div>
              <div className={styles.statLabel}>Favoris</div>
            </div> */}
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{userDrafts?.length}</div>
              <div className={styles.statLabel}>Brouillon{userDrafts?.length > 1 ? "s" : ""}</div>
            </div>
          </div>

          {/* Section mes recettes  */}
          <h3 className={styles.sectionTitle}>
            <BookOutlined style={{ marginRight: "0.5rem" }} />
            Mes Recettes
          </h3>

          {userRecipes?.length > 0 ? (
            <div className={styles.recipesGrid}>{userRecipes?.map(renderRecipeCard)}</div>
          ) : (
            <div className={styles.emptyState}>
              <h3>Aucune recette</h3>
              <p>On attend votre première recette !</p>
              <Button
                type="primary"
                size="large"
                style={{ marginTop: "1rem" }}
                onClick={() => router.push("/recipe/create")}
              >
                Créer une recette
              </Button>
            </div>
          )}
          {/* Section Bouillons */}
          <h3 className={styles.sectionTitle}>
            <FileOutlined style={{ marginRight: "0.5rem" }} />
            Mes Brouillons
          </h3>

          {userDrafts?.length > 0 ? (
            <div className={styles.recipesGrid}>{userDrafts?.map(renderRecipeCard)}</div>
          ) : (
            <div className={styles.emptyState}>
              <h3>Aucun brouillon</h3>
            </div>
          )}

          {/* Bouton de suppression de compte */}
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            className={styles.logoutButton}
            onClick={handleDeleteAccount}
          >
            Supprimer le compte
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
            name="firstName"
            label="Prénom"
            rules={[{ required: true, message: "Veuillez saisir votre prénom" }]}
          >
            <Input value={profileData?.firstName} placeholder="Votre prénom" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Nom"
            rules={[{ required: true, message: "Veuillez saisir votre nom" }]}
          >
            <Input value={profileData?.lastName} placeholder="Votre nom complet" />
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
