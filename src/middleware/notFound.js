var express = require('express');

express.json();

exports.NotFound = function(req, res, next) {
    res.status(404).send({
        error: 'Not found'
    });
    return;
};