/**
 * Created by cl-macmini-72 on 11/9/16.
 */

App.controller('HowItWorksController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';



    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $state.go('page.login');
    }

    console.log("Landing Home");

    $scope.mainId = '';
    $scope.edit = false;
    $scope.worksContent ='';

    $("whilr").css("position","fixed");

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
            console.log("success",data,data.data._id);

            $scope.mainId = data.data._id;
            $scope.worksContent = data.data.workDescription;
            $scope.showloader=false;

        })
        .error(function(response){
            bootbox.alert(response.message);
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

            $http({
                method: 'PUT',
                url: MY_CONSTANT.url_cviq + '/api/admin/updateWorkDescription',
                headers:{
                    'authorization':$cookieStore.get("obj").accessToken,
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data : {
                    "_id": $scope.mainId,
                    'workDescription': $scope.worksContent
                }
            })
                .success(function (data) {

                    $('#addButton').prop('disabled', false);
                    $scope.showloader=false;
                    $scope.mainId = data.data._id;
                    $scope.Landingdescription = data.data.homeDescription;
                    $scope.companyArray = data.data.company;
                    $scope.edit = false;
                    bootbox.alert('Updated Successfully');
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










    $scope.video = '';
    $scope.file_to_upload = function (files,id) {
        console.log("file change",files);
        if(files[0] != ''){
            $scope.uploadVideoError = false;

        }
         if(files[0].size < 20000000){

            $scope.uploadVideoSizeError = false;
        }
         if(files[0].size > 20000000){
            $scope.uploadVideoSizeError = true;
        }
            $scope.video = files[0];
            $scope.videoName = files[0].name;
            var file = files[0];
            var imageType = /video.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("myupdateimage");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);


        $scope.$apply();
    };

    $scope.uploadVideoError = false;
    $scope.uploadVideoSizeError = false;

    $scope.updateVideo = function () {

        console.log('my video ',$scope.video);

        if($scope.video == ''){
            $scope.uploadVideoError = true;

        }
        else{
            if($scope.video.size > 20000000){

                $scope.uploadVideoSizeError = true;
            }
            else{
                $('#videoButton').prop('disabled', true);
                $scope.showloader = true;

                var myForm = new FormData();
                myForm.append("_id",$scope.mainId);
                myForm.append("workVideo",$scope.video);


                $http({
                    method: 'POST',
                    url: MY_CONSTANT.url_cviq + '/api/admin/uploadVideo',
                    transformRequest: angular.identity,
                    headers:{
                        'authorization':$cookieStore.get("obj").accessToken,
                        'Content-type': undefined
                    },

                    data: myForm
                })
                    .success(function (data) {
                        $('#addButton').prop('disabled', false);
                        $scope.showloader=false;
                        $scope.mainId = data.data._id;
                        $scope.Landingdescription = data.data.homeDescription;
                        $scope.companyArray = data.data.company;
                        $scope.edit = false;
                        bootbox.alert('Updated Successfully');
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

        }


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