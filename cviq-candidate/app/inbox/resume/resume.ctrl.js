angular.module('Cviq').controller('resumeCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$filter', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $filter){


    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
    
    if( $scope.userData.membershipTaken == false ){
            bootbox.alert("Please buy membership to update your resume");
            $state.go('home.membership');
    }

    /*=============================Start: Get Matched Jobs ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/candidate/recentlySearchedJobs',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('data', response);
            $scope.recentlysearchedJobs = response.data;
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    /*=============================End: Get Matched Jobs ================================*/

    /*=============================Start: Get Resume List ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/candidate/getCandidateResume',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('success resume list', response);
            $scope.listOfResumes = response.data.resumeList;
        })
        .error(function(response){
            console.log('failure', response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    /*=============================End: Get Resume List ================================*/
    
    $scope.goToResume = function () {
        $state.go('home.createResume');
        $timeout(function () {
            $rootScope.scrollToTop();
        },0);
    }


    /*=============================Start: Upload Resume ================================*/
    
    $scope.uploadResumeFile = function () {

        var bioData = new FormData;
        bioData.append('resume', $('#new-resume')[0].files[0]);

        $rootScope.loading = true;

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/candidate/uploadCandidateResume',
            headers: {
                authorization: $cookieStore.get('AccessToken'),
                'Content-type': undefined
            },
            data: bioData
        })
            .success(function(response){
                console.log('data', response);
                $rootScope.loading = false;
                bootbox.alert(response.message);
                $state.reload('home.inbox.resume');
            })
            .error(function(response){
                console.log(response);
                $rootScope.loading = false;
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }

    /*=============================End: Upload Resume ================================*/

    $scope.closeDialogBox = function () {
        ngDialog.close();
    }

    /*=============================Start: Delete Resume Dialog ================================*/

    var delResumeId;

    $scope.deleteResumeDialog = function (data) {

        delResumeId = data;
        ngDialog.open({
            template: 'deleteResumeDialogBox',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }

    /*=============================End: Delete Resume Dialog ================================*/

    /*=============================Start: Delete Resume ================================*/

    $scope.deleteResume = function () {

        var selResumeId = {
            resumeID: delResumeId
        }

        $http({
            method: 'DELETE',
            url: CONSTANT.apiUrl + '/api/candidate/deleteCandidateResume',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: selResumeId
        })
            .success(function(response){
                console.log('Success Delete', response);
                $timeout(function () {
                    ngDialog.close();
                },500);
                $state.reload('home.inbox.resume');
            })
            .error(function(response){
                console.log('Failure Delete', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Delete Resume ================================*/

    /*=============================Start: Primary Resume Dialog ================================*/

    var priResumeId;

    $scope.priResumeDialog = function (data) {

        console.log(data);
        priResumeId = data;

        ngDialog.open({
            template: 'primaryResumeDialogBox',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }

    /*=============================End: Primary Resume Dialog ================================*/

    /*=============================Start: Primary Resume Api ================================*/
    
    $scope.setPrimaryResume= function () {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/setPrimaryResume',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                resumeID: priResumeId
            }
        })
            .success(function(response){
                console.log('Success', response);
                $timeout(function () {
                    ngDialog.close();
                },500);
                bootbox.alert(response.message);
                $state.reload('home.inbox.resume');
            })
            .error(function(response){
                console.log('Failure', response);
                //bootbox.alert(response.message);
                if(response.statusCode == 401){
                   $rootScope.sessionExpired();
                }
            })

    }

    /*=============================End: Primary Resume Api ================================*/



}]);

/*=============================Start: Update certificates trigger immediately ================================*/

angular.module('Cviq').directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ngModel){
            //change event is fired when file is selected
            el.bind('change',function(){
                scope.$apply(function(){
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                })
            })
        }
    }
});

/*=============================End: Update certificates trigger immediately ================================*/