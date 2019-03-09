const express = require('express');
const router = express.Router();
const fs = require('fs');
const checkUserMid = require('./userMiddleware');
const uuid = require('uuid/v4');

router.post('/registration', (req, res, next) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let usersList = JSON.parse(data);
            let userFound = usersList.find(user => {
                if (user.name === req.body.name) {
                    let err = new Error('Choose another username');
                    err.status = 401;
                    next(err);
                    return true
                }
            });
            if (userFound === undefined) {
                let token = uuid();
                req.body.userId = token;
                usersList.push(req.body);
                fs.writeFile('./data/users.json', JSON.stringify(usersList, null, 2), (err) => {
                    if (err) {
                        return next(err);
                    } else {
                        res.status(200).send({'token': token});
                    }
                });
            }
        }
    });
});

router.post('/login', (req, res, next) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let usersList = JSON.parse(data);
            let userFound = usersList.find( user => {
                if (req.body.email === user.email && req.body.password === user.password) {
                    return res.status(200).send({'token': user.userId});
                }
            });
            if (userFound === undefined) {
                let err = new Error('Email or password is wrong');
                err.status = 401;
                next(err);
            }
        }
    });
});

router.put('/user', checkUserMid, (req, res, next) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let usersList = JSON.parse(data);
            let userToken = req.headers['x-apikey'];
            usersList.find( user => {
                if (user.userId === userToken) {
                    user.password = req.body.password;
                    return true
                }
            });
            fs.writeFile('./data/users.json', JSON.stringify(usersList, null, 2), (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send({});
                }
            });
        }
    })
});

module.exports = router;