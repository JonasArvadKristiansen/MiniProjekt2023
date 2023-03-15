const express = require('express');
const mysql = require('mysql2');


const app = express();
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'test'
  });

  connection.connect(function(err) {
	if(err) throw(err);
	console.log("Connected!");
  });

app.get('/', (req, res) => {
	res.send('<h1>My node App</h1>');
});

app.listen(5000, () => {
	console.log('App listening on port 5000!');
});