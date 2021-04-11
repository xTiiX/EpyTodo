var express = require('express');
var router = express.Router();
var Todo = require('../todos/todos.query.js');
var User = require('./user.query.js');
var auth = require('../../middleware/auth.js');
const { remove } = require('../todos/todos.query.js');

express.json();

router.get('/', auth.authenticateToken, function(req, res) {
    User.getUserByIdOrMail(null, req.body.user.id, function(err, user) {
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            console.log("Get user.\n", user[0] + "\n");
            res.status(200).send(user[0]);
        }
    });
});

router.get('/todos', auth.authenticateToken, function(req, res) {
    Todo.getAllTodoByUserId(req.body.user.id, function(err, result) {
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            console.log("Print all todos for the user with id =", req.body.user.id);
            console.log(result);
            res.status(200).send(result);
        }
    });
});

router.get('/:val', auth.authenticateToken, function(req, res) {
    User.getUserByIdOrMail(req.params.val, req.params.val, function(err, result) {
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            console.log("Get user by id or email.\n", result[0] + "\n");
            res.status(200).send(result[0]);
        }
    })
});

router.put('/:id', auth.authenticateToken, function(req, res) {
    User.updateById(req.params.id, new User(req.body), function(err, result) {
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            console.log("Updated user.\n");
            res.status(200).send(result[0]);
        }
    });
});

router.delete('/:id', auth.authenticateToken, function(req, res) {
    Todo.getAllTodoByUserId(req.params.id, function(err, todos) {
        for (todo in todos) {
            console.log("Delete User's todo with id :", todos[todo].id);
            Todo.remove(todos[todo].id, function(err, result) {
                if (err)
                    res.status(500).send({ msg: "internal  server  error" });
            });
        }
    });
    User.remove(req.params.id, function(err, user) {
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            var id = req.params.id;
            console.log("Deleted User :", id + "\n");
            res.status(200).send({
                msg: "succesfully deleted record number: " + id
            });
        }
    });
});

module.exports = router;