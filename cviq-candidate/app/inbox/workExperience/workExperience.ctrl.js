angular.module('Cviq').controller('workExperienceCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$filter', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $filter){


    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
    console.log($scope.userData);

    $scope.read = true;

    /*=============================Start: Get Matched Jobs ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/candidate/recentlySearchedJobs',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('data1', response);
            $scope.recentlysearchedJobs = response.data;
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    /*=============================End: Get Matched Jobs ================================*/

    /*=============================Start: Edit Profile ================================*/

    $scope.editProfile = function (data) {
        var workData = _.filter($scope.userData.workHistory, {_id: data});

        _.forEach(workData, function (value) {

            $scope.master = value;
            $scope.selectedWorkData = angular.copy($scope.master);

            console.log('=============', $scope.selectedWorkData);
        });

        $timeout(function () {

            $("#datetimepickerfrom").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                maxDate: new Date()
            });

            $("#datetimepickerto").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                maxDate: new Date()
            });

            $("#datetimepickerfrom").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());
                $("#datetimepickerto").data("DateTimePicker").minDate(e.date);
                $(e.target).trigger("change");
            });

            $("#datetimepickerto").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());
                $("#datetimepickerfrom").data("DateTimePicker").maxDate(e.date);
                $(e.target).trigger("change");
            });

        },500);

        ngDialog.open({
            template: 'workExperience',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }

    /*=============================End: Edit Profile ================================*/

    /*=============================Start: Delete Profile ================================*/

    var deleteEmpId;

    $scope.deleteDetails = function (data) {

        deleteEmpId = data;

        ngDialog.open({
            template: 'deleteWorkExperience',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }
    
    /*=============================End: Delete Profile ================================*/

    /*=============================Start: Cancel Personal Details ================================*/

    $scope.cancelPersonalDetails = function () {
        $scope.read = true;
        $state.reload('home.inbox.profile');
        $('.candidate-edit-profile input.inp').css("background", "none");
    }
    /*=============================End: Cancel Personal Details ================================*/
    
    $scope.closeDialogBox = function () {
        ngDialog.close();
    }

    /*=============================Start: Save Experience Details ================================*/

    $scope.saveWorkExperience = function (data) {
        console.log('fghfgh', data);

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editEmploymentDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{   
              "workHistory": [
                {              
                  "_id": data._id,
                  "designation": data.designation,
                  "companyName": data.companyName,
                  "industry": data.industry,
                  "durationFrom": data.durationFrom,
                  "durationTo": data.durationTo,
                  "currentEmployer": data.currentEmployer,
                  "annualSalary": data.annualSalary
               }      
               ]
             }                         
        })
            .success(function(response){
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.workExperience');
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Save Experience Details ================================*/

    /*=============================Start: Delete Experience Details ================================*/

    $scope.deleteEmpDetails = function (data) {
        var empID = {
            employmentID:deleteEmpId
        }

        $http({
            method: 'DELETE',
            url: CONSTANT.apiUrl + '/api/candidate/deleteEmploymentDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params:empID
        })
            .success(function(response){
                console.log('success', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.workExperience');
            })
            .error(function(response){
                console.log('Error', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Delete Experience Details ================================*/

    /*=============================Start: Add Employment Dialog Open Details ================================*/

    $scope.addEmploymentDetails = function () {

        $timeout(function () {

            $("#datetimepickerfromwork").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                maxDate: new Date()
            });

            $("#datetimepickertowork").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                maxDate: new Date()
            });

            $("#datetimepickerfromwork").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());
                $("#datetimepickertowork").data("DateTimePicker").minDate(e.date);
                $(e.target).trigger("change");
            });

            $("#datetimepickertowork").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());
                $("#datetimepickerfromwork").data("DateTimePicker").maxDate(e.date);
                $(e.target).trigger("change");
            });

        },500);

        ngDialog.open({
            template: 'addWorkExperience',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================End: Add Employment Dialog Open Details ================================*/

    /*=============================Start: Add New Employment Details ================================*/

    $scope.addBtn = false;

    $scope.addNewWorkExperience = function (data) {
        console.log(data);

        $scope.addBtn = true;

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editEmploymentDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
            "workHistory": [
                {
                "_id": "",
                "designation": data.designation,
                "companyName": data.companyName,
                "industry": data.industry,
                "durationFrom": data.durationFrom,
                "durationTo": data.durationTo,
                "currentEmployer": data.currentEmployer,
                "annualSalary": data.annualSalary
            }
            ]
            }
        })
            .success(function(response){
                $scope.addBtn = false;
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.workExperience');
            })
            .error(function(response){
                $scope.addBtn = false;
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Add New Employment Details ================================*/

}]);