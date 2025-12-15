import { useState } from "react";
import type { PetModel, Vaccination } from "../lib/models";
import styles from "./pet.module.css";
import api from "../lib/api";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVac = await api.post(
      `/medical-records/pets/${pet.id}/vaccinations`,
      formData
    );

    setAddingNewVaccine(false);
    setVaccineList([...vaccineList, newVac.data]);
    setFormData(initialFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        </div>
      )}
      <button onClick={() => setAddingNewVaccine(true)}>Add Vaccination</button>
      {addingNewVaccine && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Vaccine Name</label>
          <input
            id="name"
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <label htmlFor="admin-date">Administered At</label>
          <input
            id="admin-date"
            type="date"
            name="administeredAt"
            onChange={handleChange}
            value={formData.administeredAt}
            required
          />
          <label htmlFor="exp-date">Expires At</label>
          <input
            id="exp-date"
            type="date"
            name="expiresAt"
            onChange={handleChange}
            value={formData.expiresAt}
            required
          />
          <button className={styles.actionButton} type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default PetVaccineList;
