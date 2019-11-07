angular.module('Cviq').controller('postLaterctrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout){

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }


    $scope.date2error = false;
    $scope.date1error = false;
    $scope.date3error = false;


    $('#date2calander').attr('readonly', true);

    $scope.jobData = JSON.parse(localStorage.getItem("JobDetails"));
    console.log("data retrieved",$scope.jobData);










        $(function () {
            $('#datetimepicker1').datetimepicker({
                 useCurrent: false, //Important! See issue #1075
                format: 'Do MMMM YYYY, h:mm a'
            });
            $('#datetimepicker2').datetimepicker({
                 useCurrent: false, //Important! See issue #1075
                format: 'Do MMMM YYYY, h:mm a'
            });

            var d = new Date;
         //   $('#datetimepicker7').data("DateTimePicker").minDate(d);

            $('#datetimepicker1').data("DateTimePicker").minDate(d);


        });

    $("#datetimepicker1").on("dp.change", function (e) {


        $('#date2calander').attr('readonly', false);

     //  console.log("current date",e.date)

        var d = new Date(e.date._d);
        var d1 = new Date(e.date._d);
        d1.setDate(d.getDate() + 30.005);

        console.log("hello1");
        $('#datetimepicker2').data("DateTimePicker").maxDate(d1);
        $('#datetimepicker2').data("DateTimePicker").minDate(e.date._d);

        var date1 = new Date(e.date._d);
        $scope.post.date1 =date1.toUTCString();


        $('#datetimepicker2').data('DateTimePicker').date(null);

    });

    $("#datetimepicker2").on("dp.change",function (e) {

        console.log("hello2");

        var date2 = new Date(e.date._d);
        $scope.post.date2 =date2.toUTCString();
    });




    $scope.post = function () {
        
        //console.log("date 1  ",$scope.post.date1,"   date 2   ",$scope.post.date2);

        $scope.date2error = false;
        $scope.date1error = false;



        if($scope.post.date1== undefined || $scope.post.date1== 'Invalid Date')
        {
            $scope.date1error = true;
        }

        if($scope.post.date2 == undefined || $scope.post.date2 == 'Invalid Date'){
            $scope.date2error = true;
        }
        else {

          //  console.log("date 1", $scope.post.date1, "date 2", $scope.post.date2)


            delete $scope.jobData.date;
            delete $scope.jobData.functionalAreaName;
            delete $scope.jobData.industryName;
            // delete $scope.jobData.areaName;

            console.log($scope.jobData);

            $scope.jobData.activeFrom = $scope.post.date1;
            $scope.jobData.activeTo = $scope.post.date2;



           // console.log("data retrieved",localStorage.getItem("JobDetails"));
            $scope.postHere();


        }


    };

    $scope.postHere = function () {

        console.log("date activeFrom    ",$scope.jobData.activeFrom);
        console.log("date activeTo    ",$scope.jobData.activeTo);

        localStorage.removeItem("JobDetails");

        $rootScope.loading=true;

        $http({
            method:'POST',
            url: CONSTANT.apiUrl +'/api/recruiter/createJob',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:$scope.jobData
        })
            .success(function (response) {
                console.log("response success",response.data);
                $rootScope.loading=false;
                bootbox.alert("Job Saved Successfully");
                $state.go("home.dashboard.recentlyPostedJobs")
            })
            .error(function (response) {

                $rootScope.loading=false;
                console.log("response error",response);
                bootbox.alert(response.message);
                
                if(response.statusCode == 401){
                    
                    $scope.confirmLogOut();
                }

            })

    };



}]);