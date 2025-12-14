import useFetch from "../hooks/useFetch";
import type { PetModel } from "../lib/models";
import Pet from "./Pet";

const PetList = () => {
  const { data: pets, error, loading } = useFetch<PetModel[]>("/pets");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pets || pets.length === 0) return <div>No pets found.</div>;

  return (
    <div>
      {pets.map((pet) => {
        return <Pet key={pet.id} pet={pet} />;
      })}
    </div>
  );
};

export default PetList;
