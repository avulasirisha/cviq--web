    App.controller('DashboardController', ['$scope', '$timeout', '$http', 'uiGmapLogger', '$cookies', '$cookieStore', 'MY_CONSTANT', '$state','responseCode', 'uiGmapGoogleMapApi','MapLatLong','cfpLoadingBar'
    , function ($scope, $timeout, $http, $log, $cookies, $cookieStore, MY_CONSTANT, $state, responseCode,GoogleMapApi,MapLatLong,cfpLoadingBar) {


        if($cookieStore.get("obj") == undefined){
            $cookieStore.remove('obj');
            $cookieStore.remove('zoom');
            $cookieStore.remove('type');
            $cookieStore.remove('email');
            $.removeCookie('geoseen');
            $state.go('page.login');
        }

        $scope.showdataflag = 1;

        // //==========================dashboard reports data===================
        // $scope.stats = {};
        // $scope.stats.rides = 0;
        // $scope.stats.users = 0;
        // $scope.stats.revenue = 0;
        // $scope.stats.userstoday = 0;
        // $scope.stats.ridestoday = 0;
        // $scope.stats.revenuetoday = 0;
        // var now = new Date();
        // var yesterday = new Date();
        // var yesterday = moment(yesterday).format("YYYY-MM-DD");
        // var now = moment(now).format("YYYY-MM-DD");
        // yesterday = startDateToUTC(yesterday);
        // now = endDateToUTC(now);
        // $.post(MY_CONSTANT.url + '/dashboard_report', {
        //     access_token: $cookieStore.get('obj').accesstoken,
        //     start_time: yesterday,
        //     end_time: now
        // }, function (response) {
        //     response = JSON.parse(response);
        //     if (response.status == responseCode.SUCCESS) {
        //         var data = response.data;
        //         $scope.stats.revenue = data.total_data.earnings;
        //         $scope.stats.rides = data.total_data.rides;
        //         $scope.stats.users = data.total_users;
        //         $scope.stats.userstoday = data.total_users_registered_today;
        //         $scope.stats.ridestoday = data.specified_dates_data.rides;
        //         $scope.stats.revenuetoday = data.specified_dates_data.earnings;
        //         $scope.$apply();
        //     }
        // });
    }]);


