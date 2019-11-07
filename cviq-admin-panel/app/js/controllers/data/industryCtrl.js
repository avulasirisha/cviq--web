App.controller('IndustryController', function ($state,$scope, $modal, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode, filterFilter) {

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

    //==========================================================================================================================
    // ============================================================ api for get Industry List=================================
    // =========================================================================================================================
    $http({
        method:'GET',
        url: MY_CONSTANT.url_cviq + '/api/common/getIndustryList',
    })
        .success(function (response) {
            $scope.showloader = false;
            console.log(response);

            var dataArray = [];
            var industryList = response.data;

            industryList.forEach(function (column) {
                var d = {};
                d.Id = column._id;
                d.industryName = column.industryName;

                dataArray.push(d);
            });
            $scope.list = dataArray;
            for (var i = 0; i < $scope.list.length; i++) {
                $scope.list[i].index = i+1;
            }
            console.log($scope.list );
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



    //==========================================================================================================================
//====================================================export api for get Industry List ====================================
//==========================================================================================================================
    $scope.exportData = function () {

        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/common/getIndustryList',
            
        })
            .success(function (response) {
                console.log(response);
                var exportArray = [];
                var industryList1 = response.data;

                industryList1.forEach(function (column) {
                    var d = {};
                    d.Id = column._id;
                    d.industryName = column.industryName;

                    exportArray.push(d);
                });
                $scope.exportList = exportArray;
                
                console.log($scope.exportList);
                alasql('SELECT * INTO CSV("IndustryList.csv",{headers:true}) FROM ?', [$scope.exportList]);
            })
            .error(function (response, error) {
                console.log(response);
                console.log(error);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('zoom');
                    $cookieStore.remove('type');
                    $cookieStore.remove('email');
                    $.removeCookie('geoseen');
                    $state.go('page.login');
                }
            });
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

    $scope.updateIndustry = function (data) {
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
            url: MY_CONSTANT.url_cviq +'/api/common/updateIndustryData',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                "industryID": $scope.newdata.Id,
                "industryName":$scope.newdata.industryName

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

 $scope.addIndustry = function () {

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
        //console.log("add",$scope.addnewData.toUpperCase());

        $http({
            method:'POST',
            url: MY_CONSTANT.url_cviq +'/api/common/insertIndustryData',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                "industryName":$scope.addnewData.industryName
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



    $scope.forceLogin = function(){
        ngDialog.close();
        $state.go('page.login');
        $cookieStore.remove('obj');
    };

});