const Sequelize = require('sequelize')

const connection = new Sequelize('cracktrello','root','sysdba',{
    host: 'localhost',
    dialect: 'mysql',
    timezone:'-03:00'
})

module.exports= connection