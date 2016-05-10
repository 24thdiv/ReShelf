var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://admin:adminadmin@ds013172.mlab.com:13172/reshelf");
//var connection = mongoose.createConnection("mongodb://localhost:27017/reshelf");
autoIncrement.initialize(connection);

var reviewSchema = mongoose.Schema({
	rating: {type: Number, required: true},
	username: {type:String, required: true},
	review_title: {type: String, required: true},
	review_desc: {type:String, required:true}
});


var productSchema = mongoose.Schema({
	p_id: {type: Number, required: true, index: true},
	f_id: {type: Number, required: false},
	f_name: {type: String, required: false},
	email : {type : String, required : true},
	cat_id: {
		type: Number
	},//Farmer Detail
	name: {type: String, required: true},
	price: {type: String, required: true},
	weight: Number,
	price_unit: String,
	unit: {type: String, required: true},
	product_img: {type : String, required : false},
	images: [{type: String}],//Farmer Detail
	reviews: [reviewSchema],//Farmer Detail
	details: {type: String},
	description: String,
	features: {type: String, required: true},
	isActive: {type: Boolean, default: true},
	quantity: {type: Number, required: true},
	exp_date : {type : Date, required : true}
},{
	collection: 'products',
    timestamps: true,
    versionKey: false
});

productSchema.plugin(autoIncrement.plugin, {
	model: 'Product',
    field: 'p_id',
    startAt: 500000001,
    incrementBy: 1});

var Product = connection.model('Product', productSchema);

module.exports = Product;
