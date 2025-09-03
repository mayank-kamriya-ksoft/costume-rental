import { db } from './db';
import { categories, costumes, accessories } from '../shared/schema';

async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  
  try {
    // Clear existing data
    await db.delete(accessories);
    await db.delete(costumes);
    await db.delete(categories);
    console.log('🗑️  Cleared existing data');

    // Insert categories
    const categoryData = [
      {
        name: 'Hindu Deities',
        description: 'Traditional Hindu god and goddess costumes',
        type: 'costume'
      },
      {
        name: 'Fantasy',
        description: 'Mythical and fantasy character costumes',
        type: 'costume'
      },
      {
        name: 'Royal',
        description: 'King and queen royal costumes',
        type: 'costume'
      },
      {
        name: 'Accessories',
        description: 'Jewelry, crowns, and costume accessories',
        type: 'accessory'
      }
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log('✅ Categories created');

    const hinduCategory = insertedCategories.find(c => c.name === 'Hindu Deities')?.id;
    const fantasyCategory = insertedCategories.find(c => c.name === 'Fantasy')?.id;
    const royalCategory = insertedCategories.find(c => c.name === 'Royal')?.id;
    const accessoryCategory = insertedCategories.find(c => c.name === 'Accessories')?.id;

    // Insert costumes
    const costumeData = [
      {
        name: 'Lord Hanuman Costume',
        description: 'Authentic Lord Hanuman costume with muscle padding, tail, and face makeup kit',
        categoryId: hinduCategory,
        pricePerDay: '45.00',
        securityDeposit: '100.00',
        sizes: ['S', 'M', 'L', 'XL'],
        themes: ['religious', 'traditional', 'strength'],
        imageUrl: '@assets/generated_images/Lord_Hanuman_strength_costume_47b0585d.png',
        status: 'available'
      },
      {
        name: 'Lord Rama Royal Costume',
        description: 'Noble Lord Rama costume with royal dhoti, crown, bow and arrow set',
        categoryId: hinduCategory,
        pricePerDay: '50.00',
        securityDeposit: '120.00',
        sizes: ['S', 'M', 'L', 'XL'],
        themes: ['religious', 'royal', 'traditional'],
        imageUrl: '@assets/generated_images/Lord_Rama_royal_costume_c4187a9e.png',
        status: 'available'
      },
      {
        name: 'Lord Krishna Costume',
        description: 'Traditional Lord Krishna costume with dhoti, crown, flute, and peacock feathers',
        categoryId: hinduCategory,
        pricePerDay: '48.00',
        securityDeposit: '110.00',
        sizes: ['S', 'M', 'L', 'XL'],
        themes: ['religious', 'traditional', 'divine'],
        imageUrl: '@assets/generated_images/Lord_Krishna_costume_display_a277fcaf.png',
        status: 'available'
      },
      {
        name: 'Lord Ganesha Costume',
        description: 'Adorable Lord Ganesha costume with elephant head, colorful attire, and blessing hands',
        categoryId: hinduCategory,
        pricePerDay: '42.00',
        securityDeposit: '95.00',
        sizes: ['S', 'M', 'L', 'XL'],
        themes: ['religious', 'traditional', 'wisdom'],
        imageUrl: '@assets/generated_images/Lord_Ganesha_elephant_costume_7ad51166.png',
        status: 'available'
      },
      {
        name: 'Lord Shiva Costume',
        description: 'Divine Lord Shiva costume with tiger skin, trishul, and serpent accessories',
        categoryId: hinduCategory,
        pricePerDay: '46.00',
        securityDeposit: '105.00',
        sizes: ['S', 'M', 'L', 'XL'],
        themes: ['religious', 'divine', 'powerful'],
        imageUrl: '@assets/generated_images/Lord_Shiva_divine_costume_753d34fb.png',
        status: 'available'
      },
      {
        name: 'Goddess Durga Costume',
        description: 'Powerful Goddess Durga costume with multiple arms, weapons, and royal sari',
        categoryId: hinduCategory,
        pricePerDay: '52.00',
        securityDeposit: '130.00',
        sizes: ['XS', 'S', 'M', 'L'],
        themes: ['religious', 'warrior', 'divine'],
        imageUrl: '@assets/generated_images/Goddess_Durga_warrior_costume_7c38c3d3.png',
        status: 'available'
      },
      {
        name: 'Goddess Lakshmi Costume',
        description: 'Elegant Goddess Lakshmi costume with golden sari, lotus, and prosperity symbols',
        categoryId: hinduCategory,
        pricePerDay: '49.00',
        securityDeposit: '115.00',
        sizes: ['XS', 'S', 'M', 'L'],
        themes: ['religious', 'prosperity', 'elegant'],
        imageUrl: '@assets/generated_images/Goddess_Lakshmi_prosperity_costume_b3447871.png',
        status: 'available'
      },
      {
        name: 'Arjuna Warrior Costume',
        description: 'Epic Arjuna warrior costume with armor, bow, quiver, and royal warrior attire',
        categoryId: hinduCategory,
        pricePerDay: '47.00',
        securityDeposit: '108.00',
        sizes: ['S', 'M', 'L', 'XL'],
        themes: ['warrior', 'epic', 'traditional'],
        imageUrl: '@assets/generated_images/Arjuna_warrior_archer_costume_08864c19.png',
        status: 'available'
      },
      {
        name: 'Royal Emperor Costume',
        description: 'Majestic royal emperor costume with elaborate crown, cape, and golden details',
        categoryId: royalCategory,
        pricePerDay: '55.00',
        securityDeposit: '140.00',
        sizes: ['S', 'M', 'L', 'XL'],
        themes: ['royal', 'majestic', 'golden'],
        status: 'available'
      },
      {
        name: 'Fantasy Dragon Costume',
        description: 'Stunning dragon costume with wings, scales, and fire-breathing effects',
        categoryId: fantasyCategory,
        pricePerDay: '65.00',
        securityDeposit: '160.00',
        sizes: ['M', 'L', 'XL'],
        themes: ['fantasy', 'dragon', 'magical'],
        status: 'available'
      }
    ];

    const insertedCostumes = await db.insert(costumes).values(costumeData).returning();
    console.log('✅ Costumes created');

    // Insert some accessories
    const accessoryData = [
      {
        name: 'Golden Crown Set',
        description: 'Ornate golden crown with matching jewelry set',
        categoryId: accessoryCategory,
        pricePerDay: '15.00',
        securityDeposit: '45.00',
        sizes: ['One Size'],
        linkedCharacters: ['king', 'queen', 'royal'],
        status: 'available'
      },
      {
        name: 'Warrior Shield & Sword',
        description: 'Traditional warrior shield and sword set',
        categoryId: accessoryCategory,
        pricePerDay: '12.00',
        securityDeposit: '35.00',
        sizes: ['One Size'],
        linkedCharacters: ['warrior', 'knight', 'hero'],
        status: 'available'
      },
      {
        name: 'Divine Jewelry Set',
        description: 'Traditional Indian jewelry set with necklaces, earrings, and bangles',
        categoryId: accessoryCategory,
        pricePerDay: '18.00',
        securityDeposit: '50.00',
        sizes: ['One Size'],
        linkedCharacters: ['goddess', 'deity', 'royal'],
        status: 'available'
      }
    ];

    await db.insert(accessories).values(accessoryData).returning();
    console.log('✅ Accessories created');

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Created: ${insertedCategories.length} categories, ${insertedCostumes.length} costumes, ${accessoryData.length} accessories`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase().catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});