import argon2 from "argon2";
import prisma from "../src/prisma";

async function main() {
  const adminHash   = await argon2.hash("Admin#1234");
  const analystHash = await argon2.hash("analyst123");
  const viewerHash  = await argon2.hash("viewer123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@financeApp.com" },
    update: {},
    create: { 
        name: "Admin", 
        email: "admin@financeApp.com", 
        passwordHash: adminHash, 
        role: "admin" 
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@finance.com" },
    update: {},
    create: { 
        name: "Analyst", 
        email: "analyst@finance.com", 
        passwordHash: analystHash, 
        role: "analyst" 
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@finance.com" },
    update: {},
    create: { 
        name: "Viewer", 
        email: "viewer@finance.com", 
        passwordHash: viewerHash, 
        role: "viewer" 
    },
  });

  console.log("Users created:", { 
    admin: admin.email, 
    analyst: analyst.email, 
    viewer: viewer.email
});

  //seeding some dummy records into the DB for testing.
  await prisma.financialRecord.createMany({
    skipDuplicates: true,
    data: [
      { userId: admin.id, amount: 85000, type: "income",  category: "salary",    date: new Date("2024-01-01"), notes: "January salary" },
      { userId: admin.id, amount: 1200,  type: "expense", category: "rent",      date: new Date("2024-01-05"), notes: "Office rent" },
      { userId: admin.id, amount: 300,   type: "expense", category: "utilities", date: new Date("2024-01-10") },
      { userId: admin.id, amount: 5000,  type: "income",  category: "freelance", date: new Date("2024-02-01"), notes: "Freelance project" },
      { userId: admin.id, amount: 800,   type: "expense", category: "software",  date: new Date("2024-02-15"), notes: "Subscriptions" },
      { userId: admin.id, amount: 85000, type: "income",  category: "salary",    date: new Date("2024-02-01"), notes: "February salary" },
      { userId: admin.id, amount: 2500,  type: "expense", category: "travel",    date: new Date("2024-03-10"), notes: "Client visit" },
      { userId: admin.id, amount: 1500,  type: "expense", category: "rent",      date: new Date("2024-03-05") },
      { userId: admin.id, amount: 3000,  type: "income",  category: "freelance", date: new Date("2024-03-20") },
      { userId: admin.id, amount: 450,   type: "expense", category: "utilities", date: new Date("2024-03-12") },
    ],
  });

  console.log("Records created: 10 financial records");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());