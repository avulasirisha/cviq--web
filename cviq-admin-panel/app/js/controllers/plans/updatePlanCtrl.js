App.controller('UpdatePlanController', function ($state,$scope, $modal, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode, filterFilter) {

    'use strict';

    $scope.showloader = true;
    $scope.predicate = 'index';
    $scope.reverse = false;

    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }


    $scope.sort = function(type){
        console.log("hjh");
        $scope.predicate = type;
        $scope.reverse = !$scope.reverse;
    };
    
    //==========================================================================================================================
    // ============================================================ api for get membership plans =================================
    // =========================================================================================================================
    $http({
        method:'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getRecruiterMembershipPlan',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .success(function (response) {
            $scope.showloader = false;
            console.log(response);
            $scope.list = response.data;

        })
        .error(function (response) {
            $scope.showloader = false;

            console.log(response);
            if(response.statusCode == 401){
                $cookieStore.remove('obj');
                $cookieStore.remove('zoom');
                $cookieStore.remove('type');
                $cookieStore.remove('email');
                $.removeCookie('geoseen');
                $state.go('page.login');
            }


        });



    //==========================================================================================================================
//====================================================export api for get member ship plans ====================================
//==========================================================================================================================
    $scope.exportData = function () {
       
        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/admin/getRecruiterMembershipPlan',
            headers: {
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .success(function (response) {
                console.log(response);
                $scope.exportList = response.data;
                console.log($scope.exportList);
                alasql('SELECT * INTO CSV("MemberShipPlans.csv",{headers:true}) FROM ?', [$scope.exportList]);
            })
            .error(function (response, error) {
                console.log(response);
                console.log(error);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('zoom');
                    $cookieStore.remove('type');
                    $cookieStore.remove('email');
                    $.removeCookie('geoseen');
                    $state.go('page.login');
                }
            });
    };

    $scope.deletePlan = function (id , type) {
        $scope.deletePlanType = type;
        $scope.deletePlanId = id;
        ngDialog.open({
            template: 'deleteplan',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });


    };
    $scope.confirmDelete = function () {

        $scope.data = {};
        $scope.data.planID = $scope.deletePlanId;
        $http({
            method:'DELETE',
            url: MY_CONSTANT.url_cviq + '/api/admin/deleteRecruiterMembershipPlan',
            headers:{
                'authorization': $cookieStore.get('obj').accessToken
            },
            params: $scope.data ,
        })
            .success(function (response) {
                $http({
                    method:'GET',
                    url: MY_CONSTANT.url_cviq + '/api/admin/getRecruiterMembershipPlan',
                    headers:{
                        'authorization':$cookieStore.get("obj").accessToken,
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                })
                    .success(function (response) {
                        $scope.showloader = false;
                        console.log(response);
                        $scope.list = response.data;

                    })
                    .error(function (response) {
                        $scope.showloader = false;

                        console.log(response);


                    });

                ngDialog.close();

                console.log(response);

            })
            .error(function (response) {
                ngDialog.close();
                console.log(response);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('zoom');
                    $cookieStore.remove('type');
                    $cookieStore.remove('email');
                    $.removeCookie('geoseen');
                    $state.go('page.login');
                }

            });

    };
    $scope.denyDelete = function () {
        ngDialog.close();
    };

    $scope.updatePlan = function (data) {
        $scope.newdata = angular.copy(data);

        ngDialog.open({
            template: 'updateplan',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });


    };
    $scope.updateConfirm = function () {

        console.log($scope.newdata);
        $scope.data1 =  {
            "planID": $scope.newdata._id,
            "planType": $scope.newdata.planType,
            "planRate": $scope.newdata.planRate,
            "planDuration":$scope.newdata.planDuration,
            "jobsPostPerMonth":$scope.newdata.jobsPostPerMonth,
            "jobActiveDays": $scope.newdata.jobActiveDays,
            "planDescription": $scope.newdata.planDescription,
            "discount": $scope.newdata.discount
        };

        $http({
            method:'PUT',
            url: MY_CONSTANT.url_cviq +'/api/admin/updateRecruiterMembershipPlan',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                'planID': $scope.newdata._id,
                'planType': $scope.newdata.planType,
                'planRate': $scope.newdata.planRate,
                'planDuration':$scope.newdata.planDuration,
                'jobsPostPerMonth':$scope.newdata.jobsPostPerMonth,
                'jobActiveDays': $scope.newdata.jobActiveDays,
                'planDescription': $scope.newdata.planDescription,
                'sessionBreakInHrs': $scope.newdata.sessionBreakInHrs,
                'searchCandidateInHrs': $scope.newdata.searchCandidateInHrs

            }
        })
            .success(function (data) {
                ngDialog.close();
                console.log(data);
                $http({
                    method:'GET',
                    url: MY_CONSTANT.url_cviq + '/api/admin/getRecruiterMembershipPlan',
                    headers:{
                        'authorization':$cookieStore.get("obj").accessToken,
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                })
                    .success(function (response) {
                        $scope.showloader = false;
                        console.log(response);
                        $scope.list = response.data;

                    })
                    .error(function (response) {
                        $scope.showloader = false;

                        console.log(response);


                    });


            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('zoom');
                    $cookieStore.remove('type');
                    $cookieStore.remove('email');
                    $.removeCookie('geoseen');
                    $state.go('page.login');
                }
            });
    };
   
});