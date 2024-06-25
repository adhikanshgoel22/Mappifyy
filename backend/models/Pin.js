import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Pin = sequelize.define("Pin", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT, // Assuming rating could be a decimal value
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT, // Using FLOAT for latitude
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT, // Using FLOAT for longitude
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, {
  timestamps: false
});

export default Pin;
