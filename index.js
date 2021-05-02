// Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');










// DB Connection
const connection = mysql.createConnection({
    host: 'localhost',

    // Local Host Port
    port: 3306,

    // Username
    user: 'root',

    // Password
    password: 'img0462jpg',
    
    // Database
    database: 'All_Employees_DB'
});

// Connect to the DB
connection.connect((err) => {
    err ? console.error(err) : console.log('Connected to Database');
});