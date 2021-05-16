// Dependencies
const password = require('./dbpassword.json'); //Importing DB Connection Info from Ignored File
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');


                    /*

BREAK BETWEEN SECTIONS

                    */  


// Other Stuff
let existingRoles = new Array;

let existingManagers = ['None'];

let existingEmployees = new Array;

let existingDepartments = new Array;


                    /*

BREAK BETWEEN SECTIONS

                    */      


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
            'Add a Manager',
            'Add a Role',
            'Remove a Role',
            'Add a Department',
            'Remove a Department',
            `Update an Employee's Role`,
            `Update an Employee's Manager`,
            `View Department Budgets`,
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

const newRolePrompt = [
    {
        type: 'input',
        name: 'newRole',
        message: `What Is This Employee's Role?`
    },
    {
        type: 'Number',
        name: 'salary',
        message: 'How much does this role earn annually?'
    },
    {
        type: 'list',
        name: 'departmentName',
        message: 'Which department does this role belong?',
        choices: existingDepartments
    }
]

const removeRolePrompt = {
    type: 'list',
    name: 'removedRole',
    message: 'Which role would you like to remove?',
    choices: existingRoles
}

const existingRolePrompt = {
    type: 'list',
    name: 'existingRole',
    message: `What Is This Employee's Role`,
    choices: existingRoles
}

const removedEmployeePrompt = {
    type: 'list',
    name: 'removedEmployee',
    message: 'Select the Employee to Remove',
    choices: existingEmployees
}

const addDepartmentPrompt = {
    type: 'input',
    name: 'addDepartment',
    message: 'What is the name of the new department?'
}

const removeDepartmentPrompt = {
    type: 'list',
    name: 'removedDepartment',
    message: 'Which Department do you Want to Remove?',
    choices: existingDepartments
}

const selectManager = {
    type: 'list',
    name: 'selectManager',
    message: `Please select this employee's direct manager.`,
    choices: existingManagers
}

const viewDeptPrompt = [
    {
        type: "list",
        name: "chooseDept",
        message: "Please select a department",
        choices: existingDepartments
    }
]

const viewManagerPrompt = [
    {
        type: "list",
        name: "chooseManager",
        message: "Please select a manager",
        choices: existingManagers
    }
]

const updatePrompt = {
    type: 'list',
    name: 'update',
    message: 'Which employee would you like to update?',
    choices: existingEmployees
}

const chooseNewMng = {
    type: 'list',
    name: 'newMng',
    message: `Who is this employee's new Manager?`,
    choices: existingManagers
}

const chooseNewRole = {
    type: 'list',
    name: 'newRole',
    message: `What is this employee's new Role?`,
    choices: existingRoles
}

const budgetDepartmentPrompt = {
    type: 'list',
    name: 'chooseDepartment',
    message: 'Which Department Budget do you Want to View?',
    choices: existingDepartments
}


                    /*

BREAK BETWEEN SECTIONS

                    */


// DB Connection
const connection = mysql.createConnection({
    host: 'localhost',

    // Local Host Port
    port: 3306,

    // Username: Username is Hidden in Ignored JSON
    user: password.user,

    // Password: Password is Hidden in Ignored JSON
    password: password.password,
    
    // Database: Database Name is Hidden in Ignored JSON
    database: password.database
});

// Connect to the DB
connection.connect((err) => {
    err ? console.error(err) : console.log('Connected to Database');
    init();  
});


                    /*

BREAK BETWEEN SECTIONS

                    */


// Functions
const endConnection = () => {
    connection.end();
};

const init = () => {
    inquirer
        .prompt(initalPrompt)
        .then((initalPrompt) => {
            switchCases(initalPrompt.firstResponse);
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
            removeEmployee();
            break;
        case 'Add a Manager':
            addManagerName();
            break;
        case 'Add a Role':
            popRole();
            break;
        case 'Remove a Role':
            removeRole();
            break;
        case 'Add a Department':
            createDepartment();
            break;
        case 'Remove a Department':
            removeDepartment();
            break;
        case `Update an Employee's Role`:
            updateEmployeeRole();
            break;
        case `Update an Emplyoee's Manager`:
            updateEmployeeMng();
            break;
        case `View Department Budgets`:
            budgetSelectDepartment();
            break;
        case `Exit`:
            endConnection();
            break;
    };
};

const viewAllEmployees = () => {
    connection.query(
        `SELECT Employees.Employee_ID, Employees.First_Name, Employees.Last_Name, Managers.First_Name 
        AS Manager_First_Name, Managers.Last_Name AS Manager_Last_Name, Roles.Title AS Role, Departments.Department_Name AS Department 
        FROM Employees LEFT JOIN Managers ON Employees.Manager_ID = Managers.Manager_ID 
        JOIN Roles ON Employees.Role_ID = Roles.Role_ID JOIN Departments ON Departments.Department_ID = Roles.Department_ID`,
        (err, res) => {
            err ? console.error(err) : console.table(res);
            return init();
        }
    );
};

const viewByDepartment = () => {
    connection.query(`SELECT Department_Name FROM Departments`, 
    (err, res) => {
      if (err) {
          console.error(err);
      }
      for (let i = 0; i < res.length; i++) {
          if (existingDepartments.includes(`${res[i].Department_Name}`)
          ) {
              continue;
          } else {
              existingDepartments.push(`${res[i].Department_Name}`);
          }
      }
      selectViewByDepartment();
    });
};

const selectViewByDepartment = () => {
    inquirer.prompt(viewDeptPrompt).then((viewDeptPrompt) => {
        connection.query(`SELECT Employees.Employee_ID, Employees.First_Name, Employees.Last_Name, Managers.First_Name 
        AS Manager_First_Name, Managers.Last_Name AS Manager_Last_Name, Roles.Title AS Role, Departments.Department_Name 
        AS Department FROM Employees LEFT JOIN Managers ON Employees.Manager_ID = Managers.Manager_ID JOIN Roles ON Employees.Role_ID = Roles.Role_ID 
        JOIN Departments ON Departments.Department_ID = Roles.Department_ID AND Department_Name = "${viewDeptPrompt.chooseDept}"`,
        (err, res) => {
            err ? console.error(err) : console.table(res);
            return init();
        }
        )
    })
};

const viewByManager = () => {
    connection.query(`SELECT First_Name, Last_Name FROM Managers`, 
    (err, res) => {
      if (err) {
          console.error(err);
      }
      for (let i = 0; i < res.length; i++) {
        if (existingManagers.includes(res[i].First_Name && res[i].Last_Name)) {
          continue;
        } else {
          existingManagers.push(res[i].First_Name + " " + res[i].Last_Name);
          }
      }
      selectViewByManager();
    });
};

const selectViewByManager = () => {
      inquirer
      .prompt(viewManagerPrompt)
      .then((viewManagerPrompt) => {
          let managerLast = viewManagerPrompt.chooseManager.split(' ');
          connection.query(`SELECT Manager_ID FROM Managers WHERE First_Name="${managerLast[0]}" AND Last_Name="${managerLast[1]}"`,
          (err, res) => {
            if (err) {
                console.error(err);
            }
            finalViewByManager(res[0].Manager_ID);
        }
      )}
    )
};

const finalViewByManager = (ManID) => {
    connection.query(
        `SELECT Employee_ID, First_Name, Last_Name FROM Employees WHERE Manager_ID = ${ManID} `,
        (err, res) => {
            if (err) {
                console.error(err);
            } else if (res){
                console.table(res);
                return init();
            }
        },
    )
}

const popRole = () => {
    connection.query(
        `SELECT Department_Name FROM Departments`,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < res.length; i++) {
                if (existingDepartments.includes(res[i].Department_Name)) {
                    continue;
                }
                else {
                    existingDepartments.push(res[i].Department_Name);
                }
            }
            return addRole();
        }
    )
}

const addRole = () => {
    inquirer
        .prompt(newRolePrompt)
        .then((newRolePrompt) => {
            connection.query(
                `SELECT Department_ID FROM Departments WHERE Department_Name = "${newRolePrompt.departmentName}"`,
                (err, res) => {
                    if (err) {
                        console.error(err);
                    }
                    let departmentID = res[0].Department_ID;
                    addRoleCont(newRolePrompt.newRole, newRolePrompt.salary, departmentID);
                }
            )
        }
    )
}

const addRoleCont = (newRole, salary, ID) => {
    connection.query(
        `INSERT INTO Roles SET ?`,
        {
            Title: `${newRole}`,
            Salary: parseInt(`${salary}`),
            Department_ID: parseInt(`${ID}`)
        },
        (err, res) => {
            if (err) {
                console.error(err);
            }
            return init();
        }
    )
}

const removeRole = () => {
    connection.query(
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
            verifyDeleteRoleRequest();
        }
    )
}

const verifyDeleteRoleRequest = () => {
    inquirer
        .prompt(removeRolePrompt)
        .then((removeRolePromptResponse) => {
            inquirer
                .prompt({
                    type: 'list',
                    name: 'confirmroledelete',
                    message: `Are you sure you want to delete the role: ${removeRolePromptResponse.removedRole}?`,
                    choices: ['Yes', 'No']
                })
                .then((confirmDelete) => {
                    if(confirmDelete.confirmroledelete == 'Yes'){
                        findDeleteRoleID(removeRolePromptResponse.removedRole);
                    } else if (confirmDelete.confirmroledelete == 'No'){
                        return init();
                    }
                })
        })
}

const findDeleteRoleID = (removedTitle) => {
    connection.query(
        `SELECT Role_ID FROM Roles WHERE Title = "${removedTitle}"`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            finalRoleDelete(res[0].Role_ID, removedTitle)
        }
    )
}

const finalRoleDelete = (removedRoleID, removedTitle) => {
    connection.query(
        `DELETE FROM Roles WHERE Role_ID = ${removedRoleID}`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
        }
    )
    existingRoles.pop(removedTitle);
    return init();
}

const addEmployeeName = () => {
    inquirer
        .prompt(addEmployeeNamePrompts)
        .then((addEmployeeNamePrompts) => {
            addEmployeeRole(addEmployeeNamePrompts.firstName, addEmployeeNamePrompts.lastName);
        }
    )
}

const addEmployeeRole = (firstName, lastName) => {
    connection.query(
        // Get Existing Roles from DB
        `SELECT Title FROM Roles`,
        (err, res) => {
            if (err) throw err;
            // For Loop to Populate Existing Roles from DB
            for (let i = 0; i < res.length; i++) {
                if (existingRoles.includes(res[i].Title)) {
                    continue;
                }
                else {
                    existingRoles.push(res[i].Title)
                }
            }
            existingRole(firstName, lastName);
        }
    )
}

const existingRole = (firstName, lastName) => {
    inquirer
        .prompt(existingRolePrompt)
        .then((existingRolePrompt) => {
            confirmDepartment(firstName, lastName, existingRolePrompt.existingRole);
        })
}

const confirmDepartment = (firstName, lastName, selectedRole) => {
    connection.query(
        `SELECT Department_ID FROM Roles WHERE Title = '${selectedRole}'`,
        (err, res) => {
            if (err) throw err;
            let currentDepartment = res[0].Department_ID;
            addEmployeeManager(firstName, lastName, selectedRole, currentDepartment);
        
        })
}

const addEmployeeManager = (firstName, lastName, role, dept) => {
    connection.query(
        // Get Existing Roles from DB
        `SELECT First_Name, Last_Name FROM Managers WHERE Department_ID = ${dept}`,
        (err, res) => {
            if (err) throw err;
            // For Loop to Populate Existing Roles from DB
            for (let i = 0; i < res.length; i++) {
                if (existingManagers.includes(`${res[i].First_Name} ${res[i].Last_Name}`)) {
                    continue;
                }
                else {
                    existingManagers.push(`${res[i].First_Name} ${res[i].Last_Name}`)
                }
            }
            inquirer
            .prompt(selectManager)
            .then((selectManagerResponse) => {
                determineRoleID(firstName, lastName, role, selectManagerResponse.selectManager);
            })
        }
    )
}

const determineRoleID = (firstName, lastName, Role, selectManagerResponse) => {
    connection.query(
        `SELECT Role_ID FROM Roles WHERE Title = '${Role}'`,
        (err, res) => {
            if (err) throw err;
            let currentRoleID = res[0].Role_ID;
            determineManagerID(firstName, lastName, currentRoleID, selectManagerResponse)     
        }
    )
}

const determineManagerID = (firstName, lastName, currentRoleID, selectManagerResponse) => {
    if(selectManagerResponse == "None"){
        completeAddEmployeesNoManager(firstName, lastName, currentRoleID)
    }
    else{
        const currentManager = selectManagerResponse.split(' ');
        connection.query(
            `SELECT Manager_ID FROM Managers WHERE First_Name = '${currentManager[0]}' AND Last_Name = '${currentManager[1]}'`,
            (err, res) => {
                if (err) throw err;
                let currentManagerID = res[0].Manager_ID;
                completeAddEmployees(firstName, lastName, currentRoleID, currentManagerID)
              }  
        )
    }
}

const completeAddEmployees = (firstName, lastName, currentRoleID, currentManagerID) => {
    connection.query(
        `INSERT INTO Employees(First_Name, Last_Name, Role_ID, Manager_ID) VALUES ('${firstName}', '${lastName}', ${currentRoleID}, ${currentManagerID})`,
        (err, res) => {
            if (err) throw err;
            return init();
          }  
    )
}

const completeAddEmployeesNoManager = (firstName, lastName, currentRoleID) => {
    connection.query(
        `INSERT INTO Employees(First_Name, Last_Name, Role_ID) VALUES ('${firstName}', '${lastName}', ${currentRoleID})`,
        (err, res) => {
            if (err) throw err;
            return init();
          }  
    )
}

const addManagerName = () => {
    inquirer
        .prompt(addEmployeeNamePrompts)
        .then((addEmployeeNamePrompts) => {
            addManagerRole(addEmployeeNamePrompts.firstName, addEmployeeNamePrompts.lastName);
        }
    )
}

const addManagerRole = (firstName, lastName) => {
    connection.query(
        // Get Existing Roles from DB
        `SELECT Title FROM Roles`,
        (err, res) => {
            if (err) throw err;
            // For Loop to Populate Existing Roles from DB
            for (let i = 0; i < res.length; i++) {
                if (existingRoles.includes(res[i].Title)) {
                    continue;
                }
                else {
                    existingRoles.push(res[i].Title)
                }
            }
            existingManagerRole(firstName, lastName);
        }
    )
}

const existingManagerRole = (firstName, lastName) => {
    inquirer
        .prompt(existingRolePrompt)
        .then((existingRolePrompt) => {
            confirmManagerDepartment(firstName, lastName, existingRolePrompt.existingRole);
        })
}

const confirmManagerDepartment = (firstName, lastName, selectedRole) => {
    connection.query(
        `SELECT Department_ID FROM Roles WHERE Title = '${selectedRole}'`,
        (err, res) => {
            if (err) throw err;
            let currentDepartment = res[0].Department_ID;
            addManagerManager(firstName, lastName, selectedRole, currentDepartment);
        
        })
}

const addManagerManager = (firstName, lastName, role, dept) => {
    connection.query(
        // Get Existing Roles from DB
        `SELECT First_Name, Last_Name FROM Managers WHERE Department_ID = ${dept}`,
        (err, res) => {
            if (err) throw err;
            // For Loop to Populate Existing Roles from DB
            for (let i = 0; i < res.length; i++) {
                if (existingManagers.includes(`${res[i].First_Name} ${res[i].Last_Name}`)) {
                    continue;
                }
                else {
                    existingManagers.push(`${res[i].First_Name} ${res[i].Last_Name}`)
                }
            }
            inquirer
            .prompt(selectManager)
            .then((selectManagerResponse) => {
                determineManagerRoleID(firstName, lastName, role, selectManagerResponse.selectManager, dept);
            })
        }
    )
}

const determineManagerRoleID = (firstName, lastName, Role, selectManagerResponse, dept) => {
    connection.query(
        `SELECT Role_ID FROM Roles WHERE Title = '${Role}'`,
        (err, res) => {
            if (err) throw err;
            let currentRoleID = res[0].Role_ID;
            determineManagerManagerID(firstName, lastName, currentRoleID, selectManagerResponse, dept)     
        }
    )
}

const determineManagerManagerID = (firstName, lastName, currentRoleID, selectManagerResponse, dept) => {
    if(selectManagerResponse == "None"){
        completeManagerAddEmployeesNoManager(firstName, lastName, currentRoleID, dept)
    }
    else{
        const currentManager = selectManagerResponse.split(' ');
        connection.query(
            `SELECT Manager_ID FROM Managers WHERE First_Name = '${currentManager[0]}' AND Last_Name = '${currentManager[1]}'`,
            (err, res) => {
                if (err) throw err;
                let currentManagerID = res[0].Manager_ID;
                completeManagerAddEmployees(firstName, lastName, currentRoleID, currentManagerID, dept)
              }  
        )
    }
}

const completeManagerAddEmployees = (firstName, lastName, currentRoleID, currentManagerID, dept) => {
    connection.query(
        `INSERT INTO Employees(First_Name, Last_Name, Role_ID, Manager_ID) VALUES ('${firstName}', '${lastName}', ${currentRoleID}, ${currentManagerID})`,
        (err, res) => {
            if (err) throw err;
            return completeManagerAddManagers(firstName,lastName,currentRoleID, currentManagerID, dept);
          }  
    )
}

const completeManagerAddManagers = (firstName, lastName, currentRoleID, currentManagerID, dept) => {
    connection.query(
        `INSERT INTO Managers(First_Name, Last_Name, Role_ID, This_Manager_ID, Department_ID) VALUES ('${firstName}', '${lastName}', ${currentRoleID}, ${currentManagerID}, ${dept})`,
        (err, res) => {
            if (err) throw err;
            return init();
          }  
    )
}

const completeManagerAddEmployeesNoManager = (firstName, lastName, currentRoleID, dept) => {
    connection.query(
        `INSERT INTO Employees(First_Name, Last_Name, Role_ID) VALUES ('${firstName}', '${lastName}', ${currentRoleID})`,
        (err, res) => {
            if (err) throw err;
            return completeManagerAddManagersNoManager(firstName, lastName, currentRoleID, dept);
          }  
    )
}

const completeManagerAddManagersNoManager = (firstName, lastName, currentRoleID, dept) => {
    connection.query(
        `INSERT INTO Managers(First_Name, Last_Name, Role_ID, Department_ID) VALUES ('${firstName}', '${lastName}', ${currentRoleID}, ${dept})`,
        (err, res) => {
            if (err) throw err;
            return init();
          }  
    )
}

const removeEmployee = () => {
    connection.query(
        `SELECT First_Name, Last_Name FROM Employees`,
        (err,res) => {
            if (err) {
                console.error(err);
            };
            for (let i = 0; i < res.length; i++) {
                if (existingEmployees.includes(`${res[i].First_Name} ${res[i].Last_Name}`)) {
                    continue;
                }
                else {
                    existingEmployees.push(`${res[i].First_Name} ${res[i].Last_Name}`);
                }
            }
            verifyDeleteEmployeeRequest();
        }
    )
}

const verifyDeleteEmployeeRequest = () => {
    inquirer
        .prompt(removedEmployeePrompt)
        .then((removedEmployeePromptResponse) => {
            inquirer
                .prompt({
                    type: 'list',
                    name: 'confirmemployeedelete',
                    message: `Are you sure you want to delete the role: ${removedEmployeePromptResponse.removedEmployee}?`,
                    choices: ['Yes', 'No']
                })
                .then((confirmDelete) => {
                    const firstLast = removedEmployeePromptResponse.removedEmployee.split(' ');
                    if(confirmDelete.confirmemployeedelete == 'Yes'){
                        findDeleteEmployeeID(firstLast[0], firstLast[1], removedEmployeePromptResponse.removedEmployee);
                    } else if (confirmDelete.confirmemployeedelete == 'No'){
                        return init();
                    }
                })
        })
}

const findDeleteEmployeeID = (firstName, lastName, fullName) => {
    connection.query(
        `SELECT Employee_ID FROM Employees WHERE First_Name = "${firstName}" AND Last_Name = "${lastName}"`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            finalRemovedEmployee(res[0].Employee_ID, fullName)
        }
    )
}

const finalRemovedEmployee = (EmployeeID, fullName) => {
    connection.query(
        `DELETE FROM Employees WHERE Employee_ID = ${EmployeeID}`,
        (err, res) => {
            if (err) throw err;
        }
    )
    existingEmployees.pop(fullName);
    existingManagers.pop(fullName);
    return init();
};

const createDepartment = () => {
    inquirer  
        .prompt(addDepartmentPrompt)
        .then((addDepartmentPrompt) => {
            connection.query(
                `INSERT INTO Departments SET Department_Name = '${addDepartmentPrompt.addDepartment}'`,
                (err, res) => {
                    if (err) {
                        console.error(err);
                    };
                }
            )
            return init();
        }
    )
}

const removeDepartment = () => {
    connection.query(
        `SELECT Department_Name FROM Departments`,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(res);
            }
            for (let i = 0; i < res.length; i++) {
                if (existingDepartments.includes(res[i].Department_Name)) {
                    continue;
                }
                else {
                    existingDepartments.push(res[i].Department_Name);
                }
            }
            verifyDeleteDepartmentRequest();
        }
    )
}

const verifyDeleteDepartmentRequest = () => {
    inquirer
        .prompt(removeDepartmentPrompt)
        .then((removeDepartmentPromptResponse) => {
            inquirer
                .prompt({
                    type: 'list',
                    name: 'confirmdepartmentdelete',
                    message: `Are you sure you want to delete the role: ${removeDepartmentPromptResponse.removedDepartment}?`,
                    choices: ['Yes', 'No']
                })
                .then((confirmDelete) => {
                    // const firstLastDepartment = removeDepartmentPromptResponse.removedDepartment.split(' ');
                    if(confirmDelete.confirmdepartmentdelete == 'Yes'){
                        findDeleteDepartmentID(removeDepartmentPromptResponse.removedDepartment);
                    } else if (confirmDelete.confirmdepartmentdelete == 'No'){
                        return init();
                    }
                })
        })
}

const findDeleteDepartmentID = (departmentName) => {
    connection.query(
        `SELECT Department_ID FROM Departments WHERE Department_Name = "${departmentName}"`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
            finalRemovedDepartment(res[0].Department_ID, departmentName)
        }
    )
}

const finalRemovedDepartment = (departmentID, departmentName) => {
    connection.query(
        `DELETE FROM Departments WHERE Department_ID = '${departmentID}'`,
        (err, res) => {
            if (err) {
                console.error(err);
            };
        }
    )
    existingDepartments.pop(departmentName);
    return init();
}

const updateEmployeeRole = () => {
    connection.query(
      `SELECT First_Name, Last_Name FROM Employees`,
      (err, res) => {
        if (err) {
          console.error(err);
        }
        for (let i = 0; i < res.length; i++) {
          if (existingEmployees.includes(res[i].First_Name && res[i].Last_Name)) {
            continue;
          } else {
            existingEmployees.push(res[i].First_Name + " " + res[i].Last_Name);
          }
        }
        updateRoleSelectRole();
      }
    );
  };
  const updateRoleSelectRole = () => {
    inquirer.prompt(updatePrompt).then((updatePromptResponse) => {
      let chosenEmployee = updatePromptResponse.update.split(" ");
      connection.query(`SELECT Title FROM Roles`, (err, res) => {
        if (err) {
          console.error(err);
        }
        for (let i = 0; i < res.length; i++) {
          if (existingRoles.includes(res[i].Title)) {
            continue;
          } else {
            existingRoles.push(res[i].Title);
          }
        }
        obtainID(chosenEmployee);
      });
    });
  };
  const obtainID = (chosenEmployee) => {
    connection.query(
      `SELECT Employee_ID FROM Employees WHERE First_Name = "${chosenEmployee[0]}" AND Last_Name = "${chosenEmployee[1]}"`,
      (err, res) => {
        if (err) {
          console.error(err);
        }
        obtainRoleID(res[0].Employee_ID, chosenEmployee);
      }
    )
  };
  const obtainRoleID = (Employee_ID, chosenEmployee) => {
    inquirer.prompt(chooseNewRole).then((chooseNewRoleResponse) => {
      connection.query(
        `SELECT Role_ID FROM Roles WHERE Title = "${chooseNewRoleResponse.newRole}"`,
        (err, res) => {
          if (err) {
            console.error(err);
          }
          updateRoleQuery(Employee_ID, res[0].Role_ID, chosenEmployee);
        }
      )
    })
  }
  const updateRoleQuery = (Employee_ID, Role_ID, chosenEmployee) => {
    connection.query(
      `UPDATE Employees SET Role_ID = ${Role_ID} WHERE Employee_ID = ${Employee_ID}`,
      (error) => {
        if (error) throw err;
        findIfManagerRole(Employee_ID, Role_ID, chosenEmployee);
      }
    );
};

const findIfManagerRole = (Employee_ID, Role_ID, chosenEmployee) => {
    connection.query(
        `SELECT Manager_ID FROM Managers WHERE Role_ID = ${Role_ID}`,
        (err, res) => {
            if (err) {
              console.error(err);
            }
            console.log(res)
            if(res[0]){
                console.log("Managerial Role Found")
                findDepartmentID(Employee_ID, Role_ID, chosenEmployee);
            } else {
                console.log('non managerial role')
                return init();
            }
          } 
    )
}

const findDepartmentID = (Employee_ID, Role_ID, chosenEmployee) => {
    connection.query(
        `SELECT Department_ID FROM Roles WHERE Role_ID = ${Role_ID}`,
        (err, res) => {
            if(err) {
                console.error(err);
            }
            findManagerID(Employee_ID, Role_ID, chosenEmployee, res[0].Department_ID);
        }
    )
}

const findManagerID = (Employee_ID, Role_ID, chosenEmployee, Department_ID) => {
    connection.query(
        `SELECT Manager_ID FROM Employees WHERE Employee_ID = ${Employee_ID}`,
        (err, res) => {
            if(err){
                console.error(err);
            }
            let hasManager = false;
            if(res[0]){
                hasManager = true;
            }
            if(hasManager == true){
                createNewManager(Role_ID, chosenEmployee, Department_ID, res[0].Manager_ID);
            }
            else if(!res[0].Manager_ID){
                createNewManagerNoManager(Role_ID,chosenEmployee,Department_ID)
            }
        }
    )
}

const createNewManager = (Role_ID, chosenEmployee, Department_ID, Manager_ID) => {
    connection.query(
        `INSERT INTO Managers(First_Name, Last_Name, Role_ID, This_Manager_ID, Department_ID) VALUES ("${chosenEmployee[0]}", "${chosenEmployee[1]}", ${Role_ID}, ${Manager_ID}, ${Department_ID})`,
        (err, res) => {
            if(err){
                console.error(err);
            }
            return init();
        }
    )
}

const createNewManagerNoManager = (Role_ID, chosenEmployee, Department_ID) => {
    connection.query(
        `INSERT INTO Managers(First_Name, Last_Name, Role_ID, Department_ID) VALUES ("${chosenEmployee[0]}", "${chosenEmployee[1]}", ${Role_ID}, ${Department_ID})`,
        (err, res) => {
            if(err){
                console.error(err);
            }
            return init();
        }
    )
}

const updateEmployeeMng = () => {
    connection.query(
      `SELECT First_Name, Last_Name FROM Employees`,
      (err, res) => {
        if (err) {
          console.error(err);
        }
        for (let i = 0; i < res.length; i++) {
          if (existingEmployees.includes(res[i].First_Name && res[i].Last_Name)) {
            continue;
          } else {
            existingEmployees.push(res[i].First_Name + " " + res[i].Last_Name);
          }
        }
        updateMngSelectMng();
      }
    );
};

const updateMngSelectMng = () => {
    inquirer.prompt(updatePrompt).then((updatePromptResponse) => {
      let chosenEmployee = updatePromptResponse.update.split(" ");
      connection.query(`SELECT First_Name, Last_Name FROM Managers`, (err, res) => {
        if (err) {
          console.error(err);
        }
        for (let i = 0; i < res.length; i++) {
          if (existingManagers.includes(res[i].First_Name && res[i].Last_Name)) {
            continue;
          } else {
            existingManagers.push(res[i].First_Name + ' ' + res[i].Last_Name);
          }
        }
        obtainEmpID(chosenEmployee);
      });
    });
};

const obtainEmpID = (chosenEmployee) => {
    connection.query(
      `SELECT Employee_ID FROM Employees WHERE First_Name = "${chosenEmployee[0]}" AND Last_Name = "${chosenEmployee[1]}"`,
      (err, res) => {
        if (err) {
          console.error(err);
        }
        obtainMngID(res[0].Employee_ID);
      }
    )
};

const obtainMngID = (Employee_ID) => {
    inquirer.prompt(chooseNewMng).then((chooseNewMngResponse) => {
      let chosenManager = chooseNewMngResponse.newMng.split(" ");
      connection.query(
        `SELECT Manager_ID FROM Managers WHERE First_Name = "${chosenManager[0]}" AND Last_Name = "${chosenManager[1]}"`,
        (err, res) => {
          if (err) {
            console.error(err);
          }
          updateMngQuery(Employee_ID, res[0].Manager_ID);
        }
      )
    })
}

const updateMngQuery = (Employee_ID, Mng_ID) => {
    connection.query(
      `UPDATE Employees SET Manager_ID = ${Mng_ID} WHERE Employee_ID = ${Employee_ID}`,
      (error) => {
        if (error) throw err;
        return init();
      }
    );
};

const budgetSelectDepartment = () => {
    connection.query(
        `SELECT Department_Name FROM Departments`,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            for (let i = 0; i < res.length; i++) {
                if (existingDepartments.includes(`${res[i].Department_Name}`)) {
                    continue;
                }
                else {
                    existingDepartments.push(`${res[i].Department_Name}`);
                }
            }
        budgetByDepartment();
        }
    );
};

const budgetByDepartment = () => {
    inquirer 
        .prompt(budgetDepartmentPrompt)
        .then((budgetDepartmentPromptResponse) => {
            connection.query(
                `SELECT SUM(Salary) AS Budget
                FROM (
                    SELECT Employees.Employee_ID, Employees.First_Name, Employees.Last_Name, Roles.Salary AS Salary
                    FROM Employees
                    LEFT JOIN Roles ON Employees.Role_ID = Roles.Role_ID
                    JOIN Departments ON Departments.Department_ID = Roles.Department_ID AND Department_Name = '${budgetDepartmentPromptResponse.chooseDepartment}'
                ) AS subquery`,
            (err, res) => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.table(res);
                }
                return init();
            }
            )
        }
    )
}