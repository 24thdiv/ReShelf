var store = angular.module('storeModule',['xeditable','ngFileUpload']);

store.controller('storeController',['$scope','$http','$sce','$filter', 'Upload', 
	function($scope,$http,$sce,$filter, Upload){
	
	/*
	-------Created by Darshil Saraiya 05/05/16-------
	-------Updated by Darshil Saraiya 05/08/16-------
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

	$scope.saveProduct = function(data, id, store_id) {
		
		console.log("Save Product");
		angular.extend(data, {id:id});
		console.log(data);
		console.log("product id :: " + id);
		console.log("store_id :: " + store_id);

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
				store_id : store_id,
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
	}
}]);