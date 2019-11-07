angular.module('Cviq').controller('gatewayCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$location',
    function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window,$location){

        if($cookieStore.get('AccessToken') == undefined){
            $scope.confirmLogOut();
        }
        $scope.package = $cookieStore.get("package");
        console.log("package   ", $scope.package );
        $scope.packageSelected = $scope.package.planRate;
        console.log("hahah",$scope.package.planRate);


        $scope.promoCode = '';
        $scope.promoApplied = false;
        $scope.newCost = $scope.packageSelected;
        $scope.promoId = '';




        // var urlarray =  $location.absUrl().split('?type=');
        //
        // var payTemp = urlarray[1];
        // var payTempArray = payTemp.split('&plan=');
        // $scope.type = payTempArray[0];
        // $scope.packageSelected = payTempArray[1];


        // console.log("Type is",$scope.type,"charges are ", $scope.packageSelected);


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
       // var jsontobase = 'Basic '+btoa("AaBcki5_ADWtJPG12FeRRTvzxhHhHtqkaPRfafIuQG92KdeaIjQ0Kk5MnSUICT8QCMgNUqt2lYGTJnWW:EGrAEySjEc5WIm6dHvAbSVKlqPcrOYutEA2d_PiNbP1d3TMaeuagEGnEONP6ZOfkBh1q-TPHS7z6ZpOH");
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
                $rootScope.loading = false;
                $scope.accessTokenPayPal = response.token_type +' '+ response.access_token;
               // console.log($scope.accessTokenPayPal,response);
                $cookieStore.put('payPalAccessToken', $scope.accessTokenPayPal)
            })
            .error(function (response) {
                $rootScope.loading = false;
                console.log(response);
            });

//===============END: paypal access token================================

//===============START: payment api ================================
        $scope.gatewayfunc = function (rec){
            $rootScope.loading = true;

           var namearray =  rec.name.split(' ');
            rec.firstName = namearray[0];
            rec.lastName = namearray[1];
            console.log(rec, $scope.method);

            var payment = '';
            if( $scope.promoApplied){
                payment =$scope.newCost;
            }
            else{
                payment =$scope.packageSelected;
            }

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
                                "total":  payment,
                                "currency": "USD"
                            },
                            "description": "This is the payment transaction description."
                        }]
                }
            })
                .success(function (response) {
                    console.log(response,response.transactions[0].related_resources[0].sale.id,response.id);

                    var promodata = {
                        "membershipPlanID": $scope.package._id,
                        "paymentID": response.id ,
                        "amount":  payment,
                        "Pauth" : btoa( $scope.accessTokenPayPal )
                    }
                    
                    if( $scope.promoApplied){
                        promodata.promoID =$scope.promoId;
                    }
                    else{
                       
                    }


                    $http({
                        method:'POST',
                        url: CONSTANT.apiUrl + '/api/recruiter/buyMembershipPlan',
                        headers:{
                            authorization: $cookieStore.get('AccessToken')
                        },
                        data: promodata

                    })
                        .success(function(response){
                            $rootScope.loading = false;
                            console.log(response);
                            if(response.data.membershipTaken == false){
                                bootbox.alert("Payment Failure. Please try again. <br> Thank You");
                            }

                            else{
                                // bootbox.alert("Payment Failure. Please Try Again. <br> Thank You");
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

                        })

                })
                .error(function (response) {
                    console.log(response);
                    $rootScope.loading = false;
                    bootbox.alert("Invalid Card Details")
                });
        };
//===============END: payment api=================================


//===============START: payPal Payment  api ================================
        $scope.payPalPayment = function (){

            var payment = '';
            if( $scope.promoApplied){
                payment =$scope.newCost;

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
                            "return_url": "http://test.cviq360.com/cviq-recruiter/#/home/redirectUrl?promo=true&promoId="+$scope.promoId,
                            "cancel_url": "http://test.cviq360.com/cviq-recruiter/#/home/gateway"
                        },
                        "payer":
                        {
                            "payment_method": "paypal"
                        },
                        "transactions": [
                            {
                                "amount":
                                {
                                    "total":  payment,
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
            }
            else{
                payment =$scope.packageSelected;
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
                            "return_url": "http://test.cviq360.com/cviq-recruiter/#/home/redirectUrl?promo=false&promoId=none',
                            "cancel_url": "http://test.cviq360.com/cviq-recruiter/#/home/gateway"
                        },
                        "payer":
                        {
                            "payment_method": "paypal"
                        },
                        "transactions": [
                            {
                                "amount":
                                {
                                    "total":  payment,
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
            }


        };
//===============END: pay pal payment api=================================





        /*============================= Start : get promo lists ===============================*/

        $http({
            method:'GET',
            url: CONSTANT.apiUrl+'/api/common/getPromoList',
            params: {
                userType:'RECRUITER'
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

        /*============================= Start : apply promo code ===============================*/

        $scope.appliedPromoCode;

        $scope.applyPromoCode = function (promocodeData) {
        
            console.log('promocodeData', promocodeData);
        
            $http({
                method:'PUT',
                url: CONSTANT.apiUrl+'/api/recruiter/applyPromoForRecruiter',
                headers:{
                    authorization: $cookieStore.get('AccessToken')
                },
                data: {
                    "promoName": promocodeData.promoName,
                    "amount": $scope.packageSelected
                }
            })
                .success(function (response) {
                    console.log('Apply Promo Code Success', response);
                    $scope.appliedPromoCode = response.data;
                    $rootScope.loading = false;
                    $scope.promoApplied = true;
                    
                    
                    $scope.successPromo = response.data.promoName;

                    $scope.newCost = response.data.amount;
                    $scope.promoId = response.data.promoID;
                    $scope.package.planRate = response.data.amount;
                    $cookieStore.put("package", $scope.package );
                    console.log(response);

                    bootbox.alert("Promo Applied Successfully");
                })
                .error(function (response) {
                    bootbox.alert( response.message);
                    console.log('Apply Promo Code Error', response);
                })
        
        }




        // $scope.gatewayPromofunc = function () {
        //     console.log($scope.promoCode);
        //     $http({
        //         method:'PUT',
        //         url: CONSTANT.apiUrl + '/api/recruiter/applyPromoForRecruiter',
        //         headers:{
        //             authorization: $cookieStore.get('AccessToken')
        //         },
        //         data:{
        //             "promoName": $scope.promoCode,
        //             "amount": $scope.packageSelected
        //
        //         }
        //
        //     })
        //         .success(function(response){
        //             $rootScope.loading = false;
        //             $scope.promoApplied = true;
        //             $scope.appliedPromoCode = response.data;
        //            
        //             $scope.newCost = response.data.amount;
        //             $scope.promoId = response.data.promoID;
        //             console.log(response);
        //
        //             bootbox.alert("Promo Applied Successfully");
        //
        //
        //
        //         })
        //         .error(function(response){
        //
        //             $rootScope.loading = false;
        //             bootbox.alert(response.message);
        //             console.log(response);
        //
        //         })
        //
        //
        // };


        /*============================= End : apply promo code ===============================*/



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