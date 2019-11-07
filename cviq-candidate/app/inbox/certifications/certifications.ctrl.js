angular.module('Cviq').controller('certificationsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$filter', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $filter){


    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
    console.log($scope.userData);

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

    $scope.closeDialogBox = function () {
        ngDialog.close();
    }

    /*=============================Start: Delete Certification Dialog ================================*/

    var certificateId;

    $scope.deleteCertification = function(data){
        certificateId = data;
        ngDialog.open({
            template: 'deleteCertificate',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    /*=============================End: Delete Certification Dialog ================================*/

    /*=============================Start: Delete Certification Details ================================*/
    
    $scope.confirmDeleteCertificate = function () {

        console.log(certificateId);
        var cerID = {
            certificationID:certificateId
        }

        $http({
            method: 'DELETE',
            url: CONSTANT.apiUrl + '/api/candidate/deleteCertificationDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params:cerID
        })
            .success(function(response){
                console.log('success', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.certifications');
            })
            .error(function(response){
                console.log('Error', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
        
    }
    
    /*=============================End: Delete Certification Details ================================*/

    /*=============================Start: Add Certification Dialog ================================*/

    $scope.addNewCertification = function () {

        $timeout(function () {

            $("#datetimepickervalid").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            $("#datetimepickervalid").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());
                $(e.target).trigger("change");
            });

        },500);

        ngDialog.open({
            template: 'addCertificate',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }

    /*=============================End: Add Certification Dialog ================================*/

    /*=============================Start: Add Certification Details ================================*/

    $scope.addBtn = false;

    $scope.addNewCertificate = function (data) {
        console.log(data);

        var certificateData = new FormData();
        certificateData.append("_id", "");
        certificateData.append("certificationName", data.certificateName);
        certificateData.append("issuedBy", data.issuedBy);
        certificateData.append("validity", data.validity);
        certificateData.append("lifeTimeValidity", data.lifeTimeValidity);

        if($('#certificates-upload')[0].files[0] != undefined){

            certificateData.append("doc", $('#certificates-upload')[0].files[0]);
        }

        $scope.addBtn = true;

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editCertificationDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken'),
                'Content-type': undefined
            },
            data: certificateData
        })
            .success(function(response){
                $scope.addBtn = false;
                console.log('data', response);
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.certifications');
            })
            .error(function(response){
                $scope.addBtn = false;
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Add Certification Details ================================*/

    /*=============================Start: Edit Certification Dialog ================================*/

    $scope.editCertificate;

    $scope.editCertification = function (data) {

        console.log(data);

        var certificateData = _.filter($scope.userData.certification, {_id: data});
        _.forEach(certificateData, function(value){

            $scope.master = value;
            $scope.editCertificate = angular.copy($scope.master);
        })
        console.log($scope.editCertificate);

        $timeout(function () {

            $("#datetimepickervalid1").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            $("#datetimepickervalid1").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());
                $(e.target).trigger("change");
            });

        },500);

        ngDialog.open({
            template: 'editCertificate',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false,
            preCloseCallback:function(){ $state.reload('home.inbox.certifications'); }
        });
        
    }

    /*=============================End: Edit Certification Dialog ================================*/

    /*=============================Start: Edit Certification Api ================================*/
    
    $scope.editExistingCertificate = function (data) {
        console.log('data================', data);

        var certificateData = new FormData();
        certificateData.append("_id", data._id);
        certificateData.append("certificationName", data.certificationName);
        certificateData.append("issuedBy", data.issuedBy);
        certificateData.append("validity", data.validity);
        certificateData.append("lifeTimeValidity", data.lifeTimeValidity);

        if(data.doc != '' && !$scope.certDel){
            certificateData.append("doc", data.doc);
        }
        else if($('#certificates-upload1')[0].files[0] != undefined){
                certificateData.append("doc", $('#certificates-upload1')[0].files[0]);
            }

        $rootScope.loading = true;
        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/editCertificationDetail',
            headers: {
                authorization: $cookieStore.get('AccessToken'),
                'Content-type': undefined
            },
            data: certificateData
        })
            .success(function(response){
                console.log('data', response);
                $rootScope.loading = false;
                ngDialog.close();
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.certifications');
            })
            .error(function(response){
                console.log(response);
                $rootScope.loading = false;
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Edit Certification Api ================================*/

    /*=============================Start: Delete Certification Documents ================================*/

    $scope.certDel = false;
    $scope.deleteDocuments = function (data) {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/deleteCertificationDoc',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                certificationID:data
                }
        })
            .success(function(response){
                console.log('data', response);
                $scope.certDel = true;
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                //$state.reload('home.inbox.certifications');
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }

    /*=============================End: Delete Certification Documents ================================*/

}]);