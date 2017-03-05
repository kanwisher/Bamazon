const mysql = require('mysql');
require('console.table');


const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

connection.connect();


connection.query("SELECT * FROM products", function(error, results, fields) {

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

});

connection.end();