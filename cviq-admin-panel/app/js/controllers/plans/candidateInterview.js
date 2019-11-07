
App.controller('CandidateInterviewController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';

    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $state.go('page.login');
    }
    $("whilr").css("position","fixed");
    $scope.showloader=true;

    $scope.candidateInterviewCharges = '';

    $scope.mainId = '';
    console.log("Landing Home",$cookieStore.get("obj"));

    $scope.edit = false;

    $http({
        method: 'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getInterviewCharge',
        headers:{
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .success(function (data) {
            console.log("my data",data);
            console.log("success",data,data.data._id);

            $scope.mainId = data.data._id;
            $scope.candidateInterviewCharges = data.data.candidateInterviewCharges;
            $scope.showloader=false;

        })
        .error(function(response){
            bootbox.alert(response.error);
            if(response.statusCode == 401){
                $cookieStore.remove('obj');
                $cookieStore.remove('email');
                $state.go('page.login');
            }

            $('#addButton').prop('disabled', false);
            $scope.showloader=false;
            console.log('error',response);
            ngDialog.open({
                template: 'error',
                scope: $scope,
                closeByEscape:false,
                closeByDocument:false
            });
        });






    $scope.update = function () {

        $('#addButton').prop('disabled', true);
        $scope.showloader = true;
        // var myForm = new FormData();
        // myForm.append("candidateInterviewCharges",$scope.candidateInterviewCharges);

        $http({
            method: 'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/ManageInterviewCharge',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data : {
                'candidateInterviewCharges': $scope.candidateInterviewCharges
            }
        })
            .success(function (data) {
                bootbox.alert("Updated Successfully");
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                $scope.mainId = data.data._id;
                $scope.Landingdescription = data.data.homeDescription;
                $scope.companyArray = data.data.company;
                $scope.edit = false;
            })
            .error(function(response){
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                console.log('error',response);
                bootbox.alert(response.message);
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