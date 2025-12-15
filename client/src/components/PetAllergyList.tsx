import { useState } from "react";
import type { Allergy, PetModel } from "../lib/models";
import styles from "./pet.module.css";
import api from "../lib/api";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVac = await api.post(
      `/medical-records/pets/${pet.id}/allergies`,
      formData
    );

    setAddingNewAllergy(false);
    setAllergyList([...allergyList, newVac.data]);
    setFormData(initialFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        </div>
      )}
      <button onClick={() => setAddingNewAllergy(true)}>Add Allergy</button>
      {addingNewAllergy && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="reactions">Allergic Reactions</label>
          <input
            id="reactions"
            type="text"
            name="reactions"
            onChange={handleChange}
            value={formData.reactions}
            required
          />
          <label htmlFor="severity">Severity</label>
          <select
            name="severity"
            onChange={handleChange}
            value={formData.severity}
            required
          >
            <option value="" selected disabled hidden>
              Choose here
            </option>
            <option value="MILD">MILD</option>
            <option value="SEVERE">SEVERE</option>
          </select>
          <button className={styles.actionButton} type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default PetAllergyList;
