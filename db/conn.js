const { Sequelize } = require('sequelize');

// Cria a conexão com o banco de dados MySQL
const sequelize = new Sequelize('toughts2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3307, // porta padrão personalizada
});

// Função para testar se a conexão foi bem-sucedida
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conectamos com sucesso ao banco toughts2!');
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
  }
}

testConnection();

module.exports = sequelize;
