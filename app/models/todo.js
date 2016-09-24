var mongoose = require('mongoose');

var todoSchema = mongoose.Scheme({
	text: String
});

module.exports = mongoose.model('Todo', todoSchema);