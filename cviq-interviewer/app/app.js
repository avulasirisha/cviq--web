var app = angular.module('Cviq',['ui.router','ngAnimate','ngMaterial','ngCookies','ngDialog','ui.bootstrap','gm.datepickerMultiSelect']);

app.factory('characterService', function(){
    return {
        characterFunction: function(evt){
                var theEvent = evt || window.event;
                var key = theEvent.keyCode || theEvent.which;
                if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
                    key = String.fromCharCode (key);
                    if(key==".")return false;
                    return;
                }

                key = String.fromCharCode (key);
                var regex = /[a-z ',A-Z-]|\./;

                if ( !regex.test(key) ) {
                    theEvent.returnValue = false;
                    if(theEvent.preventDefault) theEvent.preventDefault();
                }
                else{var rege = /[.]|\./;
                    if ( rege.test(key) ) {
                        theEvent.returnValue = false;
                        if(theEvent.preventDefault) theEvent.preventDefault();
                    }}
            },

        numberFunction: function(evt){
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;

            var regex = /[0-9]|\./;
            if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
                key = String.fromCharCode (key);
                if(key==".")return false;
                return;
            }
            key = String.fromCharCode (key);
            if ( !regex.test(key) ) {
                theEvent.returnValue = false;
                if(theEvent.preventDefault) theEvent.preventDefault();
            }
        },

        codeFunction: function(evt){
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;

            var regex = /[0-9 ',+]|\./;
            if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
                key = String.fromCharCode (key);
                if(key==".")return false;
                return;
            }
            key = String.fromCharCode (key);
            if ( !regex.test(key) ) {
                theEvent.returnValue = false;
                if(theEvent.preventDefault) theEvent.preventDefault();
            }
        },
        alphaFunction: function(evt){
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;

            var regex = /[a-z ',A-Z- ',0-9 ',# ',+ ',@]|\./;
            if(key ==24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
                key = String.fromCharCode (key);
                if(key==".")return false;
                return;
            }
            key = String.fromCharCode (key);
            if ( !regex.test(key) ) {
                theEvent.returnValue = false;
                if(theEvent.preventDefault) theEvent.preventDefault();
            }
        }
    }
});

app.factory('questions', function ($q, $http, CONSTANT, $cookieStore) {

    return {
        getQuestions: function () {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: CONSTANT.apiUrl + '/api/interviewer/getQuestions',
                headers: {
                    authorization: $cookieStore.get('AccessToken')
                }
            })
                .success(function(response){
                    console.log('Success', response);
                    deferred.resolve(response);
                })
                .error(function(response){
                    console.log(response);
                    deferred.reject(response)
                });

            return deferred.promise;
        }
    }

})

app.factory('socket', function ($rootScope, $cookieStore) {
     if( window.location.hostname == "localhost"  ){
        api_url = 'http://localhost:8000' ;
    }else{
        api_url = 'http://34.207.125.7:3005' ;
    }
    var socket = io.connect( api_url );

    $cookieStore.put('SocketID', socket.disconnected);

    socket.on('cviq', function (data) {
        console.log('CVIQ', data);
    });

    return socket;


    // return {
    //     on: function (eventName, callback) {
    //         // console.log('eventName', eventName);
    //         // console.log('callback', callback);
    //         socket.on(eventName, function () {
    //             var args = arguments;
    //             $rootScope.$apply(function () {
    //                 callback.apply(socket, args);
    //             });
    //         });
    //     },
    //     emit: function (eventName, data, callback) {
    //         socket.emit(eventName, data, function () {
    //             var args = arguments;
    //             $rootScope.$apply(function () {
    //                 if (callback) {
    //                     callback.apply(socket, args);
    //                 }
    //             });
    //         })
    //     }
    // };
});

app.directive('loading', function () {
    return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="images/loader.gif"></div>',
        link: function (scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val)
                    $(element).show();
                else
                    $(element).hide();
            });
        }
    }
});

app.directive('backButton', ['$window', function($window, $rootScope) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);

app.run(function ($rootScope, $http, CONSTANT, $cookieStore, $state) {
    $rootScope.scrollToTop = function () {
        $(window).scrollTop(0);
    };
    
    $rootScope.candidateDetails = function (candID, interID, interStatus) {
        $http({
            method:'GET',
            url:CONSTANT.apiUrl+'/api/interviewer/getSingleCandidateDetail',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            params:{
                candidateID:candID,
                interviewID:interID,
                interviewFinished:interStatus
            }
        })
            .success(function (response) {
                console.log(response);
                localStorage.setItem('CandidateDetails', JSON.stringify(response.data));
                $state.go('home.description');
                $rootScope.scrollToTop();
            })
            .error(function (response) {
                console.log(response);
            })
    }
});

app.run(function ($rootScope, $cookieStore, $state, $timeout) {
    $rootScope.sessionExpired = function () {
        bootbox.alert('Session Expired. Please login again.');
        $cookieStore.remove('loggedIn');
        $cookieStore.remove('AccessToken');
        $cookieStore.remove('UserDetails');
        $cookieStore.remove('SelIndustryID');
        $cookieStore.remove('StartInterviewDetails');
        $cookieStore.remove('CandidateDetails');
        $state.go('home.login');
        $timeout(function () {
            $state.reload();
        }, 500);
    };
});