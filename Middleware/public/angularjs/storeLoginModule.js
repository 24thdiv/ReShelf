var store = angular.module('storeLoginModule',[]);

store.controller('storeLoginController',['$scope','$http', function($scope,$http){

	//Store Login Submit
	$scope.isBlankEmail = false;
	$scope.isBlankPassword = false;
	$scope.isIncorrectDetails = false;

	$scope.loginSubmit = function() {
		
		$scope.isBlankEmail = false;
		$scope.isBlankPassword = false;
		$scope.isIncorrectDetails = false;		

		if($scope.email == '')
			$scope.email = null;

		if($scope.pass == '')
			$scope.pass = null;

		if ($scope.email == null) {
			
			$scope.isBlankEmail = true;
			$scope.isBlankPassword = false;
		} else if ($scope.email != null && $scope.pass == null){
			$scope.isBlankPassword = true;
		}

		if($scope.email != null && $scope.pass != null){
			//Check Login Credentials
			$http({
				method : "POST",
				url : "/store/checkLogin",
				data : {
					"email" : $scope.email,
					"pass" : $scope.pass
				}
			}).success(function(data) {
				if(data.status == 200){
					console.log("store login successful!");
					//Assigning the page to store homepage
					window.location.assign('/store/home');
				} else if(data.status == 401) {
					console.log("store login unsuccessful!");
					console.log("Error : " + data.error);
					$scope.isBlankEmail = false;
					$scope.isBlankPassword = false;
					$scope.isIncorrectDetails = true;
				}
			}).error(function(error){
				console.log("Error requesting server : " + error);
			});
		}
	}
	//Store login-page End


}]);