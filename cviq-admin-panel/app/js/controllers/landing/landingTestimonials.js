/**
 * Created by cl-macmini-72 on 11/9/16.
 */

App.controller('LandingTestimonialsController', function ($rootScope,$scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';



    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $state.go('page.login');
    }
    $scope.mainId = '';

    console.log("Landing Home");

    $scope.edit = false;


    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".bootstrap-select").click(function () {
            $(this).addClass("open");
        });

    },0);







    //==========================================================================================================================
//============================================================ api for  add member ====================================
//==========================================================================================================================
    $scope.addNew = function () {

        ngDialog.open({
            template: 'add_new_member',
            scope: $scope,
            closeByEscape: false,
            closeByDocument: false
        });

    };

    $scope.addMember = function (data) {


        ngDialog.close();

        console.log('hello');
        console.log($scope.editCat.edit_image,data);

        var register= new FormData();

        register.append("_id",$scope.mainId);
        register.append("testimonialID",'');
        register.append("name",data.name);
        register.append("message",data.message);
        register.append("profilePic",$scope.editCat.edit_image);

        $http({
            method: 'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/addTestimonial',
            transformRequest: angular.identity,
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': undefined
            },
            data:register
        })
            .success(function (response) {
                $('.myButton').prop('disabled', false);
                console.log(response);
                bootbox.alert(response.message);
                $state.reload();
            })
            .error(function (response) {
                $('.myButton').prop('disabled', false);
                $rootScope.loading = false;
                console.log("error", response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $cookieStore.remove('loggedIn');
                    $cookieStore.remove('AccessToken');
                    $cookieStore.remove('UserDetails');
                    $cookieStore.put('loggedIn',false);
                    $state.go('home.login', {}, {reload: true});
                }


            })


    };

    $scope.editCat = {};
    $scope.addCat = {};

    $scope.add_file_to_upload = function (files,id) {
        if(id == 0){ //vehicle image
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

        }
        if(id == 1){ //Member image
            $scope.addCat.driver_image = files[0];
            $scope.addCat.driver_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("Member_image");
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
//============================================================ api for  update Member ====================================
//==========================================================================================================================
    $scope.updateID = '';

    $scope.editTestimonial= function (data) {
        console.log(data);

        $scope.updateeditCat = {};
        $scope.updateaddCat = {};
        $scope.updatedata={};



        $scope.updatedata.name = data.name;
        $scope.updatedata.message = data.message;
        $scope.updateeditCat.edit_image = data.picURL;
        $scope.updateID = data._id;

        ngDialog.open({
            template: 'update_member',
            scope: $scope,
            closeByEscape: false,
            closeByDocument: false
        });


    };


    $scope.updateMember= function (data) {

        ngDialog.close();
        console.log('hello',$scope.updateeditCat.edit_image,data);

        var register= new FormData();

        register.append("_id",$scope.mainId);
        register.append("testimonialID",$scope.updateID);
        register.append("name",data.name);
        register.append("message",data.message);
        if(typeof($scope.updateeditCat.edit_image)!='string'){
            register.append("profilePic",$scope.updateeditCat.edit_image);
        }

        $http({
            method: 'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/addTestimonial',
            transformRequest: angular.identity,
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': undefined
            },
            data:register
        })
            .success(function (response) {
                $('.myButton').prop('disabled', false);
                console.log(response);
                bootbox.alert(response.message);
                $state.reload();
            })
            .error(function (response) {
                $('.myButton').prop('disabled', false);
                $rootScope.loading = false;
                console.log("error", response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $cookieStore.remove('loggedIn');
                    $cookieStore.remove('AccessToken');
                    $cookieStore.remove('UserDetails');
                    $cookieStore.put('loggedIn',false);
                    $state.go('home.login', {}, {reload: true});
                }


            })


    };

    $scope.file_to_upload = function (files,id) {
         //vehicle image
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
        $scope.$apply();
    };

    //==========================================================================================================================
//============================================================ api for get Member ====================================
//==========================================================================================================================


        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/admin/getLandingPageData',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .success(function(data){
                $scope.showloader=false;
                console.log("Member list",data.data.testimonial);
                $rootScope.loading = false;
                $scope.mainId = data.data._id;

                var dataArray = [];
                var MemberList = data.data.testimonial;

                MemberList.forEach(function (column) {
                    
                    var d = {};
                    d._id = column._id;
                    d.message = column.message;
                    d.name = column.name;
                    d.picURL = column.picURL.original;

                    dataArray.push(d);

                });
                $scope.list = {};
                $scope.list = dataArray.reverse();
                for (var i = 0; i < $scope.list.length; i++) {
                    $scope.list[i].index = i;
                }

                console.log($scope.list);
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
    $scope.predicate = 'index';
    $scope.reverse = false;
    $scope.sort = function(type){
        console.log("hjh");
        $scope.predicate = type;
        $scope.reverse = !$scope.reverse;
    };




    $scope.forceLogin = function(){
        ngDialog.close();
        $cookieStore.remove('AccessToken');
        $cookieStore.remove('loggedIn');
        $cookieStore.remove('UserDetails');
        console.log("going to login page");
        $state.go('home.login');

    };


    //==========================================================================================================================
//============================================================ deleteMember =============================================
//==========================================================================================================================


    $scope.deleteTestimonial = function(data){
        console.log(data);
        $scope.Member_name = data.name;
        $scope.Member_id = data._id;
        ngDialog.open({
            template: 'delete_member_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            closeByEscape: false,
            closeByDocument: false,
            scope: $scope
        });
    };
    $scope.confirmDeleteMember = function(data){

        $('.myButton').prop('disabled', true);
        ngDialog.close({
            template: 'delete_Member_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });


        $http({
            method: 'DELETE',
            url: MY_CONSTANT.url_cviq + '/api/admin/deleteTestimonial?testimonialID='+data+'&_id='+$scope.mainId,
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
            }
        })
            .success(function(response){
                $('.myButton').prop('disabled', false);
                console.log(response);
                bootbox.alert(response.message);
                $state.reload();
            })
            .error(function(response){
                $('.myButton').prop('disabled', false);
                $rootScope.loading = false;
                console.log("error", response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $cookieStore.remove('loggedIn');
                    $cookieStore.remove('AccessToken');
                    $cookieStore.remove('UserDetails');
                    $cookieStore.put('loggedIn',false);
                    $state.go('home.login', {}, {reload: true});
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