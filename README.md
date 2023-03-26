# nodelogin
You need run "npm install" to get node_modules on project.

Then you need to create .env file for project.
Then you need to copy all inside .env.example and paste into .env
Then set the values for connection to your mysql database
eks.

DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASS = '' (only if you have made one yourself. default is empty in heidisql)
MYSQL_DB = 'foodblog' (database name from db.sql is foodblog, so use that)
SESS_NAME = '' (name it what you want. The name is just a name for session instead of default which is an id)
SESS_SECRET = '' (just make a random string. It makes the session not readable without this sess_secret)

After creating .env and set the values in .env, then run "npm run dev" for starting project with nodemon (nodemon makes so it refresh backend if change in server.js)
