const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 100
	},
<<<<<<< HEAD
	username:{
		type: String,
=======
	timesPerDay:{
		type: Number,
>>>>>>> eccf44e995959a3a24686ff37c3d6ae4ba9a468f
		required: true,
		minlength: 2,
		maxlength: 25
	},
<<<<<<< HEAD
	email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
=======
	days: [{
		date: Date,
		completions: Number,
		notes: String
	}],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	} 
>>>>>>> eccf44e995959a3a24686ff37c3d6ae4ba9a468f
})

module.exports = mongoose.model('Habit', habitSchema);