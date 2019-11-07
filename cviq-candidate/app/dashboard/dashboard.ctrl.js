angular.module('Cviq').controller('dashboardCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','ngDialog', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window, ngDialog){

        if($cookieStore.get('AccessToken') == undefined){
            $state.go('home.login');
        }
         var loggedInVar = $cookieStore.get('loggedIn');
      if(loggedInVar == undefined || loggedInVar == false){
            $cookieStore.remove('AccessToken'); 
            $state.go('home.login');
      }
      $scope.Gotomembership = function(){
          $cookieStore.remove('revaluation'); 
          $state.go('home.membership',{},{ reload: true });
      }

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/candidate/loginViaAccessToken',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            }
        })
        .success(function(response){
            console.log('loginViaAccessToken', response);
            response.data.InterviewsTaken = response.data.InterviewsTaken == undefined ? 0 : response.data.InterviewsTaken;
            localStorage.setItem('UserDetails', JSON.stringify(response.data));
            $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
        })
        .error(function(response){
            console.log(response);
        })

        $scope.variable = $state.params.variable;
        $scope.pstatus = [
            {
                desc:'Actively Looking',
                val: 1
            },
            {
                desc:'Not Looking',
                val: 0
            },
            {
                desc:'Looking For Freelance Work',
                val: 2
            }
        ]

        $scope.profileStatus = $scope.userData.status;

        $('#upload-resume').click(function () {
            $('#resume').click();
        });

        $('#upload-certificate').click(function () {
            $('#certificate').click();
        });

        $('.upload-file2').click(function () {
            $('#dp').click();
        });

        $scope.profilePic = function (File) {

            $scope.profilePics = File[0];

            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(File[0]); // read the local file

            reader.onloadend = function(){ // set image data as background of div

                $('.dp').attr("src",this.result);

            };
        };

    /*=============================Start: Crop candidate image ================================*/

    $scope.myImage='';
    $scope.myCroppedImage='';

    var upFileName;
    var upFileType;

    var handleFileSelect=function(evt) {
        $scope.file=evt.currentTarget.files[0];
        //console.log('file', file);
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL($scope.file);
        upFileName = $scope.file.name;
        upFileType = $scope.file.type;
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    
    $scope.uploadCroppedImage = function () {

        var blob = dataURItoBlob($scope.myCroppedImage);
        var file = new File([blob], upFileName, {type: upFileType});

        var profilePicData = new FormData;
        profilePicData.append('profilePic', file);

        console.log(profilePicData);

        $rootScope.loading = true;

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/updateProfilePic',
            headers: {
                authorization: $cookieStore.get('AccessToken'),
                'Content-type': undefined
            },
            data: profilePicData
        })
            .success(function(response){
                console.log('data', response);
                $rootScope.loading = false;
                localStorage.setItem('UserDetails', JSON.stringify(response.data));
                $('#myModal').modal('hide');
                //bootbox.alert(response.message);
                $timeout(function () {
                    $state.reload();
                },500);

            })
            .error(function(response){
                console.log(response);
                $rootScope.loading = false;
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }


    function dataURItoBlob(dataURI) {

        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }

    /*=============================End: Crop candidate image ================================*/



    /*=============================Start: Angularjs Charts ================================*/

    $scope.emittedData;

    $scope.$on('GRAPH', function (event, args) {
        $scope.emittedData = args;

        console.log('$scope.emittedData', $scope.emittedData);
        console.log('$scope.emittedData', $scope.emittedData.aggregatedScoreResponse.length);


   // $scope.labels = ["0","Attempt 1", "Attempt 2", "Attempt 3", "Attempt 4"];
    $scope.labels = [];
    $scope.series = ['Aggregated Score'];

        $scope.data = [
            []
        ];

        $scope.aggregatedScore = [];
         var ag = 1;
        angular.forEach($scope.emittedData.aggregatedScoreResponse, function (cords) {
            $scope.aggregatedScore.push(cords);
             $scope.labels.push( "I"+ag);
             ag  =ag+1
            //$scope.labels.push(moment(cords.interviewDate).format('Do MMM, YYYY'));
        });

        console.log('$scope.labels', $scope.labels);

        var count = 0, count1 = 0;
        $scope.emittedData.graphCoordinates = $scope.aggregatedScore.reverse();
        $scope.newLabels = $scope.labels.reverse();

        $scope.labels = [];
        //
        console.log('$scope.newLabels', $scope.newLabels);
        //
        for(var j=0; j<=$scope.newLabels.length; j++ ){

            ++count1;
            if(count1 <= $scope.newLabels.length && count1 <= 4){
                $scope.labels.push($scope.newLabels[j]);
            } else {
                $scope.labels.reverse();
                console.log('ELSE PART');
                $scope.labels.unshift(0);
                break;
            }
        }

        for(var i=0; i<=$scope.emittedData.graphCoordinates.length; i++ ){

            ++count;
            if(count <= $scope.emittedData.graphCoordinates.length && count <= 4){
                $scope.data[0].push($scope.emittedData.graphCoordinates[i]);
            } else {
                $scope.data[0].reverse();
                console.log('ELSE PART');
                $scope.data[0].unshift(0);
                break;
            }
        }

        console.log('$scope.data', $scope.data);

        //angular.forEach($scope.emittedData.graphCoordinates, function (value) {
        //    $scope.data[0].push(value);
        //});

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        },
        elements : { line : { tension : 0 },
            point : { radius : 4 }}
    };
    })

    /*=============================End: Angularjs Charts ================================*/
    
    $scope.openLinkedProfilePopup = function () {
        ngDialog.open({
            template: 'addLinkedInProfile',
            className: 'ngdialog-theme-default employment-details',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }
    
    $scope.addLinkedIn = function (linkedinUrl) {
        console.log('linkedinUrl', linkedinUrl);

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/setLinkedInProfileLink',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                linkedInProfileLink: linkedinUrl.url
            }
        })
            .success(function(response){
                console.log('data', response);
                localStorage.setItem('UserDetails', JSON.stringify(response.data));
                ngDialog.close();
                $timeout(function () {
                    bootbox.alert(response.message);
                },0);
                $scope.userData.linkedInProfileLink = linkedinUrl.url;
               // $state.reload();

            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
        
    }

    /*=============================Start: Change profile status ================================*/
    
    $scope.changeProfileStatus = function (profileStatus) {

        console.log('profileStatus', profileStatus);

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/updateProfileStatus',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "profileStatus": profileStatus
            }
        })
            .success(function(response){
                console.log('data', response);
                localStorage.setItem('UserDetails', JSON.stringify(response.data));

            })
            .error(function(response){
                console.log(response);
            })
        
    }

    /*=============================End: Change profile status ================================*/
    
    
    

}]);