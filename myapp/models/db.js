const mysql = require("mysql");
require('dotenv').config()

// create connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// open mysql connection
connection.connect(error => {
    if (error) throw error;
    console.log("successfully connected to the database");
});

module.exports = connection;