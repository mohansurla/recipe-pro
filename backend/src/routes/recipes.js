import express from "express";
import Recipe from "../models/Recipe.js";
import { Op } from "sequelize";

const operatorMap = (op) => {
  switch (op) {
    case ">=": return Op.gte;
    case "<=": return Op.lte;
    case "=": return Op.eq;
    default: return Op.eq;
  }
};
const router = express.Router();

// GET /api/recipes?page=1&limit=10
router.get("/", async (req, res) => {
  try {
    // 1️⃣ Get query params, set defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 2️⃣ Fetch recipes with pagination, sorted by rating DESC
    const { count, rows } = await Recipe.findAndCountAll({
      limit,
      offset,
      order: [["rating", "DESC"]],
    });

    // 3️⃣ Send response
    res.json({
      page,
      limit,
      total: count,
      data: rows,
    });
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/recipes/search → Filtered search
router.get("/search", async (req, res) => {
  try {
    const { title, cuisine, rating, total_time, calories } = req.query;

    const whereConditions = {};

    // Title partial match
    if (title) {
      whereConditions.title = { [Op.iLike]: `%${title}%` };
    }

    // Cuisine exact match
    if (cuisine) {
      whereConditions.cuisine = cuisine;
    }

    // Rating filter
    if (rating) {
      const match = rating.match(/(>=|<=|=)(\d+(\.\d+)?)/);
      if (match) {
        const op = operatorMap(match[1]);
        const value = parseFloat(match[2]);
        whereConditions.rating = { [op]: value };
      }
    }

    // Total time filter
    if (total_time) {
      const match = total_time.match(/(>=|<=|=)(\d+)/);
      if (match) {
        const op = operatorMap(match[1]);
        const value = parseInt(match[2]);
        whereConditions.total_time = { [op]: value };
      }
    }

    // Calories filter (integer now)
    if (calories) {
      const match = calories.match(/(>=|<=|=)(\d+)/);
      if (match) {
        const op = operatorMap(match[1]);
        const value = parseInt(match[2]);
        whereConditions.calories = { [op]: value }; // use new integer column
      }
    }


    // Query DB
    const recipes = await Recipe.findAll({ where: whereConditions });

    res.json({ data: recipes });
  } catch (error) {
    console.error("❌ Error searching recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
