const { db } = require("../../utils/database");
const { DataTypes } = require("sequelize");

const User = db.define("user", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 8,
    },
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "normal",
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "available",
  },
});

module.exports = { User };
