import { useState } from "react";
import api from "../lib/api";
import type { PetModel } from "../lib/models";
import { AxiosError } from "axios";
import styles from "./pet.module.css";

interface PetSearchProps {
  onSuccess: (pets: PetModel[]) => void;
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
    <section>
      <input
        name="search"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for a pet"
      />
      <button
        className={styles.actionButton}
        type="button"
        onClick={handleSearch}
      >
        Search
      </button>
    </section>
  );
};

export default PetSearch;
