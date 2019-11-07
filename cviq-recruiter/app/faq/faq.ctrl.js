angular.module('Cviq').controller('faqCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT', function($scope, $rootScope, $cookieStore, $http, CONSTANT){

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    $rootScope.loading = true;
    $scope.faqList = [ ];


    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/admin/getFAQList?userType=RECRUITER',
    })
        .success(function (response) {
            $rootScope.loading = false;
            console.log(response);
            $scope.faqList = response.data;

        })
        .error(function (response) {
            $rootScope.loading = false;
            console.log(response);
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }
            bootbox.alert(response.message);
        });

    $scope.showhide = function(index){


        var arrayLength = $scope.faqList.length;
        for(var i=0;i<arrayLength;i++){
            if(index == i){
                var id1 = '#question-'+index;
                $(id1).slideToggle('showDriverClass hideDriverClass');
                var id2 = '#imageup-'+index;
                $(id2).toggleClass('showDriverClass hideDriverClass');
                var id3 = '#imagedown-'+index;
                $(id3).toggleClass('showDriverClass hideDriverClass');
                var id4 = '#quecolor-'+index;
                $(id4).toggleClass('faqQuestionGreen faqQuestionGrey');
            }
            else{
                var id1 = '#question-'+i;
                $(id1).slideUp();
                var id2 = '#imageup-'+i;
                $(id2).removeClass(' showDriverClass');
                $(id2).addClass(' hideDriverClass');
                var id3 = '#imagedown-'+i;
                $(id3).removeClass(' hideDriverClass');
                $(id3).addClass('  showDriverClass');
                var id4 = '#quecolor-'+i;
                $(id4).removeClass(' faqQuestionGreen ');
                $(id4).addClass(' faqQuestionGrey');
            }
        }


        // console.log(index);
        // var id1 = '#question-'+index;
        // $(id1).slideToggle('showDriverClass hideDriverClass');
        // var id2 = '#imageup-'+index;
        // $(id2).toggleClass('showDriverClass hideDriverClass');
        // var id3 = '#imagedown-'+index;
        // $(id3).toggleClass('showDriverClass hideDriverClass');
        // var id4 = '#quecolor-'+index;
        // $(id4).toggleClass('faqQuestionGreen faqQuestionGrey');
    };

}]);