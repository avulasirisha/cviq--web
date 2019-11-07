angular.module('Cviq').controller('awardsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$filter', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $filter){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
    console.log($scope.userData);

    $scope.closeDialogBox = function () {
        ngDialog.close();
    }

    /*=============================Start: Delete Award Dialog ================================*/

    var awardId;

    $scope.deleteAward = function(data){
        awardId = data;
        ngDialog.open({
            template: 'deleteAward',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================End: Delete Award Dialog ================================*/

    /*=============================Start: Delete Certification Details ================================*/

    $scope.confirmDeleteAward = function () {

        var awaID = {
            awardID:awardId
        }

        $http({
            method: 'DELETE',
            url: CONSTANT.apiUrl + '/api/candidate/deleteAwardDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params:awaID
        })
            .success(function(response){
                console.log('success', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.awards');
            })
            .error(function(response){
                console.log('Error', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }

    /*=============================End: Delete Certification Details ================================*/
    
    
    $scope.addNewAwards = function () {

        ngDialog.open({
            template: 'addAward',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }
    

    /*=============================Start: Add Award Details ================================*/

    $scope.addBtn = false;

    $scope.addNewAward = function (data) {
        $scope.addBtn = true;

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editAwardDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "_id": "",
                "description": data
            }
        })
            .success(function(response){
                $scope.addBtn = false;
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.awards');
            })
            .error(function(response){
                $scope.addBtn = false;
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Add Award Details ================================*/

    $scope.editAwardvar;
    
    $scope.editAward = function (data) {

        console.log(data);

        $scope.editAwardvar = data;

        ngDialog.open({
            template: 'editAward',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================Start: Edit Award Details ================================*/

    $scope.editAwardFunction = function () {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editAwardDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "_id": $scope.editAwardvar._id,
                "description": $scope.editAwardvar.description
            }
        })
            .success(function(response){
                $scope.addBtn = false;
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.awards');
            })
            .error(function(response){
                $scope.addBtn = false;
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================Edit: Edit Award Details ================================*/

}]);