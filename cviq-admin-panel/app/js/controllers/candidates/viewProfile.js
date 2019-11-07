
App.controller('viewProfileController', function ($scope, $http, $cookies,$state, $cookieStore, $location,MY_CONSTANT, $timeout,responseCode, filterFilter,ngDialog) {


    console.log("view profile");

    'use strict';


    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }




    //  console.log("job id",$location.absUrl());
    var jobArray =  $location.absUrl().split('+');
//    console.log("job id",jobArray);

    $scope.candidateProfileId = {};
    $scope.candidateProfileId.candidateID = jobArray[1];
    console.log($scope.candidateProfileId.candidateID);


    $scope.showloader=true;

    console.log($scope.showloader);


$http({
    method:'GET',
    url: MY_CONSTANT.url_cviq + '/api/admin/getSingleCandidateProfile',
    headers:{
        'authorization':$cookieStore.get("obj").accessToken,
    },
    params:$scope.candidateProfileId
})
    .success(function(response){

        var profile = response.data;
        console.log("profile data",profile);

        $scope.data = {};

        $scope.data.profilePicURL = profile.profilePicURL.original;
        $scope.data.name = profile.firstName +' ' +profile.lastName;
        $scope.data.phoneNo = profile.countryCode+'-' + profile.phoneNo;
        $scope.data.phoneVerified = profile.phoneVerified;
        $scope.data.gender = profile.gender;
        $scope.data.email = profile.email;
        $scope.data.linkedInId = profile.linkedInId;
        $scope.data.dob = profile.dob;
        $scope.data.experience = profile.totalExperience;
        $scope.data.salary = profile.salary;
        $scope.data.keySkills = profile.keySkills.join();
        $scope.data.country = profile.currentCountry;
        $scope.data.state = profile.currentState;
        $scope.data.zipCode = profile.zipCode;
        $scope.data.nationality = profile.nationality;
        $scope.data.lastLogin = profile.lastLogin;

        $scope.data.desiredJobLocations = profile.desiredJobLocations.join();

        $scope.data.isBlocked = profile.isBlocked;
        $scope.data.Id = profile._id;


        $scope.data.aggregatedScore = profile.aggregatedScore;
        $scope.data.qualitativeScore = profile.qualitativeScore;
        $scope.data.quantitativeScore = profile.quantitativeScore;

        $scope.data.desiredJob = {};


        $scope.data.desiredJob.functionalArea = profile.desiredJob.functionalArea;
        $scope.data.desiredJob.industry = profile.desiredJob.industry;
        $scope.data.desiredJob.jobLocation = profile.desiredJob.jobLocation;
        $scope.data.desiredJob.salary = profile.desiredJob.salary;


        var dataArray = [];
        var allList = profile.education;

        allList.forEach(function (column) {
            // console.log(Object.keys(column).length);   //to find key length in object
            var d = {};
            d.instituteName = column.instituteName;
            d.passoutYear = column.passoutYear;
            d.qualificationLevel = column.qualificationLevel;
            d.specialization = column.specialization;

            dataArray.push(d);

        });
        $scope.data.education = dataArray;

        console.log($scope.data.education );
        for (var i = 0; i < $scope.data.education.length; i++) {
            $scope.data.education[i].index = (1 + i)
        }

        var dataArray2 = [];
        var allList2 = profile.workHistory;

        allList2.forEach(function (column) {
            // console.log(Object.keys(column).length);   //to find key length in object

            var d = {};
            d.annualSalary = column.annualSalary;
            d.companyName = column.companyName;
            d.currentEmployer = column.currentEmployer;
            d.designation = column.designation;
            d.durationFrom = column.durationFrom;
            d.durationTo = column.durationTo;
            d.industry = column.industry;
            d.accomplishments = column.accomplishments;

            dataArray2.push(d);

        });
        $scope.data.work = dataArray2;

        console.log($scope.data.work );
        for (var i = 0; i < $scope.data.work.length; i++) {
            $scope.data.work[i].index = (1 + i)
        }

        var dataArray3 = [];
        var allList3 = profile.certification;

        allList3.forEach(function (column) {
            // console.log(Object.keys(column).length);   //to find key length in object


            var d = {};
            d.certificationName = column.certificationName;
            d.doc = column.doc;
            d.docName = column.docName;
            d.issuedBy = column.issuedBy;
            d.lifeTimeValidity = column.lifeTimeValidity;
            d.validity = column.validity;

            dataArray3.push(d);

        });
        $scope.data.certi = dataArray3;

        console.log($scope.data.certi );
        for (var i = 0; i < $scope.data.certi.length; i++) {
            $scope.data.certi[i].index = (1 + i)
        }
        var dataArray4 = [];
        var allList4 = profile.resume;

        allList4.forEach(function (column) {
            // console.log(Object.keys(column).length);   //to find key length in object

            var d = {};

            d.isPrimary = column.isPrimary;
            d.resumeName = column.resumeName;
            d.resumeURL = column.resumeURL;

            dataArray4.push(d);

        });
        $scope.data.resume = dataArray4;
        console.log($scope.data.resume );
        for (var i = 0; i < $scope.data.resume.length; i++) {
            $scope.data.resume[i].index = (1 + i)
        }
        var dataArray5 = [];
        var allList5 = profile.award;

        allList5.forEach(function (column) {
            // console.log(Object.keys(column).length);   //to find key length in object

            var d = {};

            d.description = column.description;
            dataArray5.push(d);

        });
        $scope.data.awards = dataArray5;
        console.log($scope.data.awards );
        for (var i = 0; i < $scope.data.awards.length; i++) {
            $scope.data.awards[i].index = (1 + i)
        }
        var dataArray6 = [];
        var allList6 = profile.patent;

        allList6.forEach(function (column) {
            // console.log(Object.keys(column).length);   //to find key length in object

            var d = {};

            d.description = column.description;
            dataArray6.push(d);

        });
        $scope.data.patents = dataArray6;
        console.log($scope.data.patents );
        for (var i = 0; i < $scope.data.patents.length; i++) {
            $scope.data.patents[i].index = (1 + i)
        }

        $scope.showloader = false;
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


    // $http({
    //     method : 'GET',
    //     url : MY_CONSTANT.url_cviq +'/api/recruiter/',
    //     headers:{
    //         authorization: $cookieStore.get('obj').accessToken
    //     },
    //     params: $scope.data,
    // })
    //     .success(function (response) {
    //         console.log("job is",response.data);
    //         $scope.jobData = response.data;
    //
    //         if($scope.jobData.workExperience.min == 15){
    //             $scope.workEx = 'More than 15 Years'
    //         }
    //         else {
    //             $scope.workEx = $scope.jobData.workExperience.min +" - " + $scope.jobData.workExperience.max + " Years";
    //         }
    //
    //         if($scope.jobData.annualCompensation.min == 50000){
    //             $scope.salary = 'More than $50000'
    //         }
    //         else {
    //             $scope.salary = '$' + $scope.jobData.annualCompensation.min +" to " + '$' + $scope.jobData.annualCompensation.max ;
    //         }
    //
    //         $scope.education = $scope.jobData.underGraduate ;
    //         if($scope.jobData.postGraduate){
    //
    //             $scope.education =  $scope.education +' , ' + $scope.jobData.postGraduate;
    //         }
    //
    //         if($scope.jobData.certification.length == 0){
    //             $scope.certificates =[];
    //         }
    //         else{
    //             $scope.certificates = $scope.jobData.certification.split(',');
    //         }
    //
    //         console.log("certi length",$scope.certificates.length);
    //
    //     })
    //     .error(function (response) {
    //         console.log("error",response);
    //         if(response.statusCode == 401){
    //             $scope.confirmLogOut();
    //         }
    //     })



    $scope.exportEducationData = function () {

        var naam ='Education List of '+$scope.data.name+'.csv';

        var exportList = $scope.data.education;


        alasql('SELECT * INTO CSV("' + naam + '",{headers:true}) FROM ?', [exportList]);

    };

    $scope.exportExperienceData = function () {

        var naam ='Work Experience List of '+$scope.data.name+'.csv';

        var exportList = $scope.data.work;

        alasql('SELECT * INTO CSV("' + naam + '",{headers:true}) FROM ?', [exportList]);

    };

    $scope.exportCertificationsData = function () {

        var naam ='Certification List of '+$scope.data.name+'.csv';
        var exportList = $scope.data.certi;

        alasql('SELECT * INTO CSV("' + naam + '",{headers:true}) FROM ?', [exportList]);

    };

    $scope.exportAwardsData = function () {

        var naam ='Awards List of '+$scope.data.name+'.csv';
        var exportList = $scope.data.awards;

        alasql('SELECT * INTO CSV("' + naam + '",{headers:true}) FROM ?', [exportList]);

    };

    $scope.exportPatentsData = function () {

        var naam ='Patents List of '+$scope.data.name+'.csv';
        var exportList = $scope.data.patents;

        alasql('SELECT * INTO CSV("' + naam + '",{headers:true}) FROM ?', [exportList]);

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


    //==========================================================================================================================
//============================================================ block candidate =============================================
//==========================================================================================================================


    $scope.blockCandidate = function(id,name){
        console.log(id);
        $scope.candiate_name = name;
        $scope.candidate_id = id;
        ngDialog.open({
            template: 'block_candidate_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };
    $scope.confirmBlockCandidate = function(id){
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
    
    $scope.myFunction = function (){
        window.print();
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