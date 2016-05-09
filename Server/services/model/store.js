var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://admin:adminadmin@ds013172.mlab.com:13172/reshelf");
//var connection = mongoose.createConnection("mongodb://localhost:27017/reshelf");
autoIncrement.initialize(connection);


var storeSchema = mongoose.Schema({
	store_id: {type: Number, required: true, index: true},
	isActive : {type: Boolean, default: false},
	name: {type: String, required: true},
	email: {type: String, required: true},
	pass: {type: String, required: true},
	intro: {type: String, required: true, default: "Hello!"},
	tax: {type: Number, required: true, default: 5},
	contacts: {type : Number, required : false},
	address: {type: String, required: true, default: "Type Address Here"},
	city: {type: String, required: true, default: "Your City"},
	state: {type: String, required: true, default: "Your State"},
	zipcode: {type: Number, required:true, default: 12345},
	
	isAvailable: {type: Boolean,default:true},

},{
	collection: 'store',
    timestamps: true,
    versionKey: false
});

storeSchema.plugin(autoIncrement.plugin, {
	model: 'Store',
    field: 'store_id',
    startAt: 200000001,
    incrementBy: 1});

var Store = mongoose.model('Store', storeSchema);

module.exports = Store;