var store = angular.module('storeModule',['xeditable','ngFileUpload']);

store.controller('storeController',['$scope','$http','$sce','$filter', 'Upload', 
	function($scope,$http,$sce,$filter, Upload){
	
	/*
	-------Created by Darshil Saraiya 05/05/16-------
	-------Updated by Darshil Saraiya 05/10/16-------
	-------Store product-list Page operations-------
	*/
	$scope.getStoreProducts = function(){
		console.log("getStoreProducts ::");
		$http({
			method : "GET",
			url : '/product/store'
		}).success(function(res){
			if (res.status === 200) {
				console.log("success on getStoreProducts : " + res.data);
				$scope.products = res.data;
			}
		});
	}

	$scope.isDateInValid = false;
	$scope.addProduct = function() {
		
		console.log("addProduct");
		$scope.isDateInValid = false;

		var product_img = $scope.product_img;
		console.log("product_img :: ");
		console.log(product_img);
		console.log("product_img end ::");

		console.log("Current Month :: " + (new Date().getMonth()+1));
		console.log("Current Date :: " + new Date().getDate());
		console.log("Current Year :: " + new Date().getFullYear());

		var month = $scope.month;
		var date = $scope.date;
		var year = $scope.year;
		
		$scope.isDateInValid = $scope.checkDate(month, date, year);

		console.log("isDateInValid in addProduct :: " + $scope.isDateInValid);
		
		if(!$scope.isDateInValid) {
			
			//uploading product and then adding product
			Upload.upload({
				url : "/fileUpload",
				data : {
					product_img : $scope.product_img
				}
			}).success(function(res) {
				$scope.product_img = "img/" + res.data;
				console.log("product image after string operation :: ");
				console.log($scope.product_img);
				console.log("product image end :: ");

				if(res)	{

					//adding product
					$http({
						method : "POST",
						url : "/product/create",
						data : {
							name : $scope.name,
							price : $scope.price,
							weight : $scope.weight,
							unit : $scope.unit,
							quantity : $scope.quantity,
							exp_date : $scope.date,
							exp_month : $scope.month,
							exp_year : $scope.year,
							details: $scope.details,
							description: $scope.description,
							features: $scope.features,
							product_img : $scope.product_img
						}
					}).success(function(res) {
						if(res.status == 200) {
							console.log("Product successfully added!");
							//$scope.getStoreProducts();
							window.location.assign('/store/home');
						} else if(res.status == 401) {
							console.log("Could not add Product");
							console.log("Error :: Angular :: " + res.error);
						}
					}).error(function(err) {
						console.log("in agnular :: error in creating adding product :: " + err);
						

					});
				} else {
					console.log("file not uploaded");
				}

			}).error(function(error) {
				console.log("error in uploading image : " + error);
			});
		}
	};

	//Check validity of the Expirty date
	$scope.checkDate = function(monthString, dateString, yearString) {
		console.log("checkDate");
		//console.log("isDateInValid :: " + $scope.isDateInValid);
		
		var month = Number(monthString);
		var date = Number(dateString);
		var year = Number(yearString);

		console.log("filled month :: " + month);
		console.log("filled date :: " + date);
		console.log("filled year :: " + year);

		var todayDate = new Date();
		//console.log("todayDate :: " + todayDate);
		//console.log("month :: " + $scope.month); 
		//console.log("date :: " + $scope.date);
		//console.log("year :: " + $scope.year);

		if(typeof month == 'undefined' || typeof date == 'undefined' || typeof year == 'undefined' ||
			( month < (todayDate.getMonth() + 1) ) || ( date < todayDate.getDate() ) || ( year < new Date().getFullYear() ) ) {
				console.log("1");
				//$scope.isDateInValid = true;	
				return true;
		} else {

			if(year < 9999) {
				switch(month) {
					case 4: 
					case 6:
					case 9:
					case 11:
						if(date < 31) {
							//$scope.isDateInValid = false;
							return false;
						} else {
							console.log("2");
							//$scope.isDateInValid = true;
							return true;
						}
					break;

					case 1:
					case 3:
					case 5:
					case 7:
					case 8:
					case 10: 
					case 12 :
						if( date < 32 ) {
							//$scope.isDateInValid = false;	
							return false;
						} else {
							console.log("3");
							//$scope.isDateInValid = true;
							return true;
						}
					break;

					case 2:
						if( (year % 4) < 1 ) {
							if( date < 30 ) {
								//$scope.isDateInValid = false;
								return false;		
							} else {
								console.log("4");
								//$scope.isDateInValid = true;
								return true;
							}
						} else {
							if( date < 29 ) {
								//$scope.isDateInValid = false;
								return false;
							} else {
								console.log("5");
								//$scope.isDateInValid = true;
								return true;
							}
						}
					break;

					default :
						console.log("6");
						//$scope.isDateInValid = true;
						return true;
					break;
				}	
			} else {
				console.log("7");
				//$scope.isDateInValid = true;
				return true;
			}	
		}
	};

	$scope.isDateWrong = false;
	$scope.checkEditedDate = function(exp_date_full) {
		console.log("checkEditedDate");
		console.log(exp_date_full);

		$scope.isDateWrong = false;

		var date_month_year = exp_date_full.split("-");
		console.log("date_month_year :: " + date_month_year);

		if(date_month_year.length != 3) {
			$scope.isDateWrong = true;
			return false;
		} else {
			var month = date_month_year[0];
			var date = date_month_year[1];
			var year = date_month_year[2];

			if($scope.checkDate(month, date, year)) {
				$scope.isDateWrong = true;
				return false;
			}
			else {
				$scope.isDateWrong = false;
				return true;
			}
		}

	}

	$scope.saveProduct = function(data, id, f_id) {
		
		console.log("Save Product");
		angular.extend(data, {id:id});
		console.log(data);
		console.log("product id :: " + id);
		console.log("f_id :: " + f_id);

		var exp_date_full = data.exp_date;
		console.log("exp_date_full :: " + exp_date_full);
		var month, date, year;

		var date_month_year = exp_date_full.split("-");
		console.log("date_month_year :: " + date_month_year);

		if(date_month_year.length != 3) {
			//$scope.isDateWrong = true;
			return false;
		} else {
			month = date_month_year[0];
			date = date_month_year[1];
			year = date_month_year[2];

			if($scope.checkDate(month, date, year))
				//$scope.isDateWrong = true;
				return false;
			/*else
				//$scope.isDateWrong = false;
				return true;*/
		}

		$http({
			method : 'POST',
			url : '/product/edit',
			data : {
				p_id : id,
				f_id : f_id,
				name : data.name,
				price : data.price,
				weight : data.weight,
				unit : data.unit,
				quantity : data.quantity,
				exp_date : date,
				exp_month : month,
				exp_year : year,
				details : data.details,
				description : data.description,
				features : data.features
			}
		}).success(function(res) {
			if(res.status == 200) {
				console.log("Product successfully edited");
				$scope.getStoreProducts();
				//$scope.products = res.data;
			} else if(res.status == 401) {
				console.log("Error : Angular : " + res.error);
			}
		}).error(function(err) {
			console.log("err : " + err);
		});
	};

	$scope.removeProduct = function(id) {
		console.log("Delete Product");
		console.log("product id :: " + id);

		//if(id) {
		//	if(id.length == 9){
				$http({
					method : "DELETE",
					url : '/product/delete',
					params: {
						p_id : id
					}
				}).success(function(res){
					if (res.status === 200) {
						console.log("success on remove product");
						$scope.getStoreProducts();
						return;
					} else if (res.status == 401) {
						console.log("error :: " + res.error);
						//window.alert("Error : " + res.error);	
					}
				}).error(function(error) {
					console.log("error :: " + error);
				});
		//	}
		//}
	};
	/*
		Store product-list operations end
	*/

	/*
	-------Created by Darshil Saraiya 05/10/16-------
	-------Updated by Darshil Saraiya 05/10/16-------
	-------Store order-list Page operations-------
	*/
	
	$scope.getAllStoreOrders = function(){
		console.log("get all store orders");
		
		$http({
			method : "POST",
			url : '/store/orders/all'
		}).success(function(res) {
			if(res.status == 200) {
				console.log("res.data :: ");
				console.log(res.data);

				console.log("f_id :: ");
				console.log(res.f_id);
				
				$scope.orders = res.data;
				$scope.f_id = res.f_id;
			} else if(res.status == 401) {
				console.log("error :: Angular :: " + res.error);
			}
		}).error(function(err) {
			console.log("error in getStoreProducts :: " + err);
		});
	};

	$scope.total = 0;
	$scope.isShowStoreOrderDetails = false;
	$scope.showStoreOrderDetails = function(order) {
		console.log("showStoreFullOrder");

		console.log("order_id :: " + order.o_id);

		$scope.isShowStoreOrderDetails = true;
		$scope.total = 0;

		console.log(order);

		$scope.orderDetails = order;

		for(var index = 0; index < order.order_detail.length;index++) {

			console.log("product id : " + (index+1) + " :: " + order.order_detail[index].p_id);
			console.log("product qty : " + (index+1) + " :: " + order.order_detail[index].qty);
			console.log("product price : " + (index+1) + " :: " + order.order_detail[index].price);
			if(order.order_detail[index].f_id == $scope.f_id)
				$scope.total = $scope.total + order.order_detail[index].price;
		}
		/*http({
			method : "POST",
			url : '/store/orderDetails',
			data : {
				o_id : o_id
			}
		}).success(function(res) {
			if(res.status == 200) {
				$scope.orderDetails = res.data;
			} else if(res.status == 401) {
				console.log("Error :: " + res.error);
			}
		}).error(function(err) {
			console.log("Error :: Angular :: " + err);
		});*/
	}

	$scope.changeIsShowStoreOrderDetails = function() {
		$scope.isShowStoreOrderDetails = false;
	}
	/*
		Store order-list page operations end
	*/

	/*
	-------Created by Darshil Saraiya 05/11/16-------
	-------Updated by Darshil Saraiya 05/11/16-------
	-------Store Profile Page operations-------
	*/
	$scope.isProfileNotFound = false;
	$scope.getStoreProfile = function(){
		$scope.isProfileNotFound = false;
		$http({
			method : 'POST',
			url : '/store/getStoreProfile'
		}).success(function(res) {
			console.log(res);
			if(res.status == 200) {
				$scope.isProfileNotFound = false;
				//res.data.zipCode = Number(res.data.zipCode);
				$scope.farmer = res.data;
			} else {
				$scope.isProfileNotFound = true;
			}
		}).error(function(error) {
			console.log("error : " + error);
		});
	}

	$scope.saveStoreProfile = function(data, id) {
		angular.extend(data, {id: id});
		console.log("saveStoreProfile data::");
		console.log(data);
		console.log("f_id :: " + id);
		//if(data && id) {
			//if(data.number.length == 7 && id.length == 9){
				$http({
					method : "POST",
					url : '/store/saveStoreProfile',
					data: {
						f_id : id,
						fname : data.fname,
						email : data.email,
						pass : data.pass,
						intro : data.intro,
						contacts : data.contacts,
						address : data.address,
						city : data.city,
						state : data.state,
						zipcode : data.zipcode
					}
				}).success(function(res){
					if (res.status === 200) {
						console.log("success on save farmer" + res.data);
						//res.data.zipCode = Number(res.data.zipCode);
						$scope.farmer = res.data;
						return;
					} else if(res.status == 401) {
						console.log("error :: " + res.error);
						window.alert("Error : " + res.error);
					}
				}).error(function(error) {
					console.log("error : " + error);
				});


	}
	/*
		Store Profile page operations end
	*/
}]);