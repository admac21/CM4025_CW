var mongoose	    = require('mongoose');
var Schema		    = mongoose.Schema;
var autoIncrement   = require('mongoose-auto-increment');

// create and initialise database connection for auto increment
var connection = mongoose.createConnection("mongodb://localhost:27017/umbra_userDB");
autoIncrement.initialize(connection);

// job schema
var JobSchema = new Schema({
    created_by      : { type: String }, 
    product_id      : { type: String },
    /*notes           : [{
        left_by         : { type: String},
        note            : { type: String},
        left_on         : { type: Date, default: Date.now }
    }],*/
    notes           : [{ type: Schema.Types.Object, ref: 'Note' }],
    status          : { type: String },
    passwords       : { type: String },
    location        : { type: String},
    costs           : [{ cost: String }],
    condition       : { type: String},
    short_desc      : { type: String },
    full_desc       : { type: String },
    accessories     : { type: String }
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}}
);

JobSchema.plugin(autoIncrement.plugin, {
    model: 'Job',
    field: 'job_number',
    startAt: 100000,
    incrementBy: 1
});

module.exports = mongoose.model('Job', JobSchema);
