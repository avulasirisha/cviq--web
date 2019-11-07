/**
 * Created by cl-macmini-72 on 11/9/16.
 */

App.controller('LandingFeaturesController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';



    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $state.go('page.login');
    }

    console.log("Landing Home");

    $scope.candidateEdit = false;
    $scope.recruiterEdit = false;
    $scope.candidateFeatures = {};
    $scope.recruiterFeatures = {};
    $scope.mainId = '';


    $("whilr").css("position","fixed");

    $http({
        method: 'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getLandingPageData',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        },
    })
        .success(function (data) {
            console.log("my data",data);
            console.log("success",data,data.data._id);

            $scope.mainId = data.data._id;
            
            $scope.candidateFeatures.text1 = data.data.candidateFeatureTitleFirst;
            $scope.candidateFeatures.text1Description = data.data.candidateFeatureDescFirst;

            $scope.candidateFeatures.text2 = data.data.candidateFeatureTitleSecond;
            $scope.candidateFeatures.text2Description = data.data.candidateFeatureDescSecond;

            $scope.candidateFeatures.text3 = data.data.candidateFeatureTitleThird;
            $scope.candidateFeatures.text3Description = data.data.candidateFeatureDescThird;

            $scope.candidateFeatures.text4 = data.data.candidateFeatureTitleFourth;
            $scope.candidateFeatures.text4Description = data.data.candidateFeatureDescFourth;

            $scope.candidateFeatures.text5 = data.data.candidateFeatureTitleFifth;
            $scope.candidateFeatures.text5Description = data.data.candidateFeatureDescFifth;

            $scope.candidateFeatures.text6 = data.data.candidateFeatureTitleSixth;
            $scope.candidateFeatures.text6Description = data.data.candidateFeatureDescSixth;
            
               
            $scope.recruiterFeatures.text1= data.data.recruiterFeatureTitleFirst;
            $scope.recruiterFeatures.text1Description = data.data.recruiterFeatureDescFirst;
   
            $scope.recruiterFeatures.text2= data.data.recruiterFeatureTitleSecond;
            $scope.recruiterFeatures.text2Description = data.data.recruiterFeatureDescSecond;
   
            $scope.recruiterFeatures.text3= data.data.recruiterFeatureTitleThird;
            $scope.recruiterFeatures.text3Description = data.data.recruiterFeatureDescThird;
   
            $scope.recruiterFeatures.text4= data.data.recruiterFeatureTitleFourth;
            $scope.recruiterFeatures.text4Description = data.data.recruiterFeatureDescFourth;
   
            $scope.recruiterFeatures.text5= data.data.recruiterFeatureTitleFifth;
            $scope.recruiterFeatures.text5Description = data.data.recruiterFeatureDescFifth;
   
            $scope.recruiterFeatures.text6= data.data.recruiterFeatureTitleSixth;
            $scope.recruiterFeatures.text6Description = data.data.recruiterFeatureDescSixth;


            $scope.showloader=false;

        })
        .error(function(response){
            bootbox.alert(response.message);
            if(response.statusCode == 401){
                $cookieStore.remove('obj');
                $cookieStore.remove('email');
                $state.go('page.login');
            }

            $('#addButton').prop('disabled', false);
            $scope.showloader=false;
            console.log('error',response);
            ngDialog.open({
                template: 'error',
                scope: $scope,
                closeByEscape:false,
                closeByDocument:false
            });
        });





    $scope.updaterecruiter = function () {
        $('#addButton1').prop('disabled', true);

        console.log($scope.recruiterFeatures);
        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/updateRecruiterFeatures',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                "_id": $scope.mainId,
                "recruiterFeatureTitleFirst":$scope.recruiterFeatures.text1,
                "recruiterFeatureDescFirst": $scope.recruiterFeatures.text1Description,
                "recruiterFeatureTitleSecond": $scope.recruiterFeatures.text2,
                "recruiterFeatureDescSecond": $scope.recruiterFeatures.text2Description,
                "recruiterFeatureTitleThird": $scope.recruiterFeatures.text3,
                "recruiterFeatureDescThird": $scope.recruiterFeatures.text3Description,
                "recruiterFeatureTitleFourth": $scope.recruiterFeatures.text4,
                "recruiterFeatureDescFourth": $scope.recruiterFeatures.text4Description,
                "recruiterFeatureTitleFifth": $scope.recruiterFeatures.text5,
                "recruiterFeatureDescFifth": $scope.recruiterFeatures.text5Description,
                "recruiterFeatureTitleSixth": $scope.recruiterFeatures.text6,
                "recruiterFeatureDescSixth": $scope.recruiterFeatures.text6Description
            }
        })
            .success(function (data) {
                bootbox.alert("Updated Successfully");
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                $scope.mainId = data.data._id;
                $state.reload();
            })
            .error(function(response){
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                console.log('error',response);
                bootbox.alert(response.message);
            });
    }
    $scope.updatecandidate = function () {
        $('#addButton1').prop('disabled', true);

        console.log($scope.candidateFeatures);
        $http({
            method: 'PUT',
            url: MY_CONSTANT.url_cviq + '/api/admin/updateCandidateFeatures',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                "_id": $scope.mainId,
                "candidateFeatureTitleFirst":$scope.candidateFeatures.text1,
                "candidateFeatureDescFirst": $scope.candidateFeatures.text1Description,
                "candidateFeatureTitleSecond": $scope.candidateFeatures.text2,
                "candidateFeatureDescSecond": $scope.candidateFeatures.text2Description,
                "candidateFeatureTitleThird": $scope.candidateFeatures.text3,
                "candidateFeatureDescThird": $scope.candidateFeatures.text3Description,
                "candidateFeatureTitleFourth": $scope.candidateFeatures.text4,
                "candidateFeatureDescFourth": $scope.candidateFeatures.text4Description,
                "candidateFeatureTitleFifth": $scope.candidateFeatures.text5,
                "candidateFeatureDescFifth": $scope.candidateFeatures.text5Description,
                "candidateFeatureTitleSixth": $scope.candidateFeatures.text6,
                "candidateFeatureDescSixth": $scope.candidateFeatures.text6Description
            }
        })
            .success(function (data) {
                bootbox.alert("Updated Successfully");
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                $scope.mainId = data.data._id;
                $state.reload();
            })
            .error(function(response){
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('email');
                    $state.go('page.login');
                }
                $('#addButton').prop('disabled', false);
                $scope.showloader=false;
                console.log('error',response);
                bootbox.alert(response.message);
            });
    }




    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".bootstrap-select").click(function () {
            $(this).addClass("open");
        });

    },0);


    /*--------------------------------------------------------------------------
     * --------- custom validation function ---------------------------------------
     --------------------------------------------------------------------------*/



    $scope.isCharacterFunction = function(evt){
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
    };


    $scope.isNumberKey = function(evt){
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
    };


});