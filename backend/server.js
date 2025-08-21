import dotenv from "dotenv";
import app from "./src/app.js";
import sequelize from "./src/config/db.js";
import recipesRoute from "./src/routes/recipes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;


app.get("/ping",(req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/recipes", recipesRoute);

// Test database connection
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    const count = await Recipe.count();
    if (count === 0) {
      const newRecipe = await Recipe.create({
        cuisine: "Indian",
        title: "Paneer Butter Masala",
        rating: 4.8,
        prep_time: 20,
        cook_time: 30,
        total_time: 50,
        description: "Rich and creamy curry with paneer cubes in tomato-based sauce.",
        nutrients: { calories: 350, protein: "12g", fat: "20g", carbs: "25g" },
        serves: "2 people"
      });
      console.log("✅ Inserted Recipe:", newRecipe.toJSON());
    } else {
      console.log("⚡ Recipes already exist, skipping insert.");
    }

  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};



startServer();  


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
