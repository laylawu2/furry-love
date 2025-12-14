import type { PetModel } from "../lib/models";
import styles from "./pet.module.css";

interface PetAllergyList {
  pet: PetModel;
}

const PetAllergyList = ({ pet }: PetAllergyList) => {
  return (
    <div>
      {pet.allergies && pet.allergies.length > 0 && (
        <div>
          <h3>Allergies:</h3>
          <ul className={styles.listView}>
            {pet.allergies.map((allergy) => (
              <li key={allergy.id}>
                Reactions: {allergy.reactions} - Severity: {allergy.severity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PetAllergyList;
