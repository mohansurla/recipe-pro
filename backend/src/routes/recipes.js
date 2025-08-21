import express from "express";
import Recipe from "../models/Recipe.js";

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

export default router;
