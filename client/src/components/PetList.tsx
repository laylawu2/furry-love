import useFetch from "../hooks/useFetch";
import api from "../lib/api";
import type { PetModel } from "../lib/models";
import Pet from "./Pet";
import styles from "./pet.module.css";

const PetList = () => {
  const { data: pets, error, loading } = useFetch<PetModel[]>("/pets");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pets || pets.length === 0) return <div>No pets found.</div>;

  const deletePet = async (petId: number) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this pet? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }
    try {
      await api.delete(`/pets/${petId}`);
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <div>
      {pets.map((pet) => {
        return (
          <div className={styles.petContainer}>
            <Pet key={pet.id} pet={pet} />
            <button
              className={styles.actionButton}
              onClick={() => deletePet(pet.id)}
            >
              Delete Pet
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PetList;
