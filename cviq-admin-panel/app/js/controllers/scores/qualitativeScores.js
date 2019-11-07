
App.controller('QualitativeScoresController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';

    $("whilr").css("position","fixed");

    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }

    $scope.showloader=true;
    $scope.sumError = false;
    $scope.flag1 = false;
    $scope.flag2 = false;

    $scope.qualitative = {};



    $http({
        method: 'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getQualScoreData',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .success(function (response) {
            console.log(response.data);

            $scope.qualitative.totalQualitativeScore = response.data.totalQualitativeScore;
            $scope.qualitative.backgroundPoints = response.data.backgroundPoints;
            $scope.qualitative.communicationPoints = response.data.communicationPoints;
            $scope.qualitative.socialSkillPoints = response.data.socialSkillPoints;
            $scope.qualitative.leadershipPoints = response.data.leadershipPoints;

            $scope.showloader=false;

        })
        .error(function(response){
            $scope.showloader=false;
            if(response.statusCode == 401){
                $cookieStore.remove('obj');
                $cookieStore.remove('zoom');
                $cookieStore.remove('type');
                $cookieStore.remove('email');
                $.removeCookie('geoseen');
                $state.go('page.login');
            }
        });

    
    $scope.checkTotal = function(){

        if($scope.qualitative.totalQualitativeScore != $scope.qualitative.backgroundPoints +
            $scope.qualitative.communicationPoints + $scope.qualitative.socialSkillPoints +
            $scope.qualitative.leadershipPoints ){

            $scope.sumError = true;

        }
        else{
            $scope.sumError = false;
            console.log($scope.sumError);
        }
    };

    
    $scope.save = function(){
        console.log("quanl",$scope.qualitative);
      

        var data = {};
        data = $scope.qualitative;
        
        $http({
            method: 'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/setQualScoreData',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
            .success(function (response) {
                console.log("success",response.data);
                $scope.displaymsg = response.message;
                console.log($scope.displaymsg);
                //  $scope.$apply();
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
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
                else{
                    $scope.displaymsg = response.message;
                    //   $scope.$apply();
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
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

    /*--------------------------------------------------------------------------
     * --------- funtion to refresh page ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.refreshPage = function () {
        $state.reload();
        ngDialog.close({
            template: 'display_msg_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.forceLogin = function(){
        ngDialog.close();
        $state.go('page.login');
        $cookieStore.remove('obj');
    };
});