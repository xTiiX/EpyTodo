var mysql = require('mysql2');

//local mysql db connection
var connection = mysql.createConnection({
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD
});

// check error
connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;