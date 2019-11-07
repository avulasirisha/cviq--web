
App.controller('approvedInterviewerController', function ($scope, $http, $cookies,$state, $cookieStore, MY_CONSTANT, $timeout,ngDialog,responseCode, filterFilter) {



    console.log("approved interviewer ctrl");
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

    $scope.delete_driver_id = '';
    $scope.approve_driver_id = '';


    $scope.searchModel = {
        limit: 10,
        limitOptions: [10, 25, 50, 100]
    };
    $scope.itemsPerPage = $scope.searchModel.limitOptions[0];
    $scope.getPagesCount = function(){
        console.log($scope.itemsPerPage);
        $scope.list = [];
        $scope.getInterviewers(0, $scope.itemsPerPage);
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
//============================================================ api for get Interviewer ====================================
//==========================================================================================================================
    $scope.getInterviewers = function(skip,limit){
        console.log(skip,limit);
        $scope.showloader = true;
        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/admin/getVerifiedInterviewersList',
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
                var pendingList = response.data.verifiedList;

                pendingList.forEach(function (column) {
                   // console.log(Object.keys(column).length);   //to find key length in object
                    var d = {};
                    d.Id = column._id;
                    d.name = column.firstName + " " + column.lastName;
                    d.phoneNumber = column.countryCode + column.phoneNo;
                    d.email = column.email;
                    d.linkedInId = column.linkedInId;
                    d.profileReviewedByAdmin = column.profileReviewedByAdmin;
                    d.registrationDate = moment(column.registrationDate).format('MMM Do YYYY, h:mm a'); //date
                    d.isBlocked = column.isBlocked;
                    d.isVerified = column.isVerified;
                    d.profilePicURL = column.profilePicURL.original;
                    d.industry = column.industry;
                    d.functionalArea = column.functionalArea;
                    d.rating = column.rating;
                    d.title = column.title;
                    d.underGraduate = column.underGraduate;
                    d.postGraduate = column.postGraduate;
                    d.paymentSetup = column.paymentSetup;
                     d.interviewCharge = column.interviewCharge;
                    d.totalInterviewes = 0;
                    d.totalpaidInterviewes = 0;
                    if( column.payments.length > 0 ){
                        for(  v in column.payments ) {
                             d.totalInterviewes = d.totalInterviewes+1;
                             if( column.payments[v].payment == true ){
                                    d.totalpaidInterviewes = d.totalpaidInterviewes+1;
                             }    
                        }
                    }
                    d.totalpaymentpending = d.totalInterviewes- d.totalpaidInterviewes ;
                    d.accomplishment = column.accomplishment;
                    d.certificationURL = column.certificationURL;
                    d.highSchool = column.highSchool;
                    d.lastLogin = column.lastLogin;
                    d.loginCountAfterVerified = column.loginCountAfterVerified;
                    d.numberOfPeopleRated = column.numberOfPeopleRated;
                    d.rating = column.rating;
                    d.totalRating = column.totalRating;
                    d.phoneVerified = column.phoneVerified;
                    d.updatedAt = column.updatedAt;
                    d.resumeURL = column.resumeURL;
                    d.certificationURL = column.certificationURL;
                    d.title = column.title;
                    if(column.paymentPercentagePerInterview){
                        d.percentage = column.paymentPercentagePerInterview;
                    }
                    else{
                        d.percentage = 0;
                    }

                    d.keywords =[];
                    d.softSkills = [];
                    d.technicalSkills = [];
                    d.keywords = column.keywords.join();
                    d.softSkills = column.softSkills.join();
                    d.technicalSkills = column.technicalSkills.join();
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
            $scope.getInterviewers((b-1)*$scope.itemsPerPage,$scope.itemsPerPage);//(b)*
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
            $scope.getInterviewers((a+1)*$scope.itemsPerPage,$scope.itemsPerPage);//(a+2)*
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
        $scope.getInterviewers((m)*$scope.itemsPerPage,$scope.itemsPerPage);//(m+1)*
    };

    $scope.init = function () {
        // $scope.resetSearchForm();
        $scope.list = [];
        $scope.getInterviewers(0, $scope.searchModel.limit);
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
//====================================================export api for get interviewer ====================================
//==========================================================================================================================
    $scope.exportData = function(){
        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/admin/getVerifiedInterviewersList',
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
                var index1 = 0;
                var pendingList1 = response.data.verifiedList;
                pendingList1.forEach(function (column) {
                    var e = {};
                    e.Id = column._id;
                    e.name = column.firstName + " " + column.lastName;
                    e.phoneNumber = column.countryCode + column.phoneNo;
                    e.email = column.email;
                    e.linkedInId = column.linkedInId;
                    e.profileReviewedByAdmin = column.profileReviewedByAdmin;
                    e.registrationDate = moment(column.registrationDate).format('MMM Do YYYY, h:mm a'); //date
                    e.isBlocked = column.isBlocked;
                    e.isVerified = column.isVerified;
                    e.profilePicURL = column.profilePicURL.original;
                    e.industry = column.industry;
                    e.functionalArea = column.functionalArea;
                    e.rating = column.rating;
                    e.title = column.title;
                    e.interviewCharge= column.interviewCharge;
                    e.underGraduate = column.underGraduate;
                    e.postGraduate = column.postGraduate;
                    e.totalInterviewes = 0;
                    e.totalpaidInterviewes = 0;
                    if( column.payments.length > 0 ){
                        for(  v in column.payments ){
                             e.totalInterviewes = e.totalInterviewes+1;
                             if( column.payments[v].payment == true ){
                                    e.totalpaidInterviewes = e.totalpaidInterviewes+1;
                             }    
                        }
                    }
                    e.totalpaymentpending = e.totalInterviewes- e.totalpaidInterviewes ;
                    if(column.paymentPercentagePerInterview){
                        e.percentage = column.paymentPercentagePerInterview;
                    }
                    else{
                        e.percentage = 0;
                    }

                    dataArray1.push(e);
                });
                $scope.exportList = dataArray1;
                console.log($scope.exportList);
                alasql('SELECT * INTO CSV("ApprovedInterviewersList.csv",{headers:true}) FROM ?',[$scope.exportList]);
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
//============================================================ block interviewer =============================================
//==========================================================================================================================


    $scope.blockInterviewer = function(id,name){
        console.log(id);
        $scope.interviewer_name = name;
        $scope.interviewer_id = id;
        ngDialog.open({
            template: 'block_interviewer_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.confirmBlockInterviewer = function(id){
        $('.myButton').prop('disabled', true);
        console.log(id);

        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/blockUnblockInterviewer',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'interviewerID': id,
                'isBlocked': true
            }
        })
            .success(function(response){
                $('.myButton').prop('disabled', false);
                console.log(response);
                $scope.displaymsg = response.message;
                $scope.$apply();
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
                    $scope.$apply();
                    ngDialog.open({
                        template: 'unauth_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
                else{
                    $scope.displaymsg = response.message;
                    $scope.$apply();
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                }
            });
    };


    $scope.updatePercentage = function (data) {
        $scope.newdata = angular.copy(data);
        console.log(" $scope.newdata",$scope.newdata.interviewCharge);

        ngDialog.open({
            template: 'updateplan',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });


    };
    $scope.updateConfirm = function (data) {
        ngDialog.close();
        console.log("update",data.interviewCharge);
        console.log("percantage",typeof (data.interviewCharge));

        var percentageForm = new FormData();

        percentageForm.append("interviewerID",data.Id);
        percentageForm.append("interviewCharge",data.interviewCharge);
        $http({
            method:'PUT',
            url: MY_CONSTANT.url_cviq +'/api/admin/updateInterviewerCharge',
            transformRequest: angular.identity,
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': undefined
            },
            data: percentageForm
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