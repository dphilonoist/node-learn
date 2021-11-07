const mongoose = require('mongoose');
const validator = require('validator');

const TaskSchema = new mongoose.Schema({
	description: {
			type: String,
			required: true,
			trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	}
})

module.exports = TaskSchema