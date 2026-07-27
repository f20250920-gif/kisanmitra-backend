// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

// 1. Clear existing data safely
  try {
    await prisma.marketRate.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (e) {
    console.log('No existing records to delete, continuing...');
  }

  // 2. Insert Farmers / Users
  await prisma.user.createMany({
    data: [
      { name: 'Ramesh Kumar', phone: '+919876543210', location: 'Punjab' },
      { name: 'Prashant Pandey ', phone: '+919812345678 ', location: 'Uttar Pradesh' },
      { name: 'Anil Patel', phone: '+919711223344', location: 'Gujarat' },
    ],
  });

  // 3. Insert Mandi Market Rates (INR / Quintal)
  await prisma.marketRate.createMany({
    data: [
      { crop: 'Wheat (mujhe hindi nhi pata iski 😅)', month: 'July', price: 2590.0 },
      { crop: 'Paddy (Common)', month: 'July', price: 2375.0 },
      { crop: 'Potato', month: 'July', price: 1700.0 },
      { crop: 'Tomato', month: 'July', price: 3500.0 },
      { crop: 'Onion', month: 'July', price: 2400.0 },
      { crop: 'Mustard', month: 'July', price: 6500.0 },
    ],
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });