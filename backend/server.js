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



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
