const {
  saveRecipe,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../database/recipe");

const express = require("express");
const auth = require("../middleware/auth");
const z = require("zod");

const router = express.Router();

const recipeSchema = z.object({
  name: z.string({
    required_error: "Name must be required",
    invalid_type_error: "Name must be a string",
  }),
  description: z.string({
    required_error: "Description must be required",
    invalid_type_error: "Description must be a string",
  }),
  time: z.string({
    required_error: "time must be required",
    invalid_type_error: "time must be a string",
  }),
});

router.get("/recipes", auth, async (req, res) => {
  try {
    const recipes = await getUserRecipes(req.user.userId);
    
    res.json({ recipes });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(401).json({
        message: err.errors,
      });
    res.status(401).json({ message: "Not Authorized!" });
  }
});

router.get("/recipe/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const recipe = await getRecipeById(id , req.user.userId);
    
    res.json({ recipe });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(401).json({
        message: err.errors,
      });
    res.status(401).json({ message: "Not Authorized!" });
  }
});

router.post("/recipe", auth, async (req, res) => {
  try {
    const newRecipe = recipeSchema.parse(req.body);
    const savedRecipe = await saveRecipe(newRecipe, req.user.userId);

    res.json({ recipe: savedRecipe });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({
        message: err.errors,
      });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/recipe/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const recipeBody = recipeSchema.parse(req.body);

    const recipe = await getRecipeById(id,  req.user.userId);
    if(!recipe) return res.status(404).send();

    const updatedRecipe = await updateRecipe(id, recipeBody);
    res.json({ 
      recipe: updatedRecipe 
    });
  } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(422).json({
          message: err.errors,
        });
      }
    res.status(500).json({ message: err.message });
  }
});

router.delete("/recipe/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const recipe = await getRecipeById(id, req.user.userId);
    if(!recipe) return res.status(404).send();

    await deleteRecipe(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

module.exports = router;
