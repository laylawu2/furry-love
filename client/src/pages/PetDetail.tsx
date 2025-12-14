import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Pet from "../components/Pet";
import type { PetModel } from "../lib/models";

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: petData,
    error,
    loading
  } = useFetch<PetModel | null>(`/pets/${id}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!petData) return <div>No pet found.</div>;

  return <Pet pet={petData} />;
};

export default PetDetail;
