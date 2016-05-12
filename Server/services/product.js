var Product = require('./model/product');
var Farmer = require('./model/farmer');
var Category = require('./model/category');
var resGen = require('./commons/responseGenerator');
var Farmer = require('./model/farmer');
//var Store = require('./model/store');


exports.suggest = function(req, callback){
	// console.log("SERVER suggest");
	q = req.q;
	// console.log(q);

	re = new RegExp('(^|\\s+)'+q,'i');
	// console.log(re);
	Product.aggregate([{$match: {name: new RegExp('(^|\\s+)'+q,'i')}}, {$group: {_id:'$name', name: {$first:'$name'}, 'p_id':{$first:'$p_id'}}}, {$limit: 5}]).exec(function(err, name){
		// Product.find({name: new RegExp('(^|\\s+)'+q,'i')}, 'name').exec(function(err, name){
		// console.log(name);
		callback(null, JSON.stringify(name));
	});
	// Product.find()
}
exports.getProducts = function(req, res){

	Product.find({isActive:true},function(err,results){
		if(err)
		{
			resGen.error(err,res);
		}
		else
		{
			if(results.length > 0){
				console.log("all products found");
				//console.log(results[0]);
				res(null,resGen.responseGenerator(200, results));
			}
			else
			{
				console.log("no data");
				resGen.error("null",res);
			}
		}
	});
}


exports.getCategory = function(req,res){
	Category.find({},function(err,results){
		if(err){
			resGen.error(err,res);
		} else {
			if(results){
				console.log("categories found");
				console.log(results);
				res(null,resGen.responseGenerator(200,results));
			}
		}
	})

}

exports.prod_search = function(msg, callback){

	searchData = {};
	if(typeof msg.cat_id != 'undefined'){

		searchData.cat_id = msg.cat_id;
	}
	if(typeof msg.search != 'undefined'){
		regexp = new RegExp('(^|\\s+)'+msg.search,'i')
		searchData.name = regexp;	
	}
	
	/*var currentDate = new Date();
	searchData.exp_date = {$gte : {currentDate}};*/

	console.log(searchData);

	Product.find(searchData, function(err, product){
		if(product == "")
				{
					console.log(err);
					res.code = "401";
					res.value = "Failed to fetch Product";
				}
			else
				{
				// console.log(product);
					res.code = "200";
					res.value = "Product Fetched";
					res.object = product;
				}
		callback(null, res);
	});

	// if (msg.search != undefined && msg.cat_id != undefined) {
	// // Product.find({name: /.*T.*/, cat_id: msg.cat_id, isActive: true}, function(err, product) {
	// Product.find({}, function(err, product) {
	// 	if(product == "")
	// 			{
	// 			console.log(err);
	// 			res.code = "401";
	// 			res.value = "Failed to fetch Product";
	// 			}
	// 		else
	// 			{
	// 			// console.log(product);
	// 			res.code = "200";
	// 			res.value = "Product Fetched";
	// 			res.object = product;
	// 			}
	// 	callback(null, res);
	// });
	// }	
	// if (msg.search != undefined && msg.cat_id == undefined) {
	// 	console.log("Category is undefined");
	// Product.find({name: new RegExp('(^|\\s+)'+msg.search,'i'), isActive: true}, function(err, product) {
	// 	if(product == "")
	// 			{
	// 			console.log(err);
	// 			res.code = "401";
	// 			res.value = "Failed to fetch Product";
	// 			}
	// 		else
	// 			{
	// 			// console.log(product);
	// 			res.code = "200";
	// 			res.value = "Product Fetched";
	// 			res.object = product;
	// 			// console.log(product);
	// 			}

	// 	callback(null, res);
	// });
	// }
	// if (msg.search == undefined && msg.cat_id != undefined) {
	// Product.find({cat_id: msg.cat_id,isActive: true}, function(err, product) {
	// 	if(product == "")
	// 			{
	// 			console.log(err);
	// 			res.code = "401";
	// 			res.value = "Failed to fetch Product";
	// 			}
	// 		else
	// 			{
	// 			// console.log(product);
	// 			res.code = "200";
	// 			res.value = "Product Fetched";
	// 			res.object = product;
	// 			}
	// 	callback(null, res);
	// });
	// }
};


exports.get_prod = function(msg, callback){
	var res = {};
	console.log("In servers get prod");
	console.log(msg);
	console.log(msg.p_id);

	Product.find({p_id: msg.p_id,isActive: true}, function(err, product) {
		if(product == "")
				{
				console.log(err);
				res.code = "401";
				res.value = "Failed to fetch Product";
				}
			else
				{
				console.log(product);
				res.code = "200";
				res.value = "Product Fetched";
				res.object = product;
				}
		callback(null, res);
	});
};

exports.farmer_page = function(msg, callback){
	var p= {};
	var f= {};
	
	//console.log("In servers get farmers");
	Farmer.find({f_id: msg.f_id}, function(err, farmer) {
		if(farmer == "")
				{
				console.log(err);
				farmer.code = "401";
				farmer.value = "Failed to fetch farmer_page";

				}
			else
				{
				//console.log(farmer);
				f.code = "200";
				f.value = "Farmer Fetched";
				f.object = farmer;
				console.log(farmer);
				Product.find({f_id: msg.f_id}, function(err, product) {
		if(product == "")
				{
				console.log(err);
				product.code = "401";
				product.value = "Failed to fetch prod info";
				}
			else
				{
				console.log(product);
				p.code = "200";
				p.value = "Farmer products Fetched";
				p = product;
				//console.log(p);
				
	//console.log(p);
	//console.log(f);
	var res = {"farmer": f,"product": p};
	callback(null, res);
				}
	});
				}
	});
};
	exports.myReviews = function(msg, callback){
	var p= {};
	var f= {};
	
	//console.log("In servers get farmers");
	Farmer.find({"reviews.username" : msg.sid}, function(err, farmer) {
		if(farmer == "")
				{
				console.log(err);
				farmer.code = "401";
				farmer.value = "Failed to fetch farmer review";
				console.log("No farmer fetched");
				}
			else
				{
				//console.log(farmer);
				f.code = "200";
				f.value = "Farmers review Fetched";
				f.object = farmer;
				}
				Product.find({"reviews.username": msg.sid}, function(err, product) {
		if(product == "")
				{
				console.log(err);
				product.code = "401";
				product.value = "Failed to fetch prod reviews";
				}
			else
				{
				//console.log(product);
				p.code = "200";
				p.value = "Products reviews Fetched";
				p = product;
				//console.log(p);
				
	console.log(p);
	console.log(f.object);
	var res = {"farmer": f,"product": p};
	callback(null, res);
				}
	});
				
	});
};

exports.create_review = function(msg, callback){
	var res = {};
	console.log("In servers create review");
	console.log(msg);
	Product.update({"p_id": msg.p_id}, {"$push": {"reviews": {"c_id": msg.c_id, "username": msg.name,"rating": msg.star,"review_title": msg.title,"review_desc": msg.review}}},{upsert:true},function(err){
        console.log("In prod update");
        if(err){
                console.log(err);res.code = "401";
				res.value = "Failed to create review";
        }else{	
        		res.code = "200";
				res.value = "Review Created";
                console.log("create_review successful");
        }
        callback(null, res);
});
};

exports.f_create_review = function(msg, callback){
	var res = {};
	console.log("In servers farmer create review");
	console.log(msg);
	Farmer.update({"f_id": msg.f_id}, {"$push": {"reviews": {"c_id": msg.c_id, "username": msg.name,"rating": msg.star,"review_title": msg.title,"review_desc": msg.review}}},{upsert:true},function(err){
        console.log("In f_create update place");
        if(err){
                console.log(err);res.code = "401";
				res.value = "Failed to create review";
        }else{	
        		res.code = "200";
				res.value = "Review Created";
                console.log("Farmers create_review successful");
        }
        callback(null, res);
});
};


exports.createProduct = function(req, res){

	//var store_name = req.store_name;
	var email = req.email;
	var name = req.name;
	var price = req.price;
	var weight = req.weight;
	var unit = req.unit;
	var quantity = req.quantity;
	var exp_date = req.exp_date;
	var exp_month = req.exp_month-1;
	var exp_year = req.exp_year;
	var details = req.details;
	var description = req.description;
	var features = req.features;
	var product_img = req.product_img;
	console.log("store_email :: " + email);
	//Store.findOne({email : req.store_email, name : req.store_name}, 'store_id', function(err, results) {
	Farmer.findOne({email : req.email}, 'f_id fname', function(err, results) {
		if(err) { 
			console.log("err : " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log(results);
			if(results != null) {
				console.log("Store ID Found!");

				var f_id = results.f_id;
				var f_name = results.fname;

				console.log("store_id :: " + f_id);
				console.log("store_name :: " + f_name);

				var product = Product({
					f_name : f_name,
					email : email,
					f_id : f_id,
					name : name,
					price : price,
					weight : weight,
					unit : unit,
					quantity : quantity,
					exp_date : new Date(Number(exp_year),Number(exp_month),Number(exp_date),23,59,59,59),
					details : details,
					description : description,
					features : features,
					product_img : product_img
				});

				product.save(function(err, data) {
					if(err) {
						console.log("err :: " + err);
						json_responses = {"status" : 401, "error" : "error occurred while executing save query"};
						res(null, JSON.stringify(json_responses));		
					} else {
						console.log("Product Added!");
						console.log(data);
						console.log("product after Saving");

						json_responses = {"status" : 200};
						res(null, JSON.stringify(json_responses));
					}
				});
			} else {
				console.log("Could not find Store Id!");
				json_responses = {"status" : 401, "error" : "Could not find Store ID while adding Product!"};
				res(null, JSON.stringify(json_responses));
			}
		}
	});

	/*var farmer_name = null;
	console.log("in createProduct");
	Farmer.findOne({f_id:req.f_id},function(err,result){
		if(err){
			console.log("error finding farmer");
			console.log(err);
			resGen.error(err,res);
		}else{
			if(result){
				console.log("result found");
				//farmer_name = result.fname + " " + result.lname;	
				//console.log(farmer_name);	
				var product = Product({
					//p_id : req.p_id,
					name : req.name,
					//f_id: req.f_id,
					//f_name: farmer_name,
					//cat_id: req.cat_id,
					price : req.price,
					weight : req.weight,
					unit: req.unit,
					price_unit: Number(req.price)/Number(req.weight),
					quantity: req.quantity,
					details : req.details,
					description : req.description,
					features: req.features,
					product_img: req.product_img
				});
				product.images[0] = req.image1;
				product.images[1] = req.image2;
				product.images[2] = req.image3;
				console.log(req.product_img);
				product.save(function(err,results){
					if(err)
					{
						resGen.error(err,res);
					}
					else
					{
						if(results){
							console.log("product created");
							//console.log(results);
							res(null,resGen.responseGenerator(200, results));
						}
						else
						{
							console.log("no data");
							resGen.error(null,res);
						}
					}
				});
			}
			else{
				console.log("no result add product");
				res(null,result);
			}
		}
	});*/

}

exports.editProduct = function(req, res){

	console.log(":: edit Product :: ");
	console.log("exp_year :: " + req.exp_year);
	console.log("exp_month :: " + req.exp_month);
	console.log("exp_date :: " + req.exp_date);

	var exp_date = Number(req.exp_date);
	var exp_month = Number(req.exp_month-1);
	var exp_year = Number(req.exp_year);

	Product.findOne({p_id:req.p_id}, function(err,result){
		if(err) {
			console.log("err : " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log("result finding a product");
			console.log(result);
			if(result){
				console.log("product exist");
				result.name = req.name;
				
				/*if(result.f_id != req.f_id){
					Farmer.find({f_id:req.f_id}, {fname:1,lname:1,f_id:1}, function(err,res){
						if(err){
							resGen.error(err,res);
						} else {
							result.farmer_name = res.fname + " " + res.lname;
							result.f_id = res.f_id;
						}
					});
				}
				console.log(result.f_id);
				result.cat_id = req.cat_id;*/
				result.price = req.price;
				result.weight = req.weight;
				result.unit = req.unit;
				result.details = req.details;
				result.description = req.description;
				result.features = req.features;
				result.quantity = req.quantity;
				console.log("Before Editing date :: " + result.exp_date);
				result.exp_date = new Date(Number(exp_year), Number(exp_month), Number(exp_date), 23, 59, 59, 59);
				console.log("After Editing date :: " + result.exp_date);
				//result.description = req.description;
				result.save(function(err,doc){
					if(err){
						console.log("err :: " + err);
						json_responses = {"status" : 401, "error" : "error occurred while executing edit query"};
						res(null, JSON.stringify(json_responses));
					} else {
						console.log("product edited");
						json_responses = {"status" : 200};
						res(null, JSON.stringify(json_responses));
					}
				});
			}
			else
			{
				resGen.error(null,res);
			}
		}
	});
}

exports.deleteProduct = function(req, res){

	console.log("p_id :: " + req.p_id);
	Product.findOne({p_id:req.p_id},function(err,result){
		if(err) {
			console.log("err : " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log("result finding a product");
			console.log(result);
			if(result){
				console.log("product exists");
				result.isActive = false;
				result.save(function(err,doc){
					if(err){
						console.log("err :: " + err);
						json_responses = {"status" : 401, "error" : "error occurred while executing delete query"};
						res(null, JSON.stringify(json_responses));
					} else {
						console.log("product inactive now");
						json_responses = {"status" : 200};
						res(null, JSON.stringify(json_responses));
					}
				});
			} else {
				console.log("no data delete product");
				json_responses = {"status" : 401, "error" : "no data delete product"};
				res(null, JSON.stringify(json_responses));
			}
		}
	});
}

exports.getStoreProducts = function(req, res) {
	console.log("getStoreProducts");

	email = req.email;

	Product.find({email : email, isActive:true},function(err,results){
		if(err) {
			console.log("err :: " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log(results);
			if(results != null) {
				console.log("All Products of '" + email + "' Store Found!");
				json_responses = {"status" : 200, "data" : results};
				res(null, JSON.stringify(json_responses));

			} else {
				json_responses = {"status" : 401, "error" : "no products data found"};
				res(null, JSON.stringify(json_responses));
			}
		}
	});
}
