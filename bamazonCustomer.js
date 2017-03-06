const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect();

displayTable();



function displayTable() {
    connection.query("SELECT * FROM products", function(error, results) {

        if (error) throw error;
        console.log("\n\n");

        console.log(
            `
		▀█████████▄     ▄████████   ▄▄▄▄███▄▄▄▄      ▄████████  ▄███████▄   ▄██████▄  ███▄▄▄▄   
		  ███    ███   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ ██▀     ▄██ ███    ███ ███▀▀▀██▄ 
		  ███    ███   ███    ███ ███   ███   ███   ███    ███       ▄███▀ ███    ███ ███   ███ 
		 ▄███▄▄▄██▀    ███    ███ ███   ███   ███   ███    ███  ▀█▀▄███▀▄▄ ███    ███ ███   ███ 
		▀▀███▀▀▀██▄  ▀███████████ ███   ███   ███ ▀███████████   ▄███▀   ▀ ███    ███ ███   ███ 
		  ███    ██▄   ███    ███ ███   ███   ███   ███    ███ ▄███▀       ███    ███ ███   ███ 
		  ███    ███   ███    ███ ███   ███   ███   ███    ███ ███▄     ▄█ ███    ███ ███   ███ 
		▄█████████▀    ███    █▀   ▀█   ███   █▀    ███    █▀   ▀████████▀  ▀██████▀   ▀█   █▀  

		`)

        console.table(results); //sooooo beautiful



        inquirer.prompt([{
            type: 'input',
            name: 'item_id',
            message: 'What is the Item ID of the item you would like to purchase?'
        }, {
            type: 'input',
            name: 'quantity',
            message: 'How many units would you like to purchase of this item?'

        }]).then(function(answers) {

            connection.query("SELECT * FROM products WHERE item_id = " + answers.item_id, function(error, results) {
                if (error) throw error;
                let currentPrice = results[0].price;
                console.log(results[0].stock_quantity);
                console.log(typeof(answers.quantity));

                if (results[0].stock_quantity < answers.quantity) {
                    console.log("Insufficient quantity!");
                    displayTable();
                } else {
                    connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answers.quantity + " WHERE item_id = " + answers.item_id, function(error, results) {
                        console.log("Inventory Updated!");
                        console.log("The total is: $" + (answers.quantity * currentPrice));
                        console.log("Thank you for shopping!");
                        exitProgram();
                    });
                }


            })
        });
    });
}









function exitProgram() {
    connection.end();
}
