interface PetTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
}

const PetTypeSelect = ({
  value,
  onChange,
  includeAll = false,
  required = false,
  id = "pet-type",
  name = "type"
}: PetTypeSelectProps) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      {includeAll && <option value="ALL">All Types</option>}
      {!includeAll && <option value="" disabled>Choose here</option>}
      <option value="DOG">Dog</option>
      <option value="CAT">Cat</option>
      <option value="BIRD">Bird</option>
      <option value="FISH">Fish</option>
      <option value="REPTILE">Reptile</option>
      <option value="OTHER">Other</option>
    </select>
  );
};

export default PetTypeSelect;
