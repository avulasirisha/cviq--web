angular.module('Cviq').controller('qualitativeScoreCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){

    $scope.var = $state.params.var;
    $scope.inter = $state.params.inter;
    console.log($scope.inter);

    /*============================= Start: get qualitative score ================================*/

    var d = new Date();
    var timeZoneOffset = d.getTimezoneOffset();

    var interData;
    $scope.interview_found_details = {};
    $scope.interview_dataes="";

    $http({
        method:'GET',
        url: CONSTANT.apiUrl +'/api/candidate/getQualitativeScore',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        },
        params:{
            timeOffset:timeZoneOffset
        }
    })
        .success(function(response){
            console.log('QualitativeScoreData', response);
            $scope.QualitativeScoreData = response.data;
            
            interData = response.data.availabilityData;
            for( i in interData ){
                for( j in interData[i].availabilityTime ){
                    if( interData[i].availabilityTime[j] == 1 ){
                        console.log( "interviedate : "+ interData[i].availabilityDate );
                        var d = moment(new Date( interData[i].availabilityDate )).format('MMMM DD, YYYY');
                        $scope.interview_dataes += d + "  " ;
                        break;
                    }
                }    
            }
            if( response.data.interviewerID == '' ){
                $scope.interview_found_details.interview_found = false;
                if(  response.data.interviewshiptaken == false ){
                     if( response.data.access == false ){
                        $scope.interview_found_details.interview_text = "Please try after 6 months later to attend new Interview for qualitative score";
                    }else{
                        $scope.interview_found_details.interview_text = "Please Buy Interview Fees To Get Qualitative Score"; 
                    }
                }else{
                    if( response.data.access == false ){
                        $scope.interview_found_details.interview_text = "Please try after 6 months later to attend new Interview for qualitative score";
                    }else{
                        $scope.interview_found_details.interview_text = "Interviewer Not Found. We Are Checking For Right Person. Please Try Later"; 
                    }
                }      
            }else{
                $scope.interview_found_details.interview_found = true;
                if(  $scope.interview_dataes == "" ){
                    $scope.interview_found_details.interview_text = "Interviewer Found. Interviewer Not given Interview Dates. Please Try Later";
                }else{
                    $scope.interview_found_details.interview_text = "Interviewer Found. Interview Dates: "+ $scope.interview_dataes;
                }
            }
            
            aaj = moment(new Date()).format('YYYY-MM-DD');
            aaj = new Date(aaj).toISOString();

            if( Object.keys(interData).length > 1){
                var availabilityData = _.filter(interData, {availabilityDate: aaj});
                $scope.interviewAvailData = availabilityData[0].availabilityTime;
            }
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })


    /*============================= End: get qualitative score ================================*/




    /*============================= Start: Time array ================================*/

    $scope.time = ['12:00 AM' , '01:00 AM' , '02:00 AM' , '03:00 AM' , '04:00 AM' , '05:00 AM' ,
        '06:00 AM' , '07:00 AM' , '08:00 AM' , '09:00 AM' , '10:00 AM' , '11:00 AM' ,
        '12:00 PM' , '01:00 PM' , '02:00 PM' , '03:00 PM' , '04:00 PM' , '05:00 PM' ,
        '06:00 PM' , '07:00 PM' , '08:00 PM' , '09:00 PM' , '10:00 PM' , '11:00 PM'
    ];

    /*============================= End: Time array ================================*/

    /*============================= Start: Update interviewer Availability ================================*/

    $scope.updateAvailableTime = function (data, index) {
        console.log(data);
        console.log(index);
        $scope.data[index] = data == undefined ? "0" : data;
    }
    /*============================= End: Update interviewer Availability ================================*/
    
    ///*============================= Start: Get candidate availability ================================*/
    //
    //$scope.data = ['0', '1', '0', '0', '0','0', '0', '0', '0', '0','0', '0', '0', '0', '0','0', '0', '0', '0', '0','0', '0', '0', '0'];
    //
    ///*============================= End: Get candidate availability ================================*/

    /*============================= Start: Date picker functionality ================================*/

    var isoDate;
    $scope.selectedDateInterview = moment(new Date()).format('YYYY-MM-DD');
    $scope.selectedInterviewTime;
    $scope.activeDate = moment(new Date()).format('MMMM DD, YYYY');

    $(".datetimepicker").datetimepicker({
        viewMode: 'months',
        format: 'MMMM DD, YYYY',
        maxDate: new Date(new Date().setDate(new Date().getDate() + 29)),
        minDate: moment().subtract(1,'d')
    });

    $(".datetimepicker").on("dp.change", function (e) {
        console.log(e);
        console.log('sss', $(e.target).val());
        var todayDate = $(e.target).val();
        $(e.target).trigger("change");
        $scope.selectedInterviewTime = '';
        isoDate = moment(todayDate).format('YYYY-MM-DD');
        $scope.selectedDateInterview = isoDate;

        isoDate = new Date(isoDate).toISOString();
        var availabilityData1 = _.filter(interData, {availabilityDate: isoDate});
        if(Object.keys(availabilityData1).length > 0 ){
            $scope.interviewAvailData = availabilityData1[0].availabilityTime;
        }
        $scope.$apply();


    });
    

    /*============================= End: Date picker functionality ================================*/
    
    $scope.setInterviewDate = function (data) {
        console.log(data);
        $scope.selectedInterviewTime = data;
    }

    /*============================= Start: Confirm interview date ================================*/

    $scope.confirmInterview = function () {
        $http({
            method:'POST',
            url: CONSTANT.apiUrl +'/api/candidate/confirmInterviewDate',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                interviewerID:$scope.QualitativeScoreData.interviewerID,
                interviewDate:new Date( $scope.selectedDateInterview ).toISOString(),
                interviewStartTime: $scope.selectedInterviewTime,
                timeOffset: +330
            }
        })
            .success(function(response){
                console.log(response);
                if(response.statusCode == 200){
                    bootbox.alert('Your request of an interview is submitted successfully.');
                }
                $state.reload('home.dashboard.qualitativeScore');
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 400){
                    bootbox.alert('Please select interview start time');
                }
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*============================= End: Confirm interview date ================================*/
    
    $scope.setMembershipTrue = function ( rev = false ) {
            $cookieStore.put('revaluation', rev );
            $state.go('home.membership',{},{ reload: true });
    }

    $scope.loadingCurrent1 = {
        backgroundColor: "#02a9e0"
    }

    $scope.loadingBarStyle1 = {
        backgroundColor: "#d8d8d8"
    }

}]);