angular.module('Cviq').controller('searchJobsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

       $scope.pstatus = [
            {
                desc:'Actively Looking',
                val: 1
            },
            {
                desc:'Not Looking',
                val: 0
            },
            {
                desc:'Looking For Freelance Work',
                val: 2
            }
        ]

    $timeout(function(){
        $('.selectpicker').selectpicker();
    },0);

    $timeout(function(){

        $('#datetimepicker').datetimepicker({
            viewMode: 'years',
            format: 'YYYY-MM-DD'
        });

    },0);

    /*=============================Start: Complete job Details ================================*/

    $scope.jobDetails = function(response){      
        $cookieStore.put('JobID', response);
        $state.go('home.search.jobDetails'); 
    }

    /*=============================End: Complete job Details ================================*/


    /*=============================Start: Searching Jobs ================================*/

    $scope.searching = function(){

        $state.go('home.search.searchJobs');

        if(sessionStorage.getItem('SearchedParameter') !== null){

            $scope.paramersForSearched = JSON.parse(sessionStorage.getItem('SearchedParameter'));

            if($('#datetimepicker').val() == ""){

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

            }
            else{
                $scope.fullDate = $('#datetimepicker').val();
            }


            if($scope.dwm == undefined || $scope.dwm == 'Daily'){
                $scope.criteria = 1;
            }
            else if($scope.dwm == 'Weekly'){
                $scope.criteria = 2;
            }
            else if($scope.dwm == 'Monthly'){
                $scope.criteria = 3;
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
                searchCriteria:$scope.criteria
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
                    if(response.statusCode == 401){
                        $rootScope.sessionExpired();
                    }
                })


        }
    }

    /*=============================End: Searching Jobs ================================*/

    $scope.period = ['Asc','Desc'];
    
       /*============================= Start : Favourite candidate API=================================*/
    
    $scope.markFavourite = function (index,id) {
        $scope.loading = true;
        
        console.log("job ",index,"id ",id);
        var data = { "jobID":id};
   
        $http({
            method:'POST',
            url: CONSTANT.apiUrl + '/api/candidate/saveFavouriteList',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:data
        })
            .success(function(response){
                console.log(response);
                $scope.searchJobResult[index].favouriteJob = true;
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
        $scope.indexofunfav = index;
        $scope.unfavdata = {};
        $scope.unfavdata.jobID = id;
        
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
            method:'POST',
            url: CONSTANT.apiUrl + '/api/candidate/deleteFavouriteList',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:$scope.unfavdata
        })
            .success(function(response){
                console.log(response);

                $scope.searchJobResult[$scope.indexofunfav].favouriteJob =false;
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