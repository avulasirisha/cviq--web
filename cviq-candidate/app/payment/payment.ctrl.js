angular.module('Cviq').controller('paymentCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','characterService','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, characterService, $state){

    $('input:checkbox').click(function() {
        $('input:checkbox').not(this).prop('checked', false);
    });

    $("#cheque-Payment :input").prop("disabled", true);
    $("#direct-Payment :input").prop("disabled", true);
    $("#save-payment").prop("disabled", true);
    $("#save-payment").css("opacity", "0.5");


    /*=============================Start: Submit Payment Function ================================*/

    $scope.submitPayment = function(data) {

        console.log(data);

        if($('#cheque-checkbox').is(':checked'))
        {
            $scope.viaCheque = true;
        }
        else{
            $scope.viaCheque = false;
        }

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/interviewer/updatePaymentInfo',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "viaCheque": $scope.viaCheque,
                "name": data.name,
                "addressOne": data.address1,
                "addressTwo": data.address2,
                "state": data.state,
                "country": data.country,
                "areaCode": data.code,
                "mobileNumber": data.phone,
                "customerName": data.customerName,
                "accountNumber": data.customerAccount,
                "bankName": data.customerBankName,
                "address": data.customerAddress
            }

        })
            .success(function(response){
                console.log(response);
                bootbox.alert(response.message);
            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
            })
    }

    /*=============================End: Submit Payment Function ================================*/

    /*=============================Start: Checkbox Validation Function ================================*/

    $('#cheque-checkbox').change(function(){
        if($(this).prop("checked")) {
            $scope.req = false;
            $scope.reqs = true;
            $("#cheque-Payment :input").css("background", "#fff");
            $("#direct-Payment :input").css("background", "#d4d4d4");
            $("#cheque-Payment :input").prop("disabled", false);
            $("#direct-Payment :input").prop("disabled", true);
            $("#save-payment").prop("disabled", false);
            $("#save-payment").css("opacity", "1");
        }
        else{
            $("#cheque-Payment :input").css("background", "#d4d4d4");
            $("#cheque-Payment :input").prop("disabled", true);
            $("#direct-Payment :input").prop("disabled", false);
            $("#save-payment").prop("disabled", true);
            $("#save-payment").css("opacity", "0.5");
        }
    });

    $('#direct-checkbox').change(function(){
        if($(this).prop("checked")) {
            $scope.reqs = false;
            $scope.req = true;
            $("#direct-Payment :input").css("background", "#fff");
            $("#cheque-Payment :input").css("background", "#d4d4d4");
            $("#direct-Payment :input").prop("disabled", false);
            $("#cheque-Payment :input").prop("disabled", true);
            $("#cheque-Payment :input").removeAttr('required');
            $("#save-payment").prop("disabled", false);
            $("#save-payment").css("opacity", "1");
        }
        else{
            $("#direct-Payment :input").css("background", "#d4d4d4");
            $("#direct-Payment :input").prop("disabled", true);
            $("#cheque-Payment :input").prop("disabled", false);
            $("#save-payment").prop("disabled", true);
            $("#save-payment").css("opacity", "0.5");
        }
    });

    /*=============================End: Checkbox Validation Function ================================*/

    $scope.FirsText = function($event){
        characterService.characterFunction($event);
    };

    $scope.isNumberKey = function($event){
        characterService.numberFunction($event);
    };

    $scope.isCodeKey = function($event){
        characterService.codeFunction($event);
    };


    /*=============================Start: Get Interviewer Payment Function ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/interviewer/getInterviewerPaymentInfo',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log(response);
            $scope.paymentData = response.data;
            $scope.chequeDetails = $scope.paymentData.chequeDetail;
            $scope.accountDetail = $scope.paymentData.accountDetail;

            $scope.pay = {
                name:$scope.chequeDetails.name,
                address1:$scope.chequeDetails.addressOne,
                address2:$scope.chequeDetails.addressTwo,
                state:$scope.chequeDetails.state,
                country:$scope.chequeDetails.country,
                code:$scope.chequeDetails.areaCode,
                phone:$scope.chequeDetails.mobileNumber,
                customerName:$scope.accountDetail.customerName,
                customerAccount:$scope.accountDetail.accountNumber,
                customerBankName:$scope.accountDetail.bankName,
                customerAddress:$scope.accountDetail.address
            }
        })
        .error(function(response){
            console.log(response);
            bootbox.alert(response.message);
        })

    /*=============================End: Get Interviewer Payment Function ================================*/

}]);