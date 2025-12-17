import express from "express";
import { prisma } from "../src/db.js";

const router = express.Router();

// Admin route to view total pets, pets by type and upcoming vaccinations
router.get("/stats", async (req, res) => {
  try {
    const totalPets = await prisma.pet.count();

    const petsByType = await prisma.pet.groupBy({
      by: ["type"],
      _count: {
        type: true
      }
    });
    const upcomingVaccinations = await prisma.vaccination.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
          lte: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }
      },
      include: {
        pet: true
      }
    });

    res.json({
      totalPets,
      petsByType,
      upcomingVaccinations
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

export default router;
