import { db } from "./db";
import { categories } from "@shared/schema";
import { eq } from "drizzle-orm";

async function createInitialCategories() {
  try {
    console.log("Creating initial categories...");

    const initialCategories = [
      // Costume categories
      { name: "Traditional Hindu Deities", description: "Costumes of Hindu gods and goddesses", type: "costume" },
      { name: "Regional Folk Costumes", description: "Traditional costumes from different regions", type: "costume" },
      { name: "Festival Costumes", description: "Costumes for various festivals", type: "costume" },
      { name: "Historical Characters", description: "Costumes of historical figures", type: "costume" },
      { name: "Modern Characters", description: "Contemporary character costumes", type: "costume" },
      
      // Accessory categories
      { name: "Crowns & Headwear", description: "Crowns, tiaras, and traditional headgear", type: "accessory" },
      { name: "Jewelry & Ornaments", description: "Traditional jewelry and ornaments", type: "accessory" },
      { name: "Weapons & Props", description: "Traditional weapons and character props", type: "accessory" },
      { name: "Musical Instruments", description: "Traditional musical instruments as props", type: "accessory" },
      { name: "Footwear", description: "Traditional and character footwear", type: "accessory" },
    ];

    for (const category of initialCategories) {
      // Check if category already exists
      const existing = await db.select().from(categories).where(eq(categories.name, category.name)).limit(1);
      
      if (existing.length === 0) {
        await db.insert(categories).values(category);
        console.log(`✅ Created category: ${category.name} (${category.type})`);
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
      }
    }

    console.log("Categories seed completed successfully!");
    
  } catch (error) {
    console.error("❌ Error creating categories:", error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createInitialCategories()
    .then(() => {
      console.log("Category seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Category seed failed:", error);
      process.exit(1);
    });
}

export { createInitialCategories };