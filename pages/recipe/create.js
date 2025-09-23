import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/NewRecipe.module.css";
import { Button, Input, Form, Upload, message, Select, Radio, Image } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
import Header from "../../components/Header";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useSelector } from "react-redux";

function CreateRecipe() {
  const { userIsConnected } = useAuthGuard();
  const userId = useSelector((state) => state.users.value.userId);
  const router = useRouter();
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "gr" }]);
  const [steps, setSteps] = useState([""]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  // Variable qui contient toutes les données du formulaire de la recette
  const donneesRecette = {
    author: userId,
    name: name,
    description: description,
    category: category,
    duration: duration,
    ingredients: ingredients,
    steps: steps,
    imageUrl: imageUrl,
  };

  // Gestion des ingrédients dynamiques
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };
  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: "", unit: "gr" }]);
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Si une image a été ajoutée et recadrée, la traiter
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSave = async (isDraft) => {
    try {
      setLoading(true);

      // Validation du formulaire Ant Design
      const values = await form.validateFields();

      // Validation manuelle des champs non gérés par Ant Design
      if (!name.trim()) {
        message.error("Le titre de la recette est obligatoire");
        setLoading(false);
        return;
      }

      if (!description.trim()) {
        message.error("La description est obligatoire");
        setLoading(false);
        return;
      }

      if (!category) {
        message.error("Veuillez sélectionner une catégorie");
        setLoading(false);
        return;
      }

      if (!duration) {
        message.error("Veuillez sélectionner un temps de préparation");
        setLoading(false);
        return;
      }

      // Validation des ingrédients
      const validIngredients = ingredients.filter((ing) => ing.name.trim() && ing.quantity.trim());
      if (validIngredients.length === 0) {
        message.error("Veuillez ajouter au moins un ingrédient avec un nom et une quantité");
        setLoading(false);
        return;
      }

      // Vérifier que tous les ingrédients ont un nom et une quantité
      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].name.trim() && !ingredients[i].quantity.trim()) {
          message.error(`Veuillez ajouter une quantité pour l'ingrédient "${ingredients[i].name}"`);
          setLoading(false);
          return;
        }
        if (!ingredients[i].name.trim() && ingredients[i].quantity.trim()) {
          message.error(
            `Veuillez ajouter un nom pour l'ingrédient avec la quantité "${ingredients[i].quantity}"`
          );
          setLoading(false);
          return;
        }
      }

      // Validation des étapes
      const validSteps = steps.filter((step) => step.trim());
      if (validSteps.length === 0) {
        message.error("Veuillez ajouter au moins une étape");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("author", userId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("steps", JSON.stringify(steps));
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("category", category);
      formData.append("duration", duration);
      formData.append("isDraft", isDraft.toString());

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }
      // Si toutes les validations passent, envoyer la requête
      const response = await fetch(`/api/recipes/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (response.ok) {
        const recipeData = await response.json();
        message.success(isDraft ? "Brouillon enregistré !" : "Recette enregistrée !");
        setLoading(false);
        router.push(`/recipe/${recipeData.recipeCreated._id}`);
      } else {
        message.error("Erreur lors de l'enregistrement de la recette");
        setLoading(false);
      }
    } catch (err) {
      if (err.errorFields) {
        // Erreur de validation Ant Design
        message.error("Veuillez remplir tous les champs obligatoires.");
      } else {
        message.error("Erreur lors de l'enregistrement de la recette");
      }
      setLoading(false);
    }
  };

  const { Option } = Select;
  return (
    <div className={styles.main}>
      <div className={styles.pageContainer}>
        <Header showBackButton={false} />

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
              <Input
                placeholder="Ex : Gâteau au chocolat"
                className={styles.titleInput}
                onChange={(e) => setName(e.target.value)}
              />
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
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
            <div className={styles.sectionTitle}>Photo</div>

            <ImgCrop quality={1} aspect={16 / 9} cropShape="rect" zoomSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
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

            <div className={styles.sectionTitle}>Temps de préparation</div>
            <div className={styles.timeContainer}>
              <Radio.Group buttonStyle="solid" className={styles.timeRadio}>
                <Radio.Button
                  className={styles.timeRadioButton}
                  value="Main course"
                  onClick={() => setCategory("Plat")}
                >
                  Plat
                </Radio.Button>
                <Radio.Button
                  className={styles.timeRadioButton}
                  value="Starter"
                  onClick={() => setCategory("Starter")}
                >
                  Entrée
                </Radio.Button>
                <Radio.Button
                  className={styles.timeRadioButton}
                  value="Desert"
                  onClick={() => setCategory("Desert")}
                >
                  Dessert
                </Radio.Button>
                <Radio.Button
                  className={styles.timeRadioButton}
                  value="Drink"
                  onClick={() => setCategory("Drink")}
                >
                  Boisson
                </Radio.Button>
              </Radio.Group>
            </div>
            <div className={styles.sectionTitle}>Temps de préparation</div>
            <div className={styles.timeContainer}>
              <Radio.Group buttonStyle="solid" className={styles.timeRadio}>
                <Radio.Button
                  className={styles.timeRadioButton}
                  value="Rapide"
                  onClick={() => setDuration("Rapide")}
                >
                  Rapide
                </Radio.Button>
                <Radio.Button
                  className={styles.timeRadioButton}
                  value="Moyen"
                  onClick={() => setDuration("Moyen")}
                >
                  Moyen
                </Radio.Button>
                <Radio.Button
                  className={styles.timeRadioButton}
                  value="Long"
                  onClick={() => setDuration("Long")}
                >
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
                    onChange={(value) => handleIngredientChange(idx, "unit", value)}
                    options={[
                      { value: "gr", label: "gr" },
                      { value: "cl", label: "cl" },
                      { value: "ml", label: "ml" },
                      { value: "càs", label: "càs" },
                      { value: "càc", label: "càc" },
                      { value: "", label: "unité" },
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

export default CreateRecipe;
