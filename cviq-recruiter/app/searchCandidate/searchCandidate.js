angular.module('Cviq').controller('searchCandidateCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window) {

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
      $scope.Showdetails = true;
    var uSER_dETAILS =  $cookieStore.get('UserDetails');
    if(uSER_dETAILS.membershipTaken == false){
            $scope.Showdetails = false;
    }
    
    
    $scope.alt_url = "../images/candidate.png";


    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $timeout(function () {
        $('.selectpicker').selectpicker('refresh');
    }, 0);

    $scope.filter = {};
    $scope.search = {};
    $scope.noCandidate = false;

    // $("#salary").keyup(function() {
    //     if( $scope.search.salary == undefined){
    //         $scope.search.salary = 0;
    //         console.log("hello");
    //     }
    //
    // });
    
    //  function salaryfunc () {
    //     if( $scope.search.salary == undefined){
    //         $scope.search.salary = 0;
    //         console.log("hello");
    //     }
    // };

    /*=============================Start: Toggle Navigation Menu ================================*/

    $scope.toggleNavigation = function(){
        //$('.navigation-bar-left').css('left', 0);
        $('.filter').slideToggle();
    }


    /*=============================End: Toggle Navigation Menu ================================*/

    //=================================== values for the sliders======================
    $scope.sliderAggregated = {
        range: {
            min: 0,
            max: 800
        },
        minValue: 0,
        maxValue: 800
    };
    $scope.sliderQuantitative = {
        range: {
            min: 0,
            max: 500
        },
        minValue: 0,
        maxValue: 500
    };
    $scope.sliderQualitative = {
        range: {
            min: 0,
            max: 1080
        },
        minValue: 0,
        maxValue: 1080
    };
    $scope.sliderSalary = {
        range: {
            min: 0,
            max: 2000000
        },
      //  value: 20000
    };



    // var landHeight = $('body').height() ;
    // var landNewHeight = landHeight - $('.footer').height();
    // console.log("body",$('body').height());
    // console.log("header",$('.header').height());
    // console.log("footer",$('.footer').height());
    // console.log("landing",landNewHeight);
    // $('.landing-page').height(landNewHeight);


    $scope.highestQualification = [{name: 'UnderGraduate'}, {name: 'PostGraduate'}];
    $scope.salaryList = [{name: '$ 0 - $ 20000'},{name: '$ 20001 - $ 40000'},{name: '$ 40001 - $ 60000'},{name: '$ 60001 - $ 80000'},{name: '$ 80001 - $ 100000'},{name: '> $ 100000'}, ];
    $scope.aggregatedList = [{name: '0 - 100'},{name: '101 - 300'},{name: '301 - 500'},{name: '501 - 700'},{name: '701 - 800'}];
    $scope.quantitativeList  = [{name: '0 - 100'},{name: '101 - 200'},{name: '201 - 300'},{name: '301 - 400'},{name: '401 - 500'} ];
    $scope.qualitativeList = [{name: '0 - 200'},{name: '201 - 400'},{name: '401 - 600'},{name: '601 - 800'},{name: '801 - 1080'}];

    
    $scope.show = false;
    /*=============================Start: Get DropDown ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function (response) {
            console.log("dropdown data",response.data);
            $scope.searchDropDownData = response.data;
            $timeout(function () {
                $('.selectpicker').selectpicker('refresh');
            }, 0);
        })
        .error(function (response) {
            console.log(response);
            $rootScope.loading=false;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
                bootbox.alert(response.message);
            }
            else
                bootbox.alert(response.message);
        });


    /*=============================End: Get DropDown ================================*/
    
    /*============================= Start: Call Get State Name and Country Code ================================*/


    $scope.getCountryID = function(response){
        $scope.selectedCountryID = response._id;
        //  console.log($scope.job.countryCode);
       // $scope.job.countryCode = response.countryCode;
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
                console.log(response);
                $rootScope.loading=false;
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
                else
                    bootbox.alert(response.message);
            })
    };

    /*============================= End: Call Get State Name and Country Code ================================*/



    /*============================= Start: Call Get State Name and Country Code ================================*/


    $scope.getSpecializationList = function(response){

        console.log(response);
        if(response == "Graduation"){

            console.log($scope.searchDropDownData);
            $scope.specializationList = $scope.searchDropDownData.Graduation;
           // console.log("graduation",$scope.specializationList);
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        }
        if(response == "Post Graduation"){

            $scope.specializationList = $scope.searchDropDownData.PostGraduation;
          //  console.log("Postgraduation",$scope.specializationList);
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        }
        if(response == "Doctorate"){

            $scope.specializationList = $scope.searchDropDownData.Doctorate;
          //  console.log("Postgraduation",$scope.specializationList);
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        }
        if(response == "Associate Degree"){

            $scope.specializationList = $scope.searchDropDownData.AssociateDegree;
          //  console.log("Postgraduation",$scope.specializationList);
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        }
        if(response == "High School"){

            $scope.specializationList = $scope.searchDropDownData.HighSchool;
          //  console.log("Postgraduation",$scope.specializationList);
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        }
        //  console.log($scope.job.countryCode);
        // $scope.job.countryCode = response.countryCode;
        //  console.log($scope.job.countryCode);
       /* $scope.count = {
            countryID:$scope.selectedCountryID
        }

       */
    };

    /*============================= End: Call Get State Name and Country Code ================================*/


    $scope.dummy = function() {
        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },0);

    };


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
                console.log(response.data);
                $scope.functionAreaList = response.data;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
            .error(function(response){
                console.log(response);
                $rootScope.loading=false;
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
                else
                    bootbox.alert(response.message);
            })
    }

    /*============================= End: Get Functional area ID ================================*/

    /*=============================Start: Get Functional area ID ================================*/

    $scope.dummy = function(){
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);


    }

    /*============================= End: Get Functional area ID ================================*/

    $scope.filter = function(id){
       // console.log("change");

        if(id==1){
          //  console.log("$scope.filter.industry",$scope.filter.industry);
            if($scope.filter.industry == false){
                $scope.filter.function = false;
                $scope.search.industry = undefined;
                $scope.search.functionalArea = undefined;
                $scope.functionAreaList = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==2){
            if($scope.filter.function == false){
                $scope.search.functionalArea = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==3){
            if($scope.filter.experience == false){
                $scope.search.experience = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==4){
            if($scope.filter.keywords == false){
                $scope.search.keywords = undefined;
            }

        }
        else if(id==5){
            if($scope.filter.name1 == false){
                $scope.search.name = undefined;
            }

        }
        else if(id==6){
            if($scope.filter.aggregated == false){
                $scope.search.aggregated = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==7){
            if($scope.filter.quantitative == false){
                $scope.search.quantitative = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==8){
            if($scope.filter.qualitative == false){
                $scope.search.qualitative = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==9){
            if($scope.filter.salary == false){
                $scope.search.salary = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }
        }
        else if(id==10){
            if($scope.filter.country == false){
                $scope.filter.currentState = false;
                $scope.search.country = undefined;
                $scope.search.currentState = undefined;
                $scope.specializationList = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==11){
            if($scope.filter.currentState == false){
                $scope.search.currentState = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==12){
            if($scope.filter.qualification == false){
                $scope.search.qualification = undefined;
                $scope.filter.spacialization = false;
                $scope.search.spacialization = undefined;
                $scope.specializationList = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }
        else if(id==13){
            if($scope.filter.spacialization == false){
                $scope.search.spacialization = undefined;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            }

        }

    };

    /*============================= Start : search candidate API=================================*/
    $scope.searching = function(response){

        $scope.filter.industry = false;
        $scope.filter.function = false;
        $scope.filter.experience = false;
        $scope.filter.keywords = false;
        $scope.filter.name1 = false;
        $scope.filter.aggregated = false;
        $scope.filter.quantitative = false;
        $scope.filter.qualitative = false;
        $scope.filter.salary = false;
        $scope.filter.country = false;
        $scope.filter.currentState = false;
        $scope.filter.qualification = false;
        $scope.filter.spacialization = false;


            console.log("response",response == undefined);

            $rootScope.loading = true;
            if($(window).width() < 992){
                //  $scope.toggleNavigation();
            }

        $scope.data = {};
            if(response != undefined) {



                if (response.experience != undefined) {
                    $scope.filter.experience = true;
                    if (response.experience.contains('-')) {
                        console.log('yes');
                        $scope.experience = response.experience.split('-');
                        $scope.data.minExperience = $scope.experience[0];
                        $scope.data.maxExperience = $scope.experience[1];
                    }
                    else if (response.experience.contains('>')) {
                        console.log('no');
                        $scope.experience = response.experience.substring(response.experience.indexOf('>') + 1);
                        console.log($scope.experience);
                        $scope.data.minExperience = $scope.experience;
                        $scope.data.maxExperience = 50;
                    }
                }
                if (response.aggregated != undefined) {
                    $scope.filter.aggregated = true;
                    $scope.aggregated = response.aggregated.name.split(' - ');
                    $scope.data.minAggregatedScore = $scope.aggregated[0];
                    $scope.data.maxAggregatedScore = $scope.aggregated[1];
                    //     $scope.sliderAggregated.minValue = $scope.data.minAggregatedScore;
                    //     $scope.sliderAggregated.maxValue = $scope.data.maxAggregatedScore;

                }
                if (response.quantitative != undefined) {
                    $scope.filter.quantitative = true;
                    $scope.quantitative = response.quantitative.name.split(' - ');
                    $scope.data.minQuantitativeScore = $scope.quantitative[0];
                    $scope.data.maxQuantitativeScore = $scope.quantitative[1];

                }
                if (response.qualitative != undefined) {
                    $scope.filter.qualitative = true;
                    $scope.qualitative = response.qualitative.name.split(' - ');
                    $scope.data.minQualitativeScore = $scope.qualitative[0];
                    $scope.data.maxQualitativeScore = $scope.qualitative[1];

                }
                if (response.salary != undefined) {
                    $scope.filter.salary = true;
                    if (response.salary.contains('-')) {
                        console.log('yes');
                        $scope.salary = response.salary.split(' - ');
                        $scope.data.minSalary = $scope.salary[0];
                        $scope.data.maxSalary = $scope.salary[1];

                    }
                    else if (response.salary.contains('>')) {
                        console.log('no');
                        $scope.salary = response.salary.substring(response.salary.indexOf('>') + 1);
                        console.log($scope.salary);
                        $scope.data.minSalary = $scope.salary;
                        $scope.data.maxSalary = 200000;
                    }
                }


                // if (response.salary != undefined) {
                //     if (response.salary.name.contains('-')) {
                //         console.log('yes');
                //         $scope.salary = response.salary.name.split(' ');
                //         $scope.data.minSalary = $scope.salary[1];
                //        // $scope.data.maxSalary = $scope.salary[4];
                //     }
                //     else if (response.salary.name.contains('>')) {
                //         console.log('no');
                //         $scope.salary = response.salary.name.split(' ');
                //         $scope.data.minSalary = $scope.salary[2];
                //       //  $scope.data.maxSalary = $scope.salary[4];
                //     }
                // }
                if (response.industry != undefined) {
                    $scope.filter.industry = true;
                    $scope.data.industry = response.industry.industryName;

                }
                if (response.functionalArea != undefined) {
                    $scope.filter.function = true;

                    $scope.data.functionalArea = response.functionalArea.functionalAreaName;

                }
                if (response.keywords != undefined) {
                    $scope.filter.keywords = true;

                    $scope.data.keywords = response.keywords;

                }
                if (response.name != undefined) {
                    $scope.filter.name1 = true;

                    $scope.data.candidateName = response.name;

                }



                if (response.country != undefined) {
                    $scope.filter.country = true;

                    $scope.data.country = response.country.countryName;

                }
                if (response.currentState != undefined) {
                    $scope.filter.currentState = true;

                    $scope.data.state = response.currentState.stateName;

                }
                if (response.qualification != undefined) {

                    $scope.filter.qualification = true;

                    $scope.data.highestQualification = response.qualification;

                }

                if (response.spacialization != undefined) {
                    $scope.filter.spacialization = true;

                    $scope.data.specialization = response.spacialization.courseName;

                }
                console.log("dat retrieved is",$scope.data);

            }


            else
            {
                console.log("else")
            }
        console.log("heloo data is",$scope.data);

            $http({
                method:'GET',
                url: CONSTANT.apiUrl + '/api/recruiter/searchCandidates',
                headers:{
                    authorization: $cookieStore.get('AccessToken')
                },
                params:$scope.data
            })
                .success(function(response){
                    console.log(response);
                    $scope.noCandidate = false;             
                    $scope.candidatesList = response.data;
                     for( i in  $scope.candidatesList  ){
                            if( $scope.candidatesList[i].rating != 0 ){
                                var ratingarray  = [] ;
                                 for( d=1; d <= $scope.candidatesList[i].rating ; d++ ){ 
                                   ratingarray.push( d );
                                 }  
                                 $scope.candidatesList[i].ratingarray = ratingarray;
                            }
                            $scope.candidatesList[i].keySkills = $scope.candidatesList[i].keySkills.toString();
                    }
                    

                    console.log('$scope.candidatesList', $scope.candidatesList);

                    $('body, html').animate({
                        scrollTop: 800
                    }, 1500);


                    if($scope.candidatesList.length == 0){
                        $scope.noCandidate = true;
                    }

                    $scope.show = true;
                    $rootScope.loading = false;
                })
                .error(function(response){
                    console.log(response);
                    bootbox.alert(response.message);
                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                        $rootScope.loading = false;
                    }
                    $rootScope.loading = false;
                })





    };
    /*============================= End : search candidate API=================================*/


    /*============================= Start : filter candidate API=================================*/
    $scope.applyFilter = function(response){

        // $scope.filter.industry = false;
        // $scope.filter.function = false;
        // $scope.filter.experience = false;
        // $scope.filter.keywords = false;
        // $scope.filter.name1 = false;
        // $scope.filter.aggregated = false;
        // $scope.filter.quantitative = false;
        // $scope.filter.qualitative = false;
        // $scope.filter.salary = false;
        // $scope.filter.country = false;
        // $scope.filter.currentState = false;
        // $scope.filter.qualification = false;
        // $scope.filter.spacialization = false;


        if( ($scope.filter.industry &&($scope.search.industry== undefined)) || ($scope.filter.function &&($scope.search.functionalArea== undefined)) ||
            ($scope.filter.experience &&($scope.search.experience== undefined) ) || ($scope.filter.keywords &&($scope.search.keywords== undefined)) ||
            ($scope.filter.name1 &&($scope.search.name== undefined) ) || ($scope.filter.aggregated &&($scope.search.aggregated== undefined) ) ||
            ($scope.filter.quantitative &&($scope.search.quantitative== undefined) ) || ($scope.filter.qualitative &&($scope.search.qualitative== undefined)) ||
            ($scope.filter.salary &&($scope.search.salary== undefined) ) || ($scope.filter.country &&($scope.search.country== undefined)) ||
            ($scope.filter.currentState &&($scope.search.currentState== undefined) ) || ($scope.filter.qualification &&($scope.search.qualification== undefined) ) ||
            ($scope.filter.spacialization &&($scope.search.spacialization== undefined) )
        ){
            console.log("please fill details required");

        }
        else{
            console.log("response",response);

            $rootScope.loading = true;
            if($(window).width() < 992)
                $scope.toggleNavigation();

            if(response != undefined) {

                $scope.data = {};

                if (response.experience != undefined) {
                    $scope.filter.experience = true;
                    if (response.experience.contains('-')) {
                        console.log('yes');
                        $scope.experience = response.experience.split('-');
                        $scope.data.minExperience = $scope.experience[0];
                        $scope.data.maxExperience = $scope.experience[1];
                    }
                    else if (response.experience.contains('>')) {
                        console.log('no');
                        $scope.experience = response.experience.substring(response.experience.indexOf('>') + 1);
                        console.log($scope.experience);
                        $scope.data.minExperience = $scope.experience;
                        $scope.data.maxExperience = 50;
                    }
                }
                if (response.aggregated != undefined) {
                    $scope.filter.aggregated = true;
                    $scope.aggregated = response.aggregated.name.split(' - ');
                    $scope.data.minAggregatedScore = $scope.aggregated[0];
                    $scope.data.maxAggregatedScore = $scope.aggregated[1];
                    //     $scope.sliderAggregated.minValue = $scope.data.minAggregatedScore;
                    //     $scope.sliderAggregated.maxValue = $scope.data.maxAggregatedScore;

                }
                if (response.quantitative != undefined) {
                    $scope.filter.quantitative = true;
                    $scope.quantitative = response.quantitative.name.split(' - ');
                    $scope.data.minQuantitativeScore = $scope.quantitative[0];
                    $scope.data.maxQuantitativeScore = $scope.quantitative[1];

                }
                if (response.qualitative != undefined) {
                    $scope.filter.qualitative = true;
                    $scope.qualitative = response.qualitative.name.split(' - ');
                    $scope.data.minQualitativeScore = $scope.qualitative[0];
                    $scope.data.maxQualitativeScore = $scope.qualitative[1];

                }
                if (response.salary != undefined) {
                    $scope.filter.salary = true;
                    if (response.salary.contains('-')) {
                        console.log('yes');
                        $scope.salary = response.salary.split(' - ');
                        $scope.data.minSalary = $scope.salary[0];
                        $scope.data.maxSalary = $scope.salary[1];

                    }
                    else if (response.salary.contains('>')) {
                        console.log('no');
                        $scope.salary = response.salary.substring(response.salary.indexOf('>') + 1);
                        console.log($scope.salary);
                        $scope.data.minSalary = $scope.salary;
                        $scope.data.maxSalary = 200000;
                    }
                }


                // if (response.salary != undefined) {
                //     if (response.salary.name.contains('-')) {
                //         console.log('yes');
                //         $scope.salary = response.salary.name.split(' ');
                //         $scope.data.minSalary = $scope.salary[1];
                //        // $scope.data.maxSalary = $scope.salary[4];
                //     }
                //     else if (response.salary.name.contains('>')) {
                //         console.log('no');
                //         $scope.salary = response.salary.name.split(' ');
                //         $scope.data.minSalary = $scope.salary[2];
                //       //  $scope.data.maxSalary = $scope.salary[4];
                //     }
                // }
                if (response.industry != undefined) {
                    $scope.filter.industry = true;
                    $scope.data.industry = response.industry.industryName;

                }
                if (response.functionalArea != undefined) {
                    $scope.filter.function = true;

                    $scope.data.functionalArea = response.functionalArea.functionalAreaName;

                }
                if (response.keywords != undefined) {
                    $scope.filter.keywords = true;

                    $scope.data.keywords = response.keywords;

                }
                if (response.name != undefined) {
                    $scope.filter.name1 = true;

                    $scope.data.candidateName = response.name;

                }



                if (response.country != undefined) {
                    $scope.filter.country = true;

                    $scope.data.country = response.country.countryName;

                }
                if (response.currentState != undefined) {
                    $scope.filter.currentState = true;

                    $scope.data.state = response.currentState.stateName;

                }
                if (response.qualification != undefined) {

                    $scope.filter.qualification = true;

                    $scope.data.highestQualification = response.qualification;

                }

                if (response.spacialization != undefined) {
                    $scope.filter.spacialization = true;

                    $scope.data.specialization = response.spacialization.courseName;

                }
                console.log("dat retrieved is",$scope.data);




            }


            else
            {
                console.log("else")
                $scope.data = {};
            }

            $http({
                method:'GET',
                url: CONSTANT.apiUrl + '/api/recruiter/searchCandidates',
                headers:{
                    authorization: $cookieStore.get('AccessToken')
                },
                params:$scope.data
            })
                .success(function(response){
                    console.log(response);
                   $scope.noCandidate = false; 
                    $scope.candidatesList = response.data;

                    $('body, html').animate({
                        scrollTop: 800
                    }, 1500);


                    if($scope.candidatesList.length == 0){
                        $scope.noCandidate = true;
                    }

                    $scope.show = true;
                    $rootScope.loading = false;
                })
                .error(function(response){
                    console.log(response);
                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                        $rootScope.loading = false;
                    }
                    $rootScope.loading = false;
                })

        }



    };
    /*============================= End : filter candidate API=================================*/


    // /*============================= Start : search candidate API=================================*/
    // $scope.searching = function(response){
    //     $rootScope.loading = true;
    //
    //     if($(window).width() < 992)
    //         $scope.toggleNavigation();
    //
    //
    //
    //     // $scope.filter.industry = false;
    //     // $scope.filter.function = false;
    //     // $scope.filter.experience = false;
    //     // $scope.filter.keywords = false;
    //     // $scope.filter.name1 = false;
    //     // $scope.filter.aggregated = false;
    //     // $scope.filter.quantitative = false;
    //     // $scope.filter.qualitative = false;
    //     // $scope.filter.salary = false;
    //     // $scope.filter.country = false;
    //     // $scope.filter.currentState = false;
    //     // $scope.filter.qualification = false;
    //     // $scope.filter.spacialization = false;
    //
    //
    //
    //     console.log("response",response);
    //
    //
    //     if(response != undefined) {
    //
    //         $scope.data = {};
    //
    //         if (response.experience != undefined) {
    //             $scope.filter.experience = true;
    //             if (response.experience.contains('-')) {
    //                 console.log('yes');
    //                 $scope.experience = response.experience.split('-');
    //                 $scope.data.minExperience = $scope.experience[0];
    //                 $scope.data.maxExperience = $scope.experience[1];
    //             }
    //             else if (response.experience.contains('>')) {
    //                 console.log('no');
    //                 $scope.experience = response.experience.substring(response.experience.indexOf('>') + 1);
    //                 console.log($scope.experience);
    //                 $scope.data.minExperience = $scope.experience;
    //                 $scope.data.maxExperience = 50;
    //             }
    //         }
    //         if (response.aggregated != undefined) {
    //             $scope.filter.aggregated = true;
    //             $scope.aggregated = response.aggregated.name.split(' - ');
    //             $scope.data.minAggregatedScore = $scope.aggregated[0];
    //             $scope.data.maxAggregatedScore = $scope.aggregated[1];
    //             //     $scope.sliderAggregated.minValue = $scope.data.minAggregatedScore;
    //             //     $scope.sliderAggregated.maxValue = $scope.data.maxAggregatedScore;
    //
    //         }
    //         if (response.quantitative != undefined) {
    //             $scope.filter.quantitative = true;
    //             $scope.quantitative = response.quantitative.name.split(' - ');
    //             $scope.data.minQuantitativeScore = $scope.quantitative[0];
    //             $scope.data.maxQuantitativeScore = $scope.quantitative[1];
    //
    //         }
    //         if (response.qualitative != undefined) {
    //             $scope.filter.qualitative = true;
    //             $scope.qualitative = response.qualitative.name.split(' - ');
    //             $scope.data.minQualitativeScore = $scope.qualitative[0];
    //             $scope.data.maxQualitativeScore = $scope.qualitative[1];
    //
    //         }
    //         if (response.salary != undefined) {
    //             $scope.filter.salary = true;
    //             if (response.salary.contains('-')) {
    //                 console.log('yes');
    //                 $scope.salary = response.salary.split(' - ');
    //                 $scope.data.minSalary = $scope.salary[0];
    //                 $scope.data.maxSalary = $scope.salary[1];
    //
    //             }
    //             else if (response.salary.contains('>')) {
    //                 console.log('no');
    //                 $scope.salary = response.salary.substring(response.salary.indexOf('>') + 1);
    //                 console.log($scope.salary);
    //                 $scope.data.minSalary = $scope.salary;
    //                 $scope.data.maxSalary = 200000;
    //             }
    //         }
    //
    //
    //         // if (response.salary != undefined) {
    //         //     if (response.salary.name.contains('-')) {
    //         //         console.log('yes');
    //         //         $scope.salary = response.salary.name.split(' ');
    //         //         $scope.data.minSalary = $scope.salary[1];
    //         //        // $scope.data.maxSalary = $scope.salary[4];
    //         //     }
    //         //     else if (response.salary.name.contains('>')) {
    //         //         console.log('no');
    //         //         $scope.salary = response.salary.name.split(' ');
    //         //         $scope.data.minSalary = $scope.salary[2];
    //         //       //  $scope.data.maxSalary = $scope.salary[4];
    //         //     }
    //         // }
    //         if (response.industry != undefined) {
    //             $scope.filter.industry = true;
    //             $scope.data.industry = response.industry.industryName;
    //
    //         }
    //         if (response.functionalArea != undefined) {
    //             $scope.filter.function = true;
    //
    //             $scope.data.functionalArea = response.functionalArea.functionalAreaName;
    //
    //         }
    //         if (response.keywords != undefined) {
    //             $scope.filter.keywords = true;
    //
    //             $scope.data.keywords = response.keywords;
    //
    //         }
    //         if (response.name != undefined) {
    //             $scope.filter.name1 = true;
    //
    //             $scope.data.candidateName = response.name;
    //
    //         }
    //
    //
    //
    //         if (response.country != undefined) {
    //             $scope.filter.country = true;
    //
    //             $scope.data.country = response.country.countryName;
    //
    //         }
    //         if (response.currentState != undefined) {
    //             $scope.filter.currentState = true;
    //
    //             $scope.data.state = response.currentState.stateName;
    //
    //         }
    //         if (response.qualification != undefined) {
    //
    //             $scope.filter.qualification = true;
    //
    //             $scope.data.highestQualification = response.qualification;
    //
    //         }
    //
    //         if (response.spacialization != undefined) {
    //             $scope.filter.spacialization = true;
    //
    //             $scope.data.specialization = response.spacialization.courseName;
    //
    //         }
    //         console.log("dat retrieved is",$scope.data);
    //
    //
    //
    //
    //         //$scope.keywords = response.keywords.split(',');
    //         // $scope.year = new Date().getFullYear();
    //         // $scope.date = new Date().getDate();
    //         // $scope.month = new Date().getMonth()+1;
    //         //
    //         // if($scope.month < 9){
    //         //     $scope.month ='0'+ $scope.month;
    //         // }
    //         //
    //         // $scope.fullDate = $scope.year+'-'+$scope.month+'-'+$scope.date;
    //         //
    //
    //
    //         //
    //         // $scope.searchParam = {
    //         //     industry:response.industry.industryName,
    //         //     functionalArea:response.functionalArea.functionalAreaName,
    //         //     minExperience:$scope.minExperience,
    //         //     maxExperience:$scope.maxExperience,
    //         //     keywords:$scope.keywords,
    //         //     searchDate:$scope.fullDate,
    //         //     searchCriteria:1
    //         //
    //         //
    //         // }
    //     }
    //
    //
    //     else
    //     {
    //         console.log("else")
    //         $scope.data = {};
    //     }
    //
    //     $http({
    //         method:'GET',
    //         url: CONSTANT.apiUrl + '/api/recruiter/searchCandidates',
    //         headers:{
    //             authorization: $cookieStore.get('AccessToken')
    //         },
    //         params:$scope.data
    //     })
    //         .success(function(response){
    //             console.log(response);
    //             $scope.candidatesList = response.data;
    //
    //             $('body, html').animate({
    //                 scrollTop: 800
    //             }, 1500);
    //
    //
    //             if($scope.candidatesList.length == 0)
    //                 $scope.noCandidate = true;
    //
    //             $scope.show = true;
    //             $rootScope.loading = false;
    //         })
    //         .error(function(response){
    //             console.log(response);
    //             if(response.statusCode == 401){
    //                 $scope.confirmLogOut();
    //                 $rootScope.loading = false;
    //             }
    //             $rootScope.loading = false;
    //         })
    // };
    // /*============================= End : search candidate API=================================*/
    //
   
    /*============================= Start : Favourite candidate API=================================*/
    
    $scope.markFavourite = function (index,id) {
        $scope.loading = true;
        
        console.log("index ",index,"id ",id);
        var data = {};
        data.candidateID = id;
        data.setFavourite = true;

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/makeFavouriteCandidate',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:data
        })
            .success(function(response){
                console.log(response);
                $scope.candidatesList[index].isFavourite = response.data.isFavourite;
                $scope.loading = false;
            })
            .error(function(response){
                console.log(response);
                $scope.loading = false;
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })
    };
    
    $scope.unFavourite = function (index,id,name) {
        console.log("index ",index,"id ",id);
        $scope.unfavname = name;
        $scope.indexofunfav = index;
        $scope.unfavdata = {};
        $scope.unfavdata.candidateID = id;
        $scope.unfavdata.setFavourite = false;
        
        ngDialog.open({
            template: 'favourite',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
        
       

    };

    $scope.denyUnFavourite = function () {
        ngDialog.close();
    };
    
    
    $scope.confirmUnFavourite = function () {
        ngDialog.close();
        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/makeFavouriteCandidate',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:$scope.unfavdata
        })
            .success(function(response){
                console.log(response);
                $scope.candidatesList[$scope.indexofunfav].isFavourite = response.data.isFavourite;
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })
        
    };
    
    
    /*============================= End : Favourite candidate API=================================*/

}]);