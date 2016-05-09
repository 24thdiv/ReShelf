/*
-------Created by Darshil Saraiya 5/05/16-------
-------Customer related operations-------
*/

//REQUIRED FILES
var Store = require('./model/store');

//checkLogin
exports.checkLogin = function(req, res){

	console.log("store checkLogin");
	var email = req.email;
	var pass = req.pass;
	console.log("email :: " + email);
	console.log("pass :: " + pass);
	var json_responses;

	/*store.update({"email" : email}, {"$set" : {"pass" : "wallgreens"}}, function(err, result) {
		if(err) {
			console.log("err : " + err);
		} else {
			if(result) {
				console.log("result update query :: ");
				console.log(result);
			}
		}
	});*/

	/*var store = Store({
				name : "Wallgreens",
				email : "wallgreens@gmail.com",
				pass : '123456',
				address : "433 N 10th St",
				city : "San Jose",
				state : "California",
				zipCode : 95118
			});

		store.save(function(err, data) {
			if(err) {
				console.log("err :: " + err);
				//json_responses = {"status" : 401, "error" : "error occurred while executing save query"};
				//res(null, JSON.stringify(json_responses));
				
			} else {
				console.log("Store Added!");
				//json_responses = {"status" : 200};
				//res(null, JSON.stringify(json_responses));
			}
		});	*/
						
					

	Store.findOne({email : email, pass : pass}, 'store_id name email', function(err, results) {
		if(err) { 
			console.log("err : " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log(results);
			if(results != null) {
				console.log("Store Login Successful!");
				json_responses = {
					"status" : 200, 
					"name" : results.name,
					"email" : results.email,
					"store_id" : results.store_id
				};
				res(null, JSON.stringify(json_responses));
			} else {
			console.log("Unsuccessful Login for Store!");
				json_responses = {"status" : 401, "error" : "Invalid Login!"};
				res(null, JSON.stringify(json_responses));
			}
		}
	});
	
};

//get Stores
exports.getStores = function(req, res) {
	console.log("getStores");

	Store.find(function(err, results) {
		if(err) {
			console.log("err :: " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log(results);
			if(results != null) {
				console.log("All Stores Found!");
				json_responses = {"status" : 200, "data" : results};
				res(null, JSON.stringify(json_responses));

			} else {
				json_responses = {"status" : 401, "error" : "no stores data found"};
				res(null, JSON.stringify(json_responses));
			}

		}
	});
};

//create Store
exports.createStore = function(req, res){
	console.log("create store :: ");
	var newStore = req.newStore;

	Store.findOne({email : newStore[0].email, pass : newStore[0].pass}, function(err, results) {
		if(err) {
			console.log("err :: " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			if(results) {
				console.log("store email exist!");
				json_responses = {"status" : 401, "error" : "store Exists"};
				res(null, JSON.stringify(json_responses));
			} else {
				var store = Store({
					name : newStore[0].fname,
					email : newStore[0].email,
					pass : newStore[0].pass,
					intro : newStore[0].intro,
					tax : newStore[0].tax,
					contacts : newStore[0].contacts,
					address : newStore[0].address,
					city : newStore[0].city,
					state : newStore[0].state,
					zipcode : newStore[0].zipcode
				});

				store.save(function(err, data) {
					if(err) {
						console.log("err :: " + err);
						json_responses = {"status" : 401, "error" : "error occurred while executing save query"};
						res(null, JSON.stringify(json_responses));
					} else {
						console.log("Store Added!");
						json_responses = {"status" : 200};
						res(null, JSON.stringify(json_responses));
					}
				});
			}
		}
	});
};

exports.editStore = function(req, res) {

	console.log("editStore");
	var store_id = req.store_id;
	var name = req.name;
	var email = req.email;
	var address = req.address;
	var city = req.city;
	var state = req.state;
	var zipcode = req.zipcode;
	var contacts = req.contacts;
	var intro = req.intro;
	var tax = req.tax;

	Store.findOne({store_id : store_id}, function(err, result){
		if(err) {
			console.log("err :: " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing find query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log("result finding a store");
			console.log(result);
			if(result) {
				console.log("store exist");
				result.name = name;
				result.email = email;
				result.address = address;
				result.city = city;
				result.state = state;
				result.zipcode = zipcode;
				result.contacts = contacts;
				result.intro = intro;
				result.tax = tax;

				result.save(function(err, doc) {
					if(err) {
						console.log("err :: " + err);
						json_responses = {"status" : 401, "error" : "error occurred while executing edit query"};
						res(null, JSON.stringify(json_responses));		
					} else {
						console.log("store edited!");
						console.log(doc);
						console.log("store after editing");
						json_responses = {"status" : 200, "data" : doc};
						res(null, JSON.stringify(json_responses));
					}
				});
			}
		}
	});
};

exports.deleteStore = function(req, res ) {
	console.log("delete store");
	var store_id = req.store_id;

	Store.remove({store_id : store_id}, function(err, result) {
		if(err) {
			console.log("err :: " + err);
			json_responses = {"status" : 401, "error" : "error occurred while executing remove query"};
			res(null, JSON.stringify(json_responses));
		} else {
			console.log("result removing a store");
			console.log(result);
			if(result) {
				console.log("store deleted!");
				json_responses = {"status" : 200};
				res(null, JSON.stringify(json_responses));
			} else {
				json_responses = {"status" : 401, "error" : "error occurred while executing delete query"};
				res(null, JSON.stringify(json_responses));
			}
		}
	});
};