/**
 * Created by cl-macmini-72 on 11/9/16.
 */

App.controller('ContactUsController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';

    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.phoneRegex = /^[1-9]{1}[0-9]{9}$/;


    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
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


    $scope.contact = {};
    $scope.candidateEdit = false;



    $scope.searchModel = {
        limit: 10,
        limitOptions: [10, 25, 50, 100]
    };
    $scope.itemsPerPage = $scope.searchModel.limitOptions[0];
    $scope.getPagesCount = function(){
        console.log("items per page",$scope.itemsPerPage);
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
            url: MY_CONSTANT.url_cviq + '/api/admin/listContactUs',
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
                var allList = response.data.contactUsList;
                
                allList.forEach(function (column) {
                    // console.log(Object.keys(column).length);   //to find key length in object
                    var d = {};
                    
                    d.Id = column._id;
                    d.name = column.firstName + " " + column.lastName;
                    d.phoneNumber =column.phoneNo;
                    d.email = column.email;
                    d.message = column.message;
                    d.addedAt = moment(column.addedAt).format('MMM Do YYYY, h:mm a');


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




    $http({
        method: 'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getLandingPageData',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        },
    })
        .success(function (data) {
            console.log("my data",data);
            console.log("success",data,data.data._id);

            $scope.mainId = data.data._id;
            $scope.contact.email = data.data.contactEmail;
            $scope.contact.countryCode = data.data.contactCountryCode;
            $scope.contact.linkedInLink = data.data.contactLinkedInLink;
            $scope.contact.phoneNumber = data.data.contactPhoneNo;
            $scope.showloader=false;

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

    $scope.update = function () {

        console.log('hello')

        $('#addButton').prop('disabled', true);
        $scope.showloader = true;

        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/updateContactUsDetail',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data : {
                "_id": $scope.mainId,
                "contactEmail":  $scope.contact.email,
                "contactCountryCode":  $scope.contact.countryCode,
                "contactPhoneNo":  $scope.contact.phoneNumber,
                "contactLinkedInLink":  $scope.contact.linkedInLink
            }
        })
            .success(function (data) {
                
                $scope.candidateEdit = false;
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                bootbox.alert('Updated Successfully');
                $scope.mainId = data.data._id;
                $scope.Landingdescription = data.data.homeDescription;
                $scope.companyArray = data.data.company;
                $scope.edit = false;
            })
            .error(function(response){
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                console.log('error',response);
                bootbox.alert(response.message);
            });
    }

    
    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".bootstrap-select").click(function () {
            $(this).addClass("open");
        });

    },0);
    
    
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