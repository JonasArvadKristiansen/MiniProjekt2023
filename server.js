// node_modules for website to work
const express = require('express');
require("dotenv").config();
const mysql = require('mysql2');
const session = require('express-session')
const bcrypt = require("bcrypt")
const app = express();
const mysqlStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileupload');

//setting path to where to find css, js and img for our server
app.use(express.static(__dirname + '/public'));
  
// telling the backend we are using ejs files
app.set('view engine', 'ejs');

//allowing the backend to read req.body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//npm module for uploading images
app.use(fileUpload());

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
    // password for database
    password: process.env.DB_PASS,
    // user for connecting to db
    user: process.env.DB_USER,
    // database name to connect to
    database: process.env.MYSQL_DB,
    //ip adresse for mysql server
    host: process.env.DB_HOST,
    // Whether or not to automatically check for and clear expired sessions:
    clearExpired: true,
	// How frequently expired sessions will be cleared; milliseconds:
	checkExpirationInterval: 1000 * 60 * 60,
	// The maximum age of a valid session; milliseconds:
	expiration: 1000 * 60 * 60 * 2,
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
    // setting encrypting data string
    secret: process.env.SESS_SECRET,
    cookie: {
        //makes so javascript cant access cookie
        httpOnly: true,
        //setting expire date for cookie
        maxAge: 1000 * 60 * 60 * 2,
        //enables only first-party cookies to be sent/accessed
        sameSite: true,
        //making so cookie works on http and https. if true only https
        secure: false
    }
}));

// get endpoints for ejs files
app.get('/', (req, res) => {
    con.query("SELECT * FROM recipes ORDER BY dateCreated DESC", (err, data) => {
        if(typeof(req.session.userId) !=  "undefined") {
            res.render('index', {auth: true, data: data})
        } else {
            res.render('index', {auth: false, data: data})
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login', {auth: false, error: false});    
});

app.get('/createuser', (req, res) => {
    res.render('createUser', {auth: false, error: false});
});

app.get('/logout', (req, res) => {
    //removing cookie from browser
    res.clearCookie(process.env.SESS_NAME)
    //removing session from database
	req.session.destroy();
    res.redirect("/")
});

app.get('/aboutus', (req, res) => {
    if(typeof(req.session.userId) !=  "undefined")
    {
        res.render('aboutUs', {auth: true});
    } else
        res.render('aboutUs', {auth: false});
});

app.get('/usersite', (req, res) => {
    //tjekking if user logged in. if not logged in then cant access site
    if(typeof(req.session.userId) !=  "undefined") {
        con.query("SELECT users.fullName, users.email, recipes.* FROM users INNER JOIN recipes ON recipes.userId = users.id WHERE users.id = ? ORDER BY recipes.dateCreated DESC", req.session.userId, (err, data) => {
            if(typeof(data[0]) == "undefined")
            {
                con.query("SELECT * FROM users WHERE id = ?", req.session.userId, (err, data) =>{
                    res.render('usersite', {auth: true, data: data, error: false, norecipe: true});
                });
            } else {
                res.render('usersite', {auth: true, data: data, error: false, norecipe: false});    
            }
        });
    } else
        con.query("SELECT * FROM recipes ORDER BY dateCreated DESC", (err, data) => {
            res.render('index', {auth: false, data: data})
    });
});

app.get('/createrecipes', (req, res) => {
    if(typeof(req.session.userId) !=  "undefined") {
        res.render('createRecipes', {auth: true , error: false});    
    } else{
        con.query("SELECT * FROM recipes ORDER BY dateCreated DESC", (err, data) => {     
            res.render('index', {auth: false, data: data})
        });
    }
});

// Lavet af Jesper
app.get('/recapie/:recapieID', (req, res) => {
    const recapieId = req.params.recapieID
    const queryRecipe = 'recipes.id, recipes.title, recipes.instructions, recipes.personorstk, recipes.totalAmount, recipes.dateCreated, recipes.img'
    const queryIngredients = 'ingredients.ingredient, ingredients.measuringUnit, ingredients.amount'

    // Henter opskrift, ingredienser og forfatter fra databasen   
	const query = ` SELECT ${queryRecipe}, users.fullName, ${queryIngredients}
    FROM recipes
    INNER JOIN users ON recipes.userId = users.id
    INNER JOIN ingredients ON recipes.id = ingredients.recipeId
    WHERE recipes.id = ?`

    con.query(query, [recapieId], (err, data) => {
        // Henter kommentarende fra databasen
        const query = `SELECT comments.id, comments.userComment, comments.stars, users.fullName
        FROM comments
        INNER JOIN users ON comments.userId = users.id 
        WHERE comments.recipeId = ? ORDER BY comments.commentDate DESC `

        con.query(query, [recapieId], (err, comments) => {
            if (err) {
                console.log(err)
            } else {
                let date = data[0].dateCreated 
                date = (new Date(date)).toISOString().slice(0,10)

                if(typeof(req.session.userId) != "undefined"){
                    // Går til siden og sender data man kan bruger på frontenden
                    res.render('recipieSite', {data: data[0], isAdmin: req.session.isAdmin, array: data, date: date, comments: comments, auth: true, recapieId: recapieId});
                } else {
                    res.render('recipieSite', {data: data[0], isAdmin: false, array: data, date: date, comments: comments, auth: false, recapieId: recapieId});
                }
            }
        })
    })
});

app.get('/editRecapi/:recapieID', (req, res) => {
    
    const recapieId = req.params.recapieID
    con.query("SELECT recipes.*, ingredients.* from recipes INNER JOIN ingredients ON recipes.id = ingredients.recipeId WHERE recipes.id = ?", recapieId, (err, data) => {
        if(data[0].userId == req.session.userId && typeof(req.session.userId) !=  "undefined")
        {
            res.render("editRecipes", {data: data, auth: true, error: false})
        } else {
            res.redirect("/")
        }
    });
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
                req.session.isAdmin = data[0].isAdmin
                res.redirect("/")
            } else {
                res.render('login', {auth: false, data: data, error: true})
            }
        } else {
            res.render('login', {auth: false, data: data, error: true})
            console.log("No user found");
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
                res.render('login', {auth: false, error: false});    
            } else {
                console.log("passwords do not match");
                res.render('createUser', {auth: false, error: true});
            }
        } else {
            console.log("Email already in use")
            res.render('createUser', {auth: false, error: true});
        }
    });
});

app.post('/updateUser', (req, res) => {
    // variable for later use
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if(oldPassword == newPassword)
    {
        con.query("SELECT users.fullName, users.email, users.id, recipes.* FROM users INNER JOIN recipes ON recipes.userId = users.id WHERE users.id = ?", 
            req.session.userId, (err, data) => {
            res.render('usersite', {auth: true, data: data, error: true});
        });
    } else {
        con.query("SELECT userPassword, fullName, email FROM users WHERE id = ?", req.session.userId, (err, data) => {
    
        //tjekking if they match
        let pwDBmatch = bcrypt.compareSync(oldPassword, data[0].userPassword)
        
        //if match bcrypt return true to pwDBmatch
        if(pwDBmatch)
        {
            //hashing user password before going to db
            let newhashedpw = bcrypt.hashSync(newPassword, 10);
            con.query("UPDATE users SET userPassword = ? WHERE id = ?", 
                [newhashedpw, req.session.userId], (err, data) => {

                //removing cookie from browser
                res.clearCookie(process.env.SESS_NAME)
                //removing session from database
	            req.session.destroy();
                res.render('login', {auth: false, error: false});    
            });
        } else {
            con.query("SELECT users.fullName, users.email, users.id, recipes.* FROM users INNER JOIN recipes ON recipes.userId = users.id WHERE users.id = ?", 
            req.session.userId, (err, data) => {
                res.render('usersite', {auth: true, data: data, error: true});
            });
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
        res.redirect("/")
    });
});

app.post('/searchRecipes', (req, res) => {
    // variables for later use
    let searchitem = "%" + req.body.search + "%"

    //seeing after matching recipes in database
    con.query("SELECT * FROM recipes WHERE title like ? ORDER BY dateCreated DESC", searchitem, (err, data) => {
        if(typeof(req.session.userId) !=  "undefined") {
            res.render('index', {auth: true, data: data})
        } else {
            res.render('index', {auth: false, data: data})
        }
    });
});

app.post('/createRecipes' ,(req,res) => { 
    // variables for later use
    let title = req.body.title;
    let instructions = req.body.instruktioner;
    let personorstk = req.body.personOrStk;
    let amount = req.body.measurements;
    let img = "/img/recapiesImg/" + req.files.imgFile.name
    let typeImg = req.files.imgFile.mimetype
    let ingrediensMeasurementList = req.body.ingrediensMeasurement;
    let ingrediensUnitList = req.body.ingrediensUnit;
    let ingrediensNameList = req.body.ingrediensName;
    //setting the file to varible
    let imgToUpload = req.files.imgFile;
    //path to put image in
    let uploadPath = __dirname + '/public/img/recapiesImg/' + img.name;    
    const array_of_allowed_files = ['png', 'jpg'];

    //tjekking if not contains any of the file types
    if(!typeImg.includes(array_of_allowed_files[0]) && !typeImg.includes(array_of_allowed_files[1]))
    {
        res.render('createRecipes', {auth: true, error: true})
    } else {
        //tjekking if ingrediensNameList is string or undefined
        if(typeof(ingrediensNameList) == "string" && typeof(ingrediensNameList) != "undefined") {
            con.query("INSERT INTO recipes(userId, title, instructions, personorstk, totalAmount, dateCreated, img) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
            [req.session.userId, title, instructions, personorstk, amount, img]
            ,(err, data) => {
                if(err) { console.log(err) }

                //using built in function mv to upload to folder on pc or server
                imgToUpload.mv(uploadPath);

                //inserting into database
                con.query("INSERT INTO ingredients(recipeId, ingredient, measuringUnit, amount) VALUES(?, ?, ?, ?)", 
                [data.insertId, ingrediensNameList, ingrediensUnitList, ingrediensMeasurementList], (err, data) => {
                    if(err)
                    {
                        console.log(err); 
                    }    
                });
                res.redirect("/")
            });
        } else if(typeof(ingrediensNameList) != "undefined" && typeof(ingrediensNameList) != "string") {
            //inserting into database
            con.query("INSERT INTO recipes(userId, title, instructions, personorstk, totalAmount, dateCreated, img) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
            [req.session.userId, title, instructions, personorstk, amount, img]
            ,(err, data) => {
                //using built in function mv to upload to folder on pc or server
                imgToUpload.mv(uploadPath);

                for (let i = 0; i < ingrediensNameList.length; i++) {
                    //inserting into database
                    con.query("INSERT INTO ingredients(recipeId, ingredient, measuringUnit, amount) VALUES(?, ?, ?, ?)", 
                    [data.insertId, ingrediensNameList[i], ingrediensUnitList[i], ingrediensMeasurementList[i]], (err, data) => {
                    if(err)
                    { console.log(err); }
                    });
                }
                res.redirect("/")
            });
        } else {
            res.render('createRecipes', {auth: true, error: true})
        }
    }
});

app.post('/updateRecipes', (req, res) => {
    // variables for later use
    let title = req.body.title;
    let instructions = req.body.instruktioner;
    let personorstk = req.body.personOrStk;
    let amount = req.body.measurements;
    let img = req.body.imgFile
    let ingrediensMeasurementList = req.body.ingrediensMeasurement;
    let ingrediensUnitList = req.body.ingrediensUnit;
    let ingrediensNameList = req.body.ingrediensName;
    
    if(!img.includes("png") && !img.includes("jpg"))
    {
        res.render('editRecipes', {auth: true, error: true})
    } else {
        //tjekking if ingrediensNameList is string or undefined
        if(typeof(ingrediensNameList) == "string" && typeof(ingrediensNameList) != "undefined") {
            con.query("INSERT INTO recipes(userId, title, instructions, personorstk, totalAmount, dateCreated, img) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
            [req.session.userId, title, instructions, personorstk, amount, img]
            ,(err, data) => { 
                //inserting into database
                con.query("INSERT INTO ingredients(recipeId, ingredient, measuringUnit, amount) VALUES(?, ?, ?, ?)", 
                [data.insertId, ingrediensNameList, ingrediensUnitList, ingrediensMeasurementList], (err, data) => {
                    if(err)
                    { 
                        console.log(err); 
                    }
                });
                res.redirect("/")
            });
        } else if(typeof(ingrediensNameList) != "undefined" && typeof(ingrediensNameList) != "string") {
            //inserting into database
            con.query("INSERT INTO recipes(userId, title, instructions, personorstk, totalAmount, dateCreated, img) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
            [req.session.userId, title, instructions, personorstk, amount, img]
            ,(err, data) => {
                for (let i = 0; i < ingrediensNameList.length; i++) {
                    //inserting into database
                    con.query("INSERT INTO ingredients(recipeId, ingredient, measuringUnit, amount) VALUES(?, ?, ?, ?)", 
                    [data.insertId, ingrediensNameList[i], ingrediensUnitList[i], ingrediensMeasurementList[i]], (err, data) => {
                    if(err)
                    { console.log(err); }
                    });
                }
                res.redirect("/")
            });
        } else {
            res.render('createRecipes', {auth: true, error: true})
        }
    }
});

app.post('/deleteRecipes' ,(req,res) => { 
    // deleting recipe from database
    con.query("DELETE FROM recipes WHERE id = ? AND userId = ?", [req.body.recipieId, req.session.userId] , (err, data) => {
        if(err)
        { console.log(err) }
        res.redirect('/usersite')
    });
});

app.post('/createComment' ,(req,res) => {
    // variables for later use
    let recipeId = req.body.recipieId
    let userid = req.session.userId
    let userComment = req.body.kommentar
    let stars = req.body.starsSelected
    let date = new Date();
    
    //made by jesper
    let dateString =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0") +
    " " +
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":" +
    date.getSeconds().toString().padStart(2, "0");
    
    //made by jonas
    // inserting into database
    con.query("INSERT INTO comments(recipeId, userId, userComment, stars, commentDate) VALUES (?, ?, ?, ?, ?)",
     [ recipeId, userid, userComment, stars, dateString], (err, data) => {
        if(err)
        { console.log("error: " + err) }
        //reloading site
        res.redirect(`/recapie/${recipeId}`)
    });
});

app.post('/deleteComment' ,(req,res) => {
    // variables for later use
    let commentId = req.body.commentId
    let recapieID = req.body.recapieId
    // deleting from database
    con.query("DELETE FROM comments WHERE id = ?", commentId, (err, data) => {
        if(err)
        { console.log("error: " + err) }
        res.redirect(`/recapie/${recapieID}`)
    });
});

// setting app to start and on what port to use 
app.listen(5000, () => {
	console.log('App listening on port 5000!');
});