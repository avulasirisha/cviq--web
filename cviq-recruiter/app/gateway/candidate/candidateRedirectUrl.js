angular.module('Cviq').controller('candidateRedirectUrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','$location','ngDialog',
    function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window,$location,ngDialog){
console.log("innnn");
        if($cookieStore.get('AccessToken') == undefined){
            $scope.confirmLogOut();
        }


        $scope.height = $window.innerHeight - 185;

        $('#height').css('height', $scope.height);

        $scope.package = $cookieStore.get("package");
        $scope.packageSelected = $cookieStore.get("package");
        console.log("hahah",typeof($scope.packageSelected));
        $rootScope.loading = true;

        var myurlarray = $location.absUrl().split('?candidate=');

        var urlarray =  myurlarray[1].split('=');

console.log("hello");
        var CandidateIdArray = urlarray[0].split('&');
        $scope.candidateId = CandidateIdArray[0];
        var payTemp = urlarray[1];
        var payTempArray = payTemp.split('&');
        var pay = payTempArray[0];
        // var payerId = urlarray[3];


        // var urlarray =  $location.absUrl().split('?candidate=');
        //
        // var payTemp = urlarray[1];
        // var payTempArray = payTemp.split('&Payment=');
        // $scope.candidateId = payTempArray[0];
        // $scope.packageSelected = payTempArray[1];
        //
        //
        // console.log("candidateId is",$scope.candidateId,"charges are ", $scope.packageSelected);




        $scope.accessTokenPayPal = $cookieStore.get('payPalAccessToken');
        
        $http({
            method:'POST',
            url: CONSTANT.apiUrl + '/api/recruiter/payForCandidate',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "candidateID": $scope.candidateId,
                "paymentID": pay
            }

        })
        .success(function(response){
            
            $rootScope.loading = false;
            console.log(response);
            
            // bootbox.alert("Payment Failure. Please Try Again. <br> Thank You");
            bootbox.alert("Payment successful");
            $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});
           

        })
        .error(function(response){

            $rootScope.loading = false;
            bootbox.alert("Payment Failure. Please try again. <br> Thank You");
            $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});
            console.log(response);

        })




        // $http({
        //         method: 'POST',
        //         url: 'https://api.sandbox.paypal.com/v1/payments/payment/'+pay+'/execute/',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': $scope.accessTokenPayPal
        //         },
        //         data: { "payer_id" : payerId }
        //     })
        //         .success(function (response) {
        //             $rootScope.loading = false;
        //             console.log(response);
        //         })
        //         .error(function (response) {
        //             $rootScope.loading = false;
        //             console.log(response);
        //         });

//===============END: pay pal payment api=================================


    }]);