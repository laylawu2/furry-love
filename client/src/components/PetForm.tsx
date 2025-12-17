import { useState } from "react";
import api from "../lib/api";
import ImageSelector from "./ImageSelector";
import PetTypeSelect from "./PetTypeSelect";
import styles from "./pet.module.css";

const PetForm = () => {
  const initialFormData = {
    name: "",
    dateOfBirth: "",
    type: "",
    imageUrl: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      await api.post("/pets", formData);
      setFormData(initialFormData);
      alert("Pet created successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create pet";
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.petForm} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Add a New Pet</h3>

      {submitError && <div className={styles.errorMessage}>{submitError}</div>}

      <section>
        <label htmlFor="name">Pet Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </section>

      <section>
        <label htmlFor="date-of-birth">Date of Birth</label>
        <input
          id="date-of-birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </section>

      <section>
        <label htmlFor="type">Type</label>
        <PetTypeSelect
          id="type"
          name="type"
          value={formData.type}
          onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
          required
        />
      </section>

      <section>
        <label htmlFor="image-url">Image URL</label>
        <input
          id="image-url"
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </section>

      {formData.type && (
        <ImageSelector
          petType={formData.type}
          selectedImageUrl={formData.imageUrl}
          onImageSelect={handleImageSelect}
        />
      )}

      <button
        className={styles.actionButton}
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Creating..." : "Create Pet"}
      </button>
    </form>
  );
};

export default PetForm;
