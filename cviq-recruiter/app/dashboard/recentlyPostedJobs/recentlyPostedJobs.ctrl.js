angular.module('Cviq').controller('recentlyPostedJobsCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','ngDialog', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window,ngDialog){

    $rootScope.loading=true;
    $scope.fixHeight = false;
    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    
console.log("recentlyposted jobs");

    $scope.noRecentJob = false;

    $http({
        method : 'GET',
        url : CONSTANT.apiUrl + '/api/recruiter/getRecentPostedJobs',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function (response) {
            console.log("response",response.data)
            $scope.searchJobResult = response.data;
            console.log("length",$scope.searchJobResult.length)
            if($scope.searchJobResult.length == 0)
                $scope.noRecentJob = true;

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



    /*============================= Start : Job Status API=================================*/

    $scope.markStatusOpen = function (id,name,index) {



        $scope.openJobName = name;
        $scope.openJobIndex = index;
        $scope.statusOpenData = {};
        $scope.statusOpenData.jobID = id;
        $scope.statusOpenData.isExpired = false;

        ngDialog.open({
            template: 'statusOpen',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });



    };



    $scope.confirmStatusOpen = function () {

        ngDialog.close();

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/editJobStatus',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:$scope.statusOpenData
        })
            .success(function(response){
                console.log(response);
                $scope.searchJobResult[$scope.openJobIndex].isExpired = response.data.isExpired;
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })


    };

    $scope.markStatusClose = function (id,name,index) {
        
        $scope.closeJobName = name;
        $scope.closeJobIndex = index;
        $scope.statusCloseData = {};
        $scope.statusCloseData.jobID = id;
        $scope.statusCloseData.isExpired = true;

        ngDialog.open({
            template: 'statusClose',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });



    };

    $scope.denystatus = function () {

        ngDialog.close();
        
    };

    $scope.confirmStatusClose = function () {
        ngDialog.close();

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/editJobStatus',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:$scope.statusCloseData
        })
            .success(function(response){
                console.log(response);
                $scope.searchJobResult[$scope.closeJobIndex].isExpired = response.data.isExpired;
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })

    };



    /*============================= End : Job Status API=================================*/




    //===================to view job details under the job =======================================================


   /* $scope.showDetails = function (index) {

        var v = "#showJobDetails1-"+index;
        console.log("class toggled")
        $(v).toggleClass('showdetails hidedetails');


        var v1 = "#hideJobDetailsbtn-"+index;

        $(v1).toggleClass('showdetails hidedetails');

        var v2 = "#showJobDetailsbtn-"+index;
        $(v2).toggleClass('showdetails hidedetails');


    };
    $scope.hideDetails = function (index) {

        var v = "#showJobDetails1-"+index;
        console.log("class toggled")
        $(v).toggleClass('showdetails hidedetails');

        var v1 = "#hideJobDetailsbtn-"+index;

        $(v1).toggleClass('showdetails hidedetails');

        var v2 = "#showJobDetailsbtn-"+index;
        $(v2).toggleClass('showdetails hidedetails');
    };*/



}]);