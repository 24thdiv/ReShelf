var maps = angular.module('mapctr',[]);

var cities = new Array();
/*var cities = [
    {
        city : 'Location 1',
        desc : 'Test',
        lat : 35.238983,
        long : -120.888509 
    },
    {
        city : 'Location 2',
        desc : 'Test',
        lat : 33.238168,
        long : -119.238168
    },
    {
        city : 'Location 3',
        desc : 'Test',
        lat : 36.242452,
        long : -121.889882 
    },
    {
        city : 'Location 4',
        desc : 'Test',
        lat : 34.247234,
        long : -122.893567 
    },
    {
        city : 'Location 5',
        desc : 'Test',
        lat : 35.241874,
        long : -120.883568 
    }
];*/


maps.controller('mapctr',['$scope','$http', function($scope,$http,$ionicLoading){

$scope.getStores = function() {
    console.log("get Stores on init");

    $http({
        method : 'POST',
        url : '/store/getStores'
    }).success(function(res) {
        console.log("in success");
        if(res){
            if(res.status == 200) {
                console.log("successfuly gotten stores");
                console.log(res.data);
                var mapData = res.data;
                $scope.mapTable = res.data;
                console.log("mapData.length :: " + mapData.length);

                for(var index = 0; index < mapData.length; index++) {
                  /*  console.log("index :: " + index);
                    console.log("longitude :: " + mapData[index].longitude);
                    console.log("latitude :: " + mapData[index].latitude);
                   */ 
                    cities[index] = {
                        city : mapData[index].fname,
                        desc : mapData[index].address+ ', ' +mapData[index].city + ', ' + mapData[index].zipcode,
                        lat : mapData[index].longitude,
                        long : mapData[index].latitude,
                        f_id : mapData[index].f_id
                    }
                }

                google.maps.event.addDomListener(document.getElementById("dvMap"), 'load', $scope.initialise());

            } else if(res.status == 401) {
                console.log("error :: angular :: " + res.error);
            }
        }
    }).error(function(err){
        console.log("error :: " + err);
    });
}

$scope.initialise = function() {
        var myLatlng = new google.maps.LatLng(37.3422,-121.8833);
        var mapOptions = {
            center: myLatlng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
      // Geo Location /
     /*   navigator.geolocation.getCurrentPosition(function(pos) {
            var image = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                animation: google.maps.Animation.DROP,
                icon:image,
                title: "My Location"
            });
        });*/
        
        $scope.dvMap = map;
        // Additional Markers //
        $scope.markers = [];
        var infoWindow = new google.maps.InfoWindow();
        var createMarker = function (info){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(info.lat, info.long),
                map: $scope.dvMap,
                animation: google.maps.Animation.DROP,
                title: info.city
            });
           

            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<a style="color:blue; text-decoration: underline;" href="/store_page?id='+info.f_id+'"><h4>' + marker.title + '</h4></a>' + marker.content);
                infoWindow.open($scope.dvMap, marker);
            });
            $scope.markers.push(marker);
        }  
        for (i = 0; i < cities.length; i++){
            createMarker(cities[i]);
        }

    };
    //google.maps.event.addDomListener(document.getElementById("dvMap"), 'load', $scope.initialise());


$scope.searchItemRedirect = function(){
	if(typeof $scope.q === "undefined") 
   		window.location.assign("/search/?search=");
	else
		window.location.assign("/search/?search="+$scopr.q);

  }


}]);
