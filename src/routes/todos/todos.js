var express = require('express');
var router = express.Router();
var Todo = require('./todos.query.js');
var auth = require('../../middleware/auth.js');

express.json();

router.get('/', auth.authenticateToken, function(req, res) {
    Todo.getAllTodo(function(err, todo) {
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            console.log("Get all todos.\n", todo[0]);
            res.status(200).send(todo);
        }
    });
});

router.post('/', auth.authenticateToken, function(req, res) {
    var new_todo = new Todo(req.body);
    if (!new_todo) {
        res.status(400).send({
            message: 'Invalid Inputs'
        });
    } else {
        Todo.createTodo(new_todo, function(err, todo) {
            if (err)
                res.status(500).send({ msg: "internal  server  error" });
            else {
                console.log('Todo Created.\n', new_todo);
                res.status(200).send(todo[0]);
            }
        });
    }
});

router.get('/:id', auth.authenticateToken, function(req, res) {
    Todo.getTodoById(req.params.id, function(err, todo) {
        if (err)
            res.send(err);
        if (todo[0] == undefined)
            res.status(404).send({
                msg: "Not found\n"
            });
        else {
            console.log('Recovered todo.\n');
            res.status(200).send(todo[0]);
        }
    });
});

router.put('/:id', auth.authenticateToken, function(req, res) {
    req.body.user.id = req.body.user_id;
    Todo.updateById(req.params.id, new Todo(req.body), function(err, todo) {
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            console.log('Update todo.\n')
            res.status(200).send({
                title: req.body.title,
                description: req.body.description,
                due_time: req.body.due_time,
                status: req.body.status,
                user_id: req.body.user_id
            });
        }
    });
});

router.delete('/:id', auth.authenticateToken, function(req, res) {
    Todo.remove(req.params.id, function(err, todo) {
        var id = req.params.id;
        if (err)
            res.status(500).send({ msg: "internal  server  error" });
        else {
            console.log('Succesfully deleted record number:', id, '\n');
            res.status(200).send({
                msg: 'succesfully deleted record number: ' + id
            });
        }
    });
});

module.exports = router;