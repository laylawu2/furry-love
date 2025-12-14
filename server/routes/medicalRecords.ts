import express from "express";
import { prisma } from "../src/db.js";

const router = express.Router();

// Get medical records for a pet
router.get("/pets/:id", async (req, res) => {
  const petId = parseInt(req.params.id, 10);

  try {
    const vaccinations = await prisma.vaccination.findMany({
      where: { petId },
      orderBy: { administeredAt: "desc" }
    });
    const allergies = await prisma.allergy.findMany({
      where: { petId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ vaccinations, allergies });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
});

// Add a new vaccination
router.post("/pets/:id/vaccinations", async (req, res) => {
  const petId = parseInt(req.params.id, 10);
  const { name, administeredAt, expiresAt } = req.body;

  try {
    const newVaccination = await prisma.vaccination.create({
      data: {
        name,
        administeredAt: new Date(administeredAt),
        expiresAt: new Date(expiresAt),
        petId
      }
    });
    res.status(201).json(newVaccination);
  } catch (error) {
    console.error("Error creating vaccination:", error);
    res.status(500).json({ error: "Failed to create vaccination" });
  }
});

// Add a new allergy
router.post("/pets/:id/allergies", async (req, res) => {
  const petId = parseInt(req.params.id, 10);
  const { reactions, severity } = req.body;

  try {
    const newAllergy = await prisma.allergy.create({
      data: {
        reactions,
        severity,
        petId
      }
    });
    res.status(201).json(newAllergy);
  } catch (error) {
    console.error("Error creating allergy:", error);
    res.status(500).json({ error: "Failed to create allergy" });
  }
});

// Delete a vaccination
router.delete("/vaccinations/:id", async (req, res) => {
  const vaccinationId = parseInt(req.params.id, 10);

  try {
    await prisma.vaccination.delete({
      where: { id: vaccinationId }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    res.status(500).json({ error: "Failed to delete vaccination" });
  }
});

// Delete an allergy
router.delete("/allergies/:id", async (req, res) => {
  const allergyId = parseInt(req.params.id, 10);

  try {
    await prisma.allergy.delete({
      where: { id: allergyId }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting allergy:", error);
    res.status(500).json({ error: "Failed to delete allergy" });
  }
});

export default router;
