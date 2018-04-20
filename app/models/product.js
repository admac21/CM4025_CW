var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// product schema
var ProductSchema = new Schema({
    make:   { type: String, required: true},
    model:  { type: String, required: true },
    type:   { type: String, required: true },
    colour: { type: String, required: true },
    serial: { type: String, required: true, index: { unique: true }},
    cust_id:{ type: String, required: true},
    dop:    { type: Date }
});

module.exports = mongoose.model('Product', ProductSchema);