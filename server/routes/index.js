import express from "express";
import petRoutes from "./pets.ts";
import medicalRecordRoutes from "./medicalRecords.ts";
import adminRoutes from "./admin.ts";

const router = express.Router();

router.use("/pets", petRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/admin", adminRoutes);

export default router;
