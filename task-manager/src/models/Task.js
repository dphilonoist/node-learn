const mongoose = require('mongoose');
const TaskSchema = require('./../schema/Task')

module.exports = mongoose.model('Task', TaskSchema)