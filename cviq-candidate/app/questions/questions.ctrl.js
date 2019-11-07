angular.module('Cviq').controller('questionsCtrl', ['$scope','$rootScope','$cookieStore','ngDialog', function($scope, $rootScope, $cookieStore, ngDialog){

    $( document ).ready(function() {

        $('.dropdown').each(function (key, dropdown) {
            var $dropdown = $(dropdown);
            $dropdown.find('.dropdown-menu a').on('click', function (e) {
                e.preventDefault();
                $dropdown.find('button').text($(this).text());
            });
        });
    });

}]);