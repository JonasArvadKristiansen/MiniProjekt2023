const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'foodblog',
  });

  connection.connect(function(err) {
	if(err) throw(err);
	console.log("Connected!");
  });

app.get('/usersite', (req, res) => {
	res.render('usersite');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/createuser', (req, res) => {
	res.render('createuser');
});

app.get('/createrecipes', (req, res) => {
	res.render('createrecipes');
});

app.get('/', (req, res) => {
	res.render('index')
});

app.listen(5000, () => {
	console.log('App listening on port 5000!');
});