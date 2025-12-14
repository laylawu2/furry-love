export interface PetModel {
  id: number;
  name: string;
  dateOfBirth: string;
  type: "DOG" | "CAT" | "BIRD" | "FISH" | "REPTILE" | "OTHER";
  ownerId: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  vaccinations?: Vaccination[];
  allergies?: Allergy[];
}

export interface Vaccination {
  id: number;
  petId: number;
  name: string;
  administeredAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface Allergy {
  id: number;
  petId: number;
  reactions: string;
  severity: "MILD" | "SEVERE";
  createdAt: string;
}

export interface MedicalRecords {
  vaccinations: Vaccination[];
  allergies: Allergy[];
}
