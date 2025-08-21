import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import Recipe from "./src/models/Recipe.js";

dotenv.config();

// Wrap everything in async function
const seedRecipes = async () => {
  try {
    // Connect to DB
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync table (ensure table exists)
    await Recipe.sync({ alter: true });
    console.log("✅ Recipe table ready");

    // Read JSON file
    const filePath = path.join("./src/data", "recipes.json"); // adjust if needed
    const fileData = fs.readFileSync(filePath, "utf-8");
    const recipesJson = JSON.parse(fileData);

    // Map JSON to DB format
    const recipesArray = recipesJson.map((recipe) => ({
      cuisine: recipe.cuisine || null,
      title: recipe.title || null,
      rating: isNaN(recipe.rating) ? null : recipe.rating,
      prep_time: isNaN(recipe.prep_time) ? null : recipe.prep_time,
      cook_time: isNaN(recipe.cook_time) ? null : recipe.cook_time,
      total_time: isNaN(recipe.total_time) ? null : recipe.total_time,
      description: recipe.description || null,
      nutrients: recipe.nutrients || {},
      serves: recipe.serves || null,
    }));

    // Bulk insert
    await Recipe.bulkCreate(recipesArray, { ignoreDuplicates: true });

    console.log(`✅ Successfully inserted ${recipesArray.length} recipes`);
    process.exit(0); // exit after seeding
  } catch (error) {
    console.error("❌ Error seeding recipes:", error);
    process.exit(1);
  }
};

// Run the seed
seedRecipes();
