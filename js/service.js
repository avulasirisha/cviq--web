if( window.location.hostname == "localhost"  ){
    var CONSTANT_apiUrl = "http://localhost:8000";
    var CVIQ_URL  = "http://localhost/site" ;
}else{
    var CONSTANT_apiUrl = "http://34.207.125.7:3005";
    var CVIQ_URL  = "" ;
}
var app = angular.module('myApp', ['ngRoute','ngCookies']);  
app.controller('Cviq_Head_Cntrl',['$scope', '$http', '$cookieStore', '$location', '$anchorScroll', function($scope, $http, $cookieStore ,$location,$anchorScroll ) {    

    var loggedInVar = $cookieStore.get('loggedIn');
 //   console.log( loggedInVar );
    function OptimizeVlaue(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
    }
    $scope.showButtons = false;
    if( loggedInVar ){
           $scope.showButtons = true;
    }
    $scope.searchresults =false;
    $scope.NewCandidates ={};
    $scope.Apierror ;         
    $scope.features = [
      { "link": "#" ,"name": "Download link 1" },
      { "link": "#" ,"name": "Download link 2" },
      { "link": "#" ,"name": "Download link 3" },
      { "link": "#" ,"name": "Download link 4" }
    ];
    
    $scope.jobs = [
      { "link": "#" ,"name": "Download link 1" },
      { "link": "#" ,"name": "Download link 2" },
      { "link": "#" ,"name": "Download link 3" },
      { "link": "#" ,"name": "Download link 4" }
    ]; 

    $scope.goto_url = function( arg1, arg2 ){
        console.log( arg1 + " + " + arg2 );
        if( arg2 == 2 ){
            if( arg1 == "cand"){                
                location.href = CVIQ_URL + "/cviq-candidate/#/home/login";           
            }else if( arg1 == "inter"){
                 location.href = CVIQ_URL + "/cviq-interviewer/#/home/login";
            }else if( arg1 == "rec"){
                 location.href = CVIQ_URL + "/cviq-recruiter/#/home/login";
            }
        }else{
         if( arg1 == "cand"){                
                location.href = CVIQ_URL + "/cviq-candidate/#/home/register";           
            }else if( arg1 == "inter"){
                 location.href = CVIQ_URL + "/cviq-interviewer/#/home/signup";
            }else if( arg1 == "rec"){
                 location.href = CVIQ_URL + "/cviq-recruiter/#/home/signup";
            }
        }
    }
  
  $scope.TrandingJobs = {};
  $scope.RecentJobs = {}; 
  $scope.FullTime = {};
  $scope.PartTIme = {};
  $scope.jobCategories = {};
  $scope.AllCounts = {}; 

       // $scope.AllCounts={};
        /* Trending Jobs */
        var opt = {};
        if( OptimizeVlaue('CandidateOpt') != '' ){
             opt['headers'] = { authorization: OptimizeVlaue('CandidateOpt')  };
        }   
        $http.get(CONSTANT_apiUrl+"/api/candidate/getJobs?type=trendingJobs",  opt)
        .then(function(response) {
                $scope.TrandingJobs =response.data;
         },function( error ){
            console.log( error );
            if( error.data.error == "Unauthorized" ){
                document.cookie = 'CandidateOpt=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'loggedIn=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                location.reload();
            }
        });

       
        /* RecentJobs*/
        $http.get( CONSTANT_apiUrl+"/api/candidate/getJobs?type=recentJobs",opt)
        .then(function(response) {
                $scope.RecentJobs =response.data.data;  
              for( i in $scope.RecentJobs ){ 
                  if( $scope.RecentJobs[i].jobType == "Permanent"){
                    $scope.FullTime[i] = $scope.RecentJobs[i] ;          
                  }else{
                    $scope.PartTIme[i] =  $scope.RecentJobs[i];
                  }
              }       
        },function( error ){
            if( error.data.error == "Unauthorized" ){
                document.cookie = 'CandidateOpt=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
        });
            
             
        /* Parttime zobs */       
        
        /* RecentJobs*/
        $http.get(CONSTANT_apiUrl+"/api/common/getJobCategories")
        .then(function(response) {
                $scope.jobCategories =response.data.data;         
        });
    
     $http.get(CONSTANT_apiUrl+"/api/common/NewCandidates")
        .then(function(response) {
                $scope.NewCandidates =response.data.data;  
                console.log( $scope.NewCandidates );       
        });
    
       $http.get( CONSTANT_apiUrl+"/api/common/getAllCounts")
        .then(function(response) {
                $scope.AllCounts.JobCount =response.data.data["jobs"];  
                $scope.AllCounts.MemberCount =response.data.data["members"]; 
                $scope.AllCounts.RecruiterCount =response.data.data["recruiters"];       
        });
        
          
          
    $scope.searchJobs = function (response) { 
    
        $scope.year = new Date().getFullYear();
        $scope.date = new Date().getDate();
        $scope.month = new Date().getMonth()+1;

        if($scope.month <= 9){
            $scope.month ='0'+ $scope.month;
        }                                    

        if($scope.date <= 9){
            $scope.date ='0'+ $scope.date;
        }
        response.zipcode = document.getElementById("zipcode").value;
        $scope.fullDate = $scope.year+'-'+$scope.month+'-'+$scope.date;
    
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
        console.log( response );     
        $scope.searchParam = {
            minExperience:$scope.minExperience,
            maxExperience:$scope.maxExperience,
            keywords: document.getElementById('Keyword').value,
            searchDate :$scope.fullDate,
            zipcode :  response.zipcode,
            searchCriteria:1
        }     
        var options = { params : $scope.searchParam } ;
        if( OptimizeVlaue('CandidateOpt') != '' ){
            options.headers = {authorization: OptimizeVlaue('CandidateOpt')  };
        }                            
            
        $http.get(CONSTANT_apiUrl+"/api/candidate/searchJobs" , options )
        .then(function(response, error) {
            if( error ){
                console.log( response );
            }else{
                $scope.numberOFJobs = response.data.data.length;
                if( $scope.numberOFJobs > 0 ){
                    
                    $scope.searchresults =true;
                    $scope.searchJobResult = response.data.data;
                    console.log( $scope.searchJobResult );
                
                    document.getElementById("dynamic_tab").click();
                    
                    window.scroll( 0, 1400);

                }else{
                     alert( "Sory.. No Data Found" );
                }
 
           }       
        });
    }
             

   $scope.applyJob = function( did , _type ){
        console.log( did , _type );
        var d = new Date();
        if( $scope.showButtons ){
            var timeZoneOffset = d.getTimezoneOffset();
            $http({
                method: 'POST',
                url: CONSTANT_apiUrl + '/api/candidate/applyForJob',
                headers: {
                    authorization: OptimizeVlaue('CandidateOpt')
                },
                data: {
                    "jobID": did ,
                    "timeOffset": timeZoneOffset
                }
            }).then(function(response){
                
                    if( _type == 'searchedjobs' ){
                        for( i in $scope.searchJobResult ){
                            if( $scope.searchJobResult[i]._id == did ){
                                $scope.searchJobResult[i].alreadyApplied == true;    
                            }
                        }
                    }else if( _type == 'recentjobs' ){
                        for( i in $scope.RecentJobs ){
                            if( $scope.searchJobResult[i]._id == did){
                                $scope.searchJobResult[i].alreadyApplied == true;    
                            }
                        }
                    }else if( _type == 'parttime' ){
                        for( i in $scope.PartTIme ){
                            if( $scope.searchJobResult[i]._id == did ){
                                $scope.searchJobResult[i].alreadyApplied == true;    
                            }
                        }
                    } 
            },function myError(response) {
                    console.log( "main" ,response );
                     $scope.Apierror = response.data.message;
                     $("#popupModel").modal('show');
            });
        }else{
        $scope.goto_url( "cand", 2);
        }
    }  
    
    
   
   $scope.setFavourite = function(data ,event ){
        if( OptimizeVlaue('CandidateOpt') == "" ){
            location.href = CVIQ_URL + "/cviq-candidate/#/home/login";
        }else{
            $http({
                method: 'POST',
                url: CONSTANT_apiUrl + '/api/candidate/saveFavouriteList',
                headers: {
                    authorization: OptimizeVlaue('CandidateOpt')
                },
                data: {
                    "jobID": data
                }
            }).then(function(response){
                    if( event.target.className ){
                        event.target.className = 'fa fa-heart';
                    }   
            },function myError(response) {
                    console.log( "main" ,response );
                     $scope.Apierror = response.data.message;
                     $("#popupModel").modal('show');
            });
       }
    }
    $scope.SubscribeNewsletter = function(data ){
    
            $http({
                method: 'POST',
                url: CONSTANT_apiUrl + '/api/common/insertNewsLetters',
                headers: {
                    authorization: OptimizeVlaue('CandidateOpt')
                },
                data: {
                    "userType": 'CANDIDATE',
                    "email"  :data
                }
            }).then(function(response, error){
                document.getElementById("subscribepanel").innerHTML = "";
            });
    }
    
}]);


