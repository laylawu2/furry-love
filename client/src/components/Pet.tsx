import { Link } from "react-router";
import type { PetData } from "../lib/models";
import PetVaccineList from "./PetVaccineList";
import PetAllergyList from "./PetAllergyList";
import styles from "./pet.module.css";

interface PetProps {
  pet: PetData;
  isOwner?: boolean;
  readOnly?: boolean;
}

const Pet = ({ pet, isOwner = false, readOnly = true }: PetProps) => {
  console.log("isOwner", isOwner);
  return (
    <>
      <Link to={`/pets/${pet.id}`} className={styles.petCard}>
        <h2>{pet.name}</h2>
        <p>Type: {pet.type}</p>
        <p>Date of Birth: {new Date(pet.dateOfBirth).toLocaleDateString()}</p>
        {pet.imageUrl && (
          <img src={pet.imageUrl} alt={`${pet.name}`} width={200} />
        )}
      </Link>
      {isOwner && !readOnly && <PetVaccineList pet={pet} />}
      {isOwner && !readOnly && <PetAllergyList pet={pet} />}
    </>
  );
};

export default Pet;
