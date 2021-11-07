const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./../models/Task')

const UserSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true,
            trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
})

UserSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login!')
    }
    return user
}

UserSchema.pre('save', async function(next) {
	const user = this
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}
	next()
})

UserSchema.pre('remove', async function(next) {
	const user = this
	await Task.deleteMany({ owner: user._id })
	next()
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'dushyanttokenkey')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

const User = mongoose.model('User', UserSchema)

module.exports = User