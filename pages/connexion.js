import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Checkbox, message, Divider, Upload, Image } from "antd";
import ImgCrop from "antd-img-crop";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
import Header from "../components/Header";
import styles from "../styles/Connexion.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userIsConnected, setUserId } from "../reducers/users";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signUp`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(payload),
//   credentials: "include",
// });

function Connexion() {
  const userConnected = useSelector((state) => state.users.value.userIsConnected);
  const userId = useSelector((state) => state.users.value.userId);

  useEffect(() => {
    if (userConnected === true) {
      router.push("/");
    }
  }, [userIsConnected, router]);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signIn`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        console.log("Connexion:", email, password);
        if (response.ok) {
          const data = await response.json();
          console.log("Connexion:", data);
          message.success("Connexion réussie !");
          dispatch(userIsConnected(true));
          dispatch(setUserId(data._id));
          router.push("/");
        } else {
          if (response.status === 401) {
            message.error("Email ou mot de passe incorrect !");
          } else {
            message.error("Connexion échouée !");
          }
        }
      } else {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);

        if (fileList[0]?.originFileObj) {
          formData.append("profilePicture", fileList[0].originFileObj);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signUp`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Inscription:", data);
          message.success("Inscription réussie !");
          dispatch(userIsConnected(true));
          dispatch(setUserId(data._id));
          router.push("/");
        } else {
          if (response.status === 400) {
            message.error("Email déjà utilisé !");
          } else {
            message.error("Inscription échouée !");
          }
        }
      }
    } catch (error) {
      message.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.main}>
      <Header showBackButton={false} />

      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.headerSection}>
            <h1 className={styles.title}>{isLogin ? "Connexion" : "Inscription"}</h1>
            <p className={styles.subtitle}>
              {isLogin
                ? "Connectez-vous pour accéder à vos recettes"
                : "Créez votre compte pour commencer"}
            </p>
          </div>

          <Form
            name="auth"
            className={styles.form}
            onFinish={onFinish}
            autoComplete="on"
            layout="vertical"
          >
            {!isLogin && (
              <Form.Item
                name="firstName"
                rules={[
                  {
                    required: !isLogin,
                    message: "Veuillez saisir votre prénom",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  autocomplete="given-name"
                  placeholder="Prénom"
                  size="large"
                  className={styles.input}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    console.log("Prénom:", firstName);
                  }}
                />
              </Form.Item>
            )}
            {!isLogin && (
              <Form.Item
                name="lastName"
                rules={[
                  {
                    required: !isLogin,
                    message: "Veuillez saisir votre nom",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nom"
                  autocomplete="family-name"
                  size="large"
                  className={styles.input}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    console.log("Nom:", lastName);
                  }}
                />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre email",
                },
                {
                  type: "email",
                  autocomplete: "email",
                  message: "Veuillez saisir un email valide",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
                className={styles.input}
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log("Email:", email);
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre mot de passe",
                },
                {
                  min: 6,
                  message: "Le mot de passe doit contenir au moins 6 caractères",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mot de passe"
                size="large"
                className={styles.input}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            {!isLogin && (
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: !isLogin,
                    message: "Veuillez confirmer votre mot de passe",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Les mots de passe ne correspondent pas"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirmer le mot de passe"
                  size="large"
                  className={styles.input}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            )}
            {!isLogin && (
              <Form.Item name="profilePicture" className={styles.uploadPicture}>
                <ImgCrop quality={1} aspect={1} cropShape="round">
                  <Upload
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    // beforeUpload={() => false}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </ImgCrop>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      movable: true,
                      toolbar: false,
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            )}

            {/* {isLogin && (
              <Form.Item className={styles.rememberMe}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Se souvenir de moi</Checkbox>
                </Form.Item>
                <a className={styles.forgotPassword} href="#">
                  Mot de passe oublié ?
                </a>
              </Form.Item>
            )} */}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                className={styles.submitButton}
                block
              >
                {isLogin ? "Se connecter" : "S'inscrire"}
              </Button>
            </Form.Item>
          </Form>

          {/* <Divider className={styles.divider}>
            <span className={styles.dividerText}>ou</span>
          </Divider>

          <div className={styles.socialButtons}>
            <Button size="large" className={styles.socialButton} block>
              Continuer avec Google
            </Button>
          </div> */}

          <div className={styles.switchMode}>
            <p>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button type="button" onClick={toggleMode} className={styles.switchButton}>
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
