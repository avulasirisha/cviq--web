/**
 * Created by sanjay on 3/25/15.
 */
App.controller('RestPasswordController', function ($scope, $http,$state, $cookies,$location , $cookieStore, MY_CONSTANT, $state,responseCode) {
    //initially set those objects to null to avoid undefined error
    // place the message if something goes wrong
    $scope.resetPass = {};
    $scope.text = "";
    $scope.show_reset=0;
    $scope.show_err=0;
    var type = $location.search().type;
    var token = $location.search().token;
    var email = $location.search().email;
    email = email.replace(' ', '+');
    //=================================================
    //                  VERIFY TOKEN
    //=================================================
    $.post(MY_CONSTANT.url + '/check_verification_token',
        {
            email: email,
            token: token
        }).then(
        function (data) {
            data = JSON.parse(data);
          if(data.status == responseCode.SUCCESS) {
              $scope.show_reset=1;
            }
            else {
              $scope.show_err=1;
            }
            $scope.$apply();
        });


    if(typeof type != 'undefined'){
        $scope.text = "GENERATE PASSWORD";
    }
    else{
        $scope.text = "RESET PASSWORD";
    }


    $scope.resetPassword = function () {
        $scope.errorMsg = '';
        if($scope.resetPass.password != $scope.resetPass.confirmpassword){
            $scope.errorMsg = "Both Passwords do not match.";

            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);

        }
        else{
            $.post(MY_CONSTANT.url + '/change_forgot_password',
                {
                    email: email,
                    token: token,
                    password: $scope.resetPass.password
                }).then(
                function (data) {
                    data = JSON.parse(data);

                    if (data.status == responseCode.SHOW_ERROR_MESSAGE) {
                        $scope.errorMsg = "Something went wrong, Please try again later";
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                    }
                    else if(data.status == responseCode.SUCCESS) {
                        $scope.successMsg = "Password reset successfully.";
                        $cookieStore.put('rememberEmail', email);
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.successMsg = "";
                            $state.go('page.login');
                            $scope.$apply();
                        }, 3000);
                    }
                    else {
                        $scope.errorMsg = data.message.toString();
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                    }
                });
        }

    };


});

