angular.module('Cviq').controller('patentsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$filter', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $filter){


    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
    console.log($scope.userData);

    $scope.closeDialogBox = function () {
        ngDialog.close();
    }

    /*=============================Start: Delete Patent Dialog ================================*/

    var patentId;

    $scope.deletePatent = function(data){
        patentId = data;

        ngDialog.open({
            template: 'deletePatent',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================End: Delete Patent Dialog ================================*/

    /*=============================Start: Delete Patent Details ================================*/

    $scope.confirmDeletePatent = function () {

        var patID = {
            patentID:patentId
        }

        $http({
            method: 'DELETE',
            url: CONSTANT.apiUrl + '/api/candidate/deletePatentDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params:patID
        })
            .success(function(response){
                console.log('success', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.patents');
            })
            .error(function(response){
                console.log('Error', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }

    /*=============================End: Delete Patent Details ================================*/


    $scope.addNewPatents = function () {

        ngDialog.open({
            template: 'addPatent',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }


    /*=============================Start: Add Patent Details ================================*/

    $scope.addBtn = false;

    $scope.addNewPatent = function (data) {
        $scope.addBtn = true;

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editPatentDetail',
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
                $state.reload('home.inbox.patents');
            })
            .error(function(response){
                $scope.addBtn = false;
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Add Patent Details ================================*/

    $scope.editPatentvar;

    $scope.editPatent = function (data) {

        console.log(data);

        $scope.editPatentvar = data;

        ngDialog.open({
            template: 'editPatent',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================Start: Edit Patent Details ================================*/

    $scope.editPatentFunction = function () {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editPatentDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "_id": $scope.editPatentvar._id,
                "description": $scope.editPatentvar.description
            }
        })
            .success(function(response){
                $scope.addBtn = false;
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.patents');
            })
            .error(function(response){
                $scope.addBtn = false;
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================Edit: Edit Patent Details ================================*/

}]);