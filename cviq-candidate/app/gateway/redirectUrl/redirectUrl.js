angular.module('Cviq').controller('redirectUrlCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','$location','ngDialog',
    function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window,$location,ngDialog){

        if($cookieStore.get('AccessToken') == undefined){
            $scope.confirmLogOut();
        }
        $scope.packageSelected = $cookieStore.get("package");
        console.log("hahah",typeof($scope.packageSelected));
        $rootScope.loading = true;

        var urlarray =  $location.absUrl().split('=');

        var payTemp = urlarray[1];
        var payTempArray = payTemp.split('&');
        var pay = payTempArray[0];
        var payerId = urlarray[3];


        $scope.accessTokenPayPal = $cookieStore.get('payPalAccessToken');

            $http({
                method: 'POST',
                url: 'https://api.sandbox.paypal.com/v1/payments/payment/'+pay+'/execute/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': $scope.accessTokenPayPal
                },
                data: { "payer_id" : payerId }
            })
                .success(function (response) {
                    $rootScope.loading = false;
                    console.log(response);
                })
                .error(function (response) {
                    $rootScope.loading = false;
                    console.log(response);
                });

//===============END: pay pal payment api=================================


    }]);