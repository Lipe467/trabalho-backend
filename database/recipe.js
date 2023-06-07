const prisma = require("./prisma");

const getUserRecipes = async(userId) => {
  return prisma.recipe.findMany({
    where: {
      userId,
    },
  });
}

const getRecipeById = async(id, userId) => {

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!recipe) throw new Error("Recipe not found!!");
  if (recipe.userId !== userId) throw new Error("Not Authorized");

  return prisma.recipe.findFirst({
    where: {
      id,
    },
  });
};

const saveRecipe = ({ name, description, time }, userId) => {
  return prisma.recipe.create({
    data: {
      name,
      description,
      time,
      userId,
    }
  });
};

const updateRecipe = async(id, recipe) => {
  return prisma.recipe.update({
    where: {
      id,
    },
    data: recipe,
  });
};

const deleteRecipe = async(id) => {
  return prisma.recipe.delete({
    where: {
      id,
    },
  });
};


module.exports = {
  saveRecipe,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
