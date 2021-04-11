var sql = require('../../config/db.js');
var bcrypt = require('bcryptjs');

// User object constructor
var User = function(user) {
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.firstname = user.firstname;
    this.created_at = user.created_at;
};

User.getUserByIdOrMail = function(email, id, res) {
    sql.query(`SELECT * FROM user WHERE email = ? OR id = ?`, [email, id], function(err, result) {
        res(err, result);
    });
}

//Admin Command
User.getAllUsers = function(res) {
    sql.query("SELECT * FROM user", function(err, result) {
        if (err)
            res(err, null);
        else
            res(null, result);
    });
}

User.updateById = function(id, user, result) {
    User.getUserByIdOrMail(null, id, function(err, resultat) {
        user.created_at = resultat[0].created_at;
        user.password = bcrypt.hashSync(user.password, 10);
        sql.query("UPDATE user SET ? WHERE id = ?", [user, id], function(err, res) {
            if (err)
                result(err, null);
            else {
                User.getUserByIdOrMail(null, id, function(err, res) {
                    if (err)
                        result(err, null);
                    else
                        result(null, res);
                });
            }
        });
    });
};

User.remove = function(id, result) {
    sql.query("DELETE FROM user NOCHECK WHERE id = ?", id, function(err, res) {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = User;