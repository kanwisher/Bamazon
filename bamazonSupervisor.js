const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('easy-table');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bamazon'

});

connection.connect();

menuPrompt();


function menuPrompt(){
	inquirer.prompt([{
		type: 'list',
		name: 'menuSelect',
		message: 'Supervisor console: What would you like to do today?',
		choices: ['View Product Sales by Department', 'Create New Department', 'Exit Program']
	}]).then(function(answers) {
		switch(answers.menuSelect) {
        		case "View Product Sales by Department":
	        		viewDeptSales();
	        		break;
        		case "Create New Department":
        			newDept();
        			break;
        		case "Exit Program":
        			exitProgram();

        	};
	});
};




function viewDeptSales(){
	connection.query("SELECT *, product_sales - over_head_costs AS profit FROM departments ORDER BY profit DESC", function(error, results) {
		var t = new Table;

	results.forEach(function(product) {
		t.cell('Department ID', product.department_id);
        	t.cell('Department', product.department_name);
        	t.cell('Overhead Costs', product.over_head_costs, Table.number(2));
        	t.cell('Product Sales', product.product_sales, Table.number(2));
        	t.cell('Profit', product.profit)
        	t.newRow();

		});
	console.log(t.toString());
	menuPrompt();
	});

};


function newDept(){
	inquirer.prompt([{
            type: 'input',
            name: 'deptName',
            message: 'What is the name of the new department?'
        }, {
            type: 'input',
            name: 'overhead',
            message: 'What are the overhead costs for this department?'

        }]).then(function(answers) {

            connection.query("INSERT INTO departments (department_name, over_head_costs, product_sales) VALUES (?, ?, ?)", [answers.deptName, answers.overhead, "0"], function(error, results) {
            	console.log("Department added!");
            	menuPrompt();
			});
		});
};





function exitProgram() {
    connection.end();
    console.log("goodbye");
}