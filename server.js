const express = require('express');
require("dotenv").config();
const mysql = require('mysql2');
const session = require('express-session')
const bcrypt = require("bcrypt")
const app = express();
const cors = require("cors");
const mysqlStore = require('express-mysql-session')(session);

app.use(cors());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const IN_PROD = process.env.NODE_ENV === 'production'
const TWO_HOURS = 1000 * 60 * 60 * 2

const con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.MYSQL_DB,
  });

con.connect(function(err) {
    if(err) throw(err);
	console.log("Connected!");
});

const options = {
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    createDatabaseTable: true   
};

const sessionStore = new mysqlStore(options);

app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        httpOnly: true,
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
}));

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
            {
                console.log(data[0].id)
                req.session.userId = data[0].id
                res.render('index');
            }
            
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