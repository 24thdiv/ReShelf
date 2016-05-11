var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://admin:adminadmin@ds013172.mlab.com:13172/reshelf");
//var connection = mongoose.createConnection("mongodb://localhost:27017/reshelf");
autoIncrement.initialize(connection);

var truckSchema = mongoose.Schema({
	t_id : {
		type : Number,
		required : true,
		index : true
	},
	number : {
		type : String,
		required : true
	},
	isActive : {
		type: Boolean, 
		default: true
	}
},{
	collection : 'trucks',
	timestamps: true,
    versionKey: false
});

truckSchema.plugin(autoIncrement.plugin, {
	model : 'Truck',
	field : 't_id',
	startAt: 100000001,
    incrementBy: 1
});

var Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;