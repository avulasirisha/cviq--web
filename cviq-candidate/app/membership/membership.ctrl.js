angular.module('Cviq').controller('membershipCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','ngDialog', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window, ngDialog){


    /*============================= Start : get promo lists ===============================*/
    var revaluation = $cookieStore.get('revaluation') ;
    if( revaluation == undefined ){
            revaluation = false;
    }else{
            revaluation = true;
            $scope.rev_ation = true;
    }
    $http({
        method:'GET',
        url: CONSTANT.apiUrl+'/api/common/getPromoList',
        params: {
            userType:'CANDIDATE'
        }
    })
        .success(function (response) {
            console.log('Promo Lists Success', response);
            $scope.promoCodeLists = response.data;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function (response) {
            console.log('Promo Lists Error', response);
        });

    /*============================= End : get promo lists ===============================*/


    $scope.selCard = 'DEBIT';

    $timeout(function(){
        $('.selectpicker').selectpicker();
    },0);

    var currentYear = new Date().getFullYear();
    $scope.currentYearArray = [];

    for(var i = 0; i < 10; i++){
        $scope.currentYearArray.push(currentYear);
        currentYear++;
    }
    console.log('currentYearArray', $scope.currentYearArray);

    $timeout(function () {

        $('#cc_number').validateCreditCard(function(result)
        {
            console.log(result);

            if(result.card_type != null){
                if(result.card_type.name == 'visa'){
                    $scope.cardVal = 'visa'
                }
                if(result.card_type.name == 'visa_electron'){
                    $scope.cardVal = 'visa_electron'
                }
                if(result.card_type.name == 'maestro'){
                    $scope.cardVal = 'maestro'
                }
                if(result.card_type.name == 'mastercard'){
                    $scope.cardVal = 'mastercard'
                }
                if(result.card_type.name == 'discover'){
                    $scope.cardVal = 'discover'
                }
            }
            //alert('CC type: ' + result.card_type.name
            //    + '\nLength validation: ' + result.length_valid
            //    + '\nLuhn validation: ' + result.luhn_valid);
        });

    },0);

    //===============START: paypal access token================================

    $scope.accessTokenPayPal ='';
  //  var jsontobase = 'Basic '+btoa("AaBcki5_ADWtJPG12FeRRTvzxhHhHtqkaPRfafIuQG92KdeaIjQ0Kk5MnSUICT8QCMgNUqt2lYGTJnWW:EGrAEySjEc5WIm6dHvAbSVKlqPcrOYutEA2d_PiNbP1d3TMaeuagEGnEONP6ZOfkBh1q-TPHS7z6ZpOH");
      var jsontobase = 'Basic '+btoa("AZhL8uhvKEfZEHfZuZM_Q_MOHM7MpRXl2nqdUUxBzw-fcCL-0SeKnF4C5d4Q3M4zF0epm70KvuTrjTI1:ECa8vDBSBWW23x9tjx6hzZyqt-B8SZosDu25t0vxSxCmJ9R35UReS3IR-thoQqVkcVNxar4KxZMZoE7r");
    console.log("jsontobase",jsontobase);
    $http({
        method: 'POST',
        url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization':jsontobase
        },
        data: 'grant_type=client_credentials'
    })
        .success(function (response) {
            console.log('success', response);
            $scope.accessTokenPayPal = response.token_type +' '+ response.access_token;
            $cookieStore.put('PaypalAccessToken',$scope.accessTokenPayPal);
        })
        .error(function (response) {
            console.log('Error', response);
        });

    //===============END: paypal access token================================


    //=============== START: get interview charges api ================================

    $scope.interviewChargesData;
    $scope.interviewAmount;
    $scope.actualAmount;

    $http({
        method:'GET',
        url: CONSTANT.apiUrl+'/api/candidate/CandidateMembership' ,
        headers: {
            authorization: $cookieStore.get('AccessToken')
        },
    })
        .success(function (response) {
            console.log('Interview Charges Success', response);
            $scope.Membershipdata = response.data;
            $scope.interviewAmount = response.data.planRate;
            $scope.actualAmount = response.data.planRate;
            response.data.revaluation = revaluation;
            $cookieStore.put('membership_pay', JSON.stringify( response.data ) );
        })
        .error(function (response) {      
            console.log('Error', response);      
        })

    //=============== END: get interview charges api ================================



    //===============START: payment api================================

    $scope.pay = function (data) {

        console.log(data);

        var fname = data.name.split(' ');
        console.log(fname);

        //var cardExp = data.mmyy.split('/');
        //console.log(cardExp);

        $scope.loading = true;

        $http({
            method: 'POST',
            url: 'https://api.sandbox.paypal.com/v1/payments/payment',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $scope.accessTokenPayPal
            },
            data: {
                "intent": "sale",
                "payer":
                {
                    "payment_method": "credit_card",
                    "funding_instruments": [
                        {
                            "credit_card":
                            {
                                "number": data.card,
                                "type": $scope.cardVal,
                                "expire_month": data.mm,
                                "expire_year": data.yy,
                                "cvv2": data.cvv,
                                "first_name": fname[0],
                                "last_name": fname[1]
                            }
                        }]
                },
                "transactions": [
                    {
                        "amount":
                        {
                            "total": $scope.interviewAmount,
                            "currency": "USD"
                        },
                        "description": "This is the payment transaction description."
                    }]
            }
        })
            .success(function (response) {
                console.log('success', response);
                //bootbox.alert('Payment Successfully');
                //$state.go('home.dashboard.qualitativeScore.pastInterview',{},{ reload:true });

                var buyMembershipData = {
                    paymentID: response.id,
                    amount : $scope.interviewAmount,
                    planType:$scope.Membershipdata.planType,
                    revaluation : revaluation,
                    Pauth : btoa( $scope.accessTokenPayPal )
                };

                if($scope.appliedPromoCode != undefined){
                    buyMembershipData.promoID = $scope.appliedPromoCode.promoID
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

            })
            .error(function (response) {
                console.log('Error', response);
                $scope.loading = false;
                bootbox.alert('Invalid Details');
            });

    }

    //===============End: payment api================================


    //=============== START: Pay with Paypal api ================================

    $scope.payPalPayment = function (){
console.log($scope.accessTokenPayPal);
        $http({
            method: 'POST',
            url: 'https://api.sandbox.paypal.com/v1/payments/payment',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $scope.accessTokenPayPal
            },
            data: {
                "intent": "sale",
                "redirect_urls":
                {
                    "return_url": "http://test.cviq360.com/cviq-candidate/#/home/redirectUrl",
                    "cancel_url": "http://test.cviq360.com/cviq-candidate/#/home/membership"
                },
                "payer":
                {
                    "payment_method": "paypal"
                },
                "transactions": [
                    {
                        "amount":
                        {
                            "total":  $scope.interviewAmount,
                            "currency": "USD"
                        },
                        "description": "This is the payment transaction description."
                    }]
            }
        })
            .success(function (response) {
                console.log(response);
                window.location.href = response.links[1].href;
            })
            .error(function (response) {
                console.log(response);
            });
    };

    /*============================= Start : apply promo code ===============================*/

    $scope.appliedPromoCode;
    
    $scope.applyPromoCode = function (promocodeData) {

        $scope.disBtn = true;

        if(promocodeData == undefined){
            return;
        }

        console.log('$scope.disBtn', $scope.disBtn);

        console.log('promocodeData', promocodeData);

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl+'/api/candidate/applyPromoForCandidate',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "promoName": promocodeData.promoName,
                "amount": $scope.actualAmount
            }
        })
            .success(function (response) {
                console.log('Apply Promo Code Success', response);
                $scope.disBtn = false;
                $scope.appliedPromoCode = response.data;
                $scope.interviewAmount = response.data.amount;
                var cookiestore= JSON.parse( $cookieStore.get('membership_pay') );
                cookiestore.planRate =response.data.amount; 
                cookiestore.promoID =response.data.promoID;
                console.log( cookiestore )  ;
                $cookieStore.put('membership_pay', JSON.stringify( cookiestore) );           
            })
            .error(function (response) {
                console.log('Apply Promo Code Error', response);
                $scope.disBtn = false;
                bootbox.alert(response.message);
            })

    }

    /*============================= End : apply promo code ===============================*/
    
//=============== END: Pay with Paypal api =================================
    
    //$scope.monthYearValid= function () {
    //    console.log($scope.payment.mmyy.length);
    //    if($scope.payment.mmyy.length == 2){
    //        $scope.payment.mmyy = $scope.payment.mmyy +'/'
    //    }
    //}

}]);