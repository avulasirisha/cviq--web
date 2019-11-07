
App.controller('AddPlanController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';



    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }

console.log("in add plan");
    
    
    $scope.plantype = ['Basic','Regular','Premium'];
    $scope.plan = {};
    
    $scope.add = function () {

        $('#addButton').prop('disabled', true);

        $scope.showloader = true;
        console.log($scope.plan);   
        $http({
            method: 'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/addMembershipPlan',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data : $scope.plan
        })
            .success(function (data) {
                $('#addButton').prop('disabled', false);
                //$scope.showloader=false;
                console.log(data);
                ngDialog.open({
                    template: 'success',
                    scope: $scope,
                    closeByEscape:false,
                    closeByDocument:false
                });
                $state.go('app.updatePlan');
            })
            .error(function(response){
                $('#addButton').prop('disabled', false);
                console.log(response);
                $scope.error = response.message;
                ngDialog.open({
                    template: 'error',
                    scope: $scope,
                    closeByEscape:false,
                    closeByDocument:false
                });
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('zoom');
                    $cookieStore.remove('type');
                    $cookieStore.remove('email');
                    $.removeCookie('geoseen');
                    $state.go('page.login');
                }

               // $scope.showloader=false;

            });

    }

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


});