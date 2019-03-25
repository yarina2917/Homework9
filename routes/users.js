const express = require('express');
const router = express.Router();
const fs = require('fs');
const checkUserMid = require('./userMiddleware');
const { userValidator, userLoginValidator } = require('../validator/users');
const uuid = require('uuid/v4');

router.post('/registration', userValidator, (req, res, next) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let usersList = JSON.parse(data);
            let userFound = usersList.find(user => {
                if (user.email === req.body.email) {
                    let err = new Error('Choose another email');
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

router.post('/login', userLoginValidator, (req, res, next) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let usersList = JSON.parse(data);
            let userFound = usersList.find(user => {
                if (req.body.email === user.email && req.body.password === user.password) {
                    return res.status(200).send(user);
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

router.put('/user', userValidator, checkUserMid, (req, res, next) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return next(err);
        } else {
            let usersList = JSON.parse(data);
            let userToken = req.headers['x-apikey'];
            let userFound;

            if (req.body.email) {
                userFound = usersList.find(user => {
                    if (user.email === req.body.email && user.userId !== userToken) {
                        let err = new Error('Choose another email');
                        err.status = 401;
                        next(err);
                        return true
                    }
                });
            }
            if (userFound === undefined) {
                let userFound = usersList.find(user => {
                    if (user.userId === userToken) {
                        for (let key in req.body) {
                            user[key] = req.body[key];
                        }
                        return true
                    }
                });

                fs.writeFile('./data/users.json', JSON.stringify(usersList, null, 2), (err) => {
                    if (err) {
                        return next(err);
                    } else {
                        res.status(200).send(userFound);
                    }
                });
            }
        }
    })
});

module.exports = router;