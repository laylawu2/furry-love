import { useState } from "react";
import api from "../lib/api";
import type { PetData } from "../lib/models";
import { AxiosError } from "axios";
import styles from "./pet.module.css";

interface PetSearchProps {
  onSuccess: (pets: PetData[]) => void;
}

const PetSearch = ({ onSuccess }: PetSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(`/pets/search?name=${searchTerm}`);
      onSuccess(response.data);
      setSearchTerm("");
    } catch (e: AxiosError | unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message);
      } else {
        console.error("Unknown error occurred");
      }
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        name="search"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for a pet"
      />
      <button
        className={`${styles.actionButton} ${styles.searchButton}`}
        type="button"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default PetSearch;
