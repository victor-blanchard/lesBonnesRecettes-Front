import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/NewRecipe.module.css";
import { Button, Input, Form, Upload, message, Modal, Select, Radio, Skeleton } from "antd";
import {
  ArrowLeftOutlined,
  HomeOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Header from "../components/Header";

function CreerRecette() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([""]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gestion des ingrédients dynamiques
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };
  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "" }]);
  const removeIngredient = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Gestion des étapes dynamiques (sans drag & drop)
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Upload d'image (mock, pas d'upload réel)
  const handleImageChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target.result);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // Enregistrement (mock)
  const handleSave = async (isDraft = false) => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // Simuler l'enregistrement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(isDraft ? "Brouillon enregistré !" : "Recette enregistrée !");
      router.push("/");
    } catch (err) {
      if (!isDraft) message.error("Veuillez remplir tous les champs obligatoires.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.back();
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const { Option } = Select;
  return (
    <div className={styles.main}>
      <div className={styles.pageContainer}>
        <Header showBackButton={true} />

        <div className={styles.topHeader}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Nouvelle Recette</h1>
          <div style={{ width: 48 }}></div>
        </div>
        <div className={styles.formContainer}>
          <Form form={form} layout="vertical" initialValues={{ title: "", description: "" }}>
            <Form.Item
              label="Titre de la recette"
              name="title"
              rules={[{ required: true, message: "Le titre est obligatoire" }]}
            >
              <Input placeholder="Ex : Gâteau au chocolat" className={styles.titleInput} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "La description est obligatoire" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Décrivez brièvement la recette..."
                className={styles.descriptionInput}
              />
            </Form.Item>
            <div className={styles.upload}>
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageChange}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Ajouter une image</Button>
              </Upload>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="aperçu recette"
                  style={{
                    marginTop: 16,
                    maxWidth: "100%",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                />
              )}
            </div>
            <div className={styles.sectionTitle}>Temps de préparation</div>
            <div className={styles.timeContainer}>
              <Radio.Group buttonStyle="solid" className={styles.timeRadio}>
                <Radio.Button className={styles.timeRadioButton} value="fast">
                  Rapide
                </Radio.Button>
                <Radio.Button className={styles.timeRadioButton} value="medium">
                  Moyen
                </Radio.Button>
                <Radio.Button className={styles.timeRadioButton} value="long">
                  Long
                </Radio.Button>
              </Radio.Group>
            </div>
            <div className={styles.sectionTitle}>
              Ingrédients
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.addButton}
                onClick={addIngredient}
                size="small"
              >
                Ajouter
              </Button>
            </div>
            <div className={styles.ingredientList}>
              {ingredients.map((ingredient, idx) => (
                <div key={idx} className={styles.ingredientItem}>
                  <Input
                    className={styles.ingredientInput}
                    placeholder="Nom de l'ingrédient"
                    value={ingredient.name}
                    type="text"
                    onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                  />
                  <Input
                    className={styles.ingredientInput}
                    placeholder="Quantité (ex : 200g)"
                    value={ingredient.quantity}
                    type="number"
                    onChange={(e) => handleIngredientChange(idx, "quantity", e.target.value)}
                    rules={[{ type: "number", message: "Veuillez entrer une quantité valide" }]}
                    inputMode="numeric"
                    min={0}
                  />

                  <Select
                    className={styles.ingredientSelect}
                    defaultValue="gr"
                    style={{ width: 100 }}
                    onChange={handleChange}
                    options={[
                      { value: "gr", label: "gr" },
                      { value: "cl", label: "cl" },
                      { value: "ml", label: "ml" },
                      { value: "càs", label: "càs" },
                      { value: "càc", label: "càc" },
                      { value: "unité", label: "unité" },
                    ]}
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => removeIngredient(idx)}
                    type="button"
                    aria-label="Supprimer l'ingrédient"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.sectionTitle}>
              Étapes
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.addButton}
                onClick={addStep}
                size="small"
              >
                Ajouter
              </Button>
            </div>
            <div className={styles.stepList}>
              {steps.map((step, idx) => (
                <div key={idx} className={styles.stepItem}>
                  <Input.TextArea
                    className={styles.stepInput}
                    placeholder={`Étape ${idx + 1}`}
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => removeStep(idx)}
                    type="button"
                    aria-label="Supprimer l'étape"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.actionButtons}>
              <Button
                className={styles.draftButton}
                onClick={() => handleSave(true)}
                loading={loading}
              >
                Enregistrer en brouillon
              </Button>
              <Button
                type="primary"
                className={styles.saveButton}
                onClick={() => handleSave(false)}
                loading={loading}
              >
                Enregistrer la recette
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreerRecette;
