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

function menuPrompt(){
  inquirer.prompt([{
            type: 'list',
            name: 'menuSelect',
            message: 'Management console: What would you like to do today?',
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Program"]
        }]).then(function(answers) {
        	switch(answers.menuSelect) {
        		case "View Products for Sale":
	        		viewProd();
	        		break;
        		case "View Low Inventory":
        			viewLow();
        			break;
        		case "Add to Inventory":
        			addInv();
        			break;
        		case "Add New Product":
        			addProd();
        			break;
        		case "Exit Program":
        			exitProgram();
        			break;
        	}
        });
}


function viewProd(param, callback){

    connection.query("SELECT * FROM products", function(error, results) {

        if (error) throw error;
        console.log("\n\n");
        console.log("Current Inventory:")
        console.log("\n\n");
        

        var t = new Table;

        results.forEach(function(product) {
        	t.cell('Item', product.item_id);
        	t.cell('Product', product.product_name);
        	t.cell('Department', product.department_name);
        	t.cell('Price', product.price, Table.number(2));
        	t.cell('Quantity', product.stock_quantity)
        	t.newRow();


        });

        console.log(t.toString());

        if (param){
        callback();
	    }else{
	    	menuPrompt();
	    }

	});
}



function viewLow(){

	connection.query("Select * FROM products WHERE stock_quantity < 5", function(error, results) {
		 var t = new Table;

        results.forEach(function(product) {
        	t.cell('Item', product.item_id);
        	t.cell('Product', product.product_name);
        	t.cell('Department', product.department_name);
        	t.cell('Price', product.price, Table.number(2));
        	t.cell('Quantity', product.stock_quantity)
        	t.newRow();


        });

        console.log(t.toString());
		menuPrompt();
	});

	
}






function addInv(){

	 viewProd("success", promptInv);
	 	

	function promptInv(){
	 inquirer.prompt([{
	            type: 'input',
	            name: 'item_id',
	            message: 'What is the Item ID of the item you would like to increase in inventory?'
	        }, {
	            type: 'input',
	            name: 'quantity',
	            message: 'How many units would you like to add to the inventory of this item?',
	            validate: function (input){
	            	if((/^([0-9]|[1-9][0-9])$/).test(input)){
	            		return true;
	            	}else{
	            		return "Please enter a number between 1 and 99";
	            	}
	            }

	        }]).then(function(answers) {

	        connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answers.quantity, answers.item_id]);
	        console.log("Your inventory  was successfully updated!");
	        menuPrompt();

	    	});

	}

}


function addProd(){

	inquirer.prompt([
		{
		type:'input',
		name: 'product_name',
		message: 'What is the name of the product?',
		validate: function(input){
				if( (/^[\w][\w'\s]{1,30}$/).test(input) ){
					return true;
				}else{
					return "Please enter a valid product name";
				}
			}
		},
		{
		type:'input',
		name: 'department_name',
		message: 'What is the department name?',
		validate: function(input){
				if((/^[\w][\w'\s&]{1,30}$/).test(input)){
					return true;
				}else{
					return "Please enter a valid department name";
				}
			}	
		},
		{
		type:'input',
		name: 'price',
		message: 'What is the price?',
		validate: function(input){
				if((/^[\d]{0,6}[.][\d][\d]$/).test(input)){
					return true;
				}else{
					return "Price must include decimal place";
				}
			}
		},
		{
		type:'input',
		name: 'stock_quantity',
		message: 'What is the stock quantity?',
		validate: function(input){
				if((/^([0-9]|[1-9][0-9])$/).test(input)){
					return true;
				}else{
					return "Please enter a valid stock quantity";
				}
			}
		

	}]).then(function(answers){
		connection.query("INSERT INTO products SET ?", {
			product_name: answers.product_name,
			department_name: answers.department_name,
			price: answers.price,
			stock_quantity: answers.stock_quantity
		});
		console.log("Product added!");
		menuPrompt();

	});
}







function exitProgram() {
	console.log("See you Later")
    connection.end();
}

menuPrompt(); //starts app

