const fs = require('fs');

function userMiddleware(req, res, next) {
    let userToken = req.headers['x-apikey'];
    if (userToken) {
        fs.readFile('./data/users.json', 'utf8', (err, data) => {
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

module.exports = userMiddleware;
