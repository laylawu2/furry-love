import { useState } from "react";
import api from "../lib/api";
import ImageSelector from "./ImageSelector";
import PetTypeSelect from "./PetTypeSelect";
import styles from "./pet.module.css";
import type { PetModel } from "../lib/models";

interface PetFormProps {
  initialData?: PetModel;
  petId?: number;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const PetForm = ({ initialData, petId, onCancel, onSuccess }: PetFormProps = {}) => {
  const initialFormData = initialData ? {
    name: initialData.name,
    dateOfBirth: initialData.dateOfBirth.split('T')[0],
    type: initialData.type,
    imageUrl: initialData.imageUrl || ""
  } : {
    name: "",
    dateOfBirth: "",
    type: "",
    imageUrl: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const isEditMode = !!petId;
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
      if (isEditMode) {
        await api.put(`/pets/${petId}`, formData);
        alert("Pet updated successfully!");
        onSuccess?.();
      } else {
        await api.post("/pets", formData);
        setFormData(initialFormData);
        alert("Pet created successfully!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : `Failed to ${isEditMode ? 'update' : 'create'} pet`;
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.petForm} onSubmit={handleSubmit}>
      <h3 className={styles.title}>{isEditMode ? "Edit Pet" : "Add a New Pet"}</h3>

      {submitError && <div className={styles.errorMessage}>{submitError}</div>}

      <div className={styles.formField}>
        <label htmlFor="name">Pet Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="date-of-birth">Date of Birth</label>
        <input
          id="date-of-birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="type">Type</label>
        <PetTypeSelect
          id="type"
          name="type"
          value={formData.type}
          onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
          required
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="image-url">Image URL</label>
        <input
          id="image-url"
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>

      {formData.type && (
        <ImageSelector
          petType={formData.type}
          selectedImageUrl={formData.imageUrl}
          onImageSelect={handleImageSelect}
        />
      )}

      <div className={styles.formActions}>
        <button
          className={styles.actionButton}
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? (isEditMode ? "Updating..." : "Creating...")
            : (isEditMode ? "Update Pet" : "Create Pet")
          }
        </button>
        {isEditMode && onCancel && (
          <button
            className={styles.cancelButton}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PetForm;
