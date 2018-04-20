var mongoose	    = require('mongoose');
var Schema		    = mongoose.Schema;

var NoteSchema = new Schema({
    left_by      : { type: String }, 
    note         : { type: String },
    left_at      : { type: Date, default: Date.now }
}
);


module.exports = mongoose.model('Note', NoteSchema);