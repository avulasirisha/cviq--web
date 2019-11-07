
angular.module('Cviq').controller('signupCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window',
    function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){



        if($cookieStore.get('AccessToken')!=undefined){
            console.log("you are already logged in");
            $state.go('home.package');
        }

    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.phoneRegex = /^[1-9]{1}[0-9]{9}$/;
        $scope.otp;
    $scope.phoneVerify = false;
    $scope.linkedinData;
    $scope.year;
    $scope.month;

    $timeout(function(){
        $('.selectpicker').selectpicker();
    },0);

    /*=============================Start: Get Passcode Function ================================*/

    $scope.openPopup = function () {

        if (($('#areaCode').val() == "") || ($('.phone').val() == "") || ($('.phone').val().length < 10) ||($('.mail').val() == "")|| $scope.signupForm.email.$error.pattern)
        {
            ngDialog.open({
                template: 'passcodeId',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByEscape:false,
                closeByDocument:false
            });
        }
        else{
            ngDialog.open({
                template: 'templateId',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByEscape:false,
                closeByDocument:false
            });
        }

    };

    /*=============================End: Get Passcode Function ================================*/

    /*=============================Start: Generate Passcode Function ================================*/

    $scope.genPasscode = function(regData){

        console.log("generate passcode",regData);
        if($('#onPhoneNumder').is(':checked') || $('#onEmail').is(':checked')) {

            if ($('#onPhoneNumder').is(':checked')) {
                $scope.phoneVerify = true;
            }
            else {
                $scope.phoneVerify = false;
            }

            $http({
                method: 'POST',
                url: CONSTANT.apiUrl + '/api/phoneVerification/generateOTP',
                data: {
                    "email": regData.email,
                    "countryCode": regData.countryCode,
                    "phoneNo": regData.mobileNumber,
                    "duringRegister": true,
                    "verifyThroughPhone": $scope.phoneVerify,
                    "userType": "RECRUITER"

                }
            })
                .success(function (response) {
                    console.log("success", response);
                    // ngDialog.open({
                    //     template: 'OTPsent',
                    //     className: 'ngdialog-theme-default',
                    //     scope: $scope,
                    //     closeByEscape:false,
                    //     closeByDocument:false
                    // });
                    bootbox.alert("Passcode has been sent.");
                    $scope.otp = response.data.OTP;
                })
                .error(function (response) {
                    console.log("error", response);
                    bootbox.alert(response.message );
                });

            ngDialog.close();

        }
        else{
            $scope.valCheck = "This Field is Required";
        }
    };

    /*=============================End: Generate Passcode Function ================================*/

    /*=============================Start: Pop Validation Function ================================*/

    $scope.validCheck = function(){

        if($('#onPhoneNumder').prop("checked") || $('#onEmail').prop("checked")) {
            $("[data-valmsg-for='Otp']").hide();
        } else {
            $("[data-valmsg-for='Otp']").show();
        }
    }

    /*=============================End: Pop Validation Function ================================*/

    /*=============================Start: Signup Function ================================*/

    //$scope.keySkillsArray = [];

    $scope.signup = function (regData) {
        console.log("country code",regData.countryCode);
        $rootScope.loading = true;

        // if($scope.keySkillsArray.indexOf(regData.keySkills) == -1){
        //     $scope.keySkillsArray.push(regData.keySkills);
        // }

        // $scope.totalExperience = parseInt($scope.year)+"."+parseInt($scope.month);

        if($('#terms').is(':checked')){

            if($scope.linkedinData == undefined){

                var registerData = new FormData();
                registerData.append("firstName", regData.firstName);
                registerData.append("lastName", regData.lastName);
                registerData.append("countryCode", regData.countryCode);
                registerData.append("phoneNo", regData.mobileNumber);
                registerData.append("OTP", $scope.otp);
                registerData.append("email", regData.email);
                registerData.append("password", regData.password);
                registerData.append("currentCountry", regData.currentCountry.countryName);
                registerData.append("currentState", regData.currentState);
                registerData.append("companyName", regData.companyName);
               // registerData.append("industryID", regData.industry._id);
               // registerData.append("functionalAreaID", $scope.selectedFunctionalAreaID);
               // registerData.append("totalExperience", $scope.totalExperience);
                //registerData.append("keySkills", $scope.keySkillsArray);
                registerData.append("deviceToken", "string");
                registerData.append("referralCode", regData.referralCode);
               // registerData.append("receiveAlerts", true);
                registerData.append("verifyThroughPhone", $scope.phoneVerify);
                registerData.append("deviceType", "WEB");

                console.log("registerData",registerData);
                $http({
                    method:'POST',
                    url:CONSTANT.apiUrl + '/api/recruiter/registerRecruiter',
                    data:registerData,
                    headers:{
                        'Content-type': undefined
                    }
                })
                    .success(function (response) {
                        $rootScope.loading = false;
                        console.log("success", response);
                        bootbox.alert(response.message);
                        $state.go('home.login');
                    })
                    .error(function(response){
                        $rootScope.loading = false;
                        console.log("error", response);
                        bootbox.alert(response.message);
                    })

            }
            else{

                var registerData = new FormData();
                registerData.append("firstName", regData.firstName);
                registerData.append("lastName", regData.lastName);
                registerData.append("countryCode", regData.countryCode);
                registerData.append("phoneNo", regData.mobileNumber);
                registerData.append("email", regData.email);
                registerData.append("currentCountry", regData.currentCountry.countryName);
                registerData.append("currentState", regData.currentState);
                //registerData.append("industryID", regData.industry._id);
                //registerData.append("functionalAreaID", $scope.selectedFunctionalAreaID);
                //registerData.append("totalExperience", $scope.totalExperience);
                //registerData.append("keySkills", $scope.keySkillsArray);
                registerData.append("deviceToken", "string");
                registerData.append("referralCode", regData.referralCode);
               // registerData.append("receiveAlerts", true);
                registerData.append("deviceType", "WEB");
                registerData.append("linkedInId", $scope.linkedinData.id);

                $http({
                    method:'POST',
                    url:CONSTANT.apiUrl + '/api/recruiter/registerRecruiterViaLinkedIn',
                    data:registerData,
                    headers:{
                        'Content-type': undefined
                    }
                })
                    .success(function (response) {
                        $rootScope.loading = false;
                        console.log("successLink hai", response);
                        bootbox.alert(response.message);
                        $state.go('home.login');
                    })
                    .error(function(response){
                        $rootScope.loading = false;
                        console.log("errorLink", response);
                        bootbox.alert(response.message);
                    })
            }

        }

        else{
            $rootScope.loading = false;
            $scope.authErrorCheck = "This Field is Required";
        }
    };

    /*=============================End: Signup Function ================================*/

    $('#terms').change(function(){
        if($(this).prop("checked")) {
            $("[data-valmsg-for='Location']").hide();
        } else {
            $("[data-valmsg-for='Location']").show();
        }
    });

    /*=============================Start: Resend Passcode Function ================================*/

    $scope.resendPasscode = function(regData){
        $rootScope.loading = true;

        $http({
            method:'PUT',
            url:CONSTANT.apiUrl + '/api/phoneVerification/resendOTP',
            data:{
                "email": regData.email,
                "countryCode": regData.countryCode,
                "phoneNo": regData.mobileNumber,
                "duringRegister": true,
                "verifyThroughPhone": $scope.phoneVerify,
                "userType": "RECRUITER"

            }
        })
            .success(function (response) {
                $rootScope.loading = false;
                console.log("success resend otp", response);
                if(response.statusCode == 200){
                    bootbox.alert("Passcode sent to your Email.");
                }
            })
            .error(function(response){
                $rootScope.loading = false;
                console.log("error resend otp", response);
                bootbox.alert(response.message);
            });

    };

    /*=============================End: Resend Passcode Function ================================*/

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

    /*=============================End: Custom Factory Function ================================*/
        $scope.closeOTP = function () {
            ngDialog.close();

        }

    /*=============================Start: Signup Via LinkedIn Function ================================*/

    $scope.liAuth = function(){
        $rootScope.loading = true;
        $timeout(function(){
            $rootScope.loading = false;
        },1000);

        IN.User.authorize(function(){
            console.log("Inside");
            $scope.onLinkedInLoad();
        });
    };

    $scope.onLinkedInLoad = function() {
        console.log("inside onlinkedinload");
        IN.Event.on(IN, "auth", $scope.getProfileData());
    };

    $scope.getProfileData = function () {

        console.log("insidegetprofiledata");
        IN.API.Raw("/people/~:(id,first-name,last-name,email-address,location,phone-numbers,num-connections,picture-url)?format=json").result(onSuccess).error(onError);
    };

    function onSuccess(data){
        console.log("Success", data);
        $scope.PassField = true;
        $("#mail").prop("readonly", true);
        $scope.codeClass = "fullWidth";
        $scope.linkedinData = data;

        $timeout(function(){

            $scope.register = {
                firstName:$scope.linkedinData.firstName,
                lastName:$scope.linkedinData.lastName,
                email:$scope.linkedinData.emailAddress
            }

            IN.User.logout(function () {
                console.log("User logged out of LinkedIn");
            });

        }, 500);

    }

    function onError(error){
        console.log("Error", error);
    }

    /*=============================Start: Signup Via LinkedIn Function ================================*/


    /*============================= Start: Custom Dropdown Plugin ================================*/

   /* if($scope.year == undefined || $scope.month == undefined){
        $scope.place = true;
    }


    $scope.calculateYear = function(){
        $scope.place = false;
        console.log($scope.year);
        if($scope.year <= 1){
            $scope.expYear = $scope.year +' year'
        }
        else{
            $scope.expYear = $scope.year +' years'
        }

    }

    $scope.calculateMonth = function(){
        $scope.place = false;
        console.log($scope.month);
        if($scope.month <= 1){
            $scope.expMonth = $scope.month +' month'
        }
        else{
            $scope.expMonth = $scope.month +' months'
        }

    }*/

    /*============================= End: Custom Dropdown Plugin ================================*/

    /*============================= Start: Key Skills Section ================================*/

    $scope.instruct = function(){
        $scope.tips = true;
        $timeout(function(){
            $scope.tips = false;
        },5000);
    }

    /*============================= End: Key Skills Section ================================*/



    /*=============================Start: Call Get Country list API ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log(response);
            $scope.countryLists = response.data.countryList;
            $scope.industriesList = response.data.industryList;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function(response){
            console.log(response);
        })

    /*=============================End: Call Get Country list API ================================*/

    /*============================= Start: Call Get State Name and Country Code ================================*/


   $scope.getCountryID = function(response){
        $scope.selectedCountryID = response._id;
        $scope.register.countryCode = response.countryCode;

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
                console.log(response);
            })
    }

    /*============================= End: Call Get State Name and Country Code ================================*/

    /*============================= Start: Call Get Function Area ================================*/


    /*$scope.findFunctionalArea = function(response){
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
                console.log(response);
            })
    }*/

    /*============================= End:  Call Get Function Area ================================*/



    /*============================= Start: Get Country, State, Code, Industry, Functional Area ================================*/

    //$scope.stateLists;
    //$scope.functionalAreaLists;
    //
    //$http({
    //    method:'GET',
    //    url: CONSTANT.apiUrl + '/api/candidate/getIndustryFunctionalAreaList'
    //})
    //    .success(function(response){
    //        console.log('Success', response);
    //        $scope.countryLists = response.data.countryList;
    //        $scope.stateLists = response.data.stateList;
    //        $scope.industryLists = response.data.industryList;
    //        $scope.functionalAreaLists = response.data.functionalAreaList;
    //        $timeout(function(){
    //            $('.selectpicker').selectpicker('refresh');
    //        },0);
    //
    //    })
    //    .error(function(response){
    //        console.log('Error', response);
    //    })
    //
    //$scope.count = function(){
    //    $scope.stateRefinedList = [];
    //    $scope.countryCodes =  $scope.register.currentCountry._id;
    //    if($scope.countryCodes != undefined || $scope.countryCodes != '')
    //    {
    //        $('#current-state').attr('disabled', false);
    //    }
    //    $scope.register.countryCode =  $scope.register.currentCountry.countryCode;
    //    _.forEach($scope.stateLists, function(value, key){
    //        if($scope.countryCodes == value.countryID){
    //            $scope.stateRefinedList.push(value.stateName);
    //            console.log($scope.stateRefinedList);
    //            $timeout(function(){
    //                $('.selectpicker').selectpicker('refresh');
    //            },0);
    //        }
    //
    //    })
    //}
    //
    //$scope.findFunctionalArea = function(){
    //    $scope.functionalAreaRefinedList = [];
    //    $scope.selectedIndustry =  $scope.register.industry._id;
    //    if($scope.selectedIndustry != undefined || $scope.selectedIndustry != '')
    //    {
    //        $('#functional-area').attr('disabled', false);
    //    }
    //    _.forEach($scope.functionalAreaLists, function(value, key){
    //        if($scope.selectedIndustry == value.industryID){
    //            $scope.functionalAreaRefinedList.push(value.functionalAreaName);
    //            $scope.selectedFunctionalAreaID = value._id;
    //            console.log($scope.functionalAreaRefinedList);
    //            $timeout(function(){
    //                $('.selectpicker').selectpicker('refresh');
    //            },0);
    //        }
    //
    //    })
    //}


    //$scope.stateLists;
    //$scope.functionalAreaLists;
    //
    //$http({
    //    method:'GET',
    //    url: CONSTANT.apiUrl + '/api/candidate/getIndustryFunctionalAreaList'
    //})
    //    .success(function(response){
    //        console.log('Success', response);
    //        $scope.countryLists = response.data.countryList;
    //        $scope.stateLists = response.data.stateList;
    //        $scope.industryLists = response.data.industryList;
    //        $scope.functionalAreaLists = response.data.functionalAreaList;
    //        $timeout(function(){
    //            $('.selectpicker').selectpicker('refresh');
    //        },0);
    //
    //    })
    //    .error(function(response){
    //        console.log('Error', response);
    //    })
    //
    //$scope.count = function(){
    //    $scope.stateRefinedList = [];
    //    $scope.countryCodes =  $scope.register.currentCountry._id;
    //    if($scope.countryCodes != undefined || $scope.countryCodes != '')
    //    {
    //        $('#current-state').attr('disabled', false);
    //    }
    //    $scope.register.countryCode =  $scope.register.currentCountry.countryCode;
    //    _.forEach($scope.stateLists, function(value, key){
    //        if($scope.countryCodes == value.countryID){
    //            $scope.stateRefinedList.push(value.stateName);
    //            console.log($scope.stateRefinedList);
    //            $timeout(function(){
    //                $('.selectpicker').selectpicker('refresh');
    //            },0);
    //        }
    //
    //    })
    //}
    //
    //$scope.findFunctionalArea = function(){
    //    $scope.functionalAreaRefinedList = [];
    //    $scope.selectedIndustry =  $scope.register.industry._id;
    //    if($scope.selectedIndustry != undefined || $scope.selectedIndustry != '')
    //    {
    //        $('#functional-area').attr('disabled', false);
    //    }
    //    _.forEach($scope.functionalAreaLists, function(value, key){
    //        if($scope.selectedIndustry == value.industryID){
    //            $scope.functionalAreaRefinedList.push(value.functionalAreaName);
    //            $scope.selectedFunctionalAreaID = value._id;
    //            console.log($scope.functionalAreaRefinedList);
    //            $timeout(function(){
    //                $('.selectpicker').selectpicker('refresh');
    //            },0);
    //        }
    //
    //    })
    //}


    //$scope.functionalAreaRefinedList = {};
    //
    //$scope.findFunctionalArea = function(){
    //    $scope.selectedIndustry =  $scope.register.industry._id;
    //    _.forEach($scope.functionalAreaLists, function(value, key){
    //        if($scope.selectedIndustry == value.industryID){
    //            $scope.functionalAreaRefinedList = {
    //                areaName:value.functionalAreaName,
    //                areaID:value._id
    //            }
    //            console.log("asdasd", $scope.functionalAreaRefinedList);
    //            $timeout(function(){
    //                $('.selectpicker').selectpicker('refresh');
    //            },0);
    //        }
    //
    //    })
    //}


}]);