// prisma/seed.js
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  await prisma.allergy.deleteMany();
  await prisma.vaccination.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();

  // Create users and get their IDs
  const sarah = await prisma.user.create({
    data: {
      email: "sarah.johnson@email.com",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "USER"
    }
  });

  const michael = await prisma.user.create({
    data: {
      email: "michael.chen@email.com",
      firstName: "Michael",
      lastName: "Chen",
      role: "USER"
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@furry-love.com",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN"
    }
  });

  console.log(`✓ Created 3 users`);

  // Create pets using real user IDs
  const luna = await prisma.pet.create({
    data: {
      name: "Luna",
      dateOfBirth: new Date("2020-03-15"),
      type: "DOG",
      ownerId: sarah.id,
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1"
    }
  });

  const whiskers = await prisma.pet.create({
    data: {
      name: "Whiskers",
      dateOfBirth: new Date("2019-07-22"),
      type: "CAT",
      ownerId: sarah.id,
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
    }
  });

  const max = await prisma.pet.create({
    data: {
      name: "Max",
      dateOfBirth: new Date("2021-01-10"),
      type: "DOG",
      ownerId: michael.id,
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb"
    }
  });

  const tweety = await prisma.pet.create({
    data: {
      name: "Tweety",
      dateOfBirth: new Date("2022-05-18"),
      type: "BIRD",
      ownerId: michael.id,
      imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3"
    }
  });

  const goldie = await prisma.pet.create({
    data: {
      name: "Goldie",
      dateOfBirth: new Date("2023-02-28"),
      type: "FISH",
      ownerId: michael.id
    }
  });

  console.log(`✓ Created 5 pets`);

  // Create vaccinations using real pet IDs
  await prisma.vaccination.create({
    data: {
      name: "Rabies",
      administeredAt: new Date("2023-03-15"),
      expiresAt: new Date("2026-03-15"),
      petId: luna.id
    }
  });

  await prisma.vaccination.create({
    data: {
      name: "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
      administeredAt: new Date("2023-06-20"),
      expiresAt: new Date("2026-06-20"),
      petId: luna.id
    }
  });

  await prisma.vaccination.create({
    data: {
      name: "Bordetella",
      administeredAt: new Date("2024-01-10"),
      expiresAt: new Date("2025-01-10"),
      petId: luna.id
    }
  });

  await prisma.vaccination.create({
    data: {
      name: "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
      administeredAt: new Date("2023-07-22"),
      expiresAt: new Date("2026-07-22"),
      petId: whiskers.id
    }
  });

  await prisma.vaccination.create({
    data: {
      name: "Rabies",
      administeredAt: new Date("2023-08-01"),
      expiresAt: new Date("2026-08-01"),
      petId: whiskers.id
    }
  });

  await prisma.vaccination.create({
    data: {
      name: "Rabies",
      administeredAt: new Date("2024-01-10"),
      expiresAt: new Date("2027-01-10"),
      petId: max.id
    }
  });

  await prisma.vaccination.create({
    data: {
      name: "DHPP",
      administeredAt: new Date("2024-02-15"),
      expiresAt: new Date("2027-02-15"),
      petId: max.id
    }
  });

  console.log(`✓ Created 7 vaccinations`);

  // Create allergies using real pet IDs
  await prisma.allergy.create({
    data: {
      reactions: "Chicken - causes skin rashes and itching",
      severity: "MILD",
      petId: luna.id
    }
  });

  await prisma.allergy.create({
    data: {
      reactions: "Grass pollen - sneezing, watery eyes, excessive scratching",
      severity: "MILD",
      petId: luna.id
    }
  });

  await prisma.allergy.create({
    data: {
      reactions: "Fish - severe vomiting and diarrhea",
      severity: "SEVERE",
      petId: whiskers.id
    }
  });

  await prisma.allergy.create({
    data: {
      reactions:
        "Bee stings - anaphylactic reaction, requires immediate EpiPen",
      severity: "SEVERE",
      petId: max.id
    }
  });

  console.log(`✓ Created 4 allergies`);

  console.log("\n✓ Seed completed successfully!\n");
  console.log("Summary:");
  console.log(`  • Users: 3`);
  console.log(`  • Pets: 5`);
  console.log(`  • Vaccinations: 7`);
  console.log(`  • Allergies: 4`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
