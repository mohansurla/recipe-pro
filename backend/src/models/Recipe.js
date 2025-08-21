import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Recipe = sequelize.define("Recipe", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
  },
  prep_time: {
    type: DataTypes.INTEGER,
  },
  cook_time: {
    type: DataTypes.INTEGER,
  },
  total_time: {
    type: DataTypes.INTEGER,
  },
  description: {
    type: DataTypes.TEXT,
  },
  nutrients: {
    type: DataTypes.JSONB, // stores as JSON in Postgres
  },
  serves: {
    type: DataTypes.STRING,
  },
});

export default Recipe;
