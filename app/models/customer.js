var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

// create and initialise database connection for auto increment
var connection = mongoose.createConnection("mongodb://localhost:27017/umbra_userDB");
autoIncrement.initialize(connection);

// customer schema
var CustomerSchema = new Schema({
    title           : { type: String, required: true},
    first_name      : { type: String, required: true, index: true },
    last_name       : { type: String, required: true, index: true },
    phone           : { type: String, required: true, index: true },
    alt_phone       : { type: String },
    email           : { type: String, required: true, index: true },
    house           : { type: String, required: true },
    street          : { type: String, required: true },
    city            : { type: String, required: true },
    postcode        : { type: String, required: true }
});

CustomerSchema.plugin(autoIncrement.plugin, {
    model: 'Customer',
    field: 'customer_number',
    startAt: 100000000,
    incrementBy: 1
});

module.exports = mongoose.model('Customer', CustomerSchema);