import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Pet from "../components/Pet";
import PetForm from "../components/PetForm";
import BackButton from "../components/BackButton";
import styles from "../components/pet.module.css";
import type { PetData } from "../lib/models";

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: petData,
    error,
    loading,
    refetch
  } = useFetch<PetData | null>(`/pets/${id}`);
  const [isEditingPet, setIsEditingPet] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!petData) return <div>No pet found.</div>;

  return (
    <div>
      {!isEditingPet && <BackButton />}
      {!isEditingPet ? (
        <>
          <Pet pet={petData} isOwner={petData.isOwner} readOnly={false} />
          {petData.isOwner && (
            <button
              className={styles.actionButton}
              onClick={() => setIsEditingPet(true)}
            >
              Edit Pet Details
            </button>
          )}
        </>
      ) : (
        <PetForm
          initialData={petData}
          petId={petData.id}
          onCancel={() => setIsEditingPet(false)}
          onSuccess={() => {
            setIsEditingPet(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default PetDetail;
