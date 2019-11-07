angular.module('Cviq').controller('signupCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    if($cookieStore.get('AccessToken') != undefined){
        $state.go('home.dashboard.aggregatedScore');
    }
    //$scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //$scope.expInYears = [];
    //
    //for(var i = 1; i <= 20; i++){
    //    $scope.expInYears.push(i);
    //}
    //console.log('yearArray', $scope.expInYears);

    $scope.myregex = "^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,}))@"
        + "((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\."
        + "([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|"
        + "([a-zA-Z]+[\\w-]+\\.)+[a-zA-Z]{2,4})$";

    //Password Regrex : Password must contain at least 6 characters with one upper case letter, one lower case letter, one special character and one numeric digit.

    $scope.passwordRegex = "(?=^.{6,30}$)(?=.*\d)(?=.*[a-z,A-Z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;&quot;:;'?/&gt;.&lt;,]).*$";


    $scope.otp;
    $scope.phoneVerify = false;
    $scope.linkedinData;
    $scope.year;
    $scope.month;

    $('#current-state').attr('disabled', true);
    $('#current-zip').attr('disabled', true);
    $('#areaCode').attr('disabled', true);
    $('#functional-area').attr('disabled', true);

    $timeout(function(){
        $('.selectpicker').selectpicker();
    },0);

    //$('body').bind('cut copy paste', function (e) {
    //    e.preventDefault();
    //});

    /*=============================Start: Get Passcode Function ================================*/

    $scope.openPopup = function () {

        if (($('#areaCode').val() == "") || ($('.phone').val() == "") || ($('.mail').val() == ""))
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
        $('#current-state').attr('disabled', false);
        $scope.zipCodeList = [];
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

    /*============================= Start: Call Get Zip Code list ================================*/


    $scope.getStateID = function(response){
        $('#current-zip').attr('disabled', false);
        var selectedStateID = response._id;

        $scope.statID = {
            stateID:selectedStateID
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl +'/api/common/getZipCodeList',
            params:$scope.statID
        })
            .success(function(response){
                console.log(response);
                $scope.zipCodeList = response.data;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
            .error(function(response){
                console.log(response);
            })
    }

    /*============================= End: Call Get Zip Code list ================================*/

    /*============================= Start: Call Get Function Area ================================*/


    $scope.findFunctionalArea = function(response){
        $('#functional-area').attr('disabled', false);
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
    }

    /*============================= End:  Call Get Function Area ================================*/

    /*============================= Start: Call Get Function Area ID ================================*/

    $scope.selectedArea = function(response){
        console.log(response);
        $scope.selectedFunctionalAreaID = response._id;
    }

    /*============================= End: Call Get Function Area ID ================================*/

    /*=============================Start: Generate Passcode Function ================================*/

    $scope.genPasscode = function(regData){

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
                    "userType": "CANDIDATE"

                }
            })
                .success(function (response) {
                    console.log("success", response);
                    if(response.statusCode == 201){
                        bootbox.alert('Passcode has been sent to you.');
                    }
                    $scope.otp = response.data.OTP;
                })
                .error(function (response) {
                    console.log("error", response);
                    bootbox.alert(response.message);
                });

            ngDialog.close();

        }
        else{
            $scope.valCheck = "This Field is Required";
        }
    };

    /*=============================End: Generate Passcode Function ================================*/

    //$('input.boxes').on('change', function() {
    //    $('input.boxes').not(this).prop('checked', false);
    //});

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

    $scope.signup = function (regData) {

        console.log('regData', regData);

        //$scope.keySkillsArray = [];
        //
        //if($scope.keySkillsArray.indexOf(regData.keySkills) == -1){
        //    $scope.skillData = regData.keySkills.split(" ").join("");
        //    $scope.keySkillsArray.push($scope.skillData);
        //}

        if($scope.year == undefined){
            $scope.totalExperience = $scope.month;
        }

        else if($scope.month == undefined){
            $scope.totalExperience = $scope.year;
        }

        else if(($scope.year != "") && ($scope.month != "")){
            $scope.totalExperience = $scope.year+"."+$scope.month;
        }

        if($('#terms').is(':checked')){
            $scope.loading = true;
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
                registerData.append("currentState", regData.currentState.stateName);
                registerData.append("zipCode", regData.zipCode);
                registerData.append("industryID", $scope.selectedIndustryID);
                registerData.append("functionalAreaID", $scope.selectedFunctionalAreaID);
                registerData.append("totalExperience", $scope.totalExperience);
                //registerData.append("keySkills", $scope.keySkillsArray);
                registerData.append("deviceToken", "string");
                registerData.append("referralCode", regData.referralCode);
                registerData.append("receiveAlerts", true);
                registerData.append("verifyThroughPhone", $scope.phoneVerify);
                registerData.append("deviceType", "WEB");

                $http({
                    method:'POST',
                    url:CONSTANT.apiUrl + '/api/candidate/register',
                    data:registerData,
                    headers:{
                        'Content-type': undefined
                    }
                })
                    .success(function (response) {
                        $scope.loading = false;
                        console.log("success", response);
                        bootbox.alert(response.message);
                        $state.go('home.login');
                        $rootScope.scrollToTop();
                    })
                    .error(function(response){
                        $scope.loading = false;
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
                registerData.append("currentState", regData.currentState.stateName);
                registerData.append("zipCode", regData.zipCode);
                registerData.append("industryID", $scope.selectedIndustryID);
                registerData.append("functionalAreaID", $scope.selectedFunctionalAreaID);
                registerData.append("totalExperience", $scope.totalExperience);
                //registerData.append("keySkills", $scope.keySkillsArray);
                registerData.append("deviceToken", "string");
                registerData.append("referralCode", regData.referralCode);
                registerData.append("receiveAlerts", true);
                registerData.append("deviceType", "WEB");
                registerData.append("linkedInId", $scope.linkedinData.id);

                $http({
                    method:'POST',
                    url:CONSTANT.apiUrl + '/api/candidate/registerViaLinkedIn',
                    data:registerData,
                    headers:{
                        'Content-type': undefined
                    }
                })
                    .success(function (response) {
                        $scope.loading = false;
                        console.log("successLink", response);
                        bootbox.alert(response.message);
                        $state.go('home.login');
                        $rootScope.scrollToTop();
                    })
                    .error(function(response){
                        $scope.loading = false;
                        console.log("errorLink", response);
                        bootbox.alert(response.message);
                    })
            }

        }

        else{
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

        console.log(regData);
        $http({
            method:'PUT',
            url:CONSTANT.apiUrl + '/api/phoneVerification/resendOTP',
            data:{
                "email": regData.email,
                "countryCode": regData.countryCode,
                "phoneNo": regData.mobileNumber,
                "duringRegister": true,
                "verifyThroughPhone": $scope.phoneVerify,
                "userType": "CANDIDATE"

            }
        })
            .success(function (response) {
                console.log("success resend otp", response);
                $scope.otp = response.data.OTP;
                if(response.statusCode == 200){
                    bootbox.alert("Passcode has been sent to you.");
                }
            })
            .error(function(response){
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

    $scope.isSpecialKey = function($event){
        characterService.specialFunction($event);
    };

    /*=============================End: Custom Factory Function ================================*/


    /*=============================Start: Signup Via LinkedIn Function ================================*/

    $scope.liAuth = function(){

        $scope.loading = true;
        $timeout(function(){
            $scope.loading = false;
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
        $('#emailid').attr('readonly', true);
        $scope.PassField = true;
        $scope.codeClass = "fullWidth";
        $scope.linkedinData = data;

        $timeout(function(){

            $scope.register = {
                firstName:$scope.linkedinData.firstName,
                lastName:$scope.linkedinData.lastName,
                email:$scope.linkedinData.emailAddress
            }
            bootbox.alert('successfully authorized. Please fill other required details');
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

    if($scope.year == undefined || $scope.month == undefined){
        $scope.place = true;
    }

    $scope.expYear = '';
    $scope.expMonth = '';

    console.log($scope.expYear);
    console.log($scope.expMonth);

    $scope.calculateYear = function(){
        $scope.place = false;
        console.log($scope.year);
        if($scope.year <= 1){
            $scope.expYear = $scope.year +' year'
        }
        else{
            $scope.expYear = $scope.year +' years'
        }

        if($scope.expMonth == ''){
            $scope.compExp =  $scope.expYear;
        }
        else{
            $scope.compExp =  $scope.expYear + ' ' + $scope.expMonth;
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

        if($scope.expYear == '')
        {
            $scope.compExp = $scope.expMonth;
        }
        else{
             $scope.compExp = $scope.expYear + ' ' + $scope.expMonth;
            console.log('===', $scope.expYear);
        }


    }

    /*============================= End: Custom Dropdown Plugin ================================*/

    /*============================= Start: Key Skills Section ================================*/

    $scope.instruct = function(){
        $scope.tips = true;
        $timeout(function(){
            $scope.tips = false;
        },5000);
    }

    /*============================= End: Key Skills Section ================================*/


}]);