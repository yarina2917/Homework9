const Ajv = require('ajv');
const ajv = new Ajv();

const userSchema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "surname": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "phone": {
            "type": "string"
        },
        "password": {
            "type": "string",
            "minLength": 5
        },
    }
};

const userLoginSchema = {
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
        },
    },
    required: ['email', 'password']
};

function userValidator(req, res, next) {
    let valid = ajv.validate(userSchema, req.body);
    if (!valid) {
        res.status(400).send({ error: ajv.errors });
    } else {
        next()
    }
}

function userLoginValidator(req, res, next) {
    let valid = ajv.validate(userLoginSchema, req.body);
    if (!valid) {
        res.status(400).send({ error: ajv.errors });
    } else {
        next()
    }
}

module.exports = {userValidator, userLoginValidator};


