const mongoose = require('mongoose');
const validator = require('validator');

const NameSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true,
            trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('provide correct email')
            }
        }
    },
    age: {
        type: Number,
        default: 1,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.length <= 6) {
                throw new Error('Password length must be greater than 6.')
            }
            if (value.includes('password')) {
                throw new Error('Password must not contains password.')
            }
        }
    }
})

module.exports = NameSchema