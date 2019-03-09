const express = require('express');
const router = express.Router();
const fs = require('fs');
const checkUserMid = require('./userMiddleware');
const uuid = require('uuid/v4');

router.get('/todolist', checkUserMid, (req, res, next) => {
    fs.readFile('./data/todolist.json', 'utf8', (err, data) => {
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

router.post('/todolist', checkUserMid, (req, res, next) => {
    fs.readFile('./data/todolist.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let todolist = JSON.parse(data);
            req.body.userId = req.headers['x-apikey'];
            req.body._id = uuid();
            todolist.push(req.body);
            fs.writeFile('./data/todolist.json', JSON.stringify(todolist, null, 2), (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send(req.body);
                }
            });
        }
    });
});

router.put('/todolist/:id', checkUserMid, (req, res, next) => {
    fs.readFile('./data/todolist.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let todolist = JSON.parse(data);
            let userToken = req.headers['x-apikey'];
            let id = req.params.id;
            todolist.find(item => {
                if (item._id === id && item.userId === userToken) {
                    for (let key in req.body) {
                        item[key] = req.body[key];
                    }
                    return true
                }
            });
            fs.writeFile('./data/todolist.json', JSON.stringify(todolist, null, 2), (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send({});
                }
            });
        }
    });
});

router.delete('/todolist/:id', checkUserMid, (req, res, next) => {
    fs.readFile('./data/todolist.json', 'utf8', (err, data) => {
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
            fs.writeFile('./data/todolist.json', JSON.stringify(todolist, null, 2), (err) => {
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