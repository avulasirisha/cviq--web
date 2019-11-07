angular.module('Cviq').controller('favouriteCandidatesCtrl', ['ngDialog','$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function(ngDialog, $scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){

    $rootScope.loading=true;

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    $scope.fixHeight = false;
    console.log("favouriteCandidates");



    $http({
        method : 'GET',
        url : CONSTANT.apiUrl + '/api/recruiter/getFavouriteCandidateList',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function (response) {
            console.log("favourite candidates",response)

            $scope.favourite = response.data;
            if($scope.favourite.length == 0)
                $scope.nofavourite = true;
            $rootScope.loading=false;
            $scope.fixHeight = true;
        })
        .error(function (response) {
            console.log("response",response)

            $rootScope.loading=false;
            $scope.fixHeight = true;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }
        });



    /*============================= Start : Favourite candidate API=================================*/

    $scope.markFavourite = function (index,id) {

        console.log("index ",index,"id ",id);
        var data = {};
        data.candidateID = id;
        data.setFavourite = true;

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/makeFavouriteCandidate',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:data
        })
            .success(function(response){
                console.log(response);
                $scope.favourite[index].isFavourite = response.data.isFavourite;

            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })
    };
    

    $scope.unFavourite = function (index,id,name) {
        console.log("index ",index,"id ",id);
        $scope.unfavname = name;
        $scope.indexofunfav = index;
        $scope.unfavdata = {};
        $scope.unfavdata.candidateID = id;
        $scope.unfavdata.setFavourite = false;

        ngDialog.open({
            template: 'favourite',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
       


    };

    $scope.denyUnFavourite = function () {

        ngDialog.close();





    };
    
    $scope.confirmUnFavourite = function () {
        ngDialog.close();




        console.log("index",$scope.indexofunfav);
        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/makeFavouriteCandidate',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:$scope.unfavdata
        })
            .success(function(response){
                console.log(response);
                $scope.favourite[$scope.indexofunfav].isFavourite = response.data.isFavourite;
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })

    };



    /*============================= End : Favourite candidate API=================================*/
    
    
    
}]);