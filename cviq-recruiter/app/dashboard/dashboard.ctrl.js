angular.module('Cviq').controller('dashboardCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){

    $rootScope.loading=true;

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }

    console.log("dash board controller");
    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.phoneRegex = /^[1-9]{1}[0-9]{9}$/;

    $scope.edit = false;


    $scope.editDetails = function () {

        $scope.edit = true;
        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');

        },0);
    };


    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);

            };

            reader.readAsDataURL(input.files[0]);
             $scope.pic = input.files[0];

        }
    }

    $("#imgInp").change(function(){
        readURL(this);
    });


    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/recruiter/getRecruiterProfileDetails',
        headers:{
            'authorization': $cookieStore.get('AccessToken')
        }

    })
        .success(function(response){
            console.log("profile details",response.data);
            $scope.profile =  response.data;
            $scope.membership = response.data.membershipTaken;
            $rootScope.loading=false;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
                console.log("success refresh");
            },0);
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                bootbox.alert(response.message);
                $scope.confirmLogOut();
                return;
            }
            else 
                bootbox.alert(response.message);
            $rootScope.loading=false;
           
        });


$scope.cancel = function () {
    $scope.edit = false;
    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/recruiter/getRecruiterProfileDetails',
        headers:{
            'authorization': $cookieStore.get('AccessToken')
        }

    })
        .success(function(response){
            console.log("profile details",response.data);
            $scope.profile =  response.data;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
            $rootScope.loading=false;
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }
            else
                bootbox.alert(response.message);
            $rootScope.loading=false;

        });

}
    $scope.isNumberKey = function($event){
        characterService.numberFunction($event);
    };
    

    $scope.editProfile= function (data) {
        $rootScope.loading=true;
        console.log(data);

        var profileData = new FormData();

        profileData.append("firstName", data.firstName);
        profileData.append("lastName", data.lastName);
        profileData.append("countryCode", data.countryCode);
        profileData.append("phoneNo", data.phoneNo);
        if($scope.pic != undefined)
        profileData.append("profilePic",$scope.pic);

        console.log($scope.pic);
        $http({
            method:'PUT',
            url:CONSTANT.apiUrl + '/api/recruiter/editRecruiterProfile',
            data:profileData,
            headers:{
                'authorization': $cookieStore.get('AccessToken'),
                'Content-type': undefined
            }

        })
            .success(function(response){
                console.log(response);

                if(response.statusCode == 200){
                    $scope.edit = false;
                    $cookieStore.put('UserDetails', response.data);
                   bootbox.alert('Profile Updated succesfully');
                    $scope.profile.profilePicURL.original = response.data.profilePicURL.original;
                    $scope.userData.profilePicURL.thumbnail = response.data.profilePicURL.thumbnail;
                    $scope.userData.firstName = response.data.firstName;
                }

                $rootScope.loading=false;
            })
            .error(function(response){
                console.log(response);
                $rootScope.loading=false;
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
                else
                bootbox.alert(response.message);

            })

    };

    /*=============================Start: Call Get Country list API ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log(response);
            $scope.countryLists = response.data.countryList;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }
        });

    /*=============================End: Call Get Country list API ================================*/

        $scope.variable = $state.params.variable;
    

        $scope.profilePic = function (File) {

            $scope.profilePic = File[0];

            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(File[0]); // read the local file

            reader.onloadend = function(){ // set image data as background of div

                $('.dp').attr("src",this.result);

            };
        };




//=============== crop image and upload===============


    $scope.showcropped = false;
    $scope.myImage='';
    $scope.myCroppedImage='';
    var fileType='';
    var filename='';

    var handleFileSelect=function(evt) {
        $scope.showcropped = true;
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
        fileType = file.type;
        filename = file.name;
    };
    
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    $scope.confirm = function (data) {
        $rootScope.loading=true;
        
        var blob = dataURItoBlob($scope.myCroppedImage);
        var file = new File([blob], filename, {type: fileType});
        
        $scope.pic = file;
        var profileData = new FormData();

        console.log(data);
        profileData.append("firstName", data.firstName);
        profileData.append("lastName", data.lastName);
        profileData.append("countryCode", data.countryCode);
        profileData.append("phoneNo", data.phoneNo);

        if($scope.pic != undefined)
            profileData.append("profilePic",$scope.pic);
        console.log($scope.pic);
        $http({
            method:'PUT',
            url:CONSTANT.apiUrl + '/api/recruiter/editRecruiterProfile',
            data:profileData,
            headers:{
                'authorization': $cookieStore.get('AccessToken'),
                'Content-type': undefined
            }

        })
            .success(function(response){
                console.log(response);

                if(response.statusCode == 200){
                    $rootScope.loading=false;
                //    $('#myModal').modal('toggle');
                    $cookieStore.put('UserDetails', response.data);
                    bootbox.alert('Profile Pic Updated succesfully');
                    $scope.profile.profilePicURL.original = response.data.profilePicURL.original;
                    $scope.userData.profilePicURL.thumbnail = response.data.profilePicURL.thumbnail;
                    $scope.userData.firstName = response.data.firstName;
                }
            })
            .error(function(response){
                $rootScope.loading=false;
               // $('#myModal').modal('toggle');
                console.log(response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
                else
                    bootbox.alert(response.message);

            })

    };



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


}]);