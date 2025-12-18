import { useNavigate } from "react-router";
import styles from "./pet.module.css";

const BackButton = () => {
  const navigate = useNavigate();

  const goBackOrHome = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <button
      className={styles.backButton}
      onClick={goBackOrHome}
      style={{ marginBottom: "20px" }}
    >
      ← Back
    </button>
  );
};

export default BackButton;
