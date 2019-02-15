const express = require('express');
const router = express.Router();
const fs = require('fs');
const randtoken = require('rand-token');

router.get('/todolist', (req, res, next) => {
    fs.readFile('data/todolist.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let todolist = JSON.parse(data);
            let userToken = req.headers['x-apikey'];
            let userList = todolist.filter(item => {
                return item.userId === userToken;
            });
            res.status(200).send(userList);
        }
    });
});

router.post('/todolist', (req, res, next) => {
    fs.readFile('data/todolist.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let todolist = JSON.parse(data);
            req.body.userId = req.headers['x-apikey'];
            req.body._id = randtoken.generate(16);
            todolist.push(req.body);
            fs.writeFile('data/todolist.json', JSON.stringify(todolist, null, 2), (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send({});
                }
            });
        }
    });
});

router.put('/todolist/:id', (req, res, next) => {
    fs.readFile('data/todolist.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let todolist = JSON.parse(data);
            let userToken = req.headers['x-apikey'];
            let id = req.params.id;
            todolist.find(item => {
                if (item._id === id && item.userId === userToken) {
                    item.title = req.body.title || item.title;
                    item.description = req.body.description || item.description;
                    item.status = req.body.status || item.status;
                    item.selected = req.body.selected || item.selected;
                    return true
                }
            });
            fs.writeFile('data/todolist.json', JSON.stringify(todolist, null, 2), (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send({});
                }
            });
        }
    });
});

router.delete('/todolist/:id', (req, res, next) => {
    fs.readFile('data/todolist.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let todolist = JSON.parse(data);
            let userToken = req.headers['x-apikey'];
            let id = req.params.id;
            let index = todolist.findIndex(item => {
                return item._id === id && item.userId === userToken
            });
            todolist.splice(index, 1);
            fs.writeFile('data/todolist.json', JSON.stringify(todolist, null, 2), (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send({});
                }
            });
        }
    });
});

module.exports = router;