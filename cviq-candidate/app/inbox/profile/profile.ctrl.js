angular.module('Cviq').controller('profileCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$filter', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $filter){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $(".datetimepicker").datetimepicker({
        viewMode: 'years',
        format: 'MMMM DD, YYYY',
        maxDate: new Date()
    });

    $(".datetimepicker").on("dp.change", function (e) {
        console.log(e);
        console.log('sss', $(e.target).val());
        $(e.target).trigger("change");
    });

    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));

    console.log($scope.userData);
    var dateModified = $filter('date')($scope.userData.dob, 'MMMM dd, yyyy');
    //
    //if($scope.userData.totalExperience <= 1){
    //    $scope.userData.totalExperience = $scope.userData.totalExperience +' Year'
    //}
    //else if($scope.userData.totalExperience > 1){
    //    $scope.userData.totalExperience = $scope.userData.totalExperience +' Years'
    //}

    $scope.profile = {
        fname:$scope.userData.firstName,
        lname:$scope.userData.lastName,
        email:$scope.userData.email,
        dob:dateModified,
        gender:$scope.userData.gender,
        states:$scope.userData.currentState,
        country:$scope.userData.currentCountry,
        countryCode:$scope.userData.countryCode,
        phoneNumber:$scope.userData.phoneNo,
        designation:$scope.userData.profileTitle,
        salary:$scope.userData.salary,
        totalExperience:$scope.userData.totalExperience,
        keySkills: $scope.userData.keySkills.toString(),
        industry:$scope.userData.industry,
        functionalArea:$scope.userData.functionalArea,
        jobType:$scope.userData.jobType,
        zipCode:$scope.userData.zipCode
    }

    var ex = $scope.userData.totalExperience.toString();

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

    $scope.read = true;



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

    /*=============================Start: Call Get Country list API ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log('www', response);
            $scope.countryLists = response.data.countryList;
            $scope.industryLists = response.data.industryList;

            console.log('$scope.industryLists', $scope.industryLists);

            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);

            /*=============================Start: Call Get State list API ================================*/

            var oldState = _.filter($scope.countryLists, {countryName: $scope.userData.currentCountry});

            $scope.oldStateName = {
                countryID: oldState[0]._id
            }

            $http({
                method:'GET',
                url: CONSTANT.apiUrl + '/api/common/getStateList',
                params:$scope.oldStateName
            })
                .success(function(response){
                    console.log('Statelist', response);
                    $scope.oldStateList = response.data;
                    $timeout(function(){
                        $('.selectpicker').selectpicker('refresh');
                    },0);


                    /*=============================Start: Call Get Zip code list API ================================*/

                    var oldZipCode = _.filter($scope.oldStateList, {stateName: $scope.userData.currentState});

                    $scope.oldZipCodeName = {
                        stateID: oldZipCode[0]._id
                    };

                    $http({
                        method:'GET',
                        url: CONSTANT.apiUrl + '/api/common/getZipCodeList',
                        params:$scope.oldZipCodeName
                    })
                        .success(function(response){
                            $scope.oldZipCodeList = response.data;
                            $timeout(function(){
                                $('.selectpicker').selectpicker('refresh');
                            },0);
                        })
                        .error(function(response){
                            console.log(response);
                            if(response.statusCode == 401){
                                $rootScope.sessionExpired();
                            }
                        })

                    /*=============================End: Call Get Zip code list API ================================*/


                })
                .error(function(response){
                    console.log(response);
                    if(response.statusCode == 401){
                        $rootScope.sessionExpired();
                    }
                })

            /*=============================End: Call Get State list API ================================*/


            /*=============================Start: Call Get Functional Area API ================================*/

            var oldFunArea = _.filter($scope.industryLists, {industryName: $scope.userData.industry});

            $scope.oldFunAreaNAme = {
                industryID: oldFunArea[0]._id
            }

            $http({
                method:'GET',
                url: CONSTANT.apiUrl + '/api/common/getFunctionalAreaList',
                params:$scope.oldFunAreaNAme
            })
                .success(function(response){
                    console.log('Functional Area list', response);
                    $scope.oldFunAreaList = response.data;
                    $timeout(function(){
                        $('.selectpicker').selectpicker('refresh');
                    },0);
                })
                .error(function(response){
                    console.log(response);
                    if(response.statusCode == 401){
                        $rootScope.sessionExpired();
                    }
                })

            /*=============================End: Call Get Functional Area API ================================*/

        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    /*=============================End: Call Get Country list API ================================*/

    /*============================= Start: Call Get State Name, Country Code and zip code list ================================*/

    $scope.oldStateList;

    $scope.getCountryID = function(response){
        console.log('res', response);

        $scope.oldZipCodeList = [];

      var selCountryID = _.filter($scope.countryLists, {countryName: response});

        var selectedCountryID = selCountryID[0]._id;
        $scope.profile.countryCode = selCountryID[0].countryCode;

        $scope.count = {
            countryID:selectedCountryID
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl +'/api/common/getStateList',
            params:$scope.count
        })
            .success(function(response){
                console.log(response);
                $scope.oldStateList = response.data;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }




    $scope.getStateID = function(response){
        console.log('res', response);

        var selStateID = _.filter($scope.oldStateList, {stateName: response});

        var selectedStateID = selStateID[0]._id;

        $scope.zipJsonObj = {
            stateID:selectedStateID
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl +'/api/common/getZipCodeList',
            params:$scope.zipJsonObj
        })
            .success(function(response){
                console.log(response);
                $scope.oldZipCodeList = response.data;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }





    /*============================= End: Call Get State Name, Country Code and zip code list ================================*/



    /*============================= Start: Call Get Functional Area name on industry change ================================*/


    $scope.getIndustryID = function(response){
        console.log('res', response);

        var selIndustryID = _.filter($scope.industryLists, {industryName: response});
        var selectedIndustryID = selIndustryID[0]._id;

        $scope.count = {
            industryID:selectedIndustryID
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl +'/api/common/getFunctionalAreaList',
            params:$scope.count
        })
            .success(function(response){
                console.log(response);
                $scope.oldFunAreaList = response.data;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*============================= End: Call Get Functional Area name on industry change ================================*/



    /*=============================Start: Get Matched Jobs ================================*/

    //$http({
    //    method: 'GET',
    //    url: CONSTANT.apiUrl + '/api/candidate/recentlySearchedJobs',
    //    headers: {
    //        authorization: $cookieStore.get('AccessToken')
    //    }
    //})
    //    .success(function(response){
    //        console.log('data', response);
    //        $scope.recentlysearchedJobs = response.data;
    //    })
    //    .error(function(response){
    //        console.log(response);
    //        if(response.statusCode == 401){
    //            $rootScope.sessionExpired();
    //        }
    //    })

    /*=============================End: Get Matched Jobs ================================*/

    /*=============================Start: Edit Profile ================================*/
    
    $scope.editProfile = function () {
        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },0);
        $scope.read = false;
        $('.candidate-edit-profile input.inp').css("background", "#e9ecee");
    }

    /*=============================End: Edit Profile ================================*/



    /*=============================Start: Edit Personal Details ================================*/

    $scope.saveBtn = false;

    $scope.editPersonalDetails = function (data) {
        console.log('profile data', data);

        if(data.keySkills == undefined){
            data.keySkills = '';
        }

        if(data.salary == ""){
            data.salary = 0;
        }

        var getDate = $('#dob').val();


        var dateString = $filter('date')(new Date(getDate), 'yyyy-MM-dd');

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

        $scope.saveBtn = true;
        //console.log('rtrtrt', typeof data.keySkills);

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/updatePersonalDetail',
            data: {
                "firstName": data.fname,
                "lastName": data.lname,
                "email": data.email,
                "countryCode": data.countryCode,
                "phoneNo": data.phoneNumber,
                "currentCountry": data.country,
                "currentState": data.states,
                "zipCode":data.zipCode,
                "dob": dateString,
                "gender": data.gender,
                "profileTitle": data.designation,
                "salary": data.salary,
                "totalExperience": totExp1,
                "keySkills": data.keySkills,
                "jobType": data.jobType,
                "industry": data.industry,
                "functionalArea": data.functionalArea
            },
            headers: {
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                $scope.saveBtn = false;
                console.log(response);
                bootbox.alert(response.message);
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.profile');
            })
            .error(function(response){
                $scope.saveBtn = false;
                bootbox.alert(response.message);
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Edit Personal Details ================================*/

    /*=============================Start: Cancel Personal Details ================================*/

    $scope.cancelPersonalDetails = function () {
        $scope.read = true;
        $state.reload('home.inbox.profile');
        $('.candidate-edit-profile input.inp').css("background", "none");
    }
    /*=============================End: Cancel Personal Details ================================*/

}]);