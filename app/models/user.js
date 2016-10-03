var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = {};

// define the schema for our user model
User.userSchema = mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    local            : {
        email        : {
            type: String,
            required: true
        },
        password     : {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

// methods ======================
// generating a hash
User.userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

User.userModel = mongoose.model('User', User.userSchema);

// create the model for users and expose it to our app
module.exports = User;