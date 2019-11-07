
App.controller('InterviewerFaqController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';



    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }

    console.log("in candidate faq");

    $scope.faq = {};

    $http({
        method:'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getFAQList?userType=INTERVIEWER',
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
                $cookieStore.remove('email');
                $state.go('page.login');
            }


        });


    $scope.add = function (data) {

        $('#addButton').prop('disabled', true);

        // $scope.showloader = true;

        data.userType = 'INTERVIEWER';
        console.log("faq",data);
        $http({
            method: 'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/addFAQ',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data : data
        })
            .success(function (data) {
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                console.log(data);
                ngDialog.open({
                    template: 'success',
                    scope: $scope,
                    closeByEscape:false,
                    closeByDocument:false
                });
                $state.reload();

            })
            .error(function(response){
                // $scope.showloader=false;
                console.log(response);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }
                $('#addButton').prop('disabled', false);


                $scope.error = response.message;
                ngDialog.open({
                    template: 'error',
                    scope: $scope,
                    closeByEscape:false,
                    closeByDocument:false
                });
            });

    }

    $scope.deletePlan = function (id) {
        $scope.deletePlanId = id;
        ngDialog.open({
            template: 'deleteplan',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });


    };
    $scope.confirmDelete = function () {
        $('.btn-default').prop('disabled', true);

        $scope.data = {};
        $scope.data.FAQID = $scope.deletePlanId;
        $http({
            method:'DELETE',
            url: MY_CONSTANT.url_cviq + '/api/admin/deleteFAQ',
            headers:{
                'authorization': $cookieStore.get('obj').accessToken
            },
            params: $scope.data
        })
            .success(function (response) {
                $('.btn-default').prop('disabled', false);
                $state.reload();
                ngDialog.close();

                console.log(response);

            })
            .error(function (response) {
                $('.btn-default').prop('disabled', false);
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
        $('.sbmt-btn').prop('disabled', true);

        console.log($scope.newdata);
        $scope.data1 =  {
            "userType": 'INTERVIEWER',
            "question": $scope.newdata.question,
            "answer": $scope.newdata.answer,
            "FAQID":$scope.newdata._id,
        };

        $http({
            method:'PUT',
            url: MY_CONSTANT.url_cviq +'/api/admin/editFAQ',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                "userType": 'INTERVIEWER',
                "question": $scope.newdata.question,
                "answer": $scope.newdata.answer,
                "FAQID":$scope.newdata._id,
            }
        })
            .success(function (data) {
                $('.sbmt-btn').prop('disabled', false);
                ngDialog.close();
                console.log(data);
                $state.reload();
            })
            .error(function(response){
                $('.sbmt-btn').prop('disabled', false);
                console.log(response);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }
            });
    };

    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".bootstrap-select").click(function () {
            $(this).addClass("open");
        });

    },0);


    /*--------------------------------------------------------------------------
     * --------- custom validation function ---------------------------------------
     --------------------------------------------------------------------------*/



    $scope.isCharacterFunction = function(evt){
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            key = String.fromCharCode (key);
            if(key==".")return false;
            return;
        }

        key = String.fromCharCode (key);
        var regex = /[a-z ',A-Z-]|\./;

        if ( !regex.test(key) ) {
            theEvent.returnValue = false;
            if(theEvent.preventDefault) theEvent.preventDefault();
        }
        else{var rege = /[.]|\./;
            if ( rege.test(key) ) {
                theEvent.returnValue = false;
                if(theEvent.preventDefault) theEvent.preventDefault();
            }}
    };


    $scope.isNumberKey = function(evt){
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;

        var regex = /[0-9]|\./;
        if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            key = String.fromCharCode (key);
            if(key==".")return false;
            return;
        }
        key = String.fromCharCode (key);
        if ( !regex.test(key) ) {
            theEvent.returnValue = false;
            if(theEvent.preventDefault) theEvent.preventDefault();
        }
    };


    $scope.refreshPage = function () {

        ngDialog.close();

    }



});