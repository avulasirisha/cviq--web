angular.module('Cviq').controller('dashboardCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','socket', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window, socket){

        if($cookieStore.get('AccessToken') == undefined || $cookieStore.get('AccessToken') == ''){
            $state.go('home.login');
        }

        //socket.emit('messageFromClient',{
        //    'accessToken':$cookieStore.get('AccessToken'),
        //    'USER_TYPE':'INTERVIEWER'
        //});
        //
        //socket.on('messageFromServer', function (msg) {
        //    console.log('messageFromServer', msg);
        //});

        $scope.year;
        $scope.month;

        $timeout(function(){
            $('.selectpicker').selectpicker();
        },0);

        $('#upload-resume').click(function () {
            $('#resume').click();
        });

        $('#upload-certificate').click(function () {
            $('#certificate').click();
        });

        $('.upload-file2').click(function () {
            $('#dp').click();
        });

        $scope.profilePic = function (File) {

            $scope.profilePics = File[0];

            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(File[0]); // read the local file

            reader.onloadend = function(){ // set image data as background of div

                $('.dp').attr("src",this.result);

            };
        };



    /*=============================Start: Call Get Industry list API ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log(response);

            $scope.industries = response.data.industryList;
            $scope.graduation = response.data.Graduation;
            $scope.postgraduation = response.data.PostGraduation;
            $scope.countryLists = response.data.countryList;
        })
        .error(function(response){
            console.log(response);
        })

    /*=============================End: Call Get Industry list API ================================*/

    /*============================= Start: Call Get State Name and Country Code ================================*/


    $scope.getCountryID = function(response){

        $scope.zipCodeList = [];

        var reqData = _.filter($scope.countryLists, {countryName: response});
        $scope.selectedCountryID = reqData[0]._id;

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

    /*=============================Start: Get Zip Code ================================*/

    $scope.selStateID = function(response){
        console.log(response);
        var stateIDs = _.filter($scope.stateRefinedList, {stateName: response});

        $scope.zip ={
            stateID: stateIDs[0]._id
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getZipCodeList',
            params: $scope.zip
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

    /*=============================End: Get Zip Code ================================*/

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
            $scope.expYear = $scope.year +' Year'
        }
        else{
            $scope.expYear = $scope.year +' Years'
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
            $scope.expMonth = $scope.month +' Month'
        }
        else{
            $scope.expMonth = $scope.month +' Months'
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


    /*============================= Start: Get Selected Industry ID ================================*/

    $scope.getIndusID = function (response) {

        var indID = _.filter($scope.industries, {industryName: response});
        _.forEach(indID, function (value) {
           console.log(value._id);
            $cookieStore.put('SelIndustryID', value._id);
        });
        
      //  $scope.findFunctionalArea( indID[0] ) ;
    }

    //$scope.underGrad = function (response) {
    //    console.log(response);
    //    $scope.under = response.courseName;
    //    $cookieStore.put('UnderGraduate', $scope.under);
    //}
    //
    //$scope.postGrad = function (response) {
    //    console.log(response);
    //    $scope.post = response.courseName;
    //    $cookieStore.put('Graduate', $scope.post);
    //}


    /*============================= End: Get Selected Industry ID ================================*/




    /*=============================Start: Get Interviewer Profile Function ================================*/

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/interviewer/getInterviewerProfileDetails',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log('===========',response);

                $cookieStore.put('SelIndustryID', response.data.industryID);

                if(response.data.resumeURL != null)
                {
                    $scope.attachmentRES = true;
                    $scope.showresume = response.data.resumeURL;
                }
                else{
                    $scope.attachmentRES = false;
                }

                if(response.data.certificationURL != null)
                {
                    $scope.attachmentCER = true;
                    $scope.showcertificate = response.data.certificationURL;
                }
                else{
                    $scope.attachmentCER = false;
                }

                if(response.data.industry == '') {
                    $scope.disableExpression = false;
                }
                else if((response.data.profileReviewedByAdmin == false) && (response.data.isVerified == false)){
                    $scope.status = 'Your profile is under review.';
                    $scope.disableExpression = true;
                }
                else if((response.data.profileReviewedByAdmin == true) && (response.data.isVerified == false)){
                    $scope.status = 'Your profile has not been verified. Please contact to admin.';
                    $scope.disableExpression = false;
                }
                else if (response.data.isVerified == true && response.data.loginCountAfterVerified == 1){
                    $scope.verifies = true;
                    $scope.status = 'Your profile has been verified by administrator.';

                    $timeout(function(){
                        $scope.status = false;
                    },20000);
                    $scope.disableExpression = false;
                }
                else {
                    $scope.verifies = true;
                }

                if(response.data.isVerified == true){
                    $scope.disResume = false;
                    console.log('resu', $scope.disResume);
                }

                $scope.interviewerData = response.data;
                //$scope.interviewerData.keywords = response.data.keywords;
                //console.log('$scope.interviewerData.keywords', $scope.interviewerData.keywords.toString());

                $scope.stateRefinedList = $scope.interviewerData.stateList;
                $scope.zipCodeList = $scope.interviewerData.zipCodeList;

                $scope.profile = {
                    industry:$scope.interviewerData.industry,
                    titles:$scope.interviewerData.title,
                    softSkills:$scope.interviewerData.softSkills.toString(),
                    technicalSkills:$scope.interviewerData.technicalSkills.toString(),
                    keywords:$scope.interviewerData.keywords.toString(),
                    accomplishment:$scope.interviewerData.accomplishment,
                    undergraduate:$scope.interviewerData.underGraduate,
                    graduate:$scope.interviewerData.postGraduate,
                    country:$scope.interviewerData.currentCountry,
                    states:$scope.interviewerData.currentState,
                    zip:$scope.interviewerData.zipCode
                }


                var ex = $scope.interviewerData.totalExperience.toString();

                console.log('ex', ex);

                if(ex.length > 1){
                    var ex = ex.split(".");
                    //$scope.compExp = ex[0]+' Years'+" "+ex[1]+" Months";
                    var x1 = ex[0]>1?ex[0]+' Years':ex[0]+" Year";
                    var x2 = ex[1]>1?ex[1]+' Months':ex[1]+' Month';
                    $scope.compExp = x1+" "+x2;
                } else {
                    $scope.compExp = ex>1?ex+' Years':ex+" Year";
                }




                $scope.designation = $scope.interviewerData.title;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },500);



            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    /*=============================End: Get Interviewer Profile Function ================================*/


    /*=============================Start: Update Interviewer Profile Function ================================*/

    $scope.disResume = true;
    $scope.completeProfile = function(data){
        $scope.loading = true;
        $scope.veriBtn = true;

        console.log(data);
        console.log('$scope.compExp', $scope.compExp);
        var keyArray = data.keywords.split(',');

        var softSkillsArray = data.softSkills.split(',');

        var technicalSkillsArray = data.technicalSkills.split(',');

        //$scope.softArray = [];
        //$scope.technicalArray = [];
        //$scope.keysArray = [];
        //
        //$scope.softArray.push(data.softSkills);
        //$scope.technicalArray.push(data.technicalSkills);
        //$scope.keysArray.push(data.keywords);
        //
        //console.log($scope.softArray);
        //console.log($scope.technicalArray);
        //console.log($scope.keysArray);

        //var onlyZip = data.zip.match(/\((.*)\)/);

        var totExp = $scope.compExp.split(" ");

        var totExp1;

        if(totExp.length > 2){
            totExp1 = totExp[0]+"."+totExp[2];
            totExp1 = Number(totExp1);
            console.log('1',totExp1);
        }
        else if(totExp[1] == 'Years' || totExp[1] == 'Year'){
            totExp1 = totExp[0]+'.0';
            totExp1 = Number(totExp1);
            console.log('2',totExp1);
        }
        else{
            totExp1 = totExp[0];
            totExp1 = '0.'+totExp[0];
            totExp1 = Number(totExp1);
            console.log('3',totExp1);
        }

        var profileData = new FormData();

        profileData.append("industryID", $cookieStore.get('SelIndustryID'));
        profileData.append("title", data.titles);
        profileData.append("softSkills", JSON.stringify(softSkillsArray));
        profileData.append("technicalSkills", JSON.stringify(technicalSkillsArray));
        profileData.append("keywords", JSON.stringify(keyArray));
        profileData.append("accomplishment", data.accomplishment);
        profileData.append("underGraduate", data.undergraduate);
        profileData.append("postGraduate", data.graduate);
        profileData.append("resume", $('#resume')[0].files[0]);
        profileData.append("certification", $('#certificate')[0].files[0]);
        profileData.append("currentCountry", data.country);
        profileData.append("currentState", data.states);
        profileData.append("zipCode", data.zip);
        profileData.append("totalExperience", totExp1);
        profileData.append("profilePic", $('#dp')[0].files[0]);

        $http({
            method:'PUT',
            url:CONSTANT.apiUrl + '/api/interviewer/interviewerUpdateProfile',
            data:profileData,
            headers:{
                'authorization': $cookieStore.get('AccessToken'),
                'Content-type': undefined
            }

        })
            .success(function(response){
                console.log(response);
                $cookieStore.put('UserDetails', response.data);
                $scope.loading = false;
                if(response.statusCode == 200){
                    bootbox.alert('Information submitted for verification.');
                }
                $scope.disableExpression = true;
                //$scope.softArray.length = 0;
                //$scope.technicalArray.length = 0;
                //$scope.keysArray.length = 0;
                $timeout(function(){
                    $state.reload();
                },0);
                $scope.veriBtn = false;
            })
            .error(function(response){
                $scope.loading = false;
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Update Interviewer Profile Function ================================*/

    /*=============================Start: Save Interviewer Profile Function ================================*/

    $scope.saveProfile = function(data){
        console.log('sdfsdf', data);
        $scope.disBtn = true;

        //$scope.softArray = [];
        //$scope.technicalArray = [];
        //$scope.keysArray = [];
        //
        //$scope.softArray.push(data.softSkills);
        //$scope.technicalArray.push(data.technicalSkills);
        //$scope.keysArray.push(data.keywords);

        var keyArray = data.keywords.split(',');

        var softSkillsArray = data.softSkills.split(',');

        var technicalSkillsArray = data.technicalSkills.split(',');

        var totExp = $scope.compExp.split(" ");

        var totExp1;

        if(totExp.length > 2){
            totExp1 = totExp[0]+"."+totExp[2];
            totExp1 = Number(totExp1);
            console.log('1',totExp1);
        }
        else if(totExp[1] == 'Years' || totExp[1] == 'Year'){
            totExp1 = totExp[0]+'.0';
            console.log('2', totExp1);
        }
        else{
            totExp1 = totExp[0];
            totExp1 = '0.'+totExp[0];
            totExp1 = Number(totExp1);
            console.log('3',totExp1);
        }



        $scope.loading = true;

        var profileData = new FormData();

        profileData.append("industryID", $cookieStore.get('SelIndustryID'));
        profileData.append("title", data.titles);
        profileData.append("softSkills", JSON.stringify(softSkillsArray));
        profileData.append("technicalSkills", JSON.stringify(technicalSkillsArray));
        profileData.append("keywords", JSON.stringify(keyArray));
        profileData.append("accomplishment", data.accomplishment);
        profileData.append("underGraduate", data.undergraduate);
        profileData.append("postGraduate", data.graduate);
        profileData.append("resume", $('#resume')[0].files[0]);
        profileData.append("certification", $('#certificate')[0].files[0]);
        profileData.append("profilePic", $('#dp')[0].files[0]);
        profileData.append("currentCountry", data.country);
        profileData.append("currentState", data.states);
        profileData.append("zipCode", data.zip);
        profileData.append("totalExperience", totExp1);

        $http({
            method:'PUT',
            url:CONSTANT.apiUrl + '/api/interviewer/interviewerUpdateProfile',
            data:profileData,
            headers:{
                'authorization': $cookieStore.get('AccessToken'),
                'Content-type': undefined
            }

        })
            .success(function(response){
                console.log(response);
                $cookieStore.put('UserDetails', response.data);
                $scope.loading = false;
                bootbox.alert(response.message);
                $timeout(function(){
                    $state.reload();
                },10);
                $scope.disBtn = false;
            })
            .error(function(response){
                $scope.loading = false;
                $scope.disBtn = false;
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Save Interviewer Profile Function ================================*/



    /*=============================Start: Utility Functions ================================*/

    $('#resume').change(function(){
        console.log($(this)[0].files[0].name);
        if($(this)[0].files[0].name.length > 0){
            $scope.resumeUp = $(this)[0].files[0].name;
        }
        else {
            $scope.resumeUp = false;
        }
        $timeout( function(){
            $scope.$apply();
        }, 1000);
    })

    $('#certificate').change(function(){
        if($(this)[0].files[0].name.length > 0){
            $scope.certificateUp = $(this)[0].files[0].name;
        }
        else {
            $scope.certificateUp = false;
        }
        $timeout( function(){
            $scope.$apply();
        }, 1000);
    })

    $scope.showResume = function(){
        $window.open($scope.showresume);
    }
    $scope.showCertificate = function(){
        $window.open($scope.showcertificate);
    }

    /*=============================End: Utility Functions ================================*/

}]);


/*=============================Start: Validation for input type file: resume ================================*/

angular.module('Cviq').directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ngModel){
            //change event is fired when file is selected
            el.bind('change',function(){
                scope.$apply(function(){
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                })
            })
        }
    }
});

/*=============================End: Validation for input type file: resume ================================*/

