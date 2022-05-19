const { db } = require('../../utils/database');
const { DataTypes } = require('sequelize');

const Restaurant = db.define('restaurant', {
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

  address: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },

  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'available',
  },
});

module.exports = { Restaurant };
