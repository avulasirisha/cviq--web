
App.controller('upcomingInterviewsController', function ($scope, $http, $cookies,$state, $cookieStore, MY_CONSTANT, $timeout,ngDialog,responseCode, filterFilter) {


    console.log("Past interviewer ctrl");

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
        console.log("items per page",$scope.itemsPerPage);
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
            url: MY_CONSTANT.url_cviq + '/api/admin/getUpcomingInterviews',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                start: skip,
                limit: limit
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
                var pendingList = response.data.interviewList;

                pendingList.forEach(function (column) {
                    // console.log(Object.keys(column).length);   //to find key length in object
                    var d = {};


                    d.id = column._id;

                    d.candidateProfilePicURL = column.candidateID.profilePicURL.original;
                    d.candidateId = column.candidateID._id;
                    d.candidateEmail = column.candidateID.email;
                    d.candidateName = column.candidateID.firstName + ' ' + column.candidateID.lastName;
                    d.candidatePhoneNo = column.candidateID.countryCode + '-' + column.candidateID.phoneNo;


                    d.interviewerProfilePicURL = column.interviewerID.profilePicURL.original;
                    d.interviewerEmail = column.interviewerID._id;
                    d.interviewerId = column.interviewerID.email;
                    d.interviewerName = column.interviewerID.firstName + ' ' + column.interviewerID.lastName;
                    d.interviewerPhoneNo = column.interviewerID.countryCode + '-' + column.interviewerID.phoneNo;

                    // d.interviewerFeedback = column.interviewerFeedback;
                    // d.candidateFeedback = column.candidateFeedback;


                    d.interviewStartDate = moment(column.interviewStartDate).format('MMM Do YYYY');//date
                    d.interviewStartTime = column.interviewStartTime;

                    d.interviewEndDate = moment(column.interviewEndDate).format('MMM Do YYYY');//date
                    d.interviewEndTime =column.interviewEndTime;//date
                    //  d.interviewEndTime = column.interviewEndTime;





                    // d.candidateRating = column.candidateRating;
                    // d.interviewerRating = column.interviewerRating;
                    // d.ratingByCandidate = column.ratingByCandidate;
                    // d.ratingByInterviewer = column.ratingByInterviewer;
                    //
                    // d.backgroundScore = column.backgroundScore;
                    // d.communicationScore = column.communicationScore;
                    // d.leadershipScore = column.leadershipScore;
                    // d.socialSkillScore = column.socialSkillScore;
                    // d.totalQualitativeGiven = column.totalQualitativeGiven;
                    // d.totalQualitativeScore = column.totalQualitativeScore;
                    //


                    var statusArray = ['','PENDING','ONGOING','','CONFIRMED','COMPLETED','EXPIRED','REJECTED','CANCELLED'];
                    d.status = statusArray[column.status];
                    d.timeOffset = column.timeOffset;


                    d.createdAt = moment(column.createdAt).format('MMM Do YYYY, h:mm a');//date
                    d.updatedAt = moment(column.updatedAt).format('MMM Do YYYY, h:mm a');//date

                    dataArray.push(d);
                });
                $scope.list = dataArray;

                console.log($scope.list);
                for (var i = 0; i < $scope.list.length; i++) {
                    $scope.list[i].index = (skip + i )
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
            url: MY_CONSTANT.url_cviq + '/api/admin/getUpcomingInterviews',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                start: 0,
                limit: 1000000,
            }
        })
            .success(function(response){
                console.log(response);
                var dataArray1 = [];
                var index1 = 0;

                var pendingList1 = response.data.interviewList;
                pendingList1.forEach(function (column) {
                    var e = {};


                    // e.id = column._id;

                    // e.candidateId = column.candidateID._id;
                    e.candidateEmail = column.candidateID.email;
                    e.candidateName = column.candidateID.firstName + ' ' + column.candidateID.lastName;
                    e.candidatePhoneNo = column.candidateID.countryCode + '-' + column.candidateID.phoneNo;

                    e.candidateProfilePicURL = column.candidateID.profilePicURL.original;
                   

                    e.interviewerProfilePicURL = column.interviewerID.profilePicURL.original;

                    e.interviewerEmail = column.interviewerID._id;
                    // e.interviewerId = column.interviewerID.email;
                    e.interviewerName = column.interviewerID.firstName + ' ' + column.interviewerID.lastName;
                    e.interviewerPhoneNo = column.interviewerID.countryCode + '-' + column.interviewerID.phoneNo;

                    // e.interviewerFeedback = column.interviewerFeedback;
                    // e.candidateFeedback = column.candidateFeedback;


                    e.interviewStartDate = moment(column.interviewStartDate).format('MMM Do YYYY');//date
                    e.interviewStartTime = column.interviewStartTime;

                    e.interviewEndDate = moment(column.interviewEndDate).format('MMM Do YYYY');//date
                    e.interviewEndTime =column.interviewEndTime;//date
                    //  e.interviewEndTime = column.interviewEndTime;





                    // e.candidateRating = column.candidateRating;
                    // e.interviewerRating = column.interviewerRating;
                    // // e.ratingByCandidate = column.ratingByCandidate;
                    // // e.ratingByInterviewer = column.ratingByInterviewer;
                    //
                    // e.backgroundScore = column.backgroundScore;
                    // e.communicationScore = column.communicationScore;
                    // e.leadershipScore = column.leadershipScore;
                    // e.socialSkillScore = column.socialSkillScore;
                    // e.totalQualitativeGiven = column.totalQualitativeGiven;
                    // e.totalQualitativeScore = column.totalQualitativeScore;



                    var statusArray = ['','PENDING','ONGOING','','CONFIRMED','COMPLETED','EXPIRED','REJECTED','CANCELLED'];
                    e.status = statusArray[column.status];
                    // e.timeOffset = column.timeOffset;



                    dataArray1.push(e);
                });
                $scope.exportList = dataArray1;
                console.log($scope.exportList);
                alasql('SELECT * INTO CSV("UpcomingInterviewsList.csv",{headers:true}) FROM ?',[$scope.exportList]);
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


    $('#certi1').click(function () {
        console.log("hello");
        $('#certi1').attr('download','myname');
    });


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