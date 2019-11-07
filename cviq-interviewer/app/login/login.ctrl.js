angular.module('Cviq').controller('loginCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout){

    if($cookieStore.get('AccessToken') != undefined){
        $state.go('home.dashboard');
    }

    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /*=============================Start: Login Interviewer Function ================================*/

    $scope.login = function (data) {
        $scope.loading = true;
        console.log(data);
        $http({
            method:'POST',
            url:CONSTANT.apiUrl + '/api/interviewer/loginInterviewer',
            data:{
                "email": data.email,
                "password": data.password,
                "deviceType": "WEB",
                "deviceToken": "string"
            }
        })
            .success(function (response) {
                console.log("success", response);
                $scope.loading = false;

                if(response.data.isVerified == true){
                    $cookieStore.put('loggedIn','verified');
                }
                else{
                    $cookieStore.put('loggedIn',true);
                }
                $cookieStore.put('AccessToken', response.data.accessToken);
                $cookieStore.put('UserDetails', response.data);
                $state.go('home.dashboard',{}, { reload: true });
                $rootScope.scrollToTop();

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
        $scope.loading = true;
        console.log("Success", data);
        $scope.linkedinID = data.id;

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/interviewer/loginInterviewerViaLinkedIn',
            data: {
                "linkedInId": $scope.linkedinID,
                "email": data.emailAddress,
                "deviceType": "WEB",
                "deviceToken": "string"
            }
        })
                .success(function(response){
                    console.log("Successin", response);
                    $scope.loading = false;

                    if(response.data.isVerified == true){
                        $cookieStore.put('loggedIn','verified');
                    }
                    else{
                        $cookieStore.put('loggedIn',true);
                    }

                    $cookieStore.put('AccessToken', response.data.accessToken);
                    $cookieStore.put('UserDetails', response.data);
                    $state.go('home.dashboard',{},{ reload:true });
                    $rootScope.scrollToTop();

                    IN.User.logout(function () {
                    console.log("User logged out of LinkedIn");
                    })

                })
                .error(function(response){
                    console.log("Errorin", response);
                    $scope.loading = false;
                    IN.User.logout(function () {
                        console.log("User logged out of LinkedIn");
                    })
                    if(response.statusCode == 400){
                        bootbox.alert('LinkedIn id not found. Please signup first');
                        $state.go('home.signup', {}, {reload : true});
                    }
                })
    }

    function onError(error){
        console.log("Error", error);
    }

    /*=============================End: Login Via LinkedIn Function ================================*/

}]);