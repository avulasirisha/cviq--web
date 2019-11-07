
App.controller('LandingAboutController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';



    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $state.go('page.login');
    }

    console.log("Landing Home");

    $scope.edit = false;
    $scope.mainId = '';
    $scope.about = {};
    

    $scope.Landingdescription = '';

    $http({
        method: 'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getLandingPageData',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        },
    })
        .success(function (data) {
            console.log("my data",data);
            $('#addButton').prop('disabled', false);
            $scope.mainId = data.data._id;
            $scope.about.aboutCviq = data.data.aboutDescription;
            $scope.about.text1 = data.data.aboutFeatureOne;
            $scope.about.text2 = data.data.aboutFeatureTwo;
            $scope.about.text3 = data.data.aboutFeatureThree;

        })
        .error(function(response){
            if(response.statusCode == 401){
                $cookieStore.remove('obj');
                $cookieStore.remove('zoom');
                $cookieStore.remove('type');
                $cookieStore.remove('email');
                $.removeCookie('geoseen');
                $state.go('page.login');
            }
            $('#addButton').prop('disabled', false);
            // $scope.showloader=false;
            console.log('error',response);
            $scope.error = response.message;
            ngDialog.open({
                template: 'error',
                scope: $scope,
                closeByEscape:false,
                closeByDocument:false
            });
        });






    $scope.updateAbout = function () {
        console.log("success");

        $('#addButton').prop('disabled', true);
        $scope.showloader = true;

        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/updateAboutUsDetail',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data : {
                "_id": $scope.mainId,
                "aboutDescription": $scope.about.aboutCviq,
                "aboutFeatureOne": $scope.about.text1,
                "aboutFeatureTwo": $scope.about.text2,
                "aboutFeatureThree": $scope.about.text3
            }
        })
            .success(function (data) {
                bootbox.alert("Updated Successfully");
                $('#addButton').prop('disabled', false);
                console.log("success",data);
                $scope.mainId = data.data._id;
                $scope.Landingdescription = data.data.homeDescription;
                $scope.edit = false;
            })
            .error(function(response){
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }
                $('#addButton').prop('disabled', false);
                // $scope.showloader=false;
                console.log('error',response);
                $scope.error = response.message;
                ngDialog.open({
                    template: 'error',
                    scope: $scope,
                    closeByEscape:false,
                    closeByDocument:false
                });
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