App.controller('NonTechQuestionBankController', function ($state,$scope, $modal, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode, filterFilter) {

    'use strict';

    $scope.showloader = true;
    $scope.predicate = 'index';
    $scope.reverse = false;
    $scope.countryregex = /^(\+)[0-9]{1,3}$/;

    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }


    $scope.sort = function(type){
        console.log("hjh");
        $scope.predicate = type;
        $scope.reverse = !$scope.reverse;
    };
    $scope.industry = {};

    //==========================================================================================================================
    // ============================================================ api for get industry list =================================
    // =========================================================================================================================
    $http({
        method:'GET',
        url: MY_CONSTANT.url_cviq + '/api/common/getIndustryList'
    })
        .success(function (response) {
            $scope.showloader = false;
            console.log(response);

            $scope.industriesList = [];
            $scope.industriesList  = response.data;
            console.log($scope.industriesList);
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function (response) {
            $scope.showloader = false;

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

    $scope.findFunctionalArea = function(response){
        $scope.selectedIndustryID = response._id;
        $scope.selectedIndustryName = response.industryName;
        $scope.selectedFunctionalName = undefined;

        $scope.funct = {
            industryID:$scope.selectedIndustryID
        };

        $http({
            method:'GET',
            url: MY_CONSTANT.url_cviq +'/api/common/getFunctionalAreaList',
            params:$scope.funct
        })
            .success(function(response){

                $scope.showloader = false;
                console.log(response);

                $scope.finctionList = [];
                $scope.finctionList  = response.data;
                console.log($scope.finctionList);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);

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
            })

        $scope.findQuestion(response,1);
    };

    $scope.findQuestion = function(industry,type,functional){
        if(type == 1){
            console.log('type 1',industry,type,functional);

            $http({
                method:'GET',
                url: MY_CONSTANT.url_cviq +'/api/admin/getQuestionsList?industry='+ industry.industryName,
                headers:{
                    'authorization':$cookieStore.get("obj").accessToken,
                }
            })
                .success(function(response){
                    $scope.showloader = false;
                    console.log(response);
                    var dataArray = [];
                    var functionalList = response.data.nonTechnicalQuestions;

                    functionalList.forEach(function (column) {
                        var d = {};
                        d.question = column;
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    for (var i = 0; i < $scope.list.length; i++) {
                        $scope.list[i].index = i+1;
                    }
                    console.log($scope.list );

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
                })

        }
        else{
            console.log('type 2',industry,type,functional);
            $scope.selectedFunctionalName = functional.functionalAreaName;
            $http({
                method:'GET',
                url: MY_CONSTANT.url_cviq +'/api/admin/getQuestionsList?industry='+ industry.industryName+'&functionalArea='+functional.functionalAreaName,
                headers:{
                    'authorization':$cookieStore.get("obj").accessToken,
                }
            })
                .success(function(response){
                    $scope.showloader = false;
                    console.log(response);
                    var dataArray = [];
                    var functionalList = response.data.nonTechnicalQuestions;

                    functionalList.forEach(function (column) {
                        var d = {};
                        d.question = column;
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    for (var i = 0; i < $scope.list.length; i++) {
                        $scope.list[i].index = i+1;
                    }
                    console.log($scope.list );


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
                })
        }
    };

    //==========================================================================================================================
//====================================================export api for get pending driver ====================================
//==========================================================================================================================
    $scope.exportData = function () {
        console.log( $scope.selectedFunctionalName);
        var naam = '';
        if( $scope.selectedFunctionalName == undefined){
            naam ='NonTechnicalQuestionListOf'+$scope.selectedIndustryName+'Industry.csv';
        }
        else{
            naam ='NonTechnicalQuestionListOf'+$scope.selectedIndustryName+'-Industry&'+ $scope.selectedFunctionalName+'-FunctionalArea.csv';
        }

        $scope.exportList = $scope.list;

        console.log($scope.exportList);
        alasql('SELECT * INTO CSV("' + naam + '",{headers:true}) FROM ?', [$scope.exportList]);


    };




    // $scope.updateFunctional = function (data) {
    //     $scope.newdata = angular.copy(data);
    //     console.log(" $scope.newdata", $scope.newdata);
    //
    //     ngDialog.open({
    //         template: 'updateplan',
    //         scope: $scope,
    //         closeByEscape:false,
    //         closeByDocument:false
    //     });
    //
    //
    // };
    // $scope.updateConfirm = function () {
    //     ngDialog.close();
    //     console.log("update",$scope.newdata);
    //
    //     $http({
    //         method:'PUT',
    //         url: MY_CONSTANT.url_cviq +'/api/common/updateFunctionalAreaData',
    //         headers:{
    //             'authorization':$cookieStore.get("obj").accessToken,
    //             'Content-type': 'application/x-www-form-urlencoded'
    //         },
    //         data:{
    //             "industryID": $scope.industry._id,
    //             "functionalAreaID": $scope.newdata.Id,
    //             "functionalAreaName":$scope.newdata.functionalAreaName
    //
    //         }
    //     })
    //         .success(function(response){
    //             $scope.addnewData = {};
    //             console.log(response);
    //             $scope.displaymsg = response.message;
    //             // $scope.$apply();
    //             ngDialog.open({
    //                 template: 'display_msg_modalDialog',
    //                 className: 'ngdialog-theme-default',
    //                 showClose: false,
    //                 scope: $scope
    //             });
    //         })
    //         .error(function(response,error){
    //             $scope.addnewData = {};
    //             console.log(response);
    //             console.log(error);
    //             if(response.statusCode == 401){
    //                 $scope.unAuthMsg = 'Someone other get LoggedIn';
    //                 //   $scope.$apply();
    //                 ngDialog.open({
    //                     template: 'unauth_msg_modalDialog',
    //                     className: 'ngdialog-theme-default',
    //                     showClose: false,
    //                     scope: $scope
    //                 });
    //             }
    //             else{
    //                 $scope.displaymsg = response.message;
    //                 //  $scope.$apply();
    //                 ngDialog.open({
    //                     template: 'display_msg_modalDialog',
    //                     className: 'ngdialog-theme-default',
    //                     showClose: false,
    //                     scope: $scope
    //                 });
    //             }
    //         });
    // };
    //
    // $scope.addFunctionalArea = function () {
    //
    //     ngDialog.open({
    //         template: 'addnew',
    //         scope: $scope,
    //         closeByEscape:false,
    //         closeByDocument:false
    //     });
    //
    //
    // };
    // $scope.addnewData = {};
    // $scope.addConfirm = function () {
    //     ngDialog.close();
    //     //console.log("add",$scope.addnewData.toUpperCase());
    //
    //     $http({
    //         method:'POST',
    //         url: MY_CONSTANT.url_cviq +'/api/common/insertFunctionalAreaData',
    //         headers:{
    //             'authorization':$cookieStore.get("obj").accessToken,
    //             'Content-type': 'application/x-www-form-urlencoded'
    //         },
    //         data:{
    //             "industryID":$scope.industry._id,
    //             "functionalAreaName":$scope.addnewData.functionalAreaName
    //         }
    //     })
    //         .success(function(response){
    //             $scope.addnewData = {};
    //             console.log(response);
    //             $scope.displaymsg = response.message;
    //             console.log($scope.displaymsg);
    //             //  $scope.$apply();
    //             ngDialog.open({
    //                 template: 'display_msg_modalDialog',
    //                 className: 'ngdialog-theme-default',
    //                 showClose: false,
    //                 scope: $scope
    //             });
    //
    //         })
    //         .error(function(response,error){
    //             $scope.addnewData = {};
    //             console.log(response);
    //             console.log(error);
    //             if(response.statusCode == 401){
    //                 $scope.unAuthMsg = 'Someone other get LoggedIn';
    //                 //  $scope.$apply();
    //                 ngDialog.open({
    //                     template: 'unauth_msg_modalDialog',
    //                     className: 'ngdialog-theme-default',
    //                     showClose: false,
    //                     scope: $scope
    //                 });
    //             }
    //             else{
    //                 $scope.displaymsg = response.message;
    //                 //   $scope.$apply();
    //                 ngDialog.open({
    //                     template: 'display_msg_modalDialog',
    //                     className: 'ngdialog-theme-default',
    //                     showClose: false,
    //                     scope: $scope
    //                 });
    //             }
    //         });
    // };
    /*--------------------------------------------------------------------------
     * --------- funtion to refresh page ---------------------------------------
     --------------------------------------------------------------------------*/
    // $scope.refreshPage = function () {
    //     $state.reload();
    //     ngDialog.close({
    //         template: 'display_msg_modalDialog',
    //         className: 'ngdialog-theme-default',
    //         scope: $scope
    //     });
    // };
    // $scope.updatePage = function () {
    //
    //     ngDialog.close({
    //         template: 'display_msg_modalDialog',
    //         className: 'ngdialog-theme-default',
    //         scope: $scope
    //     });
    //     $scope.funct = {
    //         industryID:$scope.industry._id
    //     };
    //
    //     $http({
    //         method:'GET',
    //         url: MY_CONSTANT.url_cviq +'/api/common/getFunctionalAreaList',
    //         params:$scope.funct
    //     })
    //         .success(function(response){
    //             $scope.showloader = false;
    //             console.log(response);
    //
    //             var dataArray = [];
    //             var functionalList = response.data;
    //
    //             functionalList.forEach(function (column) {
    //                 var d = {};
    //                 d.Id = column._id;
    //                 d.functionalAreaName = column.functionalAreaName;
    //
    //                 dataArray.push(d);
    //             });
    //             $scope.list = dataArray;
    //             for (var i = 0; i < $scope.list.length; i++) {
    //                 $scope.list[i].index = i;
    //             }
    //             console.log($scope.list );
    //
    //         })
    //         .error(function(response){
    //
    //             console.log(response);
    //             if(response.statusCode == 401){
    //                 $cookieStore.remove('obj');
    //                 $cookieStore.remove('zoom');
    //                 $cookieStore.remove('type');
    //                 $cookieStore.remove('email');
    //                 $.removeCookie('geoseen');
    //                 $state.go('page.login');
    //             }
    //         })
    // };

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

    $scope.forceLogin = function(){
        ngDialog.close();
        $state.go('page.login');
        $cookieStore.remove('obj');
    };
    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".bootstrap-select").click(function () {
            $(this).addClass("open");
        });

    },0);
});