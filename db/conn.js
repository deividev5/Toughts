const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '',{
    host:'localhost',
    dialect:'mysql' 
})


try{
    sequelize.authenticate()
    console.log('O banco foi conectado com successo')
}catch(err){
console.log(`Não foi possível conectar ao banco de dados ${err}`)
}


module.exports = sequelize