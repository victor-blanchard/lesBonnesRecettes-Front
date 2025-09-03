import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Checkbox, message, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import Header from "../components/Header";
import styles from "../styles/Connexion.module.css";
import { useDispatch } from "react-redux";
import { userIsConnected } from "../reducers/users";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signUp`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(payload),
//   credentials: "include",
// });

function Connexion() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
          // message.success("Connexion réussie !");
          dispatch(userIsConnected(true));
          router.push("/");
        } else {
          if (response.status === 401) {
            message.error("Email ou mot de passe incorrect !");
          } else {
            message.error("Connexion échouée !");
          }
        }
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signUp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName }),
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Inscription:", data);
          message.success("Inscription réussie !");
          dispatch(userIsConnected(true));
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

            {isLogin && (
              <Form.Item className={styles.rememberMe}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Se souvenir de moi</Checkbox>
                </Form.Item>
                <a className={styles.forgotPassword} href="#">
                  Mot de passe oublié ?
                </a>
              </Form.Item>
            )}

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

          <Divider className={styles.divider}>
            <span className={styles.dividerText}>ou</span>
          </Divider>

          <div className={styles.socialButtons}>
            <Button size="large" className={styles.socialButton} block>
              Continuer avec Google
            </Button>
          </div>

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
