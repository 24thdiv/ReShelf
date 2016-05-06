var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://admin:adminadmin@ds013172.mlab.com:13172/reshelf");
//var connection = mongoose.createConnection("mongodb://localhost:27017/reshelf");
autoIncrement.initialize(connection);

var driverSchema = mongoose.Schema({
	driver_id : { type : Number, required : true, index : true},
	t_id : { type : String, required : true},
	fname : { type : String, required : true},
	lname : { type : String, required : false},
	email : { type : String, required : true},
	address: { type: String, required: true},
	city : { type: String, required: true},
	state : { type: String, required: true},
	zipCode : { type: Number, required:true},
	contacts : {type : Number, required : true},
	isActive : {type: Boolean, default: true}
},{
	collection: 'drivers',
	timestamps: true,
    versionKey: false
});

driverSchema.plugin(autoIncrement.plugin, {
	model : 'Driver',
	field : 'driver_id',
	startAt: 200000001,
    incrementBy: 1
});

var Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;