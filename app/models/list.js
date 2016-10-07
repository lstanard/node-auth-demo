var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId    = Schema.ObjectId;

var listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    subdomain: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);