const express = require('express');
const mysql = require('mysql2');
const session = require('express-session')

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
	res.render('createuser');
});

app.get('/createrecipes', (req, res) => {
	res.render('createrecipes');
});

app.get('/', (req, res) => {
	res.render('index')
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.render('index')
});

app.post('/loginUser',(req,res) => {

	//let userData = con.query(`SELECT * FROM users WHERE email = ${req.body.email} AND WHERE userPassword = ${req.body.password}`);

    if(userData){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session);
        res.render('index');
    }
    
	else{
        res.send('Invalid username or password');
    }
});

app.post('/createUser',(req,res) => {
    let fullName = req.body.fullName;
    let userPassword = req.body.userPassword;
    let email = req.body.email;

    con.query(`SELECT * FROM users WHERE email = ${email}`)


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