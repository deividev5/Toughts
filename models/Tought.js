const { DataTypes } = require('sequelize');
const db = require('../db/conn');

// Importa o modelo User para associar com Tought
const User = require('./User');

// Define o modelo Tought (Pensamento)
const Tought = db.define('Tought', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true, // marca o campo como obrigatório
  },
});

// Cria relação: Um Pensamento pertence a um Usuário
Tought.belongsTo(User);

// Cria relação: Um Usuário pode ter vários Pensamentos
User.hasMany(Tought);

module.exports = Tought;
