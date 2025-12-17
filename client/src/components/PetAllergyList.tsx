import { useState } from "react";
import type { Allergy, PetModel } from "../lib/models";
import styles from "./pet.module.css";
import api from "../lib/api";
import { validateAllergyForm } from "../lib/validators";

interface PetAllergyList {
  pet: PetModel;
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

  return (
    <div>
      {allergyList && allergyList.length > 0 && (
        <div>
          <h3>Allergies:</h3>
          <ul className={styles.listView}>
            {allergyList.map((allergy) => (
              <li key={allergy.id}>
                Reactions: {allergy.reactions} - Severity: {allergy.severity}
              </li>
            ))}
          </ul>
          <button
            className={styles.actionButton}
            onClick={() => setAddingNewAllergy(true)}
          >
            Add Allergy
          </button>
        </div>
      )}
      {addingNewAllergy && (
        <form onSubmit={handleSubmit} className={styles.petForm}>
          <h3>Add New Allergy</h3>

          <section>
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
          </section>

          <section>
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
          </section>

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
