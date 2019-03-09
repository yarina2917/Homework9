const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuid = require('uuid/v4');

router.get('/todolist', isLoggedMid, (req, res, next) => {
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

router.post('/todolist', isLoggedMid, (req, res, next) => {
    fs.readFile('data/todolist.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let todolist = JSON.parse(data);
            console.log(todolist);
            req.body.userId = req.headers['x-apikey'];
            req.body._id = uuid();
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

router.put('/todolist/:id', isLoggedMid, (req, res, next) => {
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

router.delete('/todolist/:id', isLoggedMid, (req, res, next) => {
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

function isLoggedMid(req, res, next) {
    let userToken = req.headers['x-apikey'];
    if (userToken) {
        fs.readFile('data/todolist.json', 'utf8', (err, data) => {
            let todolist = JSON.parse(data);
            let userFound = todolist.find( item => {
                if (item.userId === userToken) {
                    next();
                    return true
                }
            });
            if (userFound === undefined) {
                res.status(401).send('unauthorized');
            }
        });
    } else {
        res.status(401).send('unauthorized');
    }
}

module.exports = router;