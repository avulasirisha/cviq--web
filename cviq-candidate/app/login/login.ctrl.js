angular.module('Cviq').controller('loginCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout){

    if($cookieStore.get('AccessToken') != undefined){
        $state.go('home.dashboard.aggregatedScore');
    }

    //$scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.myregex = "^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,}))@"
        + "((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\."
        + "([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|"
        + "([a-zA-Z]+[\\w-]+\\.)+[a-zA-Z]{2,4})$";

    /*=============================Start: Login Interviewer Function ================================*/

    $scope.login = function (data) {
        $scope.loading = true;
        console.log(data);
        $http({
            method:'POST',
            url:CONSTANT.apiUrl + '/api/candidate/login',
            data:{
                "email": data.email,
                "password": data.password,
                "deviceType": "WEB",
                "deviceToken": "string"
            }
        })
            .success(function (response) {
                console.log("success", response);
             //   $cookieStore.put('loggedIn',true, { "path": "/" } );
                var now = new Date();
                now.setTime(now.getTime() + ( 60 * 60 * 1000));
                if( window.location.hostname == "localhost"  ){
                
                    document.cookie = "loggedIn=true; expires=" + now.toUTCString() + "; path=/site";
                    document.cookie = "CandidateOpt="+response.data.accessToken+";expires=" + now.toUTCString() + "; path=/site";
                }else{
                
                    document.cookie = "loggedIn=true; expires=" + now.toUTCString() + "; path=/";
                    document.cookie = "CandidateOpt="+response.data.accessToken+";expires=" + now.toUTCString() + "; path=/";
                }
            
               $cookieStore.put('AccessToken', response.data.accessToken,  { "path": "/" } );
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                //$cookieStore.put('UserDetails', response.data);
                $scope.loading = false;
                if(response.data.loginCount > 1){
                    $state.go('home.dashboard.aggregatedScore',{},{ reload: true });
                }
                else{
                    $state.go('home.completeYourProfile',{}, { reload: true });
                }

            })
            .error(function(response){
                console.log("error", response);
                $scope.loading = false;
                bootbox.alert(response.message);
            })
    };

    /*=============================End: Login Interviewer Function ================================*/

    $scope.forgotPassword = function(){
        $state.go('home.forgotPassword',{},{ reload: true });
        $rootScope.scrollToTop();
    };

    $scope.goToSignup = function(){
        $state.go('home.signup',{},{ reload: true });
        $rootScope.scrollToTop();
    };

    /*=============================Start: Login Via LinkedIn Function ================================*/

    $scope.liAuth = function(){
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
        $scope.loading = true;
        $scope.linkedinID = data.id;

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/candidate/loginViaLinkedIn',
            data: {
                "linkedInId": $scope.linkedinID,
                "email": data.emailAddress,
                "deviceType": "WEB",
                "deviceToken": "string"
            }
        })
                .success(function(response){
                    console.log("Successin", response);
                    $cookieStore.put('loggedIn',true, { path: "" });
                    $cookieStore.put('AccessToken', response.data.accessToken);
                    localStorage.setItem('UserDetails',JSON.stringify(response.data));
                    //$cookieStore.put('UserDetails', response.data);
                    $state.go('home.dashboard.aggregatedScore');
                    $scope.loading = false;
                    $timeout(function(){
                        $state.reload();
                    },100);

                    IN.User.logout(function () {
                    console.log("User logged out of LinkedIn");
                    })

                })
                .error(function(response){
                    $scope.loading = false;
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