angular.module('Cviq').controller('availabilityCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, ngDialog, $http, CONSTANT, $state, $timeout){




    /*============================= Start: Get interviewer Availability ================================*/

    $scope.available;
    $scope.selectedDates = [];
    $scope.display = false;

    var currentDate = new Date();
    currentDate = moment(currentDate).format('YYYY-MM-DD');

    $scope.todayCurrentDate = new Date().setHours(0, 0, 0, 0);
    $scope.selectedTodayDate = new Date().setHours(0, 0, 0, 0);

    $scope.todayHours = new Date().getHours();
    console.log('todayHours', $scope.todayHours);

    $scope.todayDate = {
        startingDate: currentDate
    }

    console.log('currentDay',  $cookieStore.get('AccessToken'));

    $http({
        method:'GET',
        url:CONSTANT.apiUrl+'/api/interviewer/getInterviewerAvailability',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        },
        params: $scope.todayDate
    })
        .success(function (response) {
            console.log(response);
            $scope.available = response.data.availabilityData;
            $scope.selectedDates = response.data.datesArr;

            $scope.display = true;

            aaj = moment(new Date()).format('YYYY-MM-DD');
            aaj = new Date(aaj).toISOString();
            var perDayData = _.filter($scope.available, {availabilityDate: aaj});
            var dateWiseData = _.filter($scope.available, {availabilityDate: aaj});
            $scope.updateDateTime = dateWiseData[0];
            $scope.refindedDateData = perDayData[0].availabilityTime;


            $scope.activeDate = null;
            //var d=new Date();


            //$scope.activeDate=$scope.selectedDates;
            console.log($scope.selectedDates);
            $scope.type = 'individual';

            $scope.removeFromSelected = function(dt) {
                $scope.selectedDates.splice($scope.selectedDates.indexOf(dt), 1);
            };

            $scope.today = function() {
                $scope.activeDate = new Date();
            };
            $scope.today();

            //$scope.clear = function() {
            //    $scope.dt = null;
            //};

            $scope.options = {
                customClass: getDayClass,
                showWeeks: false,
                maxDate: new Date(new Date().setDate(new Date().getDate() + 29))
            };


            // Disable weekend selection
            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }

            $scope.toggleMin = function() {
                $scope.options.minDate = $scope.options.minDate ? null : new Date();
            };

            $scope.toggleMin();

            //$scope.setDate = function(year, month, day) {
            //    $scope.dt = new Date(year, month, day);
            //};

            //var tomorrow = new Date();
            //tomorrow.setDate(tomorrow.getDate() + 1);
            //var afterTomorrow = new Date(tomorrow);
            //afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [
                //{
                //    date: tomorrow,
                //    status: 'selectedDate'
                //},
                //{
                //    date: afterTomorrow,
                //    status: 'selectedDate'
                //}
            ];
            for(var i=0;i<$scope.selectedDates.length;i++){
                var d={
                    date:$scope.selectedDates[i],
                    status:'selectedDate'
                };
                $scope.events.push(d);
            }

            function getDayClass(data) {
                var date = data.date,
                    mode = 'day';
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0,0,0,0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            }
        })
        .error(function (response) {
            console.log(response);
            bootbox.alert(response.message);
        })

    /*============================= End: Get interviewer Availability ================================*/

    var isoDate;
    $scope.updateDateTime;                        

    $scope.sel = function (date) {
        $scope.selectedTodayDate = date.setHours(0, 0, 0, 0);
        //$state.reload();
        isoDate = moment(date).format('YYYY-MM-DD');
        isoDate = new Date(isoDate).toISOString();         
        var perDayData = _.filter($scope.available, {availabilityDate: isoDate});
        var dateWiseData = _.filter($scope.available, {availabilityDate: isoDate});
        $scope.updateDateTime = dateWiseData[0];
        $scope.refindedDateData = perDayData[0].availabilityTime;
    }

    $scope.time = ['12:00 AM' , '01:00 AM' , '02:00 AM' , '03:00 AM' , '04:00 AM' , '05:00 AM' ,
        '06:00 AM' , '07:00 AM' , '08:00 AM' , '09:00 AM' , '10:00 AM' , '11:00 AM' ,
        '12:00 PM' , '01:00 PM' , '02:00 PM' , '03:00 PM' , '04:00 PM' , '05:00 PM' ,
        '06:00 PM' , '07:00 PM' , '08:00 PM' , '09:00 PM' , '10:00 PM' , '11:00 PM'
    ];


    /*============================= Start: Update interviewer Availability ================================*/

    $scope.updateAvailableTime = function (data, index) {
        console.log(data);
        console.log(index);
        $scope.updateDateTime.availabilityTime[index] = data == undefined ? "0" : "1";
        console.log('sss', $scope.updateDateTime.availabilityTime[index]);
    }
    /*============================= End: Update interviewer Availability ================================*/

    /*============================= Start: Update interviewer Availability ================================*/

    $scope.disSubBtn = false;

    $scope.updateInterviewerAvailability = function () {

        var availabilityJSON = [];
        availabilityJSON = $scope.available;

        var availObj = {"availabilityJSON":availabilityJSON};
        console.log('availabilityJSON', availObj);

        $scope.disSubBtn = true;

        $http({
            method:'PUT',
            url:CONSTANT.apiUrl+'/api/interviewer/updateInterviewerAvailability',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data: availObj
        })
            .success(function (response) {
                console.log(response);
                $scope.disSubBtn = false;
                bootbox.alert(response.message);
                $state.reload();
            })
            .error(function (response) {
                console.log(response);
                $scope.disSubBtn = false;
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }

    /*============================= End: Update interviewer Availability ================================*/

    //var arrayOfDates = ['2016-08-26', '2016-08-28'];
    //var speDate;
    //$scope.arrayDay = [];
    //
    //for(i=0; i<arrayOfDates.length; i++){
    //    console.log(arrayOfDates[i]);
    //    speDate = moment(arrayOfDates[i]).format('DD');
    //    $scope.arrayDay.push(speDate);
    //}
    //console.log('$scope.arrayDay', $scope.arrayDay);
    //
    //$timeout(function () {
    //    $(".uib-daypicker tbody td:visible").each(function(){
    //        var date = $(this).find("button span").text();
    //        if(date==speDate){
    //            $(this).find("button").css("background","red");
    //        }
    //    });
    //},0);


}]);

