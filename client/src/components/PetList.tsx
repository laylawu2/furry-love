import { useState, useEffect } from "react";
import api from "../lib/api";
import type { PetModel } from "../lib/models";
import Pet from "./Pet";
import PetTypeSelect from "./PetTypeSelect";
import styles from "./pet.module.css";
import PetSearch from "./PetSearch";
import { Link } from "react-router-dom";

const PetList = () => {
  const [pets, setPets] = useState<PetModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          filterType === "ALL" ? "/pets" : `/pets/filter?type=${filterType}`;
        const response = await api.get(endpoint);
        setPets(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [filterType]);

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
      setPets(pets.filter((pet) => pet.id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleSearchSuccess = (pets: PetModel[]) => {
    setPets(pets);
  };

  return (
    <div>
      <PetSearch onSuccess={handleSearchSuccess} />

      <div
        style={{
          margin: "20px 0",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <label htmlFor="pet-type-filter" style={{ fontWeight: 600 }}>
          Filter by Type:
        </label>
        <PetTypeSelect
          id="pet-type-filter"
          value={filterType}
          onChange={setFilterType}
          includeAll
        />
        <span style={{ color: "#666", fontSize: "14px" }}>
          Showing {pets.length}{" "}
          {filterType === "ALL" ? "pets" : `${filterType.toLowerCase()}(s)`}
        </span>
      </div>

      <div className={styles.newPet}>
        Got a new pet?{" "}
        <Link to="/pets/new" type="button">
          Add them here!
        </Link>
      </div>

      {pets.map((pet) => {
        return (
          <div className={styles.petContainer} key={pet.id}>
            <Pet pet={pet} />
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
