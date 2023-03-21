const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

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

app.get('/recapie/:recapieID?', (req, res) => {
    const recapieId = req.params.recapieID
    const queryRecipe = 'recipes.title, recipes.instructions, recipes.personorstk, recipes.totalAmount, recipes.dateCreated, recipes.foodImg'
    const queryIngredients = 'ingredients.ingredient, ingredients.measuringUnit, ingredients.amount'

    // Henter opskrift, ingredienser og forfatter  fra databasen   
	const query = ` SELECT ${queryRecipe}, users.fullName, ${queryIngredients}
            FROM recipes
            INNER JOIN users ON recipes.userId = users.id
            INNER JOIN ingredients ON recipes.id = ingredients.recipeId
            WHERE recipes.id = ?`

    connection.query(query, [recapieId], (err, data) => {
        if (err) {
            console.log(err)
        } else {
            // Henter kommentarende fra databasen
            const query = `SELECT comments.userComment, comments.stars, users.fullName
            FROM comments
            INNER JOIN users ON comments.userId = users.id 
            WHERE comments.recipeId = ?`

            connection.query(query, [recapieId], (err, comments) => {
                if (err) {
                    console.log(err)
                } else {
                    let date = data[0].dateCreated 
                    date = (new Date(date)).toISOString().slice(0,10)
        
                    // Går til siden og sender data man kan bruger på frontenden
                    res.render('recipieSite', {data: data[0], array: data, date: date, comments: comments});
                }
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