const mysql = require("mysql");
const dbConfig = require("../config/db_config.js");

// create connection
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// open mysql connection
connection.connect(error => {
    if (error) throw error;
    console.log("successfully connected to the database");
});

module.exports = connection;