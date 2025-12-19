import { useState } from "react";
import type { Allergy, PetData } from "../lib/models";
import styles from "./pet.module.css";
import api from "../lib/api";
import { validateAllergyForm } from "../lib/validators";

interface PetAllergyList {
  pet: PetData;
}

const PetAllergyList = ({ pet }: PetAllergyList) => {
  const [addingNewAllergy, setAddingNewAllergy] = useState<boolean>(false);
  const initialFormData = {
    reactions: "",
    severity: ""
  };
  const [formData, setFormData] = useState(initialFormData);
  const [allergyList, setAllergyList] = useState<Allergy[]>(
    pet.allergies || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingAllergyId, setEditingAllergyId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState(initialFormData);

  const validateForm = () => {
    const newErrors = validateAllergyForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newVac = await api.post(
      `/medical-records/pets/${pet.id}/allergies`,
      formData
    );

    setAddingNewAllergy(false);
    setAllergyList([...allergyList, newVac.data]);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    setAddingNewAllergy(false);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleEdit = (allergy: Allergy) => {
    setEditingAllergyId(allergy.id);
    setEditFormData({
      reactions: allergy.reactions,
      severity: allergy.severity
    });
    setErrors({});
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    try {
      const updatedAllergy = await api.put(
        `/medical-records/allergies/${editingAllergyId}`,
        editFormData
      );
      setAllergyList(
        allergyList.map((allergy) =>
          allergy.id === editingAllergyId ? updatedAllergy.data : allergy
        )
      );
      setEditingAllergyId(null);
      setEditFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("Failed to update allergy:", error);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingAllergyId(null);
    setEditFormData(initialFormData);
    setErrors({});
  };

  const validateEditForm = () => {
    const newErrors = validateAllergyForm(editFormData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className={styles.medicalSection}>
      {allergyList && allergyList.length > 0 && (
        <div>
          <h3>Allergies:</h3>
          <ul className={styles.listView}>
            {allergyList.map((allergy) => (
              <li key={allergy.id}>
                {editingAllergyId === allergy.id ? (
                  <form onSubmit={handleEditSubmit} className={styles.petForm}>
                    <h4>Edit Allergy</h4>

                    <div className={styles.formField}>
                      <label htmlFor={`edit-reactions-${allergy.id}`}>
                        Allergic Reactions
                      </label>
                      <input
                        id={`edit-reactions-${allergy.id}`}
                        type="text"
                        name="reactions"
                        onChange={handleEditChange}
                        value={editFormData.reactions}
                        placeholder="e.g., Chicken, Pollen, Dust"
                      />
                      {errors.reactions && (
                        <span className={styles.errorMessage}>
                          {errors.reactions}
                        </span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor={`edit-severity-${allergy.id}`}>
                        Severity
                      </label>
                      <select
                        id={`edit-severity-${allergy.id}`}
                        name="severity"
                        onChange={handleEditChange}
                        value={editFormData.severity}
                      >
                        <option value="" disabled>
                          Choose severity level
                        </option>
                        <option value="MILD">MILD</option>
                        <option value="SEVERE">SEVERE</option>
                      </select>
                      {errors.severity && (
                        <span className={styles.errorMessage}>
                          {errors.severity}
                        </span>
                      )}
                    </div>

                    <div className={styles.formActions}>
                      <button className={styles.actionButton} type="submit">
                        Save
                      </button>
                      <button
                        className={styles.cancelButton}
                        type="button"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    Reactions: {allergy.reactions} - Severity:{" "}
                    {allergy.severity}
                    {pet.isOwner && (
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEdit(allergy)}
                        style={{
                          width: "auto",
                          marginTop: "8px",
                          padding: "8px 16px",
                          display: "block"
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!addingNewAllergy && editingAllergyId === null && (
        <button
          className={styles.actionButton}
          onClick={() => setAddingNewAllergy(true)}
        >
          Add Allergy
        </button>
      )}
      {addingNewAllergy && (
        <form onSubmit={handleSubmit} className={styles.petForm}>
          <h3>Add New Allergy</h3>

          <div className={styles.formField}>
            <label htmlFor="reactions">Allergic Reactions</label>
            <input
              id="reactions"
              type="text"
              name="reactions"
              onChange={handleChange}
              value={formData.reactions}
              placeholder="e.g., Chicken, Pollen, Dust"
            />
            {errors.reactions && (
              <span className={styles.errorMessage}>{errors.reactions}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="severity">Severity</label>
            <select
              id="severity"
              name="severity"
              onChange={handleChange}
              value={formData.severity}
            >
              <option value="" disabled>
                Choose severity level
              </option>
              <option value="MILD">MILD</option>
              <option value="SEVERE">SEVERE</option>
            </select>
            {errors.severity && (
              <span className={styles.errorMessage}>{errors.severity}</span>
            )}
          </div>

          <div className={styles.formActions}>
            <button className={styles.actionButton} type="submit">
              Submit
            </button>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PetAllergyList;
