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
    },

    {
    title: 'Soto Ayam Lamongan',
    description: 'Soto ayam gurih dengan koya khas Lamongan.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    category: 'Sarapan',
    prepTime: '20 min',
    cookTime: '60 min',
    servings: 4,
    calories: 400,
    rating: 4.8,
    ingredients: JSON.stringify([
      '1 ekor ayam',
      '2 liter air',
      'Bawang putih',
      'Kemiri',
      'Kunyit',
      'Koya'
    ]),
    steps: JSON.stringify([
      'Rebus ayam.',
      'Tumis bumbu halus.',
      'Masukkan ke kaldu.',
      'Suwir ayam.',
      'Sajikan dengan koya.'
    ]),
    authorId: adminUser.id,
  },

  {
    title: 'Gado-Gado Jakarta',
    description: 'Sayuran segar dengan siraman saus kacang yang lezat.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    category: 'Makan Siang',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 3,
    calories: 350,
    rating: 4.6,
    ingredients: JSON.stringify([
      'Kangkung',
      'Tauge',
      'Kentang',
      'Telur rebus',
      'Bumbu kacang'
    ]),
    steps: JSON.stringify([
      'Rebus sayuran.',
      'Susun di piring.',
      'Buat saus kacang.',
      'Siram saus.',
      'Sajikan.'
    ]),
    authorId: adminUser.id,
  },

  {
  title: 'Pempek Palembang',
  description: 'Pempek ikan tenggiri dengan kuah cuko pedas manis.',
  imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
  category: 'Camilan',
  prepTime: '30 min',
  cookTime: '40 min',
  servings: 4,
  calories: 380,
  rating: 4.8,
  ingredients: JSON.stringify([
    '500 gr ikan tenggiri',
    '300 gr tepung tapioka',
    '1 butir telur',
    'Garam',
    'Air secukupnya'
  ]),
  steps: JSON.stringify([
    'Campur ikan dan bumbu.',
    'Tambahkan tepung sedikit demi sedikit.',
    'Bentuk adonan.',
    'Rebus hingga mengapung.',
    'Sajikan dengan cuko.'
  ]),
  authorId: adminUser.id,
},

{
  title: 'Gudeg Jogja',
  description: 'Gudeg nangka muda dengan cita rasa manis khas Yogyakarta.',
  imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
  category: 'Makan Siang',
  prepTime: '20 min',
  cookTime: '240 min',
  servings: 6,
  calories: 480,
  rating: 4.7,
  ingredients: JSON.stringify([
    '1 kg nangka muda',
    '500 ml santan',
    '5 lembar daun salam',
    'Gula merah',
    'Bawang merah',
    'Bawang putih'
  ]),
  steps: JSON.stringify([
    'Potong nangka muda.',
    'Susun bahan dalam panci.',
    'Masukkan santan dan bumbu.',
    'Masak dengan api kecil.',
    'Masak hingga kuah menyusut.'
  ]),
  authorId: adminUser.id,
},

{
  title: 'Bakso Malang',
  description: 'Bakso sapi kenyal dengan kuah kaldu gurih.',
  imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=800&auto=format&fit=crop',
  category: 'Makan Malam',
  prepTime: '30 min',
  cookTime: '60 min',
  servings: 4,
  calories: 450,
  rating: 4.8,
  ingredients: JSON.stringify([
    '500 gr daging sapi',
    '100 gr tepung tapioka',
    'Es batu',
    'Bawang putih',
    'Garam',
    'Merica'
  ]),
  steps: JSON.stringify([
    'Haluskan daging.',
    'Campur dengan bahan lain.',
    'Bentuk bulatan bakso.',
    'Rebus hingga matang.',
    'Sajikan dengan kuah.'
  ]),
  authorId: adminUser.id,
},

{
  title: 'Sate Ayam Madura',
  description: 'Sate ayam dengan bumbu kacang yang gurih dan manis.',
  imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800&auto=format&fit=crop',
  category: 'Makan Malam',
  prepTime: '25 min',
  cookTime: '30 min',
  servings: 4,
  calories: 540,
  rating: 5.0,
  ingredients: JSON.stringify([
    '500 gr daging ayam',
    'Tusuk sate',
    'Kacang tanah',
    'Kecap manis',
    'Bawang putih'
  ]),
  steps: JSON.stringify([
    'Potong ayam dadu.',
    'Tusuk ayam.',
    'Panggang hingga matang.',
    'Buat bumbu kacang.',
    'Siram sate dengan bumbu.'
  ]),
  authorId: adminUser.id,
},

{
  title: 'Rujak Cingur',
  description: 'Kuliner khas Surabaya dengan petis dan irisan cingur.',
  imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
  category: 'Makan Siang',
  prepTime: '20 min',
  cookTime: '30 min',
  servings: 3,
  calories: 390,
  rating: 4.7,
  ingredients: JSON.stringify([
    'Cingur sapi',
    'Tahu',
    'Tempe',
    'Kangkung',
    'Petis udang',
    'Kacang tanah'
  ]),
  steps: JSON.stringify([
    'Rebus cingur hingga empuk.',
    'Siapkan sayuran dan pelengkap.',
    'Haluskan bumbu petis.',
    'Campur semua bahan.',
    'Sajikan.'
  ]),
  authorId: adminUser.id,
},

{
  title: 'Martabak Manis',
  description: 'Kue manis tebal dengan topping cokelat, keju, dan susu.',
  imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
  category: 'Camilan',
  prepTime: '20 min',
  cookTime: '25 min',
  servings: 6,
  calories: 520,
  rating: 5.0,
  ingredients: JSON.stringify([
    '250 gr tepung terigu',
    '1 butir telur',
    'Gula',
    'Ragi instan',
    'Keju',
    'Cokelat meses'
  ]),
  steps: JSON.stringify([
    'Campur adonan.',
    'Diamkan hingga mengembang.',
    'Masak di loyang martabak.',
    'Tambahkan topping.',
    'Lipat dan sajikan.'
  ]),
  authorId: adminUser.id,
},

{
  title: 'Es Cendol',
  description: 'Minuman segar dengan cendol, santan, dan gula aren.',
  imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
  category: 'Minuman',
  prepTime: '10 min',
  cookTime: '15 min',
  servings: 3,
  calories: 280,
  rating: 4.9,
  ingredients: JSON.stringify([
    'Cendol',
    'Santan',
    'Gula aren',
    'Es batu'
  ]),
  steps: JSON.stringify([
    'Rebus gula aren hingga larut.',
    'Siapkan gelas.',
    'Masukkan cendol.',
    'Tambahkan santan dan gula.',
    'Beri es batu lalu sajikan.'
  ]),
  authorId: adminUser.id,
},

{
  title: 'Klepon',
  description: 'Kue tradisional isi gula merah yang lumer saat digigit.',
  imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop',
  category: 'Camilan',
  prepTime: '20 min',
  cookTime: '15 min',
  servings: 5,
  calories: 220,
  rating: 4.8,
  ingredients: JSON.stringify([
    'Tepung ketan',
    'Air pandan',
    'Gula merah',
    'Kelapa parut'
  ]),
  steps: JSON.stringify([
    'Campur tepung dan air pandan.',
    'Isi dengan gula merah.',
    'Bentuk bulat.',
    'Rebus hingga mengapung.',
    'Gulingkan ke kelapa parut.'
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
