
App.controller('allRecruiterController', function ($scope, $http, $cookies,$state, $cookieStore, MY_CONSTANT, $timeout,ngDialog,responseCode, filterFilter) {


    console.log("all recruiter ctrl");

    'use strict';
    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }
    $scope.showloader=true;
    $scope.currentPage = 0;
    $scope.sp_pagination = false;
    $scope.tBodyFlag = true;
    $scope.tFootFlag = false;
    $scope.hideExport = false;
    $scope.maxSize = 5;
    $scope.pdf_check1 = true;


    $scope.searchModel = {
        limit: 10,
        limitOptions: [10, 25, 50, 100]
    };
    $scope.itemsPerPage = $scope.searchModel.limitOptions[0];
    $scope.getPagesCount = function(){
        console.log("items per page",$scope.itemsPerPage);
        $scope.list = [];
        $scope.getrecruiters(0, $scope.itemsPerPage);

        $scope.setPage(0);

    };
    // $scope.resetSearchForm = function () {
    //     $scope.searchModel = {
    //         limit: 10,
    //         limitOptions: [10, 25, 50, 100]
    //     };
    // };
    $scope.dateCorrect = function(data){
        var date = data;
        var targetTime = new Date(date);
        var tzDifference = targetTime.getTimezoneOffset();
        var offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000);
        return(new Date(offsetTime));
    };
    //==========================================================================================================================
//============================================================ api for get recruiter ====================================
//==========================================================================================================================
    $scope.getrecruiters = function(skip,limit){
        console.log(skip,limit);
        $scope.showloader = true;
        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/admin/getAllRecruiterList',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                start: skip,
                limit: limit,
            }
        })
            .success(function(response){
                console.log(response);
                $scope.showloader = false;
                $scope.dataLength = response.data.totalCount;

                if(response.data.totalCount == 0){
                    $scope.sp_pagination = false;
                    $scope.tBodyFlag = false;
                    $scope.tFootFlag = true;
                    $scope.hideExport = false;
                }
                else{
                    $scope.sp_pagination = true;
                    $scope.tBodyFlag = true;
                    $scope.tFootFlag = false;
                    $scope.hideExport = true;
                }

                var dataArray = [];
                var allList = response.data.recruiterList;

                allList.forEach(function (column) {
                    // console.log(Object.keys(column).length);   //to find key length in object
                    var d = {};
                    d.Id = column._id;
                    d.name = column.firstName + " " + column.lastName;
                    d.phoneNumber = column.countryCode + " - " + column.phoneNo;
                    d.email = column.email;
                    d.linkedInId = column.linkedInId;
                    d.registrationDate = moment(column.registrationDate).format('MMM Do YYYY, h:mm a'); //date
                    d.isBlocked = column.isBlocked;
                    d.isVerified = column.isVerified;
                    d.profilePicURL = column.profilePicURL.original;


                    d.lastLogin = column.lastLogin;
                    d.numberOfPeopleRated = column.numberOfPeopleRated;
                    d.rating = column.rating;
                    d.totalRating = column.totalRating;
                    d.phoneVerified = column.phoneVerified;
                    d.appVersion = column.appVersion;
                    d.companyName = column.companyName;
                    d.membershipTaken = column.membershipTaken;
                    d.referralCredits = column.referralCredits;
                    d.state = column.state;
                    d.country = column.country;
                    d.updatedAt = column.updatedAt;

                    dataArray.push(d);

                });
                $scope.list = dataArray;

                console.log($scope.list);
                for (var i = 0; i < $scope.list.length; i++) {
                    $scope.list[i].index = (skip + i)
                }
                console.log($scope.itemsPerPage);

                if ($scope.dataLength <= $scope.itemsPerPage) {
                    $scope.sp_pagination = false;
                }
                else {
                    $scope.sp_pagination = true;
                    $scope.pageCount(response.data.totalCount);
                }
                $scope.skipValue = $scope.list[0].index;
                $scope.limitValue = $scope.list[$scope.list.length-1].index;

                $scope.$watch('search', function (newVal, oldVal) {
                    $scope.filtered = filterFilter($scope.list, newVal);
                    $scope.totalItems = $scope.filtered.length;
                    console.log(newVal);
                    console.log(oldVal);
                    console.log($scope.filtered);
                    if($scope.filtered.length == 0){
                        $scope.watchPagination = false;
                    }
                    else $scope.watchPagination = true;
                }, true);
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
            });
    };
    $scope.forceLogin = function(){
        ngDialog.close();
        $state.go('page.login');
        $cookieStore.remove('obj');
    };
    //==========================================================================================================================
//============================================================ pagination ====================================
//==========================================================================================================================
    $scope.range = function () {

        // console.log("dfdswfew",Math.ceil($scope.dataLength / $scope.itemsPerPage));

        if(Math.ceil($scope.dataLength / $scope.itemsPerPage)<5){
            var rangeSize = Math.ceil($scope.dataLength / $scope.itemsPerPage);
        }
        else{
            var rangeSize = 5;
        }
        var ret = [];
        var start;

        start = $scope.currentPage;
        if (start > $scope.totalPages - rangeSize) {
            start = $scope.totalPages - rangeSize + 1;
        }

        for (var i = start; i < start + rangeSize; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function (b) {
        console.log(b);
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.getrecruiters((b-1)*$scope.itemsPerPage,$scope.itemsPerPage);//(b)*
        }
    };

    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.pageCount = function (dataLength) {
        $scope.totalPages = Math.ceil(dataLength / $scope.itemsPerPage) - 1;
        return ($scope.totalPages);
    };

    $scope.nextPage = function (a) {
        console.log(a);
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
            $scope.getrecruiters((a+1)*$scope.itemsPerPage,$scope.itemsPerPage);//(a+2)*
        }
    };

    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.totalPages ? "disabled" : "";
    };

    $scope.setPage = function (m) {
        $scope.currentPage = m;
    };
//    }
    $scope.currentData = function(m){
        console.log(m);
        $scope.getrecruiters((m)*$scope.itemsPerPage,$scope.itemsPerPage);//(m+1)*
    };

    $scope.init = function () {
        // $scope.resetSearchForm();
        $scope.list = [];
        $scope.getrecruiters(0, $scope.searchModel.limit);
    };
    $scope.init();

    $scope.predicate = 'index';
    $scope.reverse = false;
    $scope.sort = function(type){
        console.log("hjh");
        $scope.predicate = type;
        $scope.reverse = !$scope.reverse;
    };
    //==========================================================================================================================
//============================================================ pagination ends ====================================
//==========================================================================================================================

    //==========================================================================================================================
//====================================================export api for get all recruiters ====================================
//==========================================================================================================================
    $scope.exportData = function(){
        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/admin/getAllRecruiterList',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                start: 0,
                limit: 10000,
            }
        })
            .success(function(response){
                console.log(response);

                var dataArray1 = [];
                var allList1 = response.data.recruiterList;

                allList1.forEach(function (column) {
                    var e = {};
                    e.Id = column._id;
                    e.name = column.firstName + " " + column.lastName;
                    e.phoneNumber = column.countryCode + " - " + column.phoneNo;
                    e.email = column.email;
                    e.linkedInId = column.linkedInId;
                    e.registrationDate = moment(column.registrationDate).format('MMM Do YYYY, h:mm a'); //date
                    e.isBlocked = column.isBlocked;
                    e.isVerified = column.isVerified;
                    e.profilePicURL = column.profilePicURL.original;
                    e.membershipTaken = column.membershipTaken ;
                    e.registrationDate = column.registrationDate
                    e.lastLogin = column.lastLogin;
                    e.numberOfPeopleRated = column.numberOfPeopleRated;
                    e.rating = column.rating;
                    e.totalRating = column.totalRating;
                    e.phoneVerified = column.phoneVerified;
                    e.appVersion = column.appVersion;
                    e.companyName = column.companyName;
                    e.membershipTaken = column.membershipTaken;
                    e.referralCredits = column.referralCredits;
                    e.state = column.state;
                    e.country = column.country;
                    e.updatedAt = column.updatedAt;

                    dataArray1.push(e);
                });
                $scope.exportList = dataArray1;
                //console.log($scope.exportList);
                alasql('SELECT * INTO CSV("AllRecruitersList.csv",{headers:true}) FROM ?',[$scope.exportList]);
            })
            .error(function(response,error){
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

    //==========================================================================================================================
//============================================================ unblock recruiter =============================================
//==========================================================================================================================

    $scope.unblockRecruiter = function(id,name){
        console.log(id);
        $scope.recruiter_name = name;
        $scope.recruiter_id = id;
        ngDialog.open({
            template: 'unblock_recruiter_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.confirmUnBlockRecruiter = function(id){
        $('.myButton').prop('disabled', true);
        console.log(id);

        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/blockUnblockRecruiter',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'recruiterID': id,
                'isBlocked': false
            }
        })
            .success(function(response){
                $('.myButton').prop('disabled', false);
                console.log(response);
                $scope.displaymsg = response.message;
              
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            })
            .error(function(response,error){
                $('.myButton').prop('disabled', false);
                console.log(response);
                console.log(error);
                if(response.statusCode == 401){
                    $scope.unAuthMsg = 'Someone other get LoggedIn';

                    ngDialog.open({
                        template: 'unauth_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
                else{
                    $scope.displaymsg = response.message;

                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
            });
    };


    //==========================================================================================================================
//============================================================ block recruiter =============================================
//==========================================================================================================================


    $scope.blockRecruiter = function(id,name){
        console.log(id);
        $scope.recruiter_name = name;
        $scope.recruiter_id = id;
        ngDialog.open({
            template: 'block_recruiter_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.confirmBlockRecruiter = function(id){
        $('.myButton').prop('disabled', true);
        console.log(id);

        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/blockUnblockRecruiter',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'recruiterID': id,
                'isBlocked': true
            }
        })
            .success(function(response){
                $('.myButton').prop('disabled', false);
                console.log(response);
                $scope.displaymsg = response.message;

                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            })
            .error(function(response,error){
                $('.myButton').prop('disabled', false);
                console.log(response);
                console.log(error);
                if(response.statusCode == 401){
                    $scope.unAuthMsg = 'Someone other get LoggedIn';

                    ngDialog.open({
                        template: 'unauth_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
                else{
                    $scope.displaymsg = response.message;

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

});