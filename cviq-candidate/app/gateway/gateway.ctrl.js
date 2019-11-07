angular.module('Cviq').controller('gatewayCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window',
    function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

        if($cookieStore.get('AccessToken') == undefined){
            $scope.confirmLogOut();
        }
        $scope.packageSelected = $cookieStore.get("package");
        console.log("hahah",typeof($scope.packageSelected));
        $rootScope.loading = true;

        $scope.month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        $scope.year = [];
        var date = new Date();
        console.log(date.getFullYear());
        var currentyear = date.getFullYear();
        for(var i=0;i<50;i++){
            $scope.year.push(i+currentyear);
            
        }
        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },0);


//===============START: auto detect card================================

        $scope.cardType = '';
        $(function() {$('#myCardType').validateCreditCard(function(result) {
            // $('.log').html('Card type: ' + (result.card_type == null ? '-' : result.card_type.name)
            //     + '<br>Valid: ' + result.valid
            //     + '<br>Length valid: ' + result.length_valid
            //     + '<br>Luhn valid: ' + result.luhn_valid);
            if(result.card_type != null){
                if(result.card_type.name == 'amex'){
                    $scope.cardType = 'americanexpress';
                    $('#amex').css('display','block');
                    $('#mastercard').css('display','none');
                    $('#visa').css('display','none');
                    $('#discover').css('display','none');
                }
                if(result.card_type.name == 'visa'){
                    $scope.cardType = 'visa';
                    $('#amex').css('display','none');
                    $('#mastercard').css('display','none');
                    $('#visa').css('display','block');
                    $('#discover').css('display','none');
                }
                if(result.card_type.name == 'mastercard'){
                    $scope.cardType = 'mastercard';
                    $('#amex').css('display','none');
                    $('#mastercard').css('display','block');
                    $('#visa').css('display','none');
                    $('#discover').css('display','none');
                }
                if(result.card_type.name == 'discover'){
                    $scope.cardType = 'discover';
                    $('#amex').css('display','none');
                    $('#mastercard').css('display','none');
                    $('#visa').css('display','none');
                    $('#discover').css('display','block');
                }
            }
            else{
                    $scope.cardType = '-';
                    $('#amex').css('display','none');
                    $('#mastercard').css('display','none');
                    $('#visa').css('display','none');
                    $('#discover').css('display','none');
            }
            // console.log(result);

        });
        });

//===============END: auto detect card================================
        



            $scope.paymentMethod = function (id) {
                $scope.method = id;
                console.log(id);
               if(id == 1) {
                   $('#debitCard').addClass('cardsActive');
                   $('#creditCard').removeClass('cardsActive');
                   $('#debitCard2').addClass('cardTextActive');
                   $('#creditCard2').removeClass('cardTextActive');
               }
                else{
                   $('#debitCard').removeClass('cardsActive');
                   $('#creditCard').addClass('cardsActive');
                   $('#debitCard2').removeClass('cardTextActive');
                   $('#creditCard2').addClass('cardTextActive');

               }
            };
        $scope.paymentMethod(1);


 //===============START: paypal access token================================

        $scope.accessTokenPayPal ='';
        var jsontobase = 'Basic '+btoa("AaBcki5_ADWtJPG12FeRRTvzxhHhHtqkaPRfafIuQG92KdeaIjQ0Kk5MnSUICT8QCMgNUqt2lYGTJnWW:EGrAEySjEc5WIm6dHvAbSVKlqPcrOYutEA2d_PiNbP1d3TMaeuagEGnEONP6ZOfkBh1q-TPHS7z6ZpOH");
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
                $rootScope.loading = false;
                $scope.accessTokenPayPal = response.token_type +' '+ response.access_token;
               // console.log($scope.accessTokenPayPal,response);
                $cookieStore.put('payPalAccessToken', $scope.accessTokenPayPal);
            })
            .error(function (response) {
                $rootScope.loading = false;
                console.log(response);
            });

//===============END: paypal access token================================

//===============START: payment api ================================
        $scope.gatewayfunc = function (rec){

           var namearray =  rec.name.split(' ');
            rec.firstName = namearray[0];
            rec.lastName = namearray[1];
            console.log(rec, $scope.method);


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
                                    "number": rec.cardNo,
                                    "type": $scope.cardType,
                                    "expire_month": rec.month,
                                    "expire_year": rec.year,
                                    "cvv2": rec.cvv,
                                    "first_name": rec.firstName,
                                    "last_name": rec.lastName
                                }
                            }]
                    },
                    "transactions": [
                        {
                            "amount":
                            {
                                "total":  $scope.packageSelected,
                                "currency": "USD"
                            },
                            "description": "This is the payment transaction description."
                        }]
                }
            })
                .success(function (response) {
                    console.log(response);

                })
                .error(function (response) {
                    console.log(response);
                });
        };
//===============END: payment api=================================


//===============START: payPal Payment  api ================================
        $scope.payPalPayment = function (){

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
                        "cancel_url": "http://test.cviq360.com/cviq-candidate/#/home/gateway"
                    },
                    "payer":
                    {
                        "payment_method": "paypal"
                    },
                    "transactions": [
                        {
                            "amount":
                            {
                                "total":  $scope.packageSelected,
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
//===============END: pay pal payment api=================================








        /*=============================Start: Custom Factory Function ================================*/

        $scope.FirsText = function($event){
            characterService.characterFunction($event);
        };

        $scope.isNumberKey = function($event){
            characterService.numberFunction($event);
        };

        $scope.isCodeKey = function($event){
            characterService.codeFunction($event);
        };

/*=============================End: Custom Factory Function ================================*/

}]);