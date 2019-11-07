angular.module('Cviq').controller('packageCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout){

    $rootScope.loading = true;
    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }

    $scope.packageClass='';


    console.log("hello i am in package ctrl");
    $scope.package = function(plan){
        console.log("selected package ",plan);
        $cookieStore.put("package",plan);
         console.log( $cookieStore.get("package"));

        $state.go('home.gateway');
        // $state.go("home.gateway", {"type": 'recruiter', "plan": plan.planRate});
    };

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getMembershipPlans',
    })
        .success(function (response) {

            console.log(response);
            $scope.plans =response.data;
            var length=response.data.length;

            if(length==1){
                $scope.packageClass='packages1'
            }
            else  if(length==2){
                $scope.packageClass='packages2'
            }
            else  if(length==3){
                $scope.packageClass='packages3'
            }
            else  if(length==4){
                $scope.packageClass='packages2'
            }
            else{
                $scope.packageClass='packages3'
            }

            // console.log(typeof($scope.plans));
            //
            // var i = 0;
            // var x;
            // while($scope.plans[i]){
            //     var descriptionArray = $scope.plans[i].planDescription.split(",");
            //     console.log(descriptionArray);
            //     $scope.plans[i].descriptionArray = descriptionArray;
            //     // for(var j=0; j<descriptionArray.length; j++){
            //     //     $scope.plans[i].j = descriptionArray[j];
            //     // }
            //
            //     i++;
            // }
            // console.log("new",$scope.plans);

            $rootScope.loading = false;

        })
        .error(function (response) {
            $rootScope.loading = false;
            console.log(response);
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }
            bootbox.alert(response.message);

        });



}]);