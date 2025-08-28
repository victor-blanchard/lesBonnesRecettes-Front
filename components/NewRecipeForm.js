import styles from "../styles/NewRecipeForm.module.css";
import { Popover } from "antd";
function Home() {
  return (
    <div>
      <Popover content={content} title="Title" trigger="click">
        <Button>Click me</Button>
      </Popover>
    </div>
  );
}

export default NewRecipeForm;
