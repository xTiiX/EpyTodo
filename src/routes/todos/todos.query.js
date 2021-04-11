var sql = require('../../config/db.js');

//Todo object constructor
var Todo = function(todo) {
    this.title = todo.title;
    this.description = todo.description;
    this.created_at = todo.created_at || null;
    this.due_time = todo.due_time || null;
    this.status = todo.status || null;
    this.user_id = todo.user.id;
};

Todo.createTodo = function(newTodo, result) {
    newTodo.created_at = new Date();
    sql.query("INSERT INTO todo SET ?", newTodo, function(err, res) {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            Todo.getTodoById(res.insertId, function(err, todo) {
                if (err)
                    result(err, null);
                else
                    result(null, todo);
            })
        }
    });
};

Todo.getTodoById = function(id, result) {
    sql.query("SELECT * FROM todo WHERE id = ? ", id, function(err, res) {
        if (err) {
            console.log(err);
            result(err, null);
        } else
            result(null, res);
    });
};

Todo.getAllTodo = function(result) {
    sql.query("SELECT * FROM todo", function(err, res) {
        if (err) {
            console.log(err);
            result(err, null);
        } else
            result(null, res);
    });
};

Todo.getAllTodoByUserId = function(user_id, result) {
    sql.query("SELECT * FROM todo WHERE user_id = ?", user_id, function(err, res) {
        if (err) {
            console.log(err);
            result(err, null);
        } else
            result(null, res);
    });
};

Todo.updateById = function(id, todo, result) {
    Todo.getTodoById(id, function(err, resultat) {
        todo.created_at = resultat[0].created_at;
        sql.query("UPDATE todo SET ? WHERE id = ?", [todo, id], function(err, res) {
            if (err) {
                console.log(err);
                result(null, err);
            } else {
                Todo.getTodoById(id, function(err, res) {
                    if (err)
                        result(err, null);
                    else
                        result(null, res);
                });
            }
        });
    });
};

Todo.remove = function(id, result) {
    sql.query("DELETE FROM todo WHERE id = ?", id, function(err, res) {
        if (err) {
            console.log(err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = Todo;