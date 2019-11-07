App.controller('ChanePasswordController', function ($scope,$http,$state,$cookies,$location,$cookieStore,MY_CONSTANT,$state,responseCode,ngDialog) {


    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }
    $scope.changePass = {};

    $scope.changePassword = function () {

        console.log( $scope.changePass);
        $scope.errorMsg = '';

        //------------------------------------------------Error msg-----------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------
        if($scope.changePass.new_password != $scope.changePass.confirmpassword){
            $scope.errorMsg = "Both Passwords do not match.";

            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);

        }
        else if($scope.changePass.new_password == $scope.changePass.old_password){
            $scope.errorMsg = "New password must be different from old password.";

            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);

        }
        else{
            console.log("pass changing")
            $('.changePass').prop('disabled', true);

            //----------------------------API change password od admin--------------------------------------------------
            //-----------------------------------------------------------------------------------------------------------
            $http({
                method:'PUT',
                url: MY_CONSTANT.url_cviq + '/api/admin/adminChangePassword',
                headers:{
                    'authorization': $cookieStore.get('obj'),
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                    "oldPassword": $scope.changePass.old_password ,
                    "newPassword":  $scope.changePass.new_password
                }
            })
                .success(function (response) {
                    $('.changePass').prop('disabled', false);
                    console.log(response);
                    ngDialog.open({
                        template: 'success',
                        scope: $scope,
                        closeByEscape:false,
                        closeByDocument:false
                    });
                    $state.go('app.dashboard');

                })
                .error(function (response) {
                    $('.changePass').prop('disabled', false);
                    console.log(response);
                    $scope.error = response.message;
                    ngDialog.open({
                        template: 'error',
                        scope: $scope,
                        closeByEscape:false,
                        closeByDocument:false
                    });
                    if(response.statusCode == 401){
                        $cookieStore.remove('obj');
                        $cookieStore.remove('zoom');
                        $cookieStore.remove('type');
                        $cookieStore.remove('email');
                        $.removeCookie('geoseen');
                        $state.go('page.login');
                    }

                })
        }
    };
});

