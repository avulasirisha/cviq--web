App.controller('ZipcodeController', function ($state,$scope, $modal, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode, filterFilter) {

    'use strict';

    $scope.showloader = true;
    $scope.predicate = 'index';
    $scope.reverse = false;
    $scope.countryregex = /^(\+)[0-9]{1,3}$/;
    $scope.zipregex = /^[0-9]{2,8}$/;

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


    //==========================================================================================================================
    // ============================================================ api for get country list =================================
    // =========================================================================================================================
    $http({
        method:'GET',
        url: MY_CONSTANT.url_cviq + '/api/common/getCountryList'
    })
        .success(function (response) {
            $scope.showloader = false;
            console.log(response);

            $scope.countriesList = [];
            $scope.countriesList  = response.data;
            console.log($scope.countriesList);
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



    $scope.getCountryID = function(response){
        $scope.selectedCountryID = response._id;
        $scope.selectedCountryName = response.countryName;
        $scope.count = {
            countryID:$scope.selectedCountryID
        }


        $http({
            method:'GET',
            url: MY_CONSTANT.url_cviq +'/api/common/getStateList',
            params:$scope.count
        })
            .success(function(response){
                $scope.statename = undefined;
                $scope.showloader = false;
                console.log(response);

                $scope.stateList = [];
                $scope.stateList  = response.data;
                console.log($scope.stateList);
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
    };


    $scope.getzipcode = function(response){
        $scope.selectedStateID = response._id;
        $scope.selectedStateName = response.stateName;
        $scope.state = {
            stateID:$scope.selectedStateID
        };

        $http({
            method:'GET',
            url: MY_CONSTANT.url_cviq +'/api/common/getZipCodeList',
            params:$scope.state
        })
            .success(function(response){
                $scope.showloader = false;
                console.log(response);

                var dataArray = [];
                var zipCodeList = response.data;

                zipCodeList.forEach(function (column) {
                    var d = {};
                    d.Id = column._id;
                    d.areaName = column.areaName;
                    d.stateID = column.stateID;
                    d.zipCode = column.zipCode;

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
    };

    //==========================================================================================================================
//====================================================export api for state data ====================================
//==========================================================================================================================
    $scope.exportData = function () {
        var naam ='ZipCodeList_'+$scope.selectedStateName+'_'+$scope.selectedCountryName+'.csv';

        $scope.exportList = $scope.list;

        console.log($scope.exportList);
        alasql('SELECT * INTO CSV("' + naam + '",{headers:true}) FROM ?', [$scope.exportList]);

    };

    // $scope.deleteCountry = function (id , type) {
    //     $scope.deletePlanType = type;
    //     $scope.deletePlanId = id;
    //     ngDialog.open({
    //         template: 'deleteplan',
    //         scope: $scope,
    //         closeByEscape:false,
    //         closeByDocument:false
    //     });
    //
    //
    // };
    // $scope.confirmDelete = function () {
    //
    //     $scope.data = {};
    //     $scope.data.planID = $scope.deletePlanId;
    //     $http({
    //         method:'DELETE',
    //         url: MY_CONSTANT.url_cviq + '/api/admin/',
    //         headers:{
    //             'authorization': $cookieStore.get('obj').accessToken
    //         },
    //         params: $scope.data ,
    //     })
    //         .success(function (response) {
    //             $http({
    //                 method:'GET',
    //                 url: MY_CONSTANT.url_cviq + '/api/admin/getRecruiterMembershipPlan',
    //                 headers:{
    //                     'authorization':$cookieStore.get("obj").accessToken,
    //                     'Content-type': 'application/x-www-form-urlencoded'
    //                 }
    //             })
    //                 .success(function (response) {
    //                     $scope.showloader = false;
    //                     console.log(response);
    //                     $scope.list = response.data;
    //
    //                 })
    //                 .error(function (response) {
    //                     $scope.showloader = false;
    //
    //                     console.log(response);
    //
    //
    //                 });
    //
    //             ngDialog.close();
    //
    //             console.log(response);
    //
    //         })
    //         .error(function (response) {
    //             ngDialog.close();
    //             console.log(response);
    //
    //
    //         });
    //
    // };
    // $scope.denyDelete = function () {
    //     ngDialog.close();
    // };

    $scope.updateArea = function (data) {
        $scope.newdata = angular.copy(data);
        console.log(" $scope.newdata", $scope.newdata);

        ngDialog.open({
            template: 'updateplan',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });


    };
    $scope.updateConfirm = function () {
        ngDialog.close();
        console.log("update",$scope.newdata);

        $http({
            method:'PUT',
            url: MY_CONSTANT.url_cviq +'/api/common/updateZipCodeData',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{

                "stateID": $scope.newdata.stateID,
                "zipCode": $scope.newdata.zipCode,
                "zipCodeID": $scope.newdata.Id,
                "areaName": $scope.newdata.areaName
            }
        })
            .success(function(response){
                $scope.addnewData = {};
                console.log(response);
                $scope.displaymsg = response.message;
                // $scope.$apply();
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });

                $scope.state = {
                    stateID: $scope.statename._id
                };

                $http({
                    method:'GET',
                    url: MY_CONSTANT.url_cviq +'/api/common/getZipCodeList',
                    params:$scope.state
                })
                    .success(function(response){
                        $scope.showloader = false;
                        console.log(response);

                        var dataArray = [];
                        var zipCodeList = response.data;

                        zipCodeList.forEach(function (column) {
                            var d = {};
                            d.Id = column._id;
                            d.areaName = column.areaName;
                            d.stateID = column.stateID;
                            d.zipCode = column.zipCode;

                            dataArray.push(d);
                        });
                        $scope.list = dataArray;
                        for (var i = 0; i < $scope.list.length; i++) {
                            $scope.list[i].index = i;
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


            })
            .error(function(response,error){
                $scope.addnewData = {};
                console.log(response);
                console.log(error);
                if(response.statusCode == 401){
                    $scope.unAuthMsg = 'Someone other get LoggedIn';
                    //   $scope.$apply();
                    ngDialog.open({
                        template: 'unauth_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
                else{
                    $scope.displaymsg = response.message;
                    //  $scope.$apply();
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
            });
    };

    $scope.addarea = function () {

        ngDialog.open({
            template: 'addnew',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });


    };
    $scope.addnewData = {};
    $scope.addConfirm = function () {
        ngDialog.close();

        $http({
            method:'POST',
            url: MY_CONSTANT.url_cviq +'/api/common/insertZipCodeData',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                "areaName":$scope.addnewData.areaName,
                "stateID": $scope.statename._id,
                "zipCode": $scope.addnewData.zipCode
            }
        })
            .success(function(response){
                $scope.addnewData = {};
                console.log(response);
                $scope.displaymsg = response.message;
                console.log($scope.displaymsg);
                //  $scope.$apply();

                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
                $scope.state = {
                    stateID: $scope.statename._id
                };

                $http({
                    method:'GET',
                    url: MY_CONSTANT.url_cviq +'/api/common/getZipCodeList',
                    params:$scope.state
                })
                    .success(function(response){
                        $scope.showloader = false;
                        console.log(response);

                        var dataArray = [];
                        var zipCodeList = response.data;

                        zipCodeList.forEach(function (column) {
                            var d = {};
                            d.Id = column._id;
                            d.areaName = column.areaName;
                            d.stateID = column.stateID;
                            d.zipCode = column.zipCode;

                            dataArray.push(d);
                        });
                        $scope.list = dataArray;
                        for (var i = 0; i < $scope.list.length; i++) {
                            $scope.list[i].index = i;
                        }
                        console.log($scope.list );
                    })
                    .error(function(response){

                        console.log(response);
                    })

            })
            .error(function(response,error){
                $scope.addnewData = {};
                console.log(response);
                console.log(error);
                if(response.statusCode == 401){
                    $scope.unAuthMsg = 'Someone other get LoggedIn';
                    //  $scope.$apply();
                    ngDialog.open({
                        template: 'unauth_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
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


    $scope.updatePage = function () {

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

    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".bootstrap-select").click(function () {
            $(this).addClass("open");
        });

    },0);
});