const Ajv = require('ajv');
const ajv = new Ajv();

const todoschema = {
    "type": "object",
    "properties": {
        "userId": {
            "type": "string"
        },
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "status": {
            "type": "string"
        },
        "selected": {
            "type": ["boolean", "string"]
        },
    }
};

function todoValidator(req, res, next) {
    let valid = ajv.validate(todoschema, req.body);
    if (!valid) {
        res.status(400).send({ error: ajv.errors });
    } else {
        next()
    }
}

module.exports = todoValidator;


