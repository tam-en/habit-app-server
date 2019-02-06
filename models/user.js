const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  password:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25
  },
  email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});

// Override 'toJSON' to prevent the password from being returned with the user
userSchema.set('toJSON', {
  transform: (doc, user) => {
    const userJson = {
      id: user._id,
      email: user.email,
      username: user.name
    }
    return userJson;
  }
});

// A helper function to authenticate with bcrypt
userSchema.methods.isAuthenticated = function(password) {
  return bcrypt.compareSync(password, this.password);
}

// Use Mongoose's version of a beforeCreate hook; use to hash password
userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

// Exporting the User model
module.exports = mongoose.model('User', userSchema);
