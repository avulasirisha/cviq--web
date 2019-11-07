angular.module('Cviq').controller('redirectUrlCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','ngDialog','$location', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window, ngDialog, $location){

    $scope.loading = true;

    var getUrl = $location.absUrl();

    var paymentIdFromPaypal = getUrl.split('=');
    paymentIdFromPaypal = paymentIdFromPaypal[1].split('&');
    
    var paypalaccess = $cookieStore.get('PaypalAccessToken');
  
     var cookiestore= JSON.parse( $cookieStore.get('membership_pay') );
     var buyMembershipData = {
          paymentID: paymentIdFromPaypal[0],
          amount : cookiestore.planRate,
          planType:cookiestore.planType,
          revaluation : cookiestore.revaluation,
          Pauth : btoa( paypalaccess )
      };

        if( cookiestore.promoID ){
            buyMembershipData.promoID = cookiestore.promoID;
        }

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/candidate/buyMembership',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: buyMembershipData
        })
            .success(function(response){
                console.log('success', response);
                //localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $scope.loading = false;
                bootbox.alert(response.message);
                $state.go('home.dashboard.qualitativeScore.pastInterview',{},{ reload:true });
            })
            .error(function(response){
                console.log('Error', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

}]);