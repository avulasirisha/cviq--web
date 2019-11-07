angular.module('Cviq').controller('educationCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$filter', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $filter){


    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
    console.log($scope.userData);

    //$scope.years = ['1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015', '2016','2017','2018','2019','2020','2021','2022'];

    var currentYear = new Date().getFullYear();
    $scope.years = [];

    for(var i = 0; i < 57; i++){
        $scope.years.push(currentYear - i);
    }
    console.log('yearArray', $scope.years);

    /*=============================Start: Get Matched Jobs ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/candidate/recentlySearchedJobs',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('data', response);
            $scope.recentlysearchedJobs = response.data;
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    /*=============================End: Get Matched Jobs ================================*/


    /*=============================Start: Call Get Drop Down Data API ================================*/

    $scope.graduation;
    $scope.postGraduation;
    $scope.qualSpecialization = [];

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log(response);
            $scope.qualificationList = response.data.highestQualification;
            $scope.graduation = response.data.Graduation;
            $scope.postGraduation = response.data.PostGraduation;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    $scope.selectedQualification = function(data){

        console.log('data', data);

        $scope.selHighQual = data.split(" ").join("");

        if($scope.selHighQual == 'Graduation'){

            $scope.qualSpecialization = [];
            _.forEach($scope.graduation, function(value){
                $scope.qualSpecialization.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })

        }
        else if($scope.selHighQual == 'PostGraduation'){

            $scope.qualSpecialization = [];
            _.forEach($scope.postGraduation, function(value){
                $scope.qualSpecialization.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
        }
    }

    /*=============================End: Call Get Country list API ================================*/

    /*=============================Start: Save Experience Details ================================*/

    $scope.saveWorkExperience = function (data) {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/updateEmploymentDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "_id": data._id,
                "designation": data.designation,
                "companyName": data.companyName,
                "industry": data.industry,
                "durationFrom": data.durationFrom,
                "durationTo": data.durationTo,
                "accomplishments": data.accomplishments,
                "currentEmployer": data.currentEmployer,
                "annualSalary": data.annualSalary
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

    $scope.addEducationalDetails = function () {

        $timeout(function () {
            $('.selectpicker').selectpicker();
        },500);

        ngDialog.open({
            template: 'addEducation',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================End: Add Employment Dialog Open Details ================================*/

    /*=============================Start: Add New Education Details ================================*/

    $scope.addBtn = false;

    $scope.addNewEducation = function (data) {
        console.log(data);

        $scope.addBtn = true;

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/updateEducationDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "_id": "",
                "qualificationLevel": data.qualification,
                "specialization": data.specialization,
                "instituteName": data.institute,
                "passoutYear": data.year
            }
        })
            .success(function(response){
                $scope.addBtn = false;
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.education');
            })
            .error(function(response){
                $scope.addBtn = false;
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Add New Education Details ================================*/

    /*=============================Start: Delete Education Dialog ================================*/

    var deleteEduId;

    $scope.deleteEducation = function(data){

        deleteEduId = data;

        ngDialog.open({
            template: 'deleteEducation',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================End: Delete Education Dialog ================================*/

    $scope.closeDialogBox = function () {
        ngDialog.close();
    }


    /*=============================Start: Delete Education Details ================================*/

    $scope.deleteEducationDetails = function () {

        var eduID = {
            educationID:deleteEduId
        }

        $http({
            method: 'DELETE',
            url: CONSTANT.apiUrl + '/api/candidate/deleteEducationDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params:eduID
        })
            .success(function(response){
                console.log('success', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.education');
            })
            .error(function(response){
                console.log('Error', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Delete Education Details ================================*/
    
    
    $scope.editSelectedQualification = function (data) {
        console.log(data);

        $scope.selHighQual = data.split(" ").join("");

        if($scope.selHighQual == 'Graduation'){

            $scope.qualSpecializationArray = [];
            _.forEach($scope.graduation, function(value){
                $scope.qualSpecializationArray.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })

        }
        else if($scope.selHighQual == 'PostGraduation'){

            $scope.qualSpecializationArray = [];
            _.forEach($scope.postGraduation, function(value){
                $scope.qualSpecializationArray.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
        }
    }
    


    /*=============================Start: Edit Education Details ================================*/

    $scope.editEducationData = function (data) {

            var workData = _.filter($scope.userData.education, {_id: data});
            _.forEach(workData, function (value) {

                $scope.master = value;
                $scope.editEducation = angular.copy($scope.master);

                var qualLevel =  $scope.editEducation.qualificationLevel.split(" ").join("");


                if(qualLevel == 'Graduation'){
                    $scope.qualSpecializationArray = [];
                    _.forEach($scope.graduation, function(value){
                        $scope.qualSpecializationArray.push(value.courseName);
                        $timeout(function(){
                            $('.selectpicker').selectpicker('refresh');
                        },0);
                    })
                }
                else if(qualLevel == 'PostGraduation'){
                    $scope.qualSpecializationArray = [];
                    _.forEach($scope.postGraduation, function(value){
                        $scope.qualSpecializationArray.push(value.courseName);
                        $timeout(function(){
                            $('.selectpicker').selectpicker('refresh');
                        },0);
                    })
                }

                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },100);
                
            });

            ngDialog.open({
                template: 'editEducations',
                className: 'ngdialog-theme-default employment-details',
                scope: $scope,
                closeByEscape:false,
                closeByDocument:false
            });

    }

    /*=============================End: Edit Education Details ================================*/
    
    $scope.editExistedEducation = function (res) {
        console.log(res);

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/updateEducationDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "_id": res._id,
                "qualificationLevel": res.qualificationLevel,
                "specialization": res.specialization,
                "instituteName": res.instituteName,
                "passoutYear": res.passoutYear
            }
        })
            .success(function(response){
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.education');
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

}]);