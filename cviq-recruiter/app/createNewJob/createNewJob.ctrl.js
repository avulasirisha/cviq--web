angular.module('Cviq').controller('createNewJobCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window',
    function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){


        if($cookieStore.get('AccessToken') == undefined){
            $scope.confirmLogOut();
        }



          $http({
             method:'GET',
             url: CONSTANT.apiUrl +'/api/recruiter/checkStatus',
             headers:{
                authorization: $cookieStore.get('AccessToken')
             }
             }).success(function (response) {
             console.log("response success",response.data);
                if( response.data != 'success' ){
                       bootbox.alert( response.data );  
                       $state.go('home.upgradePackage');
                }

             })
             .error(function (response) {
                console.log("response error",response);
                 bootbox.alert( response.message );  
                 $state.go('home.upgradePackage');

             })







        $('body, html').animate({
            scrollTop: 0
        }, 10);


        $scope.review = false;

        $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        $scope.phoneRegex = /^[1-9]{1}[0-9]{9}$/;
        $scope.otp;
        $scope.phoneVerify = false;
        $scope.linkedinData;
        $scope.year;
        $scope.job = {};
        $scope.month;
        $scope.questions = false;
        $scope.certificates = false;
        $scope.job.confidential= false;

        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var monthNo = [
            "01", "02", "03",
            "04", "05", "06", "07",
            "08", "09", "10",
            "11", "12"
        ];
        var dayno = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];

        var date = new Date();
        var dayIndex = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        // console.log(dayno[dayIndex-1], monthNames[monthIndex], year);
        //  console.log(dayno[dayIndex-1], monthNo[monthIndex], year);
        $scope.job.date=dayno[dayIndex-1] + '-' + monthNames[monthIndex] + '-' + year;
        $scope.job.postedOn=year + '-' + monthNo[monthIndex]+ '-' +dayno[dayIndex-1];
        //  console.log( typeof($scope.job.postedOn));



        /*================================Start : my date time calander=========================================*/

        $( function() {
            $( "#datepicker1" ).datepicker({
                format: 'dd-MM-yyyy',
                startDate:new Date(),
                autoclose: true
            });
        } );

        /*================================End : my date time calander=========================================*/

        // $scope.workExperience = [ '0 to 3','3 to 6','6 to 9','9 to 12','12 to 15','> 15' ];
        // $scope.salaryList = ['$ 10000 to $ 15000','$ 15000 to $ 20000','$ 20000 to $ 25000','$ 25000 to $ 30000','$ 30000 to $ 35000','$ 35000 to $ 40000','$ 40000 to $ 45000','$ 45000 to $ 50000','> $ 50000',]
        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },0);

        $scope.certificationList = [];
        $scope.certificationMessages = {};
        var d ={
            id: $scope.certificationList.length+ 1,
        };
        $scope.certificationList.push(d);


        /*=============================Start :add more function for certification================================*/
        $scope.addMoreCertificates = function () {
            var data1 ={
                id: $scope.certificationList.length+ 1,
            };
            $scope.certificationList.push(data1);
            if($scope.certificationList.length >=5){

                $scope.certificates = true;
            }

        };

        /*=============================End : add more function for certification ================================*/

        $scope.questionList = [];
        $scope.questionnaire = {};
        var q ={
            id: $scope.questionList.length+ 1,
        };
        $scope.questionList.push(q);


        /*=============================Start :add more function for tech questions================================*/
        $scope.addMoreTechQuestions = function () {

            var q ={
                id: $scope.questionList.length+ 1,
            };
            $scope.questionList.push(q);
            if($scope.questionList1.length + $scope.questionList.length>=5){

                // $('#techQuestions').prop('disabled', true);
                // $('#nonTechQuestions').prop('disabled', true);
                $scope.questions = true;
            }

        };

        /*=============================End : add more function for tech questions ================================*/
        $scope.questionList1 = [];
        $scope.questionnaire1 = {};
        var q1 ={
            id: $scope.questionList1.length+ 1,
        };
        $scope.questionList1.push(q1);


        /*=============================Start :add more function for non Tech questions================================*/
        $scope.addMoreNonTechQuestions = function () {

            var q ={
                id: $scope.questionList1.length+ 1,
            };
            $scope.questionList1.push(q);
            console.log($scope.questionList1.length + $scope.questionList.length);
            if($scope.questionList1.length + $scope.questionList.length>=5){

                // $('#techQuestions').prop('disabled', true);
                // $('#nonTechQuestions').prop('disabled', true);
                $scope.questions = true;
            }

        };

        /*=============================End : add more function for non Tech questions ================================*/

        /*=============================Start: Pop Validation Function ================================*/

        $scope.validCheck = function(){

            if($('#onPhoneNumder').prop("checked") || $('#onEmail').prop("checked")) {
                $("[data-valmsg-for='Otp']").hide();
            } else {
                $("[data-valmsg-for='Otp']").show();
            }
        }

        /*=============================End: Pop Validation Function ================================*/


        $('#terms').change(function(){
            if($(this).prop("checked")) {
                $("[data-valmsg-for='Location']").hide();
            } else {
                $("[data-valmsg-for='Location']").show();
            }
        });

        /*=============================Start: Custom Factory Function ================================*/

        $scope.FirsText = function($event){
            characterService.characterFunction($event);
        };

        $scope.isNumberKey = function($event){
            characterService.numberFunction($event);
        };

        $scope.isCodeKey = function($event){
            characterService.codeFunction($event);
        };

        $scope.maxLengthCheck = function(object){
            if (object.value.length > 4)
                object.value = object.value.slice(0, 4)
        };


        /*=============================End: Custom Factory Function ================================*/



        /*===============================console data function start ==================================*/

        $scope.post = function (id) {

            // console.log("job data got is",$scope.job)
            //   console.log("certification",$scope.certificationMessages);
            // console.log("tech ques",$scope.questionnaire);
            // console.log("non tech ques",$scope.questionnaire1);

            var certificationarray = [];
            var techArray = [];
            var nonTechArray = [];
            angular.forEach($scope.certificationMessages, function (value) {
                certificationarray.push(value);
            });
            angular.forEach($scope.questionnaire, function (value) {
                techArray.push(value);
            });
            angular.forEach($scope.questionnaire1, function (value) {
                nonTechArray.push(value);
            });

            // console.log("certification",certificationarray);
            //   console.log("tech ques",techArray);
            //   console.log("non tech ques",nonTechArray);


            $scope.postNowData = {};
            $scope.postNowData.jobTitle=$scope.job.jobTitle;
            $scope.postNowData.jobDescription=$scope.job.jobDescription;
            $scope.postNowData.jobskill=$scope.job.jobskill;
            $scope.postNowData.address=$scope.job.address;
            
            $scope.postNowData.aggregatedScore = {};
            $scope.postNowData.quantitativeScore = {};
            $scope.postNowData.qualitativeScore = {};

            $scope.postNowData.aggregatedScore.min=$scope.job.aggregatedScore;
            $scope.postNowData.aggregatedScore.max=1580;
            $scope.postNowData.quantitativeScore.min=$scope.job.quantitativeScore;
            $scope.postNowData.quantitativeScore.max=500;
            $scope.postNowData.qualitativeScore.min=$scope.job.qualitativeScore;
            $scope.postNowData.qualitativeScore.max=1080;

            $scope.postNowData.jobType = $scope.job.jobType;

            if ($scope.job.commute == "true")
                $scope.postNowData.canCommute= true;
            else
                $scope.postNowData.canCommute= false;


            console.log('$scope.job.jobType====================', $scope.job.jobType);




            $scope.postNowData.workExperience={};

            if($scope.job.workExp.indexOf('>') > -1) {
                var workEx = $scope.job.workExp.split(">");
                //  console.log(workEx);
                $scope.postNowData.workExperience.min = workEx[1];
                $scope.postNowData.workExperience.max = 50;

            }
            else{

                var workEx = $scope.job.workExp.split("-");
                $scope.postNowData.workExperience.min = workEx[0];
                $scope.postNowData.workExperience.max = workEx[1];
            }

            $scope.postNowData.annualCompensation = {};

            if($scope.job.salary.indexOf('>') > -1) {
                var salaryArray = $scope.job.salary.split(">");
                console.log(salaryArray);
                $scope.postNowData.annualCompensation.min = salaryArray[1];
                $scope.postNowData.annualCompensation.max = 200000;

            }
            else{

                var salaryArray = $scope.job.salary.split(" - ");
                $scope.postNowData.annualCompensation.min = salaryArray[0];
                $scope.postNowData.annualCompensation.max = salaryArray[1];
            }

            // $scope.postNowData.annualCompensation.min=$scope.job.minSalary;
            // $scope.postNowData.annualCompensation.max=$scope.job.maxSalary;
            $scope.postNowData.state=$scope.job.currentState.stateName;
            $scope.postNowData.country=$scope.job.currentCountry.countryName;
            $scope.postNowData.zipCode=$scope.job.zipCode;
            // $scope.postNowData.areaName=$scope.job.areaName;
            $scope.postNowData.industryID=$scope.job.industry._id;
            $scope.postNowData.industryName=$scope.job.industry.industryName;
            $scope.postNowData.functionalAreaID=$scope.job.function._id;
            $scope.postNowData.functionalAreaName=$scope.job.function.functionalAreaName;
            $scope.postNowData.postedOn=$scope.job.postedOn;
            $scope.postNowData.date=$scope.job.date;


            var d = new Date();
            $scope.postNowData.timeOffset=  d.getTimezoneOffset();



            if(id==1){
                $scope.postNowData.postLater= false;
            }

            else
            {
                $scope.postNowData.postLater= true;
            }


            $scope.postNowData.underGraduate=$scope.job.ugQualifications.courseName;

            if($scope.job.pgQualifications != undefined)
                $scope.postNowData.postGraduate=$scope.job.pgQualifications.courseName;


            if(certificationarray.length != 0)
                $scope.postNowData.certification=certificationarray.toString();     //array

            $scope.postNowData.companyName=$scope.job.positionAt;
            $scope.postNowData.isNameConfidential=$scope.job.confidential;
            $scope.postNowData.contactPerson=$scope.job.contactPerson;
            $scope.postNowData.contactEmail=$scope.job.contactEmail;
            $scope.postNowData.contactNumber=$scope.job.contactNumber;

            $scope.postNowData.technicalQuestions=techArray;       //array
            $scope.postNowData.nonTechnicalQuestions=nonTechArray;     //array



            // console.log($scope.postNowData);
            localStorage.setItem("JobDetails",JSON.stringify($scope.postNowData));

            //  console.log("local storage",JSON.parse(localStorage.getItem("JobDetails")));

            if(id == 1){

                $('body, html').animate({
                    scrollTop: 0
                }, 10);
                $scope.review = true;

                $scope.jobData = $scope.postNowData;

                if($scope.jobData.workExperience.min == 15){
                    $scope.workEx = 'More than 15 Years'
                }
                else {
                    $scope.workEx = $scope.jobData.workExperience.min +" - " + $scope.jobData.workExperience.max + " Years";
                }

                if($scope.jobData.annualCompensation.min == 50000){
                    $scope.salary = 'More than $50000'
                }
                else {
                    $scope.salary = '$' + $scope.jobData.annualCompensation.min +" to " + '$' + $scope.jobData.annualCompensation.max ;
                }

                $scope.education = $scope.jobData.underGraduate ;
                if($scope.jobData.postGraduate){

                    $scope.education =  $scope.education +' , ' + $scope.jobData.postGraduate;
                }


                if($scope.jobData.certification && $scope.jobData.certification.length == 0){
                    $scope.certificates =[];
                }
                if($scope.jobData.certification && $scope.jobData.certification.length != 0){
                    $scope.certificates = $scope.jobData.certification.split(',');
                }

            }
            else{
                console.log("going to post later");
                $state.go('home.postLater');
            }

            /*$http({
             method:'POST',
             url: CONSTANT.apiUrl +'/api/recruiter/createJob',
             headers:{
             authorization: $cookieStore.get('AccessToken')
             },
             data:$scope.postNowData
             })
             .success(function (response) {
             console.log("response success",response.data);

             })
             .error(function (response) {
             console.log("response error",response);

             })*/



        };
        /*===============================console data function end ==================================*/



        $scope.reviewJob = function () {

            $scope.review = false;
            $('body, html').animate({
                scrollTop: 0
            }, 10);

        }


        $scope.postnow = function () {
            $rootScope.loading=true;

            delete $scope.jobData.date;
            delete $scope.jobData.functionalAreaName;
            delete $scope.jobData.industryName;
            // delete $scope.jobData.areaName;
            console.log($scope.jobData);

            $http({
                method:'POST',
                url: CONSTANT.apiUrl +'/api/recruiter/createJob',
                headers:{
                    authorization: $cookieStore.get('AccessToken')
                },
                data:$scope.jobData
            })
                .success(function (response) {
                    console.log("response success",response.data);
                    bootbox.alert("Job Created Successfully");
                    $state.go("home.dashboard.recentlyPostedJobs");
                    $rootScope.loading=false;
                })
                .error(function (response) {
                    console.log("response error",response);
                    bootbox.alert(response.message);
                    $rootScope.loading=false;
                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                    }
                })
        }


        /*============================= Start: Key Skills Section ================================*/

        $scope.instruct = function(){
            $scope.tips = true;
            $timeout(function(){
                $scope.tips = false;
            },5000);
        }

        /*============================= End: Key Skills Section ================================*/


        $( function() {
            $( "#datepicker" ).datepicker();
        } );
        /*=============================Start: Call Get Country list API ================================*/

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getDropDownData'
        })
            .success(function(response){
                console.log(response);
                $scope.workExperience = response.data.ExperienceList;
                $scope.salaryList =  response.data.SalaryList;
                $scope.countryLists = response.data.countryList;
                $scope.industriesList = response.data.industryList;
                $scope.GraduationList = response.data.Graduation;
                $scope.PostGraduationList = response.data.PostGraduation;

                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
            .error(function(response){
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                    $rootScope.loading = false;
                }
                console.log(response);
            })

        /*=============================End: Call Get Country list API ================================*/

        /*============================= Start: Call Get State Name and Country Code ================================*/


        $scope.getCountryID = function(response){
            $scope.selectedCountryID = response._id;
            //  console.log($scope.job.countryCode);
            $scope.job.countryCode = response.countryCode;
            //  console.log($scope.job.countryCode);
            $scope.count = {
                countryID:$scope.selectedCountryID
            }

            $http({
                method:'GET',
                url: CONSTANT.apiUrl +'/api/common/getStateList',
                params:$scope.count
            })
                .success(function(response){
                    console.log(response);
                    $scope.stateRefinedList = response.data;
                    $scope.zipCodeList = [];
                    $timeout(function(){
                        $('.selectpicker').selectpicker('refresh');
                    },0);
                })
                .error(function(response){
                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                        $rootScope.loading = false;
                    }
                    console.log(response);

                })

        }

        /*============================= End: Call Get State Name and Country Code ================================*/


        /*============================= Start: Call Get zip code ================================*/


        $scope.getZipCode = function(response){
            // console.log(response._id);
            $scope.selectedStateID = response._id;
            console.log($scope.job.currentState.stateName);
            $scope.state = {
                stateID:$scope.selectedStateID
            };

            $http({
                method:'GET',
                url: CONSTANT.apiUrl +'/api/common/getZipCodeList',
                params:$scope.state
            })
                .success(function(response){
                    console.log(response);
                    $scope.zipCodeList = response.data;
                    $timeout(function(){
                        $('.selectpicker').selectpicker('refresh');
                    },0);
                })
                .error(function(response){
                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                    }
                    console.log(response);
                })
        }

        /*============================= End: Call Get zip code ================================*/

        /*============================= Start: Call Get Function Area ================================*/


        $scope.findFunctionalArea = function(response){
            $scope.selectedIndustryID = response._id;

            $scope.funct = {
                industryID:$scope.selectedIndustryID
            }

            $http({
                method:'GET',
                url: CONSTANT.apiUrl +'/api/common/getFunctionalAreaList',
                params:$scope.funct
            })
                .success(function(response){
                    console.log(response);
                    $scope.functionalAreaRefinedList = response.data;
                    $timeout(function(){
                        $('.selectpicker').selectpicker('refresh');
                    },0);
                })
                .error(function(response){
                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                    }
                    console.log(response);
                })
        }

        /*============================= End:  Call Get Function Area ================================*/

    }]);





/*                      version 2




 angular.module('Cviq').controller('createNewJobCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window',
 function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){


 if($cookieStore.get('AccessToken') == undefined){
 $scope.confirmLogOut();
 }


 $scope.job = JSON.parse(localStorage.getItem("isJob"));
 $scope.certificationList = JSON.parse(localStorage.getItem("iscertiarray"));
 $scope.questionList = JSON.parse(localStorage.getItem("istecharray"));
 $scope.questionList1 = JSON.parse(localStorage.getItem("isnontecharray"));



 if($scope.job == undefined)
 {
 $scope.job={};
 console.log("no job is there");
 }
 else
 {
 console.log("your job is", $scope.job);

 }
 if($scope.certificationList == undefined)
 {
 $scope.certificationList = [];
 console.log("no certi is there");
 }
 else
 {
 console.log("your certi are is", $scope.certificationList);
 }
 if($scope.questionList == undefined)
 {

 $scope.questionList = [];
 console.log("no tech que is there");
 }
 else
 {
 console.log("your tech que are", $scope.questionList);
 }
 if($scope.questionList1 == undefined)
 {
 $scope.questionList1 = [];
 console.log("no non tech que is there");
 }
 else
 {
 console.log("your non tech que are", $scope.questionList1);
 }

 $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 $scope.phoneRegex = /^[1-9]{1}[0-9]{9}$/;
 $scope.otp;
 $scope.phoneVerify = false;
 $scope.linkedinData;
 $scope.year;
 $scope.month;
 $scope.questions = false;
 $scope.certificates = false;
 $scope.job.confidential= false;

 var monthNames = [
 "January", "February", "March",
 "April", "May", "June", "July",
 "August", "September", "October",
 "November", "December"
 ];
 var monthNo = [
 "01", "02", "03",
 "04", "05", "06", "07",
 "08", "09", "10",
 "11", "12"
 ];
 var dayno = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];

 var date = new Date();
 var dayIndex = date.getDate();
 var monthIndex = date.getMonth();
 var year = date.getFullYear();

 // console.log(dayno[dayIndex-1], monthNames[monthIndex], year);
 //  console.log(dayno[dayIndex-1], monthNo[monthIndex], year);
 $scope.job.date=dayno[dayIndex-1] + '-' + monthNames[monthIndex] + '-' + year;
 $scope.job.postedOn=year + '-' + monthNo[monthIndex]+ '-' +dayno[dayIndex-1];
 //  console.log( typeof($scope.job.postedOn));



 /!*================================Start : my date time calander=========================================*!/

 $( function() {
 $( "#datepicker1" ).datepicker({
 format: 'dd-MM-yyyy',
 startDate:new Date(),
 autoclose: true
 });
 } );

 /!*================================End : my date time calander=========================================*!/

 // $scope.workExperience = [ '0 to 3','3 to 6','6 to 9','9 to 12','12 to 15','> 15' ];
 // $scope.salaryList = ['$ 10000 to $ 15000','$ 15000 to $ 20000','$ 20000 to $ 25000','$ 25000 to $ 30000','$ 30000 to $ 35000','$ 35000 to $ 40000','$ 40000 to $ 45000','$ 45000 to $ 50000','> $ 50000',]
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);


 $scope.certificationMessages = {};
 var d ={
 id: $scope.certificationList.length+ 1,
 };
 $scope.certificationList.push(d);


 /!*=============================Start :add more function for certification================================*!/
 $scope.addMoreCertificates = function () {
 var data1 ={
 id: $scope.certificationList.length+ 1,
 };
 $scope.certificationList.push(data1);
 if($scope.certificationList.length >=5){

 $scope.certificates = true;
 }

 };

 /!*=============================End : add more function for certification ================================*!/


 $scope.questionnaire = {};
 var q ={
 id: $scope.questionList.length+ 1,
 };
 $scope.questionList.push(q);


 /!*=============================Start :add more function for tech questions================================*!/
 $scope.addMoreTechQuestions = function () {

 var q ={
 id: $scope.questionList.length+ 1,
 };
 $scope.questionList.push(q);
 if($scope.questionList1.length + $scope.questionList.length>=5){

 // $('#techQuestions').prop('disabled', true);
 // $('#nonTechQuestions').prop('disabled', true);
 $scope.questions = true;
 }

 };

 /!*=============================End : add more function for tech questions ================================*!/

 $scope.questionnaire1 = {};
 var q1 ={
 id: $scope.questionList1.length+ 1,
 };
 $scope.questionList1.push(q1);


 /!*=============================Start :add more function for non Tech questions================================*!/
 $scope.addMoreNonTechQuestions = function () {

 var q ={
 id: $scope.questionList1.length+ 1,
 };
 $scope.questionList1.push(q);
 console.log($scope.questionList1.length + $scope.questionList.length);
 if($scope.questionList1.length + $scope.questionList.length>=5){

 // $('#techQuestions').prop('disabled', true);
 // $('#nonTechQuestions').prop('disabled', true);
 $scope.questions = true;
 }

 };

 /!*=============================End : add more function for non Tech questions ================================*!/

 /!*=============================Start: Pop Validation Function ================================*!/

 $scope.validCheck = function(){

 if($('#onPhoneNumder').prop("checked") || $('#onEmail').prop("checked")) {
 $("[data-valmsg-for='Otp']").hide();
 } else {
 $("[data-valmsg-for='Otp']").show();
 }
 }

 /!*=============================End: Pop Validation Function ================================*!/


 $('#terms').change(function(){
 if($(this).prop("checked")) {
 $("[data-valmsg-for='Location']").hide();
 } else {
 $("[data-valmsg-for='Location']").show();
 }
 });

 /!*=============================Start: Custom Factory Function ================================*!/

 $scope.FirsText = function($event){
 characterService.characterFunction($event);
 };

 $scope.isNumberKey = function($event){
 characterService.numberFunction($event);
 };

 $scope.isCodeKey = function($event){
 characterService.codeFunction($event);
 };




 /!*=============================End: Custom Factory Function ================================*!/



 /!*===============================console data function start ==================================*!/

 $scope.post = function (id) {

 // console.log("job data got is",$scope.job)
 //   console.log("certification",$scope.certificationMessages);
 // console.log("tech ques",$scope.questionnaire);
 // console.log("non tech ques",$scope.questionnaire1);

 var certificationarray = [];
 var techArray = [];
 var nonTechArray = [];
 angular.forEach($scope.certificationMessages, function (value) {
 certificationarray.push(value);
 });
 angular.forEach($scope.questionnaire, function (value) {
 techArray.push(value);
 });
 angular.forEach($scope.questionnaire1, function (value) {
 nonTechArray.push(value);
 });

 // console.log("certification",certificationarray);
 //   console.log("tech ques",techArray);
 //   console.log("non tech ques",nonTechArray);


 $scope.postNowData = {};
 $scope.postNowData.jobTitle=$scope.job.jobTitle;
 $scope.postNowData.jobDescription=$scope.job.jobDescription;

 $scope.postNowData.aggregatedScore = {};
 $scope.postNowData.quantitativeScore = {};
 $scope.postNowData.qualitativeScore = {};

 $scope.postNowData.aggregatedScore.min=$scope.job.aggregatedScore;
 $scope.postNowData.aggregatedScore.max=1580;
 $scope.postNowData.quantitativeScore.min=$scope.job.quantativeScore;
 $scope.postNowData.quantitativeScore.max=500;
 $scope.postNowData.qualitativeScore.min=$scope.job.qualitativeScore;
 $scope.postNowData.qualitativeScore.max=1080;

 if ($scope.job.commute == "true")
 $scope.postNowData.canCommute= true;
 else
 $scope.postNowData.canCommute= false;

 $scope.postNowData.workExperience={};

 if($scope.job.workExp.indexOf('>') > -1) {
 var workEx = $scope.job.workExp.split(">");
 console.log(workEx);
 $scope.postNowData.workExperience.min = workEx[1];
 $scope.postNowData.workExperience.max = 50;

 }
 else{

 var workEx = $scope.job.workExp.split("-");
 $scope.postNowData.workExperience.min = workEx[0];
 $scope.postNowData.workExperience.max = workEx[1];
 }

 $scope.postNowData.annualCompensation = {};

 if($scope.job.salary.indexOf('>') > -1) {
 var salaryArray = $scope.job.salary.split(">");
 console.log(salaryArray);
 $scope.postNowData.annualCompensation.min = salaryArray[1];
 $scope.postNowData.annualCompensation.max = 200000;

 }
 else{

 var salaryArray = $scope.job.salary.split(" - ");
 $scope.postNowData.annualCompensation.min = salaryArray[0];
 $scope.postNowData.annualCompensation.max = salaryArray[1];
 }

 // $scope.postNowData.annualCompensation.min=$scope.job.minSalary;
 // $scope.postNowData.annualCompensation.max=$scope.job.maxSalary;
 $scope.postNowData.state=$scope.job.currentState.stateName;
 $scope.postNowData.country=$scope.job.currentCountry.countryName;
 $scope.postNowData.zipCode=$scope.job.zipCode;
 // $scope.postNowData.areaName=$scope.job.areaName;
 $scope.postNowData.industryID=$scope.job.industry._id;
 $scope.postNowData.industryName=$scope.job.industry.industryName;
 $scope.postNowData.functionalAreaID=$scope.job.function._id;
 $scope.postNowData.functionalAreaName=$scope.job.function.functionalAreaName;
 $scope.postNowData.postedOn=$scope.job.postedOn;
 $scope.postNowData.date=$scope.job.date;


 var d = new Date();
 $scope.postNowData.timeOffset=  d.getTimezoneOffset();



 if(id==1){
 $scope.postNowData.postLater= false;
 }

 else
 {
 $scope.postNowData.postLater= true;
 }


 $scope.postNowData.underGraduate=$scope.job.ugQualifications.courseName;

 if($scope.job.pgQualifications != undefined)
 $scope.postNowData.postGraduate=$scope.job.pgQualifications.courseName;


 if(certificationarray.length != 0)
 $scope.postNowData.certification=certificationarray.toString();     //array

 $scope.postNowData.companyName=$scope.job.positionAt;
 $scope.postNowData.isNameConfidential=$scope.job.confidential;
 $scope.postNowData.contactPerson=$scope.job.contactPerson;
 $scope.postNowData.contactEmail=$scope.job.contactEmail;
 $scope.postNowData.contactNumber=$scope.job.contactNumber;

 $scope.postNowData.technicalQuestions=techArray;       //array
 $scope.postNowData.nonTechnicalQuestions=nonTechArray;     //array

 // console.log($scope.postNowData);

 localStorage.setItem("JobDetails",JSON.stringify($scope.postNowData));

 localStorage.setItem("isJob",JSON.stringify($scope.job));
 localStorage.setItem("iscertiarray",JSON.stringify($scope.certificationList));
 localStorage.setItem("istecharray",JSON.stringify($scope.questionList));
 localStorage.setItem("isnontecharray",JSON.stringify($scope.questionList1));

 //  console.log("local storage",JSON.parse(localStorage.getItem("JobDetails")));

 if(id==1){

 $state.go('home.postNow');
 }
 else{
 console.log("going to post later");
 $state.go('home.postLater');
 }

 /!*$http({
 method:'POST',
 url: CONSTANT.apiUrl +'/api/recruiter/createJob',
 headers:{
 authorization: $cookieStore.get('AccessToken')
 },
 data:$scope.postNowData
 })
 .success(function (response) {
 console.log("response success",response.data);

 })
 .error(function (response) {
 console.log("response error",response);

 })*!/



 }
 /!*===============================console data function end ==================================*!/

 /!*============================= Start: Key Skills Section ================================*!/

 $scope.instruct = function(){
 $scope.tips = true;
 $timeout(function(){
 $scope.tips = false;
 },5000);
 }

 /!*============================= End: Key Skills Section ================================*!/


 $( function() {
 $( "#datepicker" ).datepicker();
 } );
 /!*=============================Start: Call Get Country list API ================================*!/

 $http({
 method:'GET',
 url: CONSTANT.apiUrl + '/api/common/getDropDownData'
 })
 .success(function(response){
 console.log(response);
 $scope.workExperience = response.data.ExperienceList;
 $scope.salaryList =  response.data.SalaryList;
 $scope.countryLists = response.data.countryList;
 $scope.industriesList = response.data.industryList;
 $scope.GraduationList = response.data.Graduation;
 $scope.PostGraduationList = response.data.PostGraduation;

 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 $rootScope.loading = false;
 }
 console.log(response);
 })

 /!*=============================End: Call Get Country list API ================================*!/

 /!*============================= Start: Call Get State Name and Country Code ================================*!/


 $scope.getCountryID = function(response){
 $scope.selectedCountryID = response._id;
 //  console.log($scope.job.countryCode);
 $scope.job.countryCode = response.countryCode;
 //  console.log($scope.job.countryCode);
 $scope.count = {
 countryID:$scope.selectedCountryID
 }

 $http({
 method:'GET',
 url: CONSTANT.apiUrl +'/api/common/getStateList',
 params:$scope.count
 })
 .success(function(response){
 console.log(response);
 $scope.stateRefinedList = response.data;
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 $rootScope.loading = false;
 }
 console.log(response);
 })
 }

 /!*============================= End: Call Get State Name and Country Code ================================*!/


 /!*============================= Start: Call Get zip code ================================*!/


 $scope.getZipCode = function(response){
 // console.log(response._id);
 $scope.selectedStateID = response._id;
 console.log($scope.job.currentState.stateName);
 $scope.state = {
 stateID:$scope.selectedStateID
 };

 $http({
 method:'GET',
 url: CONSTANT.apiUrl +'/api/common/getZipCodeList',
 params:$scope.state
 })
 .success(function(response){
 console.log(response);
 $scope.zipCodeList = response.data;
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 }
 console.log(response);
 })
 }

 /!*============================= End: Call Get zip code ================================*!/

 /!*============================= Start: Call Get Function Area ================================*!/


 $scope.findFunctionalArea = function(response){
 $scope.selectedIndustryID = response._id;

 $scope.funct = {
 industryID:$scope.selectedIndustryID
 }

 $http({
 method:'GET',
 url: CONSTANT.apiUrl +'/api/common/getFunctionalAreaList',
 params:$scope.funct
 })
 .success(function(response){
 console.log(response);
 $scope.functionalAreaRefinedList = response.data;
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 }
 console.log(response);
 })
 }

 /!*============================= End:  Call Get Function Area ================================*!/

 }]);
 */


/*
 version 1




 angular.module('Cviq').controller('createNewJobCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window',
 function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){


 if($cookieStore.get('AccessToken') == undefined){
 $scope.confirmLogOut();
 }

 $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 $scope.phoneRegex = /^[1-9]{1}[0-9]{9}$/;
 $scope.otp;
 $scope.phoneVerify = false;
 $scope.linkedinData;
 $scope.year;
 $scope.month;
 $scope.questions = false;
 $scope.certificates = false;
 $scope.job.confidential= false;

 var monthNames = [
 "January", "February", "March",
 "April", "May", "June", "July",
 "August", "September", "October",
 "November", "December"
 ];
 var monthNo = [
 "01", "02", "03",
 "04", "05", "06", "07",
 "08", "09", "10",
 "11", "12"
 ];
 var dayno = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];

 var date = new Date();
 var dayIndex = date.getDate();
 var monthIndex = date.getMonth();
 var year = date.getFullYear();

 // console.log(dayno[dayIndex-1], monthNames[monthIndex], year);
 //  console.log(dayno[dayIndex-1], monthNo[monthIndex], year);
 $scope.job.date=dayno[dayIndex-1] + '-' + monthNames[monthIndex] + '-' + year;
 $scope.job.postedOn=year + '-' + monthNo[monthIndex]+ '-' +dayno[dayIndex-1];
 //  console.log( typeof($scope.job.postedOn));



 /!*================================Start : my date time calander=========================================*!/

 $( function() {
 $( "#datepicker1" ).datepicker({
 format: 'dd-MM-yyyy',
 startDate:new Date(),
 autoclose: true
 });
 } );

 /!*================================End : my date time calander=========================================*!/

 // $scope.workExperience = [ '0 to 3','3 to 6','6 to 9','9 to 12','12 to 15','> 15' ];
 // $scope.salaryList = ['$ 10000 to $ 15000','$ 15000 to $ 20000','$ 20000 to $ 25000','$ 25000 to $ 30000','$ 30000 to $ 35000','$ 35000 to $ 40000','$ 40000 to $ 45000','$ 45000 to $ 50000','> $ 50000',]
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);

 $scope.certificationList = [];
 $scope.certificationMessages = {};
 var d ={
 id: $scope.certificationList.length+ 1,
 };
 $scope.certificationList.push(d);


 /!*=============================Start :add more function for certification================================*!/
 $scope.addMoreCertificates = function () {
 var data1 ={
 id: $scope.certificationList.length+ 1,
 };
 $scope.certificationList.push(data1);
 if($scope.certificationList.length >=5){

 $scope.certificates = true;
 }

 };

 /!*=============================End : add more function for certification ================================*!/

 $scope.questionList = [];
 $scope.questionnaire = {};
 var q ={
 id: $scope.questionList.length+ 1,
 };
 $scope.questionList.push(q);


 /!*=============================Start :add more function for tech questions================================*!/
 $scope.addMoreTechQuestions = function () {

 var q ={
 id: $scope.questionList.length+ 1,
 };
 $scope.questionList.push(q);
 if($scope.questionList1.length + $scope.questionList.length>=5){

 // $('#techQuestions').prop('disabled', true);
 // $('#nonTechQuestions').prop('disabled', true);
 $scope.questions = true;
 }

 };

 /!*=============================End : add more function for tech questions ================================*!/
 $scope.questionList1 = [];
 $scope.questionnaire1 = {};
 var q1 ={
 id: $scope.questionList1.length+ 1,
 };
 $scope.questionList1.push(q1);


 /!*=============================Start :add more function for non Tech questions================================*!/
 $scope.addMoreNonTechQuestions = function () {

 var q ={
 id: $scope.questionList1.length+ 1,
 };
 $scope.questionList1.push(q);
 console.log($scope.questionList1.length + $scope.questionList.length);
 if($scope.questionList1.length + $scope.questionList.length>=5){

 // $('#techQuestions').prop('disabled', true);
 // $('#nonTechQuestions').prop('disabled', true);
 $scope.questions = true;
 }

 };

 /!*=============================End : add more function for non Tech questions ================================*!/

 /!*=============================Start: Pop Validation Function ================================*!/

 $scope.validCheck = function(){

 if($('#onPhoneNumder').prop("checked") || $('#onEmail').prop("checked")) {
 $("[data-valmsg-for='Otp']").hide();
 } else {
 $("[data-valmsg-for='Otp']").show();
 }
 }

 /!*=============================End: Pop Validation Function ================================*!/


 $('#terms').change(function(){
 if($(this).prop("checked")) {
 $("[data-valmsg-for='Location']").hide();
 } else {
 $("[data-valmsg-for='Location']").show();
 }
 });

 /!*=============================Start: Custom Factory Function ================================*!/

 $scope.FirsText = function($event){
 characterService.characterFunction($event);
 };

 $scope.isNumberKey = function($event){
 characterService.numberFunction($event);
 };

 $scope.isCodeKey = function($event){
 characterService.codeFunction($event);
 };




 /!*=============================End: Custom Factory Function ================================*!/



 /!*===============================console data function start ==================================*!/

 $scope.post = function (id) {

 // console.log("job data got is",$scope.job)
 //   console.log("certification",$scope.certificationMessages);
 // console.log("tech ques",$scope.questionnaire);
 // console.log("non tech ques",$scope.questionnaire1);

 var certificationarray = [];
 var techArray = [];
 var nonTechArray = [];
 angular.forEach($scope.certificationMessages, function (value) {
 certificationarray.push(value);
 });
 angular.forEach($scope.questionnaire, function (value) {
 techArray.push(value);
 });
 angular.forEach($scope.questionnaire1, function (value) {
 nonTechArray.push(value);
 });

 // console.log("certification",certificationarray);
 //   console.log("tech ques",techArray);
 //   console.log("non tech ques",nonTechArray);


 $scope.postNowData = {};
 $scope.postNowData.jobTitle=$scope.job.jobTitle;
 $scope.postNowData.jobDescription=$scope.job.jobDescription;

 $scope.postNowData.aggregatedScore = {};
 $scope.postNowData.quantitativeScore = {};
 $scope.postNowData.qualitativeScore = {};

 $scope.postNowData.aggregatedScore.min=$scope.job.aggregatedScore;
 $scope.postNowData.aggregatedScore.max=1580;
 $scope.postNowData.quantitativeScore.min=$scope.job.quantativeScore;
 $scope.postNowData.quantitativeScore.max=500;
 $scope.postNowData.qualitativeScore.min=$scope.job.qualitativeScore;
 $scope.postNowData.qualitativeScore.max=1080;

 if ($scope.job.commute == "true")
 $scope.postNowData.canCommute= true;
 else
 $scope.postNowData.canCommute= false;

 $scope.postNowData.workExperience={};

 if($scope.job.workExp.indexOf('>') > -1) {
 var workEx = $scope.job.workExp.split(">");
 console.log(workEx);
 $scope.postNowData.workExperience.min = workEx[1];
 $scope.postNowData.workExperience.max = 50;

 }
 else{

 var workEx = $scope.job.workExp.split("-");
 $scope.postNowData.workExperience.min = workEx[0];
 $scope.postNowData.workExperience.max = workEx[1];
 }

 $scope.postNowData.annualCompensation = {};

 if($scope.job.salary.indexOf('>') > -1) {
 var salaryArray = $scope.job.salary.split(">");
 console.log(salaryArray);
 $scope.postNowData.annualCompensation.min = salaryArray[1];
 $scope.postNowData.annualCompensation.max = 200000;

 }
 else{

 var salaryArray = $scope.job.salary.split(" - ");
 $scope.postNowData.annualCompensation.min = salaryArray[0];
 $scope.postNowData.annualCompensation.max = salaryArray[1];
 }

 // $scope.postNowData.annualCompensation.min=$scope.job.minSalary;
 // $scope.postNowData.annualCompensation.max=$scope.job.maxSalary;
 $scope.postNowData.state=$scope.job.currentState.stateName;
 $scope.postNowData.country=$scope.job.currentCountry.countryName;
 $scope.postNowData.zipCode=$scope.job.zipCode;
 // $scope.postNowData.areaName=$scope.job.areaName;
 $scope.postNowData.industryID=$scope.job.industry._id;
 $scope.postNowData.industryName=$scope.job.industry.industryName;
 $scope.postNowData.functionalAreaID=$scope.job.function._id;
 $scope.postNowData.functionalAreaName=$scope.job.function.functionalAreaName;
 $scope.postNowData.postedOn=$scope.job.postedOn;
 $scope.postNowData.date=$scope.job.date;


 var d = new Date();
 $scope.postNowData.timeOffset=  d.getTimezoneOffset();



 if(id==1){
 $scope.postNowData.postLater= false;
 }

 else
 {
 $scope.postNowData.postLater= true;
 }


 $scope.postNowData.underGraduate=$scope.job.ugQualifications.courseName;

 if($scope.job.pgQualifications != undefined)
 $scope.postNowData.postGraduate=$scope.job.pgQualifications.courseName;


 if(certificationarray.length != 0)
 $scope.postNowData.certification=certificationarray.toString();     //array

 $scope.postNowData.companyName=$scope.job.positionAt;
 $scope.postNowData.isNameConfidential=$scope.job.confidential;
 $scope.postNowData.contactPerson=$scope.job.contactPerson;
 $scope.postNowData.contactEmail=$scope.job.contactEmail;
 $scope.postNowData.contactNumber=$scope.job.contactNumber;

 $scope.postNowData.technicalQuestions=techArray;       //array
 $scope.postNowData.nonTechnicalQuestions=nonTechArray;     //array

 // console.log($scope.postNowData);

 localStorage.setItem("JobDetails",JSON.stringify($scope.postNowData));

 //  console.log("local storage",JSON.parse(localStorage.getItem("JobDetails")));

 if(id==1){

 $state.go('home.postNow');
 }
 else{
 console.log("going to post later");
 $state.go('home.postLater');
 }

 /!*$http({
 method:'POST',
 url: CONSTANT.apiUrl +'/api/recruiter/createJob',
 headers:{
 authorization: $cookieStore.get('AccessToken')
 },
 data:$scope.postNowData
 })
 .success(function (response) {
 console.log("response success",response.data);

 })
 .error(function (response) {
 console.log("response error",response);

 })*!/



 }
 /!*===============================console data function end ==================================*!/

 /!*============================= Start: Key Skills Section ================================*!/

 $scope.instruct = function(){
 $scope.tips = true;
 $timeout(function(){
 $scope.tips = false;
 },5000);
 }

 /!*============================= End: Key Skills Section ================================*!/


 $( function() {
 $( "#datepicker" ).datepicker();
 } );
 /!*=============================Start: Call Get Country list API ================================*!/

 $http({
 method:'GET',
 url: CONSTANT.apiUrl + '/api/common/getDropDownData'
 })
 .success(function(response){
 console.log(response);
 $scope.workExperience = response.data.ExperienceList;
 $scope.salaryList =  response.data.SalaryList;
 $scope.countryLists = response.data.countryList;
 $scope.industriesList = response.data.industryList;
 $scope.GraduationList = response.data.Graduation;
 $scope.PostGraduationList = response.data.PostGraduation;

 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 $rootScope.loading = false;
 }
 console.log(response);
 })

 /!*=============================End: Call Get Country list API ================================*!/

 /!*============================= Start: Call Get State Name and Country Code ================================*!/


 $scope.getCountryID = function(response){
 $scope.selectedCountryID = response._id;
 //  console.log($scope.job.countryCode);
 $scope.job.countryCode = response.countryCode;
 //  console.log($scope.job.countryCode);
 $scope.count = {
 countryID:$scope.selectedCountryID
 }

 $http({
 method:'GET',
 url: CONSTANT.apiUrl +'/api/common/getStateList',
 params:$scope.count
 })
 .success(function(response){
 console.log(response);
 $scope.stateRefinedList = response.data;
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 $rootScope.loading = false;
 }
 console.log(response);
 })
 }

 /!*============================= End: Call Get State Name and Country Code ================================*!/


 /!*============================= Start: Call Get zip code ================================*!/


 $scope.getZipCode = function(response){
 // console.log(response._id);
 $scope.selectedStateID = response._id;
 console.log($scope.job.currentState.stateName);
 $scope.state = {
 stateID:$scope.selectedStateID
 };

 $http({
 method:'GET',
 url: CONSTANT.apiUrl +'/api/common/getZipCodeList',
 params:$scope.state
 })
 .success(function(response){
 console.log(response);
 $scope.zipCodeList = response.data;
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 }
 console.log(response);
 })
 }

 /!*============================= End: Call Get zip code ================================*!/

 /!*============================= Start: Call Get Function Area ================================*!/


 $scope.findFunctionalArea = function(response){
 $scope.selectedIndustryID = response._id;

 $scope.funct = {
 industryID:$scope.selectedIndustryID
 }

 $http({
 method:'GET',
 url: CONSTANT.apiUrl +'/api/common/getFunctionalAreaList',
 params:$scope.funct
 })
 .success(function(response){
 console.log(response);
 $scope.functionalAreaRefinedList = response.data;
 $timeout(function(){
 $('.selectpicker').selectpicker('refresh');
 },0);
 })
 .error(function(response){
 if(response.statusCode == 401){
 $scope.confirmLogOut();
 }
 console.log(response);
 })
 }

 /!*============================= End:  Call Get Function Area ================================*!/

 }]);*/
