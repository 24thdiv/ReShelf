/*
-------Created by Darshil Saraiya 05/05/16-------
-------Updated by Darshil Saraiya 05/10/16-------
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
	console.log("ordersList");
	if(req.session!= null && req.session.store!= null &&  req.session.store.email) {
  		res.render('store-ordersList', {
  	 		email : req.session.store.email, 
  	 		fname : req.session.store.fname
    	});
		/*res.render('store-index', {
			email : req.session.store.email, 
  	 		fname : req.session.store.fname
		});*/
  	} else
  		res.redirect('/store/login');
};

/*
	-------Created by Darshil Saraiya 05/11/16-------
	-------Updated by Darshil Saraiya 05/11/16-------
	-------Store profile Page operations-------
*/

exports.profile = function(req, res) {
	console.log("store profile");
	if(req.session!= null && req.session.store!= null &&  req.session.store.email) {
  		res.render('store-profile', {
  	 		email : req.session.store.email, 
  	 		fname : req.session.store.fname
    	});
  	} else 
  		res.redirect('/store/login');
}

exports.getStoreProfile = function(req, res) {

    if(req.session!= null && req.session.store!= null &&  req.session.store.email) {
      //messege payload for sending to server
      msg_payload = {"service" : "getStoreProfile", "email" : req.session.store.email};

      //making request to the server
      mq.make_request('store-queue', msg_payload,function(err, results) {
        if(err) {
          console.log("Error occurred while requesting to server for getStoreProfile : " + err);
          var json_resposes = {"status" : 401, "error" : "Could not connect to server"};
          res.send(json_resposes);
        } else {
            res.send(JSON.parse(results));
        }
      });
    } else
      res.redirect('/store/login');
}

exports.saveStoreProfile = function(req, res) {

  var f_id = req.param("f_id");
  var fname = req.param("fname");
  var email = req.param("email");
  var pass = req.param("pass");
  var intro = req.param("intro");
  var contacts = req.param("contacts");
  var address = req.param("address");
  var city = req.param("city");
  var state = req.param("state");
  var zipcode = req.param("zipcode");

  if(req.session!= null && req.session.store!= null &&  req.session.store.email) {
    //messege payload for sending to server
      msg_payload = {
        "service" : "saveStoreProfile", 
        "f_id" : f_id,
        "fname" : fname,
        "email" : email,
        "pass" : pass,
        "intro" : intro,
        "contacts" : contacts,
        "address" : address,
        "city" : city,
        "state" : state,
        "zipcode" : zipcode
      };

      //making request to the server
      mq.make_request('store-queue', msg_payload,function(err, results) {
        if(err) {
          console.log("Error occurred while requesting to server for saveStoreProfile : " + err);
          var json_resposes = {"status" : 401, "error" : "Could not connect to server"};
          res.send(json_resposes);
        } else {
          
          var dataParsed = JSON.parse(results);
          if(dataParsed.status == 200) {
            req.session.email = email;
            req.session.fname = fname;
            res.send(JSON.parse(results));
          } else if(dataParsed.status == 401) {
            res.send(JSON.parse(results));
          }
        }
      });
  } else 
    res.redirect('/store/login');
};
/*
	Store Profile page operations end
*/

//Home Page Map Get Stores
exports.getStores = function(req, res) {
          //messege payload for sending to server
          msg_payload = {"service" : "getStores"};

          //making request to the server
          mq.make_request('store-queue', msg_payload,function(err, results) {
            if(err) {
              console.log("Error occurred while requesting to server for getStores : " + err);
              var json_resposes = {"status" : 401, "error" : "Could not connect to server"};
              res.send(json_resposes);
            } else
                res.send(JSON.parse(results));
          });
}
//end