const { DataTypes } = require('sequelize');
const db = require('../db/conn');

// Define o modelo de Usuário
const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    required: true, // campo obrigatório
  },
  email: {
    type: DataTypes.STRING,
    required: true,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = User;
