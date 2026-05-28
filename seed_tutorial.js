const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany();
  for (const recipe of recipes) {
    const existing = await prisma.tutorial.findUnique({ where: { recipeId: recipe.id } });
    if (!existing) {
      await prisma.tutorial.create({
        data: {
          recipeId: recipe.id,
          title: 'Video Tutorial: ' + recipe.title,
          description: 'Panduan lengkap langkah demi langkah membuat ' + recipe.title,
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: 15,
          price: 35000,
          isPublished: true
        }
      });
      console.log('Created tutorial for recipe ' + recipe.id);
    }
  }
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
