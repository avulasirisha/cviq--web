var app = angular.module('Cviq',['chart.js','ngImgCrop','isteven-omni-bar','angular-svg-round-progressbar','ngMaterial','ui.router','ngAnimate','ngMaterial','ngCookies','ngDialog','ui.bootstrap','angular.filter','ui-rangeSlider']);



 if( window.location.hostname == "localhost"  ){
        api_url = 'http://localhost:8000' ;
}else{
        api_url = 'http://34.207.125.7:3005' ;
}
//================sockrt factory =====================
app.factory('socket', function ($rootScope, $cookieStore) {
    var socket = io.connect( api_url );
    $cookieStore.put('SocketID', socket.disconnected);

    socket.on('cviq', function (data) {
        console.log(data);
    })

    return socket;});




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
        }
    }
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

app.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);



app.run(function ($rootScope) {
    $rootScope.scrollToTop = function () {
        $(window).scrollTop(0);
    };
});