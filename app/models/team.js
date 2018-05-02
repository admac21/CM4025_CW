var mongoose	    = require('mongoose');
var Schema		    = mongoose.Schema;

// job schema
var TeamSchema = new Schema({
    teamName        : { type: String, required: true, index: { unique: true }}, 
    money           : { type: Number },
    level           : { type: Number },
    store_size      : { type: String },
    tools           : { type: String },
    created_by      : { type: String },
    newest_member   : { type: String },
    members         : [{ type: Schema.Types.ObjectId, ref: 'User'}]
    
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}}
);


module.exports = mongoose.model('Team', TeamSchema);