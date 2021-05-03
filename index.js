// Dependencies
const password = require('./dbpassword.json');
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');


// Other Stuff
let existingRoles = new Array;

let existingManagers = new Array;






// Inquirer Prompts
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

const addEmployeeNamePrompts = [
    {
        type: 'input',
        name: 'firstName',
        message: 'What Is Their First Name?'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'What Is Their Last Name?'
    }
];

const existingOrNewRolePrompt = {
    type: 'list',
    name: 'existingOrNew',
    message: 'Is This an Existing or New Role?',
    choices: ['Existing', 'New']
}

const newRolePrompt = {
    type: 'input',
    name: 'newRole',
    message: `What Is This Employee's Role?`
}

const existingRolePrompt = {
    type: 'list',
    name: 'existingRole',
    message: `What Is This Employee's Role`,
    choices: existingRoles
}







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
    init();  
});










// Functions
const endConnection = () => {
    connection.end();
};

const init = () => {
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
            viewAllEmployees();
            break;
        case 'View Employees By Department':
            viewByDepartment();
            break;
        case 'View Employees By Manager':
            viewByManager();
            break;
        case 'Add an Employee':
            addEmployeeName();
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
            endConnection();
            break;
    };
};

const viewAllEmployees = () => {
    // This probably needs a join, currently doesn't give all of the desired information
    connection.query(
        `SELECT * FROM Employees`,
        (err, res) => {
            err ? console.error(err) : console.table(res);
            init();
        }
    );
};

const viewByDepartment = () => {
    // Also needs a join, just testing function calls and DB queries for now
    connection.query(
        `SELECT * FROM Departments`,
        (err, res) => {
            err ? console.error(err) : console.table(res);
            init();
        }
    );
};

const viewByManager = () => {
    // NEEDS JOIN
    connection.query(
        `SELECT * FROM Employees WHERE ?`,
        {
            Manager_ID: 1 || 2
        },
        (err,res) => {
            err ? console.error(err) : console.table(res);
            init();
        }
    )
}

const addEmployeeName = () => {
    inquirer
        .prompt(addEmployeeNamePrompts)
        .then((addEmployeeNamePrompts) => {
            // console.log(addEmployeeNamePrompts.firstName, addEmployeeNamePrompts.lastName);
            addEmployeeRole(addEmployeeNamePrompts.firstName, addEmployeeNamePrompts.lastName);
        }
    )
}

const addEmployeeRole = (firstName, lastName) => {
    connection.query(
        // Get Existing Roles from DB
        `SELECT Title FROM Roles`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            // For Loop to Populate Existing Roles from DB
            for (let i = 0; i < res.length; i++) {
                if (existingRoles.includes(res[i].Title)) {
                    continue;
                }
                else {
                    existingRoles.push(res[i].Title);
                }
            }
            existingOrNewRole(firstName, lastName);
        }
    )
}

const existingOrNewRole = (firstName, lastName) => {
    inquirer
        .prompt(existingOrNewRolePrompt)
        .then((existingOrNewRolePrompt) => {
            if (existingOrNewRolePrompt.existingOrNew == 'Existing') {
                existingRole(firstName, lastName);
            }
            else if (existingOrNewRolePrompt.existingOrNew == 'New') {
                // console.log('New Role');
                newRole(firstName, lastName);
            }
            // console.log(firstName, lastName); // Check to make sure previous prompt data is still coming through new functions
            
        }
    )
}


const newRole = (firstName, lastName) => {
    inquirer
        .prompt(newRolePrompt)
        .then((newRolePrompt) => {
            // console.log(firstName, lastName, newRolePrompt.newRole);
            addEmployeeManager(firstName, lastName, newRolePrompt.newRole);
        })
}

const existingRole = (firstName, lastName) => {
    inquirer
        .prompt(existingRolePrompt)
        .then((existingRolePrompt) => {
            // console.log(firstName, lastName, existingRolePrompt.existingRole);
            addEmployeeManager(firstName, lastName, existingRolePrompt.existingRole);
        })
}

const addEmployeeManager = (firstName, lastName, role) => {
    console.log('function call worked');
    console.log(firstName, lastName, role);
    init();
}