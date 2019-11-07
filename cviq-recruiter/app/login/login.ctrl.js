angular.module('Cviq').controller('loginCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout){

    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



    if($cookieStore.get('AccessToken')!=undefined){
        console.log("you are already logged in");

        var isMember = $cookieStore.get('UserDetails').membershipTaken;
        if(isMember == false){
            $state.go('home.package',{}, {reload: true});
            // $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});
        }
        else{
            // $state.go('home.package',{}, {reload: true});
            $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});
        }

    }
    
    
    
    /*=============================Start: Login Recruiter Function ================================*/

    $scope.login = function (data) {
        $rootScope.loading = true;
        console.log(data);
        $http({
            method:'POST',
            url:CONSTANT.apiUrl + '/api/recruiter/loginRecruiter',
            data:{
                "email": data.email,
                "password": data.password,
                "deviceType": "WEB",
                "deviceToken": "string",
                "appVersion": "1"
            }
        })
            .success(function (response) {
                $rootScope.loading = false;
                console.log("success loolololo", response);
                $cookieStore.put('loggedIn',true);
                $cookieStore.put('AccessToken', response.data.accessToken);
                $cookieStore.put('UserDetails', response.data);

                console.log("Member Ship Taken",response.data.membershipTaken);
                if(response.data.membershipTaken == false){
                    $state.go('home.package',{}, {reload: true});
                    // $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});
                }

                else{
                    // $state.go('home.package',{}, {reload: true});
                    $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});
                }

                // $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});

                $timeout(function(){
                    $state.reload();
                },100);

            })
            .error(function(response){
                $rootScope.loading = false;
                console.log("error", response);
                bootbox.alert(response.message);
            })
    };

    /*=============================End: Login Interviewer Function ================================*/

    $scope.forgotPassword = function(){
        $state.go('home.forgotPassword');
        $rootScope.scrollToTop();
    };

    /*=============================Start: Login Via LinkedIn Function ================================*/

    $scope.liAuth = function(){
        /*$rootScope.loading = true;
        $timeout(function(){
            $rootScope.loading = false;
        },1000);*/
        IN.User.authorize.then(function()
        {
            console.log("Inside");
           // $scope.onLinkedInLoad();
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
        $scope.linkedinID = data.id;

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/recruiter/loginRecruiterViaLinkedIn',
            data: {
                "linkedInId": $scope.linkedinID,
                "email": data.emailAddress,
                "deviceType": "WEB",
                "deviceToken": "string"
            }
        })
                .success(function(response){
                    console.log("Successin", response);
                    $cookieStore.put('loggedIn',true);
                    $cookieStore.put('AccessToken', response.data.accessToken);
                    $cookieStore.put('UserDetails', response.data);
                    $state.go('home.package');
                    $timeout(function(){
                        $state.reload();
                    },100);

                    IN.User.logout(function () {
                    console.log("User logged out of LinkedIn");
                    })

                })
                .error(function(response){
                    console.log("Errorin", response);
                    IN.User.logout(function () {
                        console.log("User logged out of LinkedIn");
                    })
                    if(response.statusCode == 400){
                        bootbox.alert('LinkedIn id not found. Please signup first');
                        $state.go('home.signup');
                    }
                })
    }

    function onError(error){
        console.log("Error", error);
        bootbox.alert(error.message);
    }

    /*=============================End: Login Via LinkedIn Function ================================*/

}]);