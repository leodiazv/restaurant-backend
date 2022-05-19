const { db } = require('../../utils/database');
const { DataTypes } = require('sequelize');

const Meal = db.define('meal', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
});

module.exports = { Meal };
