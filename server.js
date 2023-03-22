// node_modules for website to work
const express = require('express');
require("dotenv").config();
const mysql = require('mysql2');
const session = require('express-session')
const bcrypt = require("bcrypt")
const app = express();
const mysqlStore = require('express-mysql-session')(session);

app.use(express.static(__dirname + '/public'));

// telling the backend we are using ejs files
app.set('view engine', 'ejs');

//allowing the backend to read req.body
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// creating connection to database using values from .env
const con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.MYSQL_DB,
  });

// tjekking connection to database
con.connect(function(err) {
    if(err) throw(err);
	console.log("Connected!");
});

// values for mysqlStore
const options = {
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    createDatabaseTable: false   
};

// used for uploading session data to database
const sessionStore = new mysqlStore(options);

// setting the session variables and for app to use session
app.use(session({
    // name for session
    name: process.env.SESS_NAME,
    // make so session does not resave on every call to server
    resave: false,
    //make so we dont create a cookie before we have data on user
    saveUninitialized: false,
    // telling where to save session data
    store: sessionStore,
    // setting encrypting data
    secret: process.env.SESS_SECRET,
    cookie: {
        //makes so javascript cant access cookie
        httpOnly: true,
        //setting expire data for cookie
        maxAge: 1000 * 60 * 60 * 2,
        //enables only first-party cookies to be sent/accessed
        sameSite: true,
        //making so cookie works on http and https. if true only https
        secure: false
    }
}));

// get endpoints for ejs files
app.get('/aboutus', (req, res) => {
    if(typeof(req.session.userId) !=  "undefined")
    {
        res.render('aboutUs', {auth: true});
    }
    else
        res.render('aboutUs', {auth: false});
});

app.get('/usersite', (req, res) => {
    if(typeof(req.session.userId) !=  "undefined")
    {
        con.query("SELECT users.fullName, users.email, users.id, recipes.* FROM users INNER JOIN recipes ON recipes.userId = users.id WHERE users.id = ?", req.session.userId, (err, data) => {
            
            res.render('usersite', {auth: true, data: data});
        });
    }

    else
        res.render('index', {auth: false});
	
});

app.get('/login', (req, res) => {
    res.render('login', {auth: false});    
});

app.get('/createuser', (req, res) => {
    res.render('createUser', {auth: false});
});

app.get('/createrecipes', (req, res) => {
    if(typeof(req.session.userId) !=  "undefined")
    {
        res.render('createRecipes', {auth: true});    
    }

    else
        res.render('index', {auth: false});
});

app.get('/recapie/:recapieID', (req, res) => {
    const recapieId = req.params.recapieID
    const queryRecipe = 'recipes.title, recipes.instructions, recipes.personorstk, recipes.totalAmount, recipes.dateCreated, recipes.foodImg'
    const queryIngredients = 'ingredients.ingredient, ingredients.measuringUnit, ingredients.amount'

    // Henter opskrift, ingredienser og forfatter  fra databasen   
	const query = ` SELECT ${queryRecipe}, users.fullName, ${queryIngredients}
            FROM recipes
            INNER JOIN users ON recipes.userId = users.id
            INNER JOIN ingredients ON recipes.id = ingredients.recipeId
            WHERE recipes.id = ?`

        con.query(query, [recapieId], (err, data) => {
        if (err) {
            console.log(err)
        } else {
            // Henter kommentarende fra databasen
            const query = `SELECT comments.userComment, comments.stars, users.fullName
            FROM comments
            INNER JOIN users ON comments.userId = users.id 
            WHERE comments.recipeId = ?`

            con.query(query, [recapieId], (err, comments) => {
                if (err) {
                    console.log(err)
                } else {
                    let date = data[0].dateCreated 
                    date = (new Date(date)).toISOString().slice(0,10)
                    if(typeof(req.session.userId) !=  "undefined")
                    {
                        // Går til siden og sender data man kan bruger på frontenden
                        res.render('recipieSite', {data: data[0], array: data, date: date, comments: comments, auth: true});
                    }

                    else
                    {
                        res.render('recipieSite', {data: data[0], array: data, date: date, comments: comments, auth: false});
                    }
                }
            })            
        }
    })
});

app.get('/', (req, res) => {
    if(typeof(req.session.userId) !=  "undefined")
    {
        res.render('index', {auth: true})
    }
    else
    {
        res.render('index', {auth: false})
    }
});

app.get('/logout', (req, res) => {
    //removing cookie from browser
    res.clearCookie(process.env.SESS_NAME)
    //removing session from database
	req.session.destroy();
	res.render('index', {auth: false});
});

// endpoints for post request
app.post('/loginUser',(req,res) => {

    // variables for later use
    let email = req.body.email
    let password = req.body.password

    //select * from database mathing the parameter 
	con.query("SELECT * FROM users WHERE email = ?", email, (err, data) => {
        if(data.length != 0)
        {   
            // tjekking if typed password match hashed password from database
            let pwCheck = bcrypt.compareSync(password, data[0].userPassword)
            
            //pwCheck return true if they match
            if(pwCheck)
            {
                //setting a userId variable in session for later use
                req.session.userId = data[0].id
                res.render('index', {auth: true});
            }
            
            else
            { 
                console.log("Wrong password to use");
            }
        }
    });
});

app.post('/createUser',(req,res) => {
    // variables for later use
    let fullName = req.body.fullNavn;
    let password = req.body.password;
    let email = req.body.email;

    //selecting from database
    con.query("SELECT * FROM users WHERE email = ?", email, (err, data) => {
        //tjekking if there exist a user with that email
        if(data.length == 0)
        {
            if(password == req.body.confirmPassword)
            {
                //hashing password user typed
                let hashPassword = bcrypt.hashSync(password, 10);

                // inserting user into database
                con.query("INSERT INTO users (fullName, userPassword, email, isAdmin) VALUES (?, ?, ?, FALSE)", [
                    fullName, hashPassword, email
                ]);
                res.render('login', {auth: false});
            }

            else
                console.log("passwords do not match");
        }

        else
            console.log("Email already in use")
    });
});

app.post('/updateUser', (req, res) => {
    // variable for later use
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if(oldPassword == newPassword)
    {
        console.log("Something?")
    }

    else
    {
        con.query("SELECT userPassword FROM users WHERE id = ?", req.session.userId, (err, data) => {
    
        let pwDBmatch = bcrypt.compareSync(oldPassword, data[0].userPassword)
        if(pwDBmatch)
        {
            let newhashedpw = bcrypt.hashSync(newPassword, 10);
            con.query("UPDATE users SET userPassword = ? WHERE id = ?", 
                [newhashedpw, req.session.userId], (err, data) => {

                if(err)
                {
                    console.log(err)
                }

                //removing cookie from browser
                res.clearCookie(process.env.SESS_NAME)
                //removing session from database
	            req.session.destroy();
                res.render('login', {auth: false})
            });
        }

        else
        {
            console.log("Not a match");
        }
        }); 
       
    }
});

app.post('/deleteUser',(req, res) => {
    //deleting user from database
    con.query("DELETE FROM users WHERE id = ?", req.session.userId, (err, data) => {
        if(err)
        { console.log("error" + err) }
        //removing cookie from browser
        res.clearCookie(process.env.SESS_NAME)
        //removing session from database
	    req.session.destroy();
        res.render('index', {auth: false})
    });
});

app.post('/createRecipe',(req,res) => { 
    // variables for later use
    let userid = req.body.id
    let title = req.body.title;
    let instructions = req.body.instructions;
    let personorstk = req.body.personorstk;
    let amount = req.body.amount;
    let dateCreated = Date.now();

    con.query(``);

});

app.post('/updateRecipe', (req, res) => {
    // variables for later use
    let title = req.body.title;
    let instructions = req.body.instructions;
    let personorstk = req.body.personorstk;
    let amount = req.body.amount;
    let dateCreated = Date.now();
    
    con.query(``);

});

app.post('/deleteRecipe' ,(req,res) => { 
    
    // deleting from database
    con.query("", req.body , (err, data) => {
        if(err)
        { console.log("error: " + err) }
        res.render('usersite', {auth: true})
    });
});

app.post('/createComment' ,(req,res) => {
    // variables for later use
    let recipeId = req.body.recipeId
    let userid = req.session.userId
    let userComment = req.body.userComment
    let stars = req.body.stars

    // inserting into database
    con.query("INSERT INTO comments(recipeId, userId, userComment, stars) VALUES (?, ?, ?, ?)",
     [ recipeId, userid, userComment, stars ], (err, data) => {
        if(err)
        { console.log("error: " + err) }
        res.render('usersite', {auth: true})
    });
});

app.post('/deleteComment' ,(req,res) => {
    // variables for later use
    let commentid = req.body.id

    // deleting from database
    con.query("DELETE FROM comments WHERE id = ?", commentid, (err, data) => {
        if(err)
        { console.log("error: " + err) }
    });
});

// setting app to start and on what port to use 
app.listen(5000, () => {
	console.log('App listening on port 5000!');
});