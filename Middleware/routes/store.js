/*
-------Created by Darshil Saraiya 05/05/16-------
-------Store related operations-------
*/

//Required Files
var mq = require('../rpc/client');

//store login page
exports.login = function(req, res) {
	if(req.session!= null && req.session.store!= null &&  req.session.store.email)
  		res.redirect('store/home');
	else
		res.render('store-login');
}

exports.logout = function(req, res) {
	console.log("store logout");
  	if(req.session!= null && req.session.store!= null && req.session.store.email)
  		req.session.destroy(function(err) {
  			res.redirect('/store/login');
  		});
  	else
		res.redirect("/store/login");
}

//store checking the login
exports.checkLogin = function(req, res) {

	//email password as parameters
	var email = req.param("email");
	var pass = req.param("pass");

	if(email != '' && pass != '') {
		//messege payload for sending to server
		msg_payload = {"service" : "checkLogin", "email" : email, "pass" : pass};

		//making request to the server
		mq.make_request('store-queue', msg_payload,function(err, results) {
			if(err) {
				console.log("Error occurred while requesting to server for checkLogin : " + err);
				var json_resposes = {"status" : 401, "error" : "Could not connect to server"};
				res.send(json_resposes);
			} else {
				var dataParsed = JSON.parse(results);
				if(dataParsed.status == 200) {

					var store = {
						"email" : email,
						"fname" : dataParsed.fname
					};

					req.session.store = store;

					console.log("store session set : " + req.session.store);
					/*req.session.email = email;
					req.session.fname = dataParsed.fname;
					req.session.lname = dataParsed.lname;*/
					
					res.send(JSON.parse(results));
				} else if(dataParsed.status == 401) {
					res.send(JSON.parse(results));
				}
			}
		});
	} else {
		var json_resposes = {"status" : 401, "error" : "Invalid Login Credentials!"};
		res.send(json_resposes);
	}
}

//store home page
exports.home = function(req, res){
  if(req.session!= null && req.session.store!= null && req.session.store.email) {
  	//Set these headers to notify the browser not to maintain any cache for the page being loaded
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('store-index', {
  	 email : req.session.store.email, 
  	 fname : req.session.store.fname
    });
  }
  else {
  	res.redirect('/store/login');
  }
};

exports.ordersList = function(req, res) {
	if(req.session!= null && req.session.store!= null &&  req.session.store.email) {
  	//Set these headers to notify the browser not to maintain any cache for the page being loaded
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('store-ordersList', {
  	 email : req.session.store.email, 
  	 fname : req.session.store.fname
    });
  }
  else {
  	res.redirect('/store/login');
  }
}
