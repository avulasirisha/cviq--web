App.controller('blockedCandidateController', function ($scope, $http, $cookies,$state, $cookieStore, MY_CONSTANT, $timeout,ngDialog,responseCode, filterFilter) {

    console.log("blocked candidate ctrl");
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
        $scope.getcandidates(0, $scope.itemsPerPage);
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
//============================================================ api for get candidate ====================================
//==========================================================================================================================
    $scope.getcandidates = function(skip,limit){
        console.log(skip,limit);
        $scope.showloader = true;
        $http({
            method: 'GET',
            url: MY_CONSTANT.url_cviq + '/api/admin/getBlockedCandidateList',
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
                var pendingList = response.data.blockedList;

                pendingList.forEach(function (column) {
                    // console.log(Object.keys(column).length);   //to find key length in object
                    var d = {};




                    d.Id = column._id;
                    d.name = column.firstName + " " + column.lastName;
                    d.phoneNumber = column.countryCode + " - " + column.phoneNo;
                    d.email = column.email;
                    d.linkedInId = column.linkedInId;
                    d.registrationDate = moment(column.registrationDate).format('MMM Do YYYY, h:mm a'); //date
                    d.isBlocked = column.isBlocked;
                    d.profilePicURL = column.profilePicURL.original;
                    d.nationality = column.nationality;


                    d.lastLogin = column.lastLogin;
                    d.phoneVerified = column.phoneVerified;
                    d.currentState = column.currentState;
                    d.currentCountry = column.currentCountry;
                    d.updatedAt = column.updatedAt;



                    d.aggregatedScore = column.aggregatedScore;
                    d.qualitativeScore = column.qualitativeScore;
                    d.quantitativeScore = column.quantitativeScore;

                    d.functionalArea = column.functionalArea;
                    d.industry = column.industry;

                    for(var i=0;i<column.resume.length;i++){
                        if(column.resume[i].isPrimary){
                            d.resume = column.resume[i].resumeURL;
                        }
                    }
                    if(!d.resume){
                        d.resume = null;
                    }
                    d.salary = column.salary;
                    d.totalExperience = column.totalExperience;

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
            $scope.getcandidates((b-1)*$scope.itemsPerPage,$scope.itemsPerPage);//(b)*
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
            $scope.getcandidates((a+1)*$scope.itemsPerPage,$scope.itemsPerPage);//(a+2)*
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
        $scope.getcandidates((m)*$scope.itemsPerPage,$scope.itemsPerPage);//(m+1)*
    };

    $scope.init = function () {
        // $scope.resetSearchForm();
        $scope.list = [];
        $scope.getcandidates(0, $scope.searchModel.limit);
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
            url: MY_CONSTANT.url_cviq + '/api/admin/getBlockedCandidateList',
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
                var allList1 = response.data.blockedList;

                allList1.forEach(function (profile) {
                    var e = {};
                    if(profile.profilePicURL.original){
                        e.ProfilePicURL = profile.profilePicURL.original;
                    }
                    else{
                        e.ProfilePicURL = '-';
                    }
                    e.Name = profile.firstName +' ' +profile.lastName;
                    e.Phone_No = profile.countryCode+'-' + profile.phoneNo;
                    e.Phone_Verified = profile.phoneVerified;
                    e.Gender = profile.gender;
                    e.Email = profile.email;

                    if(profile.linkedInId){
                        e.LinkedInId = profile.linkedInId;
                    }
                    else{
                        e.LinkedInId = '-';
                    }
                    if(profile.dob){
                        e.Date_Of_Birth = profile.dob;
                    }
                    else{
                        e.Date_Of_Birth = '-';
                    }
                    e.Experience = profile.totalExperience;
                    e.Salary = profile.salary;
                    if(profile.keySkills){
                        e.KeySkills = profile.keySkills;
                    }
                    else{
                        e.KeySkills = '-';
                    }
                    e.Country = profile.currentCountry;
                    e.State = profile.currentState;
                    e.Nationality = profile.nationality;
                    e.LastLogin = profile.lastLogin;
                    e.Desired_Job_Locations = profile.desiredJobLocations;

                    e.Blocked = profile.isBlocked;

                    e.AggregatedScore = profile.aggregatedScore;
                    e.QualitativeScore = profile.qualitativeScore;
                    e.QuantitativeScore = profile.quantitativeScore;

                    if(profile.desiredJob.functionalArea){
                        e.DesiredJob_functionalArea = profile.desiredJob.functionalArea;
                    }
                    else{
                        e.DesiredJob_functionalArea = '-';
                    }
                    if(profile.desiredJob.industry){
                        e.DesiredJob_industry = profile.desiredJob.industry;
                    }
                    else{
                        e.DesiredJob_industry = '-';
                    }
                    if(profile.desiredJob.jobLocation){
                        e.DesiredJob_jobLocation = profile.desiredJob.jobLocation;
                    }
                    else{
                        e.DesiredJob_jobLocation = '-';
                    }
                    if(profile.desiredJob.salary){
                        e.DesiredJob_salary = profile.desiredJob.salary;
                    }
                    else{
                        e.DesiredJob_salary = '-';
                    }

                    dataArray1.push(e);
                });
                $scope.exportList = dataArray1;
                //console.log($scope.exportList);
                alasql('SELECT * INTO CSV("BlockedCandidatesList.csv",{headers:true}) FROM ?',[$scope.exportList]);
            })
            .error(function(response,error){
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

    //==========================================================================================================================
//============================================================ unblock candidate =============================================
//==========================================================================================================================

    $scope.unblockCandidate = function(id,name){
        console.log(id);
        $scope.candiate_name = name;
        $scope.candidate_id = id;
        ngDialog.open({
            template: 'unblock_candidate_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.confirmUnBlockCandidate = function(id){
        $('.myButton').prop('disabled', true);
        console.log(id);

        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/blockUnblockCandidate',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'candidateID': id,
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