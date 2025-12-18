import { useState } from "react";
import type { PetData, Vaccination } from "../lib/models";
import styles from "./pet.module.css";
import api from "../lib/api";
import { validateVaccineForm } from "../lib/validators";

interface PetVaccineListProps {
  pet: PetData;
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
  const [editingVaccineId, setEditingVaccineId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState(initialFormData);

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

  const handleEdit = (vaccine: Vaccination) => {
    setEditingVaccineId(vaccine.id);
    setEditFormData({
      name: vaccine.name,
      administeredAt: vaccine.administeredAt.split("T")[0],
      expiresAt: vaccine.expiresAt.split("T")[0]
    });
    setErrors({});
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    try {
      const updatedVac = await api.put(
        `/medical-records/vaccinations/${editingVaccineId}`,
        editFormData
      );
      setVaccineList(
        vaccineList.map((vaccine) =>
          vaccine.id === editingVaccineId ? updatedVac.data : vaccine
        )
      );
      setEditingVaccineId(null);
      setEditFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("Failed to update vaccination:", error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setEditingVaccineId(null);
    setEditFormData(initialFormData);
    setErrors({});
  };

  const validateEditForm = () => {
    const newErrors = validateVaccineForm(editFormData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log("vac list", vaccineList);
  return (
    <div className={styles.medicalSection}>
      {vaccineList && vaccineList.length > 0 && (
        <div>
          <h3>Vaccinations:</h3>
          <ul className={styles.listView}>
            {vaccineList.map((vac) => (
              <li key={vac.id}>
                {editingVaccineId === vac.id ? (
                  <form onSubmit={handleEditSubmit} className={styles.petForm}>
                    <h4>Edit Vaccination</h4>

                    <div className={styles.formField}>
                      <label htmlFor={`edit-name-${vac.id}`}>
                        Vaccine Name
                      </label>
                      <input
                        id={`edit-name-${vac.id}`}
                        type="text"
                        name="name"
                        onChange={handleEditChange}
                        value={editFormData.name}
                        placeholder="e.g., Rabies, Distemper"
                      />
                      {errors.name && (
                        <span className={styles.errorMessage}>
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor={`edit-admin-${vac.id}`}>
                        Administered At
                      </label>
                      <input
                        id={`edit-admin-${vac.id}`}
                        type="date"
                        name="administeredAt"
                        onChange={handleEditChange}
                        value={editFormData.administeredAt}
                      />
                      {errors.administeredAt && (
                        <span className={styles.errorMessage}>
                          {errors.administeredAt}
                        </span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor={`edit-exp-${vac.id}`}>Expires At</label>
                      <input
                        id={`edit-exp-${vac.id}`}
                        type="date"
                        name="expiresAt"
                        onChange={handleEditChange}
                        value={editFormData.expiresAt}
                      />
                      {errors.expiresAt && (
                        <span className={styles.errorMessage}>
                          {errors.expiresAt}
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
                    <h4>{vac.name}</h4>
                    <div>
                      Administered on:{" "}
                      {new Date(vac.administeredAt).toLocaleDateString()}
                    </div>
                    <div>
                      Expiring on:{" "}
                      {new Date(vac.expiresAt).toLocaleDateString()}
                    </div>
                    {pet.isOwner && (
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEdit(vac)}
                        style={{
                          width: "auto",
                          marginTop: "8px",
                          padding: "8px 16px"
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
      {!addingNewVaccine && editingVaccineId === null && (
        <button
          className={styles.actionButton}
          onClick={() => setAddingNewVaccine(true)}
        >
          Add Vaccination
        </button>
      )}
      {addingNewVaccine && (
        <form onSubmit={handleSubmit} className={styles.petForm}>
          <h3>Add New Vaccination</h3>

          <div className={styles.formField}>
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
          </div>

          <div className={styles.formField}>
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
          </div>

          <div className={styles.formField}>
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

export default PetVaccineList;
