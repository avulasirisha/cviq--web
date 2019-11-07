
App.controller('ScoresController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode,currency, filterFilter) {

    'use strict';

    $("whilr").css("position","fixed");

    if($cookieStore.get("obj") == undefined){
        $cookieStore.remove('obj');
        $cookieStore.remove('zoom');
        $cookieStore.remove('type');
        $cookieStore.remove('email');
        $.removeCookie('geoseen');
        $state.go('page.login');
    }

    console.log("in update scores");

    $scope.showloader=true;
    $scope.sumError = false;
    $scope.flag1 = false;
    $scope.flag2 = false;

    $scope.quantitative = {};
    $scope.experiencePointsDetail = [];
    $scope.awardPointsDetail = [];


    $scope.addExp = {};
    $scope.addAwards = {};

        $http({
        method: 'GET',
        url: MY_CONSTANT.url_cviq + '/api/admin/getQuantScoreData',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .success(function (response) {
            console.log(response.data);
            if( Object.keys( response.data ).length == 0 ){
                    // Empty data found
                    console.log( "got empty data");
            }else{
            $scope.quantitative.totalQuantitativeScore = response.data.totalQuantitativeScore;
            
            $scope.quantitative.educationTotalPoints = response.data.educationTotalPoints;
            $scope.quantitative.AssociateDegree = response.data.AssociateDegree;
            $scope.quantitative.Doctorate = response.data.Doctorate;
            $scope.quantitative.Graduation = response.data.Graduation;
            $scope.quantitative.HighSchool = response.data.HighSchool;
            $scope.quantitative.PostGraduation = response.data.PostGraduation;
            
            $scope.quantitative.certificationTotalPoints = response.data.certificationTotalPoints;
            $scope.quantitative.maxCertificateLimit = response.data.maxCertificateLimit;
            
            $scope.quantitative.patentTotalPoints = response.data.patentTotalPoints;
            $scope.quantitative.maxPatentLimit = response.data.maxPatentLimit;
            
            $scope.quantitative.experienceTotalPoints = response.data.experienceTotalPoints;
            $scope.experiencePointsDetail = [];

            response.data.experiencePointsDetail.forEach(function (column) {
                var d ={};
                d.minYearRange = column.minYearRange;
                d.maxYearRange = column.maxYearRange;
                d.points =  column.points ;
                $scope.experiencePointsDetail.push(d);
            });
            $scope.quantitative.awardTotalPoints = response.data.awardTotalPoints;

            $scope.awardPointsDetail = [];
            response.data.awardPointsDetail.forEach(function (column) {
                var d ={};
                d.minRange = column.minRange;
                d.maxRange = column.maxRange;
                d.points =  column.points ;
                $scope.awardPointsDetail.push(d);
            });

            }
            $scope.showloader=false;
        })
        .error(function(response){
            $scope.showloader=false;
            if(response.statusCode == 401){
                $cookieStore.remove('obj');
                $cookieStore.remove('zoom');
                $cookieStore.remove('type');
                $cookieStore.remove('email');
                $.removeCookie('geoseen');
                $state.go('page.login');
            }
        });


    $scope.deleteExp = function(index){
       if($scope.experiencePointsDetail.length==2){

       }
        else{
           $scope.experiencePointsDetail.splice(index, 1);
       }

    };
  $scope.deleteAwards = function(index){

      if($scope.awardPointsDetail.length==2){

      }
      else{
          $scope.awardPointsDetail.splice(index, 1);
      }
    };


    $scope.addExp = function(){
        var my ={};
        my.minYearRange = '';
        my.maxYearRange = '';
        my.points = '';
        $scope.experiencePointsDetail.splice($scope.experiencePointsDetail.length-1, 0,my);

    };

  $scope.addAwards = function(){

      var my ={};
      my.minRange = '';
      my.maxRange = '';
      my.points = '';
      $scope.awardPointsDetail.splice($scope.awardPointsDetail.length-1, 0,my);
    };
    $scope.checkTotal = function(){

      if($scope.quantitative.totalQuantitativeScore != $scope.quantitative.educationTotalPoints +
          $scope.quantitative.certificationTotalPoints + $scope.quantitative.patentTotalPoints +
          $scope.quantitative.experienceTotalPoints + $scope.quantitative.awardTotalPoints){
          
           $scope.sumError = true;
           console.log($scope.sumError );

      }
        else{
          $scope.sumError = false;
          console.log($scope.sumError);
      }
    };
    
    
    
    $scope.checkExpTotal = function(){
        $scope.flag1 = false;
        for(var i=0;i<$scope.experiencePointsDetail.length;i++){
            if($scope.experiencePointsDetail[i].points > $scope.quantitative.experienceTotalPoints){
                $scope.flag1 = true;
                console.log( scope.experiencePointsDetail[i].points + " -- " + $scope.quantitative.experienceTotalPoints );
            }
        }
    };



    $scope.checkAwardsTotal = function(index){
        console.log($scope.awardPointsDetail,index);
        $scope.flag2 = false;
        for(var i=0;i<$scope.awardPointsDetail.length;i++){
            if($scope.awardPointsDetail[i].points > $scope.quantitative.awardTotalPoints){
                $scope.flag2 = true;
                console.log( scope.awardPointsDetail[i].points + " -- " + $scope.quantitative.awardTotalPoints );
            }
        }

    };

 
    $scope.save = function(){
    console.log("quant",$scope.quantitative);
    console.log("exp",$scope.experiencePointsDetail);
    console.log("award",$scope.awardPointsDetail);

    var data = {};
    data = $scope.quantitative;

    data.perCertificatePoints =  Number(Math.round( data.certificationTotalPoints / data.maxCertificateLimit +'e2')+'e-2');
    data.perPatentPoints =  Number(Math.round( data.patentTotalPoints / data.maxPatentLimit +'e2')+'e-2');

console.log("hello",data.perCertificatePoints);
    data.experiencePointsDetail = [];
    data.awardPointsDetail = [];


    $scope.experiencePointsDetail.forEach(function (column) {
        var d ={};
        d.minYearRange = column.minYearRange;
        d.maxYearRange = column.maxYearRange;
        d.points =  column.points ;
        data.experiencePointsDetail.push(d);
    });

    $scope.awardPointsDetail.forEach(function (column) {
        var d ={};
        d.minRange = column.minRange;
        d.maxRange = column.maxRange;
        d.points =  column.points ;
        data.awardPointsDetail.push(d);
    });


            $http({
        method: 'POST',
        url: MY_CONSTANT.url_cviq + '/api/admin/setQuantScoreData',
        headers:{
            'authorization':$cookieStore.get("obj").accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: data
    })
        .success(function (response) {
            console.log("success",response.data);
            $scope.displaymsg = response.message;
            console.log($scope.displaymsg);
            //  $scope.$apply();
            ngDialog.open({
                template: 'display_msg_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $cookieStore.remove('obj');
                $cookieStore.remove('zoom');
                $cookieStore.remove('type');
                $cookieStore.remove('email');
                $.removeCookie('geoseen');
                $state.go('page.login');
            }
            else{
                $scope.displaymsg = response.message;
                //   $scope.$apply();
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }
        });

};



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

    /*--------------------------------------------------------------------------
     * --------- funtion to refresh page ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.refreshPage = function () {
        $state.reload();
        ngDialog.close({
            template: 'display_msg_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.forceLogin = function(){
        ngDialog.close();
        $state.go('page.login');
        $cookieStore.remove('obj');
    };
});