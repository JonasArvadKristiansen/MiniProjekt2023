const express = require('express');
const mysql = require('mysql2');
const session = require('express-session')
const bcrypt = require("bcrypt")

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'foodblog',
  });

  con.connect(function(err) {
	if(err) throw(err);
	console.log("Connected!");
  });

app.get('/showrecipes', (req, res) => {
	res.render('usersite');
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

app.get('/', (req, res) => {
	res.render('index')
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.render('index');
});

app.post('/loginUser',(req,res) => {
let email = req.body.email
let password = req.body.password

	con.query("SELECT * FROM users WHERE email = ?", email, (err, data) => {
        if(data.length > 0)
        {
            let pwCheck = bcrypt.compareSync(password, data[0].userPassword)
            
            if(pwCheck)
            { res.render('index'); }
            
            else
            { console.log("Wrong password to use"); }
        }
    });
});

app.post('/createUser',(req,res) => {
    let fullName = req.body.fullNavn;
    let password = req.body.password;
    let email = req.body.email;

    con.query("SELECT * FROM users WHERE email = ?", email, (err, data) => {
        if(data.length == 0)
        {
            if(password == req.body.confirmPassword)
            {
                let hashPassword = bcrypt.hashSync(password, 10);

                con.query("INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES (?, ?, ?, FALSE)", [
                    fullName, hashPassword, email
                ]);
                res.render('login');
            }

            else
                console.log("passwords do not match");
        }

        else
            console.log("Email already in use")
    });
});

app.post('/createRecipe',(req,res) => { 
let userid = req.body.id
let title = req.body.title;
let instructions = req.body.instructions;
let personorstk = req.body.personorstk;
let amount = req.body.amount;
let dateCreated = Date.now();

con.query(``);

});

app.post('/deleteRecipe' ,(req,res) => { 

});

app.post('/deleteUser',(req,res) => {
let id = req.body.id;
let email = req.body.email;

con.query(`DELETE FROM users WHERE email = ${email} AND id = ${id}`)

});

app.listen(5000, () => {
	console.log('App listening on port 5000!');
});