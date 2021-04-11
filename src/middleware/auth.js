var jwt = require('jsonwebtoken');
const sql = require('../config/db');
var dotenv = require('dotenv').config();

exports.generateToken = function(email, id) {
    const token = jwt.sign({ email: email, id: id }, process.env.SECRET, { expiresIn: '365d' });
    return token;
}

exports.authenticateToken = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send({
            msg: "No token, authorization denied"
        });
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({
                msg: "Token is not valid"
            });
        }
        req.body.user = user;
        sql.query("SELECT * FROM user WHERE user.email = ?", user.email, function(err, result) {
            if (err || result[0] == undefined) {
                return res.status(401).send({
                    msg: "Token is not valid"
                });
            } else {
                req.body.user.id = result[0].id;
                next();
            }
        })
    })
}