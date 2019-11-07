/**
 * Created by sanjay on 3/25/15.
 */
App.controller('LoginController', function ($rootScope,$scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state,ngDialog) {
    //initially set those objects to null to avoid undefined error
    // place the message if something goes wrong
    $scope.stayLoggedIn = true;  //Setting remember me option to true on initial page load
     $scope.account = {};
    $scope.account.email = "";
    $scope.account.password = "";
    $scope.authMsg = '';
    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if($.cookie("rememberEmail")){
        $scope.account.email = $.cookie("rememberEmail");
    }
    // if($cookieStore.get("obj")){
    //    $state.go('app.dashboard');
    // }
    $scope.loginAdmin = function () {

        if($scope.account.email == "" || $scope.account.password == ""){}
       else {
        $scope.authMsg = '';
        //    ------------------API for login------------------------------------------
            var fd = {
                'email': $scope.account.email,
                'password': $scope.account.password
            };

        $http({
            method: 'POST',
            url: MY_CONSTANT.url_cviq + '/api/admin/loginAdmin',
            headers:{
                'Content-type': 'application/x-www-form-urlencoded',
            },
            data: fd
            })
            .success(function (data) {
                console.log(data);
                // data = JSON.parse(data);

                if (data.statusCode != 200) {
                    $scope.authMsg = data.message.toString();
                    $scope.$apply();
                    setTimeout(function () {
                        $scope.authMsg = "";
                        $scope.$apply();
                    }, 3000);
                } else {
                    if ($scope.stayLoggedIn) {
                        $.cookie("rememberEmail", $scope.account.email, { expires: 365 });
                    }
                    var someSessionObj = {'accessToken': data.data.accessToken};

                    $cookieStore.put('obj', someSessionObj);
                    $state.go('app.dashboard');
                }
            })
            .error(function(data){
                console.log(data);
                if (data.statusCode != 200) {
                    $scope.authMsg = data.message.toString();
                    $scope.$apply();
                    setTimeout(function () {
                        $scope.authMsg = "";
                        $scope.$apply();
                    }, 3000);
                }
                else{
                    console.log('ok');
                }
            });
        }
    };
    //---------------------------API for forgot password-------------------------------------
    $scope.recover = function () {

        $.post(MY_CONSTANT.url + '/forgot_password',
            {
                email: $scope.account.email
            }).then(
            function (data) {
                data = JSON.parse(data);
                if (data.status == 200) {
                    $scope.successMsg = "Please check your email to reset password.";
                    setTimeout(function () {
                        $scope.successMsg = "";
                        $scope.$apply();
                    }, 3000);
                } else if(data.status ==101) {
                    $scope.errorMsg = "Email Id is not registered as admin";
                    //$scope.successMsg = data.message.toString();
                    setTimeout(function () {
                        $scope.errorMsg = "";
                        $scope.$apply();
                    }, 3000);

                }
                else if(data.status ==401) {
                    $scope.errorMsg = "Your session has been expired. Please login again";
                    //$scope.successMsg = data.message.toString();
                    setTimeout(function () {
                        $scope.errorMsg = "";
                        $scope.$apply();
                    }, 3000);
                    $scope.logoutFunction();

                }
                $scope.$apply();
            })
    };

    $scope.logout = function () {
        ngDialog.open({
            template: 'logout_dialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
    };

    $scope.logoutFunction = function () {
        ngDialog.close({
            template: 'logout_dialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope
        });
        $http({
            method:'PUT',
            url: MY_CONSTANT.url_cviq  +'/api/admin/logoutAdmin',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .success(function (response) {
                console.log(response);
                $cookieStore.remove('obj');
                $cookieStore.remove('zoom');
                $cookieStore.remove('type');
                $cookieStore.remove('email');
                $.removeCookie('geoseen');
                $state.go('page.login');

            })
            .error(function (response) {
                console.log(response);
                $cookieStore.remove('obj');
                $cookieStore.remove('zoom');
                $cookieStore.remove('type');
                $cookieStore.remove('email');
                $.removeCookie('geoseen');
                $state.go('page.login');

            })

    }
});