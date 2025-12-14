import type { PetModel } from "../lib/models";
import styles from "./pet.module.css";

interface PetVaccineListProps {
  pet: PetModel;
}

const PetVaccineList = ({ pet }: PetVaccineListProps) => {
  return (
    <div>
      {pet.vaccinations && pet.vaccinations.length > 0 && (
        <div>
          <h3>Vaccinations:</h3>
          <ul className={styles.listView}>
            {pet.vaccinations.map((vac) => (
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
      <button onClick={}>Add Vaccination</button>
    </div>
  );
};

export default PetVaccineList;
