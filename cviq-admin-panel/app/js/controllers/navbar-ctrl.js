/**
 * Created by Salma on 8/26/15.
 */
App.controller('navBarController', function ($rootScope,$scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state,ngDialog,responseCode) {
$scope.typeUser = [
{
    id:0,
    name:'Customer'
},{
    id:1,
    name:'Driver'
}
]
    $scope.notif = {};
    $scope.notif.successMsg = "";
    $scope.notif.errorMsg = "";
    if($cookieStore.get('type')==0){
        $scope.super_admin_show = 1;
    }
    else
    {
        $scope.super_admin_show = 0;
    }

    // ===================================================
    //           notification pop up
    //===================================================
    $scope.notificationPopup = function(){
        ngDialog.open({
            template: 'notif_dialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope,
            preCloseCallback: function () {
                $scope.notif.successMsg = '';
                $scope.notif.errorMsg = '';
                $scope.notif.user_type = '';
                $scope.notif.message = "";
                return true;
            }
        });
    }

    $scope.sendNotifications = function(notif){
        $.post(MY_CONSTANT.url_booking + '/send_notification',{
            access_token: $cookieStore.get('obj').accesstoken,
            user_type: notif.user_type,
            message:notif.message,
            users:""
        }, function (data) {
            data = JSON.parse(data);


            if (data.status == responseCode.SUCCESS) {
                $scope.notif.successMsg = "Push Notifications sent successfully.";
            }
            else if (data.status == responseCode.INVALID_ACCESS_TOKEN){
                $state.go('page.login');
            }
            else {
               $scope.notif.errorMsg = data.message;

            }
            $scope.$apply();
            setTimeout(function () {
                ngDialog.close({
                    template: 'notif_dialog',
                    className: 'ngdialog-theme-default',
                    scope: $scope

                });
            },3000);
        });
    }
});