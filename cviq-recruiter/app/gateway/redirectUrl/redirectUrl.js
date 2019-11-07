angular.module('Cviq').controller('redirectCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','$location','ngDialog',
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

        var urlarray =  $location.absUrl().split('=');
        var promoAppliedTemp =  urlarray[1];
        var promoAppliedArray =  promoAppliedTemp.split('&');
        var promoApplied =  promoAppliedArray[0];


        var promoTemp =  urlarray[2];
        var promoArray =  promoTemp.split('&');
        var promoId =  promoArray[0];
        
        console.log('Promo Applied ',promoApplied , "Promo ID",promoId);

        var payTemp = urlarray[3];
        var payTempArray = payTemp.split('&');
        var pay = payTempArray[0];
        var payerId = urlarray[5];
        var paymentid = urlarray[3].split('&')[0];


      var promodata = {
          "membershipPlanID": $scope.package._id,
          "paymentID":paymentid ,
          "amount":  $scope.package.planRate,
          "Pauth" : btoa(   $cookieStore.get('payPalAccessToken' ) )
      }
      
      if( $scope.promoApplied){
          promodata.promoID =$scope.promoId;
      }
    

        $scope.accessTokenPayPal = $cookieStore.get('payPalAccessToken');
            $http({
                method:'POST',
                url: CONSTANT.apiUrl + '/api/recruiter/buyMembershipPlan',
                headers:{
                    authorization: $cookieStore.get('AccessToken')
                },
                data:promodata

            })
                .success(function(response){
                    $rootScope.loading = false;
                    console.log(response);
                    if(response.data.membershipTaken == false){
                        bootbox.alert("Payment Failure. Please try again. <br> Thank You");
                        $state.go('home.package');
                    }
                    else{
                        var UserDetails = $cookieStore.get('UserDetails');
                        UserDetails.membershipPlanType = $scope.package.planType;
                        UserDetails.membershipTaken =true;
                        $cookieStore.put('UserDetails',UserDetails);

                        bootbox.alert("Membership taken successfully");
                        $state.go("home.dashboard.recentlyPostedJobs", {}, {reload: true});
                    }

                })
                .error(function(response){

                    $rootScope.loading = false;
                    bootbox.alert("Payment Failure. Please try again. <br> Thank You");
                    console.log(response);
                    $state.go('home.package');

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