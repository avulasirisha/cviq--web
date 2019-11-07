angular.module('Cviq').controller('inboxCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$location' , function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $location){

    $scope.var1 = $state.params.var1;

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }                      

    var loggedInVar = $cookieStore.get('loggedIn');
    if(loggedInVar == undefined || loggedInVar == false){
          $cookieStore.remove('AccessToken'); 
          $state.go('home.login');
    }
    
    $timeout(function(){
        $('.selectpicker').selectpicker();
    },0);

    /*=============================Start: Get all jobs count ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl +'/api/candidate/getAllCountValues',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('Success Count', response);
            $scope.countForJobs = response.data;
        })
        .error(function(response){
            console.log('Error Count', response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    /*=============================End: Get all jobs count ================================*/



    /*=============================Start: Toggle Navigation Menu ================================*/

    $scope.toggleNavigation = function(){
        //$('.navigation-bar-left').css('left', 0);
        $('.navigation-bar-left').slideToggle();
    }

    $timeout(function () {

        if ($(window).width() < 1200) {
            $('.navigation-bar-left ul li a').click(function () {
                $('.navigation-bar-left').slideUp();
            });
        }

    },0);

    /*=============================End: Toggle Navigation Menu ================================*/

    /*=============================Start: Get DropDown ================================*/

    $scope.graduation;
    $scope.postGraduation;
    $scope.qualSpecialization = [];

    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log(response);
            $scope.searchDropDownData = response.data;
            $scope.graduation = response.data.Graduation;
            $scope.postGraduation = response.data.PostGraduation;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function(response){
            console.log(response);
        })

    /*=============================End: Get DropDown ================================*/


    /*=============================Start: Get Functional area ID ================================*/

    $scope.selectedIndustry = function(response){
        $scope.selectedIndustryID = response._id;

        $scope.fun ={
            industryID: $scope.selectedIndustryID
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getFunctionalAreaList',
            params: $scope.fun
        })
            .success(function(response){
                console.log(response);
                $scope.functionAreaList = response.data;
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

    /*============================= End: Get Functional area ID ================================*/

    /*=============================Start: Get Country ID ================================*/

    $scope.selectedCount = function(response){
        $scope.selCountryID = response._id;

        $scope.stat ={
            countryID: $scope.selCountryID
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getStateList',
            params: $scope.stat
        })
            .success(function(response){
                console.log(response);
                $scope.stateList = response.data;
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

    /*=============================End: Get Country ID ================================*/


    /*=============================Start: Get Zip Code ================================*/

    $scope.selStateID = function(response){
        console.log(response);
        $scope.stateIDs = response._id;

        $scope.zip ={
            stateID: $scope.stateIDs
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getZipCodeList',
            params: $scope.zip
        })
            .success(function(response){
                console.log(response);
                $scope.zipCodeList = response.data;
                $scope.zipCodeList = response.data;
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

    /*=============================End: Get Zip Code ================================*/

    /*=============================Start: Get Specialization ================================*/

    $scope.getQualID = function(response){
        $scope.selHighQual = response.split(" ").join("");
        console.log('aaaa', $scope.selHighQual);

        if($scope.selHighQual == 'Graduation'){

            $scope.qualSpecialization = [];
            _.forEach($scope.graduation, function(value){
                $scope.qualSpecialization.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
                console.log($scope.qualSpecialization);
            })

        }
        else if($scope.selHighQual == 'PostGraduation'){

            $scope.qualSpecialization = [];
            _.forEach($scope.postGraduation, function(value){
                $scope.qualSpecialization.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
        }
    }

    /*=============================End: Get Specialization ================================*/



    /*=============================Start: Searching Jobs Via Cookie ================================*/
    if(sessionStorage.getItem('SearchedParameter') !== null){

        $scope.paramersForSearched = JSON.parse(sessionStorage.getItem('SearchedParameter'));

        //$timeout(function(){
        //    $scope.$apply();
        //    $("#sel-industry").val($scope.paramersForSearched.industry.industryName);
        //},1000);
        //
        //$timeout(function(){
        //    $('.selectpicker').selectpicker('refresh');
        //},2000);

        $scope.year = new Date().getFullYear();
        $scope.date = new Date().getDate();
        $scope.month = new Date().getMonth()+1;

        if($scope.month <= 9){
            $scope.month ='0'+ $scope.month;
        }

        if($scope.date <= 9){
            $scope.date ='0'+ $scope.date;
        }

        $scope.fullDate = $scope.year+'-'+$scope.month+'-'+$scope.date;
        if($scope.paramersForSearched.industry == null || $scope.paramersForSearched.industry == undefined){
            $scope.paramersForSearched.industry = {};
        }
        if($scope.paramersForSearched.functionalArea == null || $scope.paramersForSearched.functionalArea == undefined){
            $scope.paramersForSearched.functionalArea = {};
        }

        if($scope.paramersForSearched.curCountry == null || $scope.paramersForSearched.curCountry == undefined){
            $scope.paramersForSearched.curCountry = {};
        }

        if($scope.paramersForSearched.curState == null || $scope.paramersForSearched.curState == undefined){
            $scope.paramersForSearched.curState = {};
        }

        if($scope.paramersForSearched.experience != undefined)
        {

            if($scope.paramersForSearched.experience.contains('-')){
                console.log('yes');
                $scope.experience = $scope.paramersForSearched.experience.split('-');
                $scope.minExperience = $scope.experience[0];
                $scope.maxExperience = $scope.experience[1];
            }
            else if($scope.paramersForSearched.experience.contains('>')){
                console.log('no');
                $scope.experience = $scope.paramersForSearched.experience.substring($scope.paramersForSearched.experience.indexOf('>') + 1);
                console.log($scope.experience);
                $scope.minExperience = $scope.experience;
                $scope.maxExperience = 50;
            }

        }

        $scope.searchParam = {
            industry:$scope.paramersForSearched.industry.industryName,
            functionalArea:$scope.paramersForSearched.functionalArea.functionalAreaName,
            minExperience:$scope.minExperience,
            maxExperience:$scope.maxExperience,
            keywords:$scope.paramersForSearched.keywords,
            country:$scope.paramersForSearched.curCountry.countryName,
            state:$scope.paramersForSearched.curState.stateName,
            minSalary:$scope.paramersForSearched.salary,
            highestQualification:$scope.paramersForSearched.qual,
            specialization:$scope.paramersForSearched.qual,
            certification:$scope.paramersForSearched.certifications,
            zipCode:$scope.paramersForSearched.zipcode,
            searchDate:$scope.fullDate,
            searchCriteria:1
        }


        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/candidate/searchJobs',
            params: $scope.searchParam,
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log(response);
                $scope.result = true;
                $scope.numberOFJobs = response.data.length;
                $scope.searchJobResult = response.data;

            })
            .error(function(response){
                console.log(response);
            })


    }

    /*=============================End: Searching Jobs Via Cookie ================================*/

    /*=============================Start: Searching Jobs ================================*/
  
     
    $scope.searching = function(response){
        $scope.appliedJobArray = [];
        $state.go('home.inbox.searchJobs');
        console.log(response);
          if(typeof(Storage) !== 'undefined'){
              sessionStorage.setItem('SearchedParameter', JSON.stringify(response));
          }


        $scope.year = new Date().getFullYear();
        $scope.date = new Date().getDate();
        $scope.month = new Date().getMonth()+1;

        if($scope.month <= 9){
            $scope.month ='0'+ $scope.month;
        }

        if($scope.date <= 9){
            $scope.date ='0'+ $scope.date;
        }
      
        $scope.fullDate = $scope.year+'-'+$scope.month+'-'+$scope.date;

        if(response.functionalArea == null || response.functionalArea == undefined){
            response.functionalArea = {};
        }

        if(response.curCountry == null || response.curCountry == undefined){
            response.curCountry = {};
        }

        if(response.curState == null || response.curState == undefined){
            response.curState = {};
        }

        if(response.experience != undefined || response.experience == '')
        {

            if(response.experience.contains('-')){
                console.log('yes');
                $scope.experience = response.experience.split('-');
                $scope.minExperience = $scope.experience[0];
                $scope.maxExperience = $scope.experience[1];
            }
            else if(response.experience.contains('>')){
                console.log('no');
                $scope.experience = response.experience.substring(response.experience.indexOf('>') + 1);
                console.log($scope.experience);
                $scope.minExperience = $scope.experience;
                $scope.maxExperience = 50;
            }

        }
   
        $scope.searchParam = {
            industry:response.industry.industryName,
            functionalArea:response.functionalArea.functionalAreaName,
            minExperience:$scope.minExperience,
            maxExperience:$scope.maxExperience,
            keywords: response.keywords,
            country:response.curCountry.countryName,
            state:response.curState.stateName,
            minSalary:response.salary,
            highestQualification:response.qual,
            specialization:response.qual,
            certification:response.certifications,
            zipCode:response.zipcode,
            searchDate:$scope.fullDate,
            searchCriteria:1
        }


        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/candidate/searchJobs',
            params: $scope.searchParam,
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log(response);
                $scope.numberOFJobs = response.data.length;
                $scope.searchJobResult = response.data;
                $timeout(function () {
                    $state.reload('home.inbox.searchJobs');
                },100);

            })
            .error(function(response){
                console.log(response);
            })
    }
    
     
    /*=============================End: Searching Jobs ================================*/

    ///*=============================Start: Custom Factory Function ================================*/
    //
    //$scope.FirsText = function($event){
    //    characterService.characterFunction($event);
    //};
    //
    //$scope.isNumberKey = function($event){
    //    characterService.numberFunction($event);
    //};
    //
    //$scope.isCodeKey = function($event){
    //    characterService.codeFunction($event);
    //};
    //
    //$scope.isAlphaKey = function($event){
    //    characterService.alphaFunction($event);
    //};
    //$scope.isSpecialKey = function($event){
    //    characterService.specialFunction($event);
    //};
    //
    ///*=============================End: Custom Factory Function ================================*/

    /*=============================Start: Show Basic + Advance Search ================================*/

    $scope.btypeSearch = true;

    $scope.asearches = function(){
        $scope.typeSearch = true;
        $scope.btypeSearch = false;
        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },0);
    }

    $scope.bsearches = function(){
        $scope.typeSearch = false;
        $scope.btypeSearch = true;

        $scope.search.curCountry = '';
        $scope.search.curState = '';
        $scope.search.zipcode = '';
        $scope.search.qual = '';
        $scope.search.special = '';
        $scope.search.certifications = '';
        $scope.search.salary = null;

    }

    /*=============================End: Show Basic + Advance Search ================================*/


    /*=============================Start: Get Matched Jobs ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/candidate/recentlySearchedJobs',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('data', response);
            $rootScope.recentlysearchedJobs = response.data;
        })
        .error(function(response){
            console.log(response);
        })

    /*=============================End: Get Matched Jobs ================================*/


    /*=============================Start: Apply for job ================================*/

    $scope.disLink = false;

    $scope.applyForJob = function(data){

        $scope.disLink = true;

        console.log($cookieStore.get('AccessToken'));

        var d = new Date();
        var timeZoneOffset = d.getTimezoneOffset();

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/candidate/applyForJob',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "jobID": data,
                "timeOffset": timeZoneOffset
            }
        })
            .success(function(response){
                console.log(response);
                $scope.disLink = false;
                bootbox.alert(response.message);
                $timeout(function(){
                    $state.reload();
                },0);
            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                $scope.disLink = false;
            })

    }

    /*=============================End: Apply for job ================================*/
    
    
    $scope.submit_newsletter = function(){
    
     var eMail = document.getElementById("newsLetterId").value;
     if( eMail == "" ){
            bootbox.alert("Please Enter Email"); 
            return false;
     }else{
     
        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/common/insertNewsLetters',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "userType": 'CANDIDATE',
                "email":eMail 
            }
        })
            .success(function(response){
                console.log(response);
                bootbox.alert(response.message);
                $timeout(function(){
                    $state.reload();
                },0);
            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);

            })
    }
    } 
    

}]);