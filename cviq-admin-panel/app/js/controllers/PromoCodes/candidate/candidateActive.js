/**
 * Created by cl-macmini-72 on 11/9/16.
 */

App.controller('CandidateActiveController', function ($rootScope,$scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

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
//============================================================ api for get ====================================
//==========================================================================================================================


    $http({
        method: 'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getPromoList',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        },
        params:{ 'type':'CANDIDATE','isactive':true  }
    })
        .success(function(data){
            $scope.showloader=false;
            console.log("Promo list",data.data.CodeList);
            $rootScope.loading = false;
            $scope.mainId = data.data._id;

            var dataArray = [];
            var List = data.data.CodeList;

            List.forEach(function (column) {
                var d = {};
                d._id = column._id;
                d.description = column.description;
                d.howManyTimes = column.howManyTimes;
                d.isAvailable = column.isAvailable;
                d.isDeleted = column.isDeleted;
                d.maxUser = column.maxUser;
                d.promoName = column.promoName;
                d.promoType = column.promoType;
                d.membersUsed= column.membersUsed;
                d.value = column.value;

                d.createdAt = moment(column.createdAt).format('MMM Do YYYY, h:mm a');//date
                d.endTime = moment(column.endTime).format('MMM Do YYYY, h:mm a');//date
                d.endTime1 =column.endTime;//date
                d.startTime = moment(column.startTime).format('MMM Do YYYY, h:mm a');//date
                d.startTime1 = column.startTime;//date
                d.updatedAt = moment(column.updatedAt).format('MMM Do YYYY, h:mm a');//date

                dataArray.push(d);

            });
            $scope.list = {};
            $scope.list = dataArray;
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
//============================================================ api for  update  ====================================
//==========================================================================================================================

    $scope.post = {};


    $scope.date2error = false;
    $scope.date1error = false;
    $scope.date3error = false;


    // $('#date2calander').attr('readonly', true);

    $(function () {
        $('#datetimepicker1').datetimepicker({
            useCurrent: false, //Important! See issue #1075
            format: 'Do MMMM YYYY, h:mm a',
            icons:{ time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"},
            ignoreReadonly: true
        });
        $('#datetimepicker2').datetimepicker({
            useCurrent: false, //Important! See issue #1075
            format: 'Do MMMM YYYY, h:mm a',
            icons:{ time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"},
            ignoreReadonly: true
        });

        var d = new Date;
        //   $('#datetimepicker7').data("DateTimePicker").minDate(d);

        // $('#datetimepicker1').data("DateTimePicker").minDate(d);

    });

    $("#datetimepicker1").on("dp.change", function (e) {


        // $('#date2calander').attr('readonly', false);

        //  console.log("current date",e.date)

        var d = new Date(e.date._d);
        var d1 = new Date(e.date._d);
        d1.setDate(d.getDate() + 3650.5);


        $('#datetimepicker2').data("DateTimePicker").maxDate(d1);
        $('#datetimepicker2').data("DateTimePicker").minDate(e.date._d);

        var date1 = new Date(e.date._d);
        $scope.post.date1 =date1.toUTCString();
        console.log("hello1",$scope.post.date1);
        if($scope.post.date1!= undefined || $scope.post.date1!= 'Invalid Date')
        {
            console.log(" in 1");
            // console.log("error before",$scope.date1error);
            $scope.date1error = false;
            // console.log("error after",$scope.date1error);
            $scope.$apply();
        }

        $('#datetimepicker2').data('DateTimePicker').date(null);

    });

    $("#datetimepicker2").on("dp.change",function (e) {

        console.log("hello2");

        var date2 = new Date(e.date._d);
        $scope.post.date2 =date2.toUTCString();
        console.log("hello2",$scope.post.date2)
        if($scope.post.date2 != undefined || $scope.post.date2 != 'Invalid Date'){
            console.log(" in 2");
            $scope.date2error = false;
            $scope.$apply();
        }

    });




    $scope.promoTypeArray = [
        {
            id: 1,
            name : "Percentage"
        },
        {
            id: 2,
            name : "Amount"
        }
    ];
    $scope.isAvailableArray = [
        {
            bool: true,
            name : "Yes"
        },
        {
            bool: false,
            name : "No"
        }
    ];







    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".bootstrap-select").click(function () {
            $(this).addClass("open");
        });

    },0);


    $scope.updateID = '';
    $scope.updatedata = {};

    $scope.editfunc= function (data) {

        console.log(data);
        $scope.updatedata._id = data._id;
        $scope.updatedata.description = data.description;
        $scope.updatedata.howManyTimes = data.howManyTimes;
        $scope.updatedata.isAvailable = data.isAvailable;
        $scope.updatedata.maxUser = data.maxUser;
        $scope.updatedata.promoName = data.promoName;
        $scope.updatedata.promoType = data.promoType;
        $scope.updatedata.value = data.value;
        $scope.updatedata.endTime = data.endTime1;
        $scope.updatedata.startTime = data.startTime1;
        

        console.log('data.startTime', data.startTime1);

        // $('#datetimepicker1').datetimepicker({
        //     // dateFormat: 'dd-mm-yy',
        //     defaultDate: '2016/08/08'
        // });

        $('#datetimepicker1').data("DateTimePicker").defaultDate(new Date(data.startTime1));
        $('#datetimepicker2').data("DateTimePicker").defaultDate(new Date(data.endTime1));



        // $('#datetimepicker1').data("DateTimePicker").date('01/01/2016');

        // $("#datetimepicker1").datetimepicker({
        //     defaultDate: "5/31/2017", // this is from jQueryUI datepicker
        //     hour: 19,
        //     minute: 30
        // });
        // $('#datetimepicker1').datetimepicker('setDate',new Date(2017, 11, 20, 8, 30));

        // $("#datetimepicker1").val("2016/12/15 00:01:00");

        //$('#datetimepicker1').data("DateTimePicker").date("2018/08/10");
        //console.log("date is", $('#datetimepicker1').data("DateTimePicker").date());
        // $('#datetimepicker2').data("DateTimePicker").date(moment(data.endTime).format("YYYY/MM/DD hh:mm:ss"));
        // $('#datetimepicker2').data("DateTimePicker").setDate(data.endTime);

        // $("#datepicker").datepicker("setDate", new Date);

        // $scope.updatedata.endTime = data.endTime;
        // $scope.updatedata.startTime = data.startTime;
        // $scope.updatedata.updatedAt =data.updatedAt;






        // console.log("hi there",data.expiryDate1);
        // var d = new Date(data.expiryDate1);
        // $('#dialog-sandbox-container').datepicker('update', new Date(d.getFullYear(), d.getMonth(), d.getDate()));





        $("#myModal").modal();
        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
            console.log("selectpicker");
        },100);

    };


    $scope.update= function (data) {


        if($scope.post.date1== undefined || $scope.post.date1== 'Invalid Date')
        {
            $scope.date1error = true;
        }

        if($scope.post.date2 == undefined || $scope.post.date2 == 'Invalid Date'){
            $scope.date2error = true;
        }
        else{
            $('.myButton').prop('disabled', true);
            $("#myModal").modal("hide");


            console.log('in');
            console.log(data ,'date 1', $scope.post.date1,'date 2',$scope.post.date2);

            var register= new FormData();

            register.append("promoID",data._id);
            register.append("promoName",data.promoName);
            register.append("value",data.value);
            register.append("maxUser",data.maxUser);
            register.append("howManyTimes",data.howManyTimes);
            register.append("description",data.description);
            register.append("startTime",$scope.post.date1);
            register.append("endTime",$scope.post.date2);
            register.append("promoType",data.promoType);
            register.append("isAvailable",data.isAvailable);
            register.append("userType","CANDIDATE");


            $http({
                method: 'PUT',
                url: MY_CONSTANT.url_cviq + '/api/admin/editPromoCode',
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

        }


    };

    //==========================================================================================================================
//============================================================ delete =============================================
//==========================================================================================================================


    $scope.delete = function(data){
        console.log(data);
        $scope.promo_name = data.promoName;
        $scope.promo_id = data._id;
        ngDialog.open({
            template: 'delete_member_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            closeByEscape: false,
            closeByDocument: false,
            scope: $scope
        });
    };
    $scope.confirmDelete = function(data){

        $('.myButton').prop('disabled', true);
        ngDialog.close({
            template: 'delete_Member_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });


        $http({
            method: 'DELETE',
            url: MY_CONSTANT.url_cviq + '/api/admin/deletePromoCode?promoID='+data,
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

//==========================================================================================================================
//============================================================ activeInActive =============================================
//==========================================================================================================================


    $scope.activeInActive = function(data){
        console.log(data);
        $scope.activeInActive_name = data.promoName;
        $scope.activeInActive_id = data._id;
        ngDialog.open({
            template: 'activeInActive_member_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            closeByEscape: false,
            closeByDocument: false,
            scope: $scope
        });
    };
    $scope.confirmActiveInActive = function(data){

        $('.myButton').prop('disabled', true);
        ngDialog.close({
            template: 'delete_Member_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

        var register= new FormData();

        register.append("promoID",data);
        register.append("activate",false);


        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/activeInactivePromoCode',
            transformRequest: angular.identity,
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': undefined
            },
            data : register
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