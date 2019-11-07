angular.module('Cviq').controller('candidateCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','$location','ngDialog', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window,$location,ngDialog){

     $rootScope.loading=true;
    $scope.messageModalError = false;
    $scope.messageModalTitleError = false;

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    console.log( $cookieStore.get('UserDetails') );

    $scope.Memberships =$cookieStore.get('UserDetails');
    
     $scope.CANDIDATE_STATUS = {
        0:'Not Looking',      
        1:'Actively Looking',
        2:'Looking For Freelance Work'
    };
    
    if( $scope.Memberships.membershipTaken == false ){
           $state.go( "home.upgradePackage" ) ; 
            $timeout(function () {
                $state.reload();
            }, 500);
    }

    var candArray =  $location.absUrl().split('+');

    $scope.data = {};
    $scope.data.candidateID = candArray[1];
     $scope.labels =[];


    var state =  candArray[0].split('/');
    var n = state.length;
    var last = state[n-2];

    console.log(last);
    if(last == 'aggregated')
        $scope.variable='AGGREGATED';
    if(last == 'quantitative')
        $scope.variable='QUANTITATIVE';
    if(last == 'qualitative')
        $scope.variable='QUALITATIVE';

    console.log("candidate id",$scope.data.candidateID);



    $scope.candidateData = false;


    $http({
        method:'POST',
        url:CONSTANT.apiUrl + '/api/recruiter/visitCandidateProfile',
        headers:{
            'authorization': $cookieStore.get('AccessToken'),
        },
        data: $scope.data,

    })
        .success(function (response) {

            console.log("success",response);

        })
        .error(function (response) {
            console.log("error",response);
            $rootScope.loading = false;
            if(response.statusCode == 401){
                bootbox.alert(response.message);
                $scope.confirmLogOut();
            }

        });

    $scope.graphArray = [];

    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/recruiter/getCandidateAggrScore',
        headers:{
            'authorization': $cookieStore.get('AccessToken'),
        },
        params: $scope.data
    })
        .success(function (response) {
            $rootScope.loading = false;
            console.log("response",response.data);

            $scope.candidateAggregatedScore = response.data.candidateAggregatedScore;
            $scope.totalAggregatedScore = response.data.totalAggregatedScore;
            $scope.graphArray = response.data.candidateAggregatedScoreArr;

            if( $scope.candidateAggregatedScore == 0){
                $scope.candidateData = false;
            }
            else{
                $scope.candidateData = true;
                $scope.data = [
                    []
                ];
                
                var ag = 1;
                console.log( "step1");
                angular.forEach(response.data.candidateAggregatedScoreArr , function (cords) {
                   $scope.labels.push( "I"+ag);
                   ag  =ag+1
                  //$scope.labels.push(moment(cords.interviewDate).format('Do MMM, YYYY'));
                });
                $scope.newLabels = $scope.labels.reverse();
                $scope.labels = [];
                var count = 0;
                $scope.graphArray =  $scope.graphArray.reverse();
                console.log('newCoordinates',  $scope.graphArray);

                for(var i=0; i<= $scope.graphArray.length; i++ ){
                    ++count;
                    if(count <=  $scope.graphArray.length && count <= 4){
                        $scope.data[0].push( $scope.graphArray[i]);
                    } else {
                        $scope.data[0].reverse();
                        console.log('ELSE PART');
                        $scope.data[0].unshift(0);
                        break;
                    }
                }
           var count1 =0;    
            for(var j=0; j<=$scope.newLabels.length; j++ ){

              ++count1;
              if(count1 <= $scope.newLabels.length && count1 <= 4){
                  $scope.labels.push($scope.newLabels[j]);
              } else {
                  $scope.labels.reverse();
                  console.log('ELSE PART');
                  $scope.labels.unshift(0);
                  break;
              }
        }

                console.log('$scope.data', $scope.data);

            }
        })
        .error(function (response) {
            console.log("error",response);
            $rootScope.loading = false;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }

        })


    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/recruiter/getCandidateProfile',
        headers:{
            'authorization': $cookieStore.get('AccessToken'),
        },
        params: $scope.data,

    })
        .success(function (response) {
           
            console.log("success",response.data);
            $scope.profile = response.data;
           $rootScope.loading = false;

            $scope.resumearray = response.data.resume;
            $scope.inboxid = response.data.inboxId;
            $scope.isresume = false;
         //   console.log("resume",resumearray.length);

            if($scope.resumearray.length == 0){
                $scope.isresume = false;
            }
            else{
                $scope.isresume = true;
                for(i=0;i<$scope.resumearray.length;i++){
                    if($scope.resumearray[i].isPrimary == true){
                        $scope.resumeUrl = $scope.resumearray[i].resumeURL;
                    }
                }
                if($scope.resumeUrl == undefined || $scope.resumeUrl == null){
                    $scope.isresume = false;
                }
            }


        })
        .error(function (response) {
            console.log("error",response);
            $rootScope.loading = false;

        });


    /*============================= Start : line graph =================================*/


    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };


   // $scope.labels = ["0","Attempt 1", "Attempt 2", "Attempt 3", "Attempt 4"];
    $scope.series = ['Aggregated Score'];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

      
    // // Simulate async data update
    $timeout(function () {

    }, 3000);




    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        maintainAspectRatio:false,
        animation:{
            easing : 'easeInOutQuart',
        },
        elements: {
            line:{
                tension : 0
            },
            point:{
                radius: 4
            }
        },
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
    /*============================= End : line graph =================================*/

    $scope.resumefunc = function () {

    if($scope.isresume == false){
        ngDialog.open({
            template: 'noresume',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }
    else{
        var win = window.open($scope.resumeUrl, '_blank');
        win.focus();
    }

}



    $scope.messageCandidate = function () {
        if( $scope.inboxid != '' ){

            $state.go('home.inboxMessages', { id: "+"+$scope.inboxid } );          
 
        }else{                                                 
            $scope.message = {};
            $("#message").modal();
         }
    };

    $('#messagefile').change(function () {
        $scope.attached = true;
        $scope.attachmentName = $('#messagefile')[0].files[0].name;
        console.log("hello",$('#messagefile')[0].files[0].name);
        $scope.$apply();
    });




    $scope.sendMessage = function () {
        // $rootScope.loading = true;
        $scope.message.attachment = $('#messagefile')[0].files[0];

        $scope.messageModalError = false;
        $scope.messageModalTitleError = false;

        if($scope.message.messageTitle == undefined || $scope.message.messageTitle.length < 2){
            // $rootScope.loading = false;
            $scope.messageModalTitleError = true;
        }
        if( ($scope.message.message == undefined || $scope.message.message.length < 2)&& $scope.message.attachment == undefined ){
            $scope.messageModalError = true;
            // $rootScope.loading = false;
        }
        if(!($scope.message.messageTitle == undefined || $scope.message.messageTitle.length < 2) && !( ($scope.message.message == undefined || $scope.message.message.length < 2)&& $scope.message.attachment == undefined )){

           $rootScope.loading = true;

            
            $scope.message._id = '';
            $scope.message.candidateID = $scope.profile._id;

            console.log("file is ",$scope.message,$scope.loading);

            var data = new FormData();

            data.append("_id", '');
            data.append("candidateID", $scope.profile._id);
            data.append("message", $scope.message.message);
            data.append("messageTitle", $scope.message.messageTitle);
            if($scope.message.attachment != undefined)
                data.append("attachment",$scope.message.attachment);


            $http({
                method:'POST',
                url:CONSTANT.apiUrl + '/api/recruiter/messageToCandidate',
                headers:{
                    'authorization': $cookieStore.get('AccessToken'),
                    'Content-type': undefined
                },
                data : data

            })
                .success(function(response){
                    $rootScope.loading = false;

                    console.log("success",response);
                    bootbox.alert("Message Sent Successfully");
                    $("#message").modal("hide");
                    $('#messagefile').val(undefined);
                    $scope.attachmentName = '';

                })
                .error(function(response){
                    $rootScope.loading = false;
                    console.log(response);
                    bootbox.alert(response.message);
                    $("#message").modal("hide");
                    $('#messagefile').val(undefined);
                    $scope.attachmentName = '';

                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                    }
                });
        }
        
    };
    
    

    /*============================= Start : Favourite candidate API=================================*/

    $scope.markFavourite = function (id,name) {
        $rootScope.loading = true;

        console.log("id ",id);
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
                bootbox.alert(name+" added to your Favourite list");
                $scope.profile.isFavourite = response.data.isFavourite;
                $rootScope.loading = false;
            })
            .error(function(response){
                console.log(response);
                $rootScope.loading = false;
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })
    };

    $scope.unFavourite = function (id,name) {
        $scope.unfavname = name;
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
        $rootScope.loading = true;
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
                $rootScope.loading = false;
                bootbox.alert($scope.unfavname +" removed from your Favourite list")
                console.log(response);
                $scope.profile.isFavourite = response.data.isFavourite;
            })
            .error(function(response){
                $rootScope.loading = false;
                console.log(response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })

    };


    /*============================= End : Favourite candidate API=================================*/

}]);