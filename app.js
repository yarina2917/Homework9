const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const users = require('./routes/users');
const todolist = require('./routes/todolist');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

app.use('/api/', users);
app.use('/api/', todolist);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});