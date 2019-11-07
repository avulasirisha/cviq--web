/**
 * Created by cl-macmini-72 on 11/9/16.
 */

App.controller('CandidatePromoController', function ($rootScope,$scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';

    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $state.go('page.login');
    }

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

        $('#datetimepicker1').data("DateTimePicker").minDate(d);

    });

    $("#datetimepicker1").on("dp.change", function (e) {


        // $('#date2calander').attr('readonly', false);

        //  console.log("current date",e.date)

        var d = new Date(e.date._d);
        var d1 = new Date(e.date._d);
        d1.setDate(d.getDate() + 3650.005);


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

    //==========================================================================================================================
//============================================================ api for  add member ====================================
//==========================================================================================================================
//     $scope.addNew = function () {
//
//         $("#myModal").modal();
//         $timeout(function(){
//             $('.selectpicker').selectpicker('refresh');
//             console.log("selectpicker");
//         },100);
//
//
//     };


    $scope.addMember = function (data) {


        if($scope.post.date1== undefined || $scope.post.date1== 'Invalid Date')
        {
            $scope.date1error = true;
        }

        if($scope.post.date2 == undefined || $scope.post.date2 == 'Invalid Date'){
            $scope.date2error = true;
        }
        else{
            $('.myButton').prop('disabled', true);




            console.log('in');
            console.log(data ,'date 1', $scope.post.date1,'date 2',$scope.post.date2);

            var register= new FormData();

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
                method: 'POST',
                url: MY_CONSTANT.url_cviq + '/api/admin/addPromoCode',
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