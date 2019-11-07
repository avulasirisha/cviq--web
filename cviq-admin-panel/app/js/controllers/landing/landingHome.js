
App.controller('LandingHomeController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';
    
    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $state.go('page.login');
    }
    $("whilr").css("position","fixed");
    $scope.showloader=true;


$scope.mainId = '';
    console.log("Landing Home",$cookieStore.get("obj"));

    $scope.edit = false;

    $scope.Landingdescription = '';
    $scope.companyArray = [];

 
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
            $scope.Landingdescription = data.data.homeDescription;
            $scope.companyArray = data.data.company;
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
            url: MY_CONSTANT.url_cviq + '/api/admin/updateHomeDescription',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data : {
                'homeDescription': $scope.Landingdescription
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



    //==========================================================================================================================
//============================================================ api for add image ====================================
//==========================================================================================================================
    $scope.addNewImage = function () {
        console.log("add image");

        ngDialog.open({
            template: 'add_new_image',
            scope: $scope,
            closeByEscape: false,
            closeByDocument: false
        });

    };

    $scope.addImage= function (data) {
        $scope.showloader=true;

        ngDialog.close();

        console.log($scope.editCat.edit_image,data);
        console.log('adding image');

        var myForm = new FormData();
        myForm.append("_id",$scope.mainId);
        myForm.append("companyID",'');
        myForm.append("companyName",data.Name);
        myForm.append("companyLogo",$scope.editCat.edit_image);


        $http({
            method:'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/addHomeCompany',
            transformRequest: angular.identity,
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': undefined
            },
            data: myForm
        })
            .success(function (response) {
                $scope.showloader=false;
                $('.myButton').prop('disabled', false);
                bootbox.alert('Logo added successfully');
                console.log(response);
                $state.reload();
            })
            .error(function (response) {
                $('.myButton').prop('disabled', false);
                console.log("error", response);
                bootbox.alert(response.message);
                $scope.showloader=false;
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }


            })


    };

    $scope.editCat = {};
    $scope.addCat = {};

    $scope.add_file_to_upload = function (files) {

            $scope.editCat.edit_image = files[0];
            $scope.editCat.edit_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("edit_image");
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

    //==========================================================================================================================
//============================================================ api for  update image ====================================
//==========================================================================================================================


    $scope.editImage= function (data) {
        console.log(data);

        $scope.updateeditCat = {};
        $scope.updateaddCat = {};
        $scope.updatedata={};

        $scope.updatedata.companyName = data.companyName;
        $scope.updatedata._id = data._id;
        $scope.updateeditCat.edit_image = data.logoURL;

        ngDialog.open({
            template: 'update_image',
            scope: $scope,
            closeByEscape: false,
            closeByDocument: false
        });
    };


    $scope.updateImage= function (data) {
        $scope.showloader=true;

        ngDialog.close();

        console.log($scope.updateeditCat.edit_image,data);

        console.log('adding image');

        var myForm = new FormData();
        myForm.append("_id",$scope.mainId);
        myForm.append("companyID",data._id);
        myForm.append("companyName",data.companyName);

        if(typeof($scope.updateeditCat.edit_image)!='string'){
            myForm.append("companyLogo",$scope.updateeditCat.edit_image);
        }

        $http({
            method:'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/addHomeCompany',
            transformRequest: angular.identity,
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                accept:'application/vnd.rexcargo.version.v1+json',
                'Content-type': undefined
            },
            data:myForm
        })
            .success(function (response) {
                $scope.showloader=false;
                $('.myButton').prop('disabled', false);
                console.log(response);
                bootbox.alert('logo updated successfully');
                $state.reload();
            })
            .error(function (response) {
                $('.myButton').prop('disabled', false);
                console.log("error", response);
                $scope.showloader=false;
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }


            })


    };

    $scope.file_to_upload = function (files,id) {
        if(id == 0){ //vehicle image
            $scope.updateeditCat.edit_image = files[0];
            $scope.updateeditCat.edit_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("update_edit_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if(id == 1){ //driver image
            $scope.updateaddCat.driver_image = files[0];
            $scope.updateaddCat.driver_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("driver_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        $scope.$apply();
    };


    //==========================================================================================================================
//============================================================ delete company =============================================
//==========================================================================================================================


    $scope.deleteImage = function(data){
        console.log(data);
        $scope.company_name = data.companyName;
        $scope.company_id = data._id;
        ngDialog.open({
            template: 'delete_company_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            closeByEscape: false,
            closeByDocument: false,
            scope: $scope
        });
    };
    $scope.confirmDeleteImage = function(data){
        $scope.loading = true;

        $('.myButton').prop('disabled', true);
        ngDialog.close({
            template: 'delete_driver_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
        console.log(data);

        $http({
            method: 'DELETE',
            url: MY_CONSTANT.url_cviq + '/api/admin/deleteHomeCompany?companyID='+data+'&_id='+$scope.mainId,
            headers: {
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': undefined
            }
            // param : {
            //     'companyID': data,
            //     '_id':$scope.mainId
            // }
        })
            .success(function(response){
                $('.myButton').prop('disabled', false);
                console.log(response);
                bootbox.alert(response.message);
                $state.reload();
            })
            .error(function(response,error){
                $('.myButton').prop('disabled', false);
                $scope.loading = false;
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $cookieStore.remove('loggedIn');
                    $cookieStore.remove('AccessToken');
                    $cookieStore.remove('UserDetails');
                    $cookieStore.put('loggedIn',false);
                    $state.go('page.login');
                }
            });
    };
    

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