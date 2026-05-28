import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  // Clear order matters due to foreign keys
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.journal.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding data...');

  // 1. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({
    data: {
      username: 'Admin Makanan',
      email: 'admin@resep.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const testUser = await prisma.user.create({
    data: {
      username: 'FoodLover',
      email: 'user@resep.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // 2. Create Categories
  const catBreakfast = await prisma.category.create({
    data: { name: 'Sarapan', description: 'Menu pagi yang membangkitkan semangat' },
  });
  const catLunch = await prisma.category.create({
    data: { name: 'Makan Siang', description: 'Menu makan siang praktis dan mengenyangkan' },
  });
  const catDinner = await prisma.category.create({
    data: { name: 'Makan Malam', description: 'Menu spesial untuk menutup hari' },
  });

  // 3. Create Recipes
  const recipes = [
    {
      title: 'Nasi Goreng Spesial',
      description: 'Nasi goreng kampung dengan bumbu terasi, telur mata sapi, dan kerupuk renyah.',
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
      category: 'Makan Malam',
      prepTime: '10 min',
      cookTime: '15 min',
      servings: 2,
      calories: 450,
      rating: 4.8,
      ingredients: JSON.stringify([
        '2 piring nasi putih',
        '2 butir telur',
        '3 siung bawang merah, haluskan',
        '2 siung bawang putih, haluskan',
        '1 sdt terasi bakar',
        '2 sdm kecap manis',
        'Garam dan lada secukupnya'
      ]),
      steps: JSON.stringify([
        'Panaskan minyak, orak arik satu telur. Sisihkan di pinggir wajan.',
        'Tumis bumbu halus hingga harum.',
        'Masukkan nasi, aduk rata dengan bumbu dan telur.',
        'Tambahkan kecap manis, garam, dan lada. Aduk hingga matang.',
        'Sajikan dengan telur mata sapi.'
      ]),
      authorId: adminUser.id,
    },
    {
      title: 'Salad Buah Segar',
      description: 'Cemilan sehat dengan campuran buah tropis, disiram saus madu dan yogurt.',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
      category: 'Sarapan',
      prepTime: '15 min',
      cookTime: '0 min',
      servings: 1,
      calories: 250,
      rating: 4.9,
      ingredients: JSON.stringify([
        '1 buah apel, potong dadu',
        '1/2 buah mangga, potong dadu',
        'Segenggam anggur',
        '2 sdm yogurt plain',
        '1 sdm madu'
      ]),
      steps: JSON.stringify([
        'Cuci bersih semua buah.',
        'Potong dadu apel dan mangga, iris anggur menjadi dua bagian.',
        'Dalam mangkuk kecil, campurkan yogurt dan madu.',
        'Tuangkan saus yogurt ke atas buah dan aduk rata.',
        'Sajikan segera dalam keadaan dingin.'
      ]),
      authorId: adminUser.id,
    },
    {
      title: 'Ayam Bakar Taliwang',
      description: 'Ayam bakar khas Lombok dengan bumbu pedas manis yang meresap sempurna.',
      imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
      category: 'Makan Siang',
      prepTime: '20 min',
      cookTime: '45 min',
      servings: 4,
      calories: 600,
      rating: 5.0,
      ingredients: JSON.stringify([
        '1 ekor ayam kampung, belah tidak putus',
        '1 buah jeruk nipis',
        '10 buah cabai merah keriting',
        '5 buah cabai rawit merah',
        '8 butir bawang merah',
        '4 siung bawang putih',
        '2 sdt terasi bakar',
        'Gula merah dan garam secukupnya'
      ]),
      steps: JSON.stringify([
        'Lumuri ayam dengan perasan jeruk nipis dan garam, diamkan 15 menit.',
        'Haluskan cabai, bawang, dan terasi.',
        'Tumis bumbu halus hingga matang dan harum.',
        'Oleskan bumbu ke seluruh permukaan ayam.',
        'Panggang ayam di atas bara api, sambil sesekali diolesi sisa bumbu hingga matang.'
      ]),
      authorId: adminUser.id,
    }
  ];

  for (const recipe of recipes) {
    await prisma.recipe.create({ data: recipe });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
