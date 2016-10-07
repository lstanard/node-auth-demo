var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var todoSchema = mongoose.Schema({
	text: String,
    completed: Boolean,
    subdomain: {
        type: ObjectId,
        ref: 'List'
    }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);