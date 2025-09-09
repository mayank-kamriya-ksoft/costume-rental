import { db } from "./db";
import { adminUsers } from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

async function createInitialAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.select().from(adminUsers).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log("Admin user already exists. Skipping creation.");
      return;
    }

    // Create initial admin user
    const hashedPassword = await hashPassword("admin123"); // Change this password!
    
    const [newAdmin] = await db.insert(adminUsers).values({
      email: "admin@example.com", // Change this email!
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "superadmin",
      permissions: ["all"],
      isActive: true,
    }).returning();
    
    console.log(`✅ Initial admin user created successfully!`);
    console.log(`Email: admin@example.com`);
    console.log(`Password: admin123`);
    console.log(`⚠️  IMPORTANT: Change these credentials immediately after first login!`);
    
  } catch (error) {
    console.error("❌ Error creating initial admin user:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createInitialAdmin()
    .then(() => {
      console.log("Admin seed completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Admin seed failed:", error);
      process.exit(1);
    });
}

export { createInitialAdmin };