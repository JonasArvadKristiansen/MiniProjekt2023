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
	res.render('createUser');
});

app.get('/createrecipes', (req, res) => {
	res.render('createRecipes');
});

app.get('/recapie/:recapieID', (req, res) => {
    let recapieId = req.url.split('/')[2]

	connection.query('SELECT * FROM recipes WHERE id = ?', [recapieId], (err, recapiData) => {
        if (err) {
            console.log(err)
        } else {
                let userId = recapiData[0].userId
                connection.query('SELECT fullName FROM users WHERE id= ?', [userId], (err, userData) => {
                res.render('recipieSite', {userName:userData[0].fullName, recapiData: recapiData[0]});
            })
        }
    })
});

app.get('/', (req, res) => {
	res.render('index')
});

app.listen(5000, () => {
	console.log('App listening on port 5000!');
});