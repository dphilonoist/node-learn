const mongoose = require('mongoose');
const NameSchema = require('./../schema/User')

module.exports = mongoose.model('User', NameSchema)