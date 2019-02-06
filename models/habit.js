const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 100
	},
	timesPerDay:{
		type: Number,
		required: true,
		minlength: 2,
		maxlength: 25
	},
	days: [{
		date: Date,
		completions: Number,
		notes: String
	}],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	} 
})

module.exports = mongoose.model('Habit', habitSchema);