-- CreateTable
CREATE TABLE "RecipeTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTag_name_recipeId_key" ON "RecipeTag"("name", "recipeId");

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
