import { useState } from "react";
import type { PetModel, Vaccination } from "../lib/models";
import styles from "./pet.module.css";
import api from "../lib/api";
import { validateVaccineForm } from "../lib/validators";

interface PetVaccineListProps {
  pet: PetModel;
}

const PetVaccineList = ({ pet }: PetVaccineListProps) => {
  const [addingNewVaccine, setAddingNewVaccine] = useState<boolean>(false);
  const initialFormData = {
    name: "",
    administeredAt: "",
    expiresAt: ""
  };
  const [formData, setFormData] = useState(initialFormData);
  const [vaccineList, setVaccineList] = useState<Vaccination[]>(
    pet.vaccinations || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors = validateVaccineForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newVac = await api.post(
      `/medical-records/pets/${pet.id}/vaccinations`,
      formData
    );

    setAddingNewVaccine(false);
    setVaccineList([...vaccineList, newVac.data]);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setAddingNewVaccine(false);
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <div>
      {vaccineList && vaccineList.length > 0 && (
        <div>
          <h3>Vaccinations:</h3>
          <ul className={styles.listView}>
            {vaccineList.map((vac) => (
              <li key={vac.id}>
                <h4>{vac.name}</h4>
                <div>
                  Administered on:{" "}
                  {new Date(vac.administeredAt).toLocaleDateString()}
                </div>
                <div>
                  Expiring on:{" "}
                  {new Date(vac.administeredAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
          <button
            className={styles.actionButton}
            onClick={() => setAddingNewVaccine(true)}
          >
            Add Vaccination
          </button>
        </div>
      )}
      {addingNewVaccine && (
        <form onSubmit={handleSubmit} className={styles.petForm}>
          <h3>Add New Vaccination</h3>

          <section>
            <label htmlFor="name">Vaccine Name</label>
            <input
              id="name"
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              placeholder="e.g., Rabies, Distemper"
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
            )}
          </section>

          <section>
            <label htmlFor="admin-date">Administered At</label>
            <input
              id="admin-date"
              type="date"
              name="administeredAt"
              onChange={handleChange}
              value={formData.administeredAt}
            />
            {errors.administeredAt && (
              <span className={styles.errorMessage}>
                {errors.administeredAt}
              </span>
            )}
          </section>

          <section>
            <label htmlFor="exp-date">Expires At</label>
            <input
              id="exp-date"
              type="date"
              name="expiresAt"
              onChange={handleChange}
              value={formData.expiresAt}
            />
            {errors.expiresAt && (
              <span className={styles.errorMessage}>{errors.expiresAt}</span>
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

export default PetVaccineList;
