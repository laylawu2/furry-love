import express from "express";
import { prisma } from "../src/db.js";
import { PetType } from "@prisma/client";

const router = express.Router();

// View all my pets
router.get("/", async (req, res) => {
  // Replace with actual user ID from authentication
  const userId = 1;

  // Admin user can view all pets
  // Individual users can view only their own pets
  try {
    const pets = await prisma.pet.findMany({
      where: { ownerId: userId }
    });
    const petsWithOwnerInfo = pets.map((pet) => ({
      ...pet,
      isOwner: true
    }));
    res.json(petsWithOwnerInfo);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
});

// Search pets by name
router.get("/search", async (req, res) => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name query parameter is required" });
  }

  try {
    const pets = await prisma.pet.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      }
    });
    const petsWithOwnerInfo = pets.map((pet) => ({
      ...pet,
      isOwner: req.user?.id === pet.ownerId
    }));
    res.json(petsWithOwnerInfo);
  } catch (error) {
    console.error("Error searching pets:", error);
    res.status(500).json({ error: "Failed to search pets" });
  }
});

// Filter pets by type
router.get("/filter", async (req, res) => {
  const { type } = req.query;

  if (!type || typeof type !== "string") {
    return res.status(400).json({ error: "Type query parameter is required" });
  }

  try {
    const pets = await prisma.pet.findMany({
      where: { type: type.toUpperCase() as PetType }
    });
    const petsWithOwnerInfo = pets.map((pet) => ({
      ...pet,
      isOwner: req.user?.id === pet.ownerId
    }));
    res.json(petsWithOwnerInfo);
  } catch (error) {
    console.error("Error filtering pets:", error);
    res.status(500).json({ error: "Failed to filter pets" });
  }
});

// View pet details
router.get("/:id", async (req, res) => {
  const petId = parseInt(req.params.id, 10);

  try {
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { allergies: true, vaccinations: true }
    });

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json({ ...pet, isOwner: req.user?.id === pet.ownerId });
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ error: "Failed to fetch pet" });
  }
});

// Add a new pet
router.post("/", async (req, res) => {
  const { name, dateOfBirth, type, imageUrl } = req.body;

  try {
    const newPet = await prisma.pet.create({
      data: {
        name,
        dateOfBirth: new Date(dateOfBirth),
        type,
        imageUrl,
        ownerId: 1 // Temporary: Replace with req.user.id when auth is implemented
      }
    });
    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ error: "Failed to create pet" });
  }
});

// Update pet information
router.put("/:id", async (req, res) => {
  const petId = parseInt(req.params.id, 10);
  const { name, dateOfBirth, type, imageUrl } = req.body;

  try {
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        name,
        dateOfBirth: new Date(dateOfBirth),
        type,
        imageUrl
      }
    });
    res.json(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Failed to update pet" });
  }
});

// Delete a pet
router.delete("/:id", async (req, res) => {
  const petId = parseInt(req.params.id, 10);

  try {
    await prisma.pet.delete({
      where: { id: petId }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ error: "Failed to delete pet" });
  }
});

export default router;
