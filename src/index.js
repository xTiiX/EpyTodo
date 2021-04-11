var sql = require('mysql2');
var express = require('express');
var dotenv = require('dotenv').config();
var app = express();
var port = process.env.PORT || 3000

// basic configurations
app.use(express.json());

// connection to the DB
var db = require('./config/db.js');

// get routers from other files
var AuthRouter = require('./routes/auth/auth.js');
var TodoRouter = require('./routes/todos/todos.js');
var UserRouter = require('./routes/user/user.js');
var NotFound = require('./middleware/notFound.js');
app.use('/', AuthRouter);
app.use('/todo', TodoRouter);
app.use('/user', UserRouter);
app.use(NotFound.NotFound);

app.listen(port);