// Dependencies
const password = require('./dbpassword.json');
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const { first } = require('lodash');


const initalPrompt = {
    type: 'list',
    name: 'firstResponse',
    message: 'What Would You Like To Do?',
    choices: ['View All Employees',
            'View Employees By Department',
            'View Employees By Manager',
            'Add an Employee',
            'Remove an Employee',
            'Add a Role',
            'Remove a Role',
            'Add a Department',
            'Remove a Department',
            `Update an Employee's Role`,
            `Update an Employee's Manager`,
            'Exit']
};


// const bsPrompt = {
//     type: 'list',
//     name: 'bsPrompt',
//     message: 'waht now?',
//     choices: ['exit','go back to beginning']
// }




// DB Connection
const connection = mysql.createConnection({
    host: 'localhost',

    // Local Host Port
    port: 3306,

    // Username
    user: 'root',

    // Password: Password is Hidden in Ignored JSON
    password: password.password,
    
    // Database
    database: 'All_Employees_DB'
});

// Connect to the DB
connection.connect((err) => {
    err ? console.error(err) : console.log('Connected to Database');
    firstPrompt();  
});


// Functions
const endConnection = () => {
    connection.end();
};

const firstPrompt = () => {
    inquirer
        .prompt(initalPrompt)
        .then((initalPrompt) => {
            switchCases(initalPrompt.firstResponse);
            // endConnection(); // end connection, remove before deploying
        })
}

const switchCases = (responses) => {
    switch(responses) {
        case 'View All Employees':
            // console.log('View All Employees');
            viewAllEmployees();
            break;
        case 'View Employees By Department':
            console.log('View Employees By Department');
            // viewByDepartment();
            break;
        case 'View Employees By Manager':
            console.log('View Employees By Manager');
            // viewByManager();
            break;
        case 'Add an Employee':
            console.log('Add an Employee');
            break;
        case 'Remove an Employee':
            console.log('Remove an Employee');
            break;
        case 'Add a Role':
            console.log('Add a Role');
            break;
        case 'Remove a Role':
            console.log('Remove a Role');
            break;
        case 'Add a Department':
            console.log('Add a Department');
            break;
        case 'Remove a Department':
            console.log('Remove a Department');
            break;
        case `Update an Employee's Role`:
            console.log(`Update an Employee's Role`);
            break;
        case `Update an Emplyoee's Manager`:
            console.log(`Update an Employee's Manager`);
            break;
        case `Exit`:
            // console.log(`Exit`);
            endConnection();
            break;
    };
};

const viewAllEmployees = () => {
    connection.query(
        `SELECT * FROM Employees`,
        (err, res) => {
            err ? console.error(err) : console.table(res);
            firstPrompt();
        }
    )
}




