angular.module('Cviq').controller('skypeInterviewCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','socket','ngDialog', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, socket, ngDialog){

    $scope.interviewData = JSON.parse(localStorage.getItem('StartInterviewDetails'));
    console.log('Skype Interview', $scope.interviewData);

    var token;
    var pub;
    var apiKey = $scope.interviewData.openTokApiKey;
    var session;
    //var sessionId;
    var connectionCount = 0;
    var publisher;
    var sessionId = $scope.interviewData.openTokSessionID;
    var token = $scope.interviewData.openTokToken;

    var publisherOptions = {
        insertMode: 'append',
        right:'30px',
        width: 200,
        publishVideo:true,
        publishAudio:true,
        height: 175,
        top:10,
        showControls:false,
        name : "Candidate",
        style: { nameDisplayMode: "on" }
    };


    $scope.disableVid = function(){

        $scope.showVid = true;
        if($scope.showVid){
            pub.publishVideo(false);
        }
        console.log("video disable");

    }
    $scope.enableVid = function(){
        pub.publishVideo(true);
        $scope.showVid = false;
        console.log("video enable");
    }

    $scope.disableAud = function(){
        $scope.showAud = true;
        if($scope.showAud == true){
            pub.publishAudio(false);
        }
        console.log("audio disable");
    }
    $scope.enableAud = function(){
        pub.publishAudio(true);
        $scope.showAud = false;
        console.log("audio enable");
    }

    var options = {
        width: '100%',
        height: '100%',
        left:0,
        insertMode: 'append',
        showControls:false
    }

    var layout = initLayoutContainer(document.getElementById("layout"), {
        maxRatio: 3/2,     // The narrowest ratio that will be used (default 2x3)
        minRatio: 9/16,      // The widest ratio that will be used (default 16x9)
        fixedRatio: false,  // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
        bigClass: "OT_big", // The class to add to elements that should be sized bigger
        bigPercentage: 0.8,  // The maximum percentage of space the big ones should take up
        bigFixedRatio: false, // fixedRatio for the big ones
        bigMaxRatio: 3/2,     // The narrowest ratio to use for the big elements (default 2x3)
        bigMinRatio: 9/16,     // The widest ratio to use for the big elements (default 16x9)
        bigFirst: true        // Whether to place the big one in the top left (true) or bottom right
    });
    layout.layout();

    function connect() {

        pub = OT.initPublisher('publisherDiv',publisherOptions);
        session = OT.initSession(apiKey, sessionId);
        session.on({
            streamCreated: function(event) {
                console.log("hello stream created",event.stream);

                //$http({
                //    method:'POST',
                //    url: CONSTANT.apiUrl+'/api/common/saveArchiveId',
                //    data:{
                //        "interviewID": $scope.interviewData._id,
                //        "archiveID": event.stream.id
                //    }
                //})
                //    .success(function (response) {
                //        console.log('ARCHIVE', response);
                //    })
                //
                //    .error(function (response) {
                //        console.log(response);
                //    })
                //$timeout(function(){
                //    $scope.preloader = false;
                //},200)



                //$scope.$apply();
                //session.subscribe(event.stream, 'subscribersDiv',{showControls:false});
                session.subscribe(event.stream, 'subscribersDiv',{showControls:false}, {
      testNetwork: true
    }, function(err) {
      if (err) alert(err.message);
    });
                //connectionCount++;
                //if (event.connection.connectionId != session.connection.connectionId) {
                //    console.log('Another client connected. ' + connectionCount + ' total.');
                //}
            },

            streamDestroyed:function(event){
                console.log(event.stream.destroyedReason);
                console.log("destroyed");
                session.disconnect();
                //$state.go('layout1.JobComplete');
                //console.log($scope.VideoDisconnected.alert);
                //BookingNotification.pushAlert()
                //    .success(function(data){
                //        console.log(data.data[0].currentStatus);
                //        if(data.data[0].currentStatus != "COMPLETED" && event.stream.destroyedReason != "clientDisconnected"){
                //            alert('client has disconnected');
                //        }else if(event.stream.destroyedReason == "clientDisconnected"){
                //            console.log(event.reason);
                //            //if(data.data[0].currentStatus != "COMPLETED")$state.go('layout1.JobComplete');
                //            //else $state.go('layout1.PriceSummary');
                //        }
                //    }).error(function(data){
                //    console.log(data);
                //});
                bootbox.alert('Interviewer has finised the interview and will provide rating soon.');
                $state.go('home.dashboard.qualitativeScore.pastInterview', {}, { reload: true });
                //if($cookieStore.get(currentStatusUser) != "COMPLETED"){
                //    ngDialog.open({
                //        template: 'lostConnect',
                //        className: 'ngdialog-theme-default',
                //        scope: $scope,
                //        closeByDocument: false,
                //        closeByEscape: false,
                //        showClose: false
                //    });
                //}

            },
            sessionDisconnected: function sessionDisconnectHandler(event) {
                // The event is defined by the SessionDisconnectEvent class
                console.log('Disconnected from the session.');
                //$state.go('layout1.JobComplete');
                //console.log($cookieStore.get(currentStatusUser));

                //if($cookieStore.get(currentStatusUser) != "COMPLETED"){
                //    ngDialog.open({
                //        template: 'lostConnect',
                //        className: 'ngdialog-theme-default',
                //        scope: $scope,
                //        closeByDocument: false,
                //        closeByEscape: false,
                //        showClose: false
                //    });
                //}
                console.log(event);
                if (event.reason == 'networkDisconnected') {
                    //unpublish();
                    $state.go('home.dashboard.qualitativeScore.upcomingInterview');
                    bootbox.alert('Disconnected from the session. Please start again.');
                    //$state.go('layout1.JobComplete');
                    //alert('Your network connection terminated.')
                }
            }
        });

        session.connect(token, function(error) {
            if (error) {
                console.log(error.message);
            } else {
                session.publish(pub);
            }
        });

    }
    connect();

    function unpublish(){
        session.unpublish(pub);
    }

    $scope.disconnect = function(data){

        if(data == 1){
            bootbox.alert('You have disconnected the session. Now finish the interview.');
        }
        session.disconnect(pub);
    };

    /*=============================Start: Socket.IO Implementation ================================*/

    // Socket Emits
    // ================

    console.log($cookieStore.get('SocketID'));

    if($cookieStore.get('SocketID')!=undefined && $cookieStore.get('SocketID') == true){

        socket.emit('authentication',{
            'userId':$scope.interviewData.candidateID,
            'accessToken':$cookieStore.get('AccessToken'),
            'USER_TYPE':'CANDIDATE',
            'sendToId':$scope.interviewData.interviewerID._id,
            'interviewId':$scope.interviewData._id
        });
    }
    //
    // socket.on('cviq', function (data) {
    //     console.log(data);
    //
    //     socket.emit('authentication',{
    //         'userId':$scope.interviewData.interviewerID,
    //         'accessToken':$cookieStore.get('AccessToken'),
    //         'USER_TYPE':'INTERVIEWER',
    //         'sendToId':$scope.interviewData.candidateID._id,
    //         'interviewId':$scope.interviewData._id
    //     });
    //
    // });

    socket.on('authenticated', function (data) {
        console.log('authenticated', data);
    });

    socket.on('unauthorized', function (data) {
        console.log('unauthorized', data);
    });

    socket.on('new message', function (data) {
        console.log('Interviewer message', data);
        $scope.messages.push({
            text: data.message,
            createdAt: data.createdAt,
            messageTo:data.messageTo
        });
        $scope.$apply();
    });


    $scope.messages = [];

    $scope.sendMessage = function () {
        socket.emit('send message', {
            'message': $scope.message,
            'USER_TYPE':'CANDIDATE'
        }, function (error, data) {
            console.log('Data', data);

            $scope.messages.push({
                text: data.message,
                createdAt: data.createdAt,
                messageTo:data.messageTo
            });
            $scope.$apply();

            console.log('$scope.messages', $scope.messages);
        });

        // add the message to our model locally
        //$scope.messages.push({
        //    user: $scope.name,
        //    text: $scope.message
        //});

        // clear message box
        $scope.message = '';
    };

    /*=============================End: Socket.IO Implementation ================================*/
    
    $scope.finishInterviewByCandidate = function (interviewId) {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/finishInterview',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                interviewID: interviewId
            }
        })
            .success(function(response){
                console.log('success', response);
                bootbox.alert('Interview finised successfully.');
                $state.go('home.dashboard.aggregatedScore');
            })
            .error(function(response){
                console.log('Error', response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }
    

}]);