const { Sequelize } = require('sequelize');

const DBConnection = new Sequelize({
    dialect: process.env.CONNECTION_TYPE,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
});

module.exports = DBConnection;