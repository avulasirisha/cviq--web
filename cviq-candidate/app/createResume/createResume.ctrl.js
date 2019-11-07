angular.module('Cviq').controller('createResumeCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.myregex = "^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,}))@"
        + "((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\."
        + "([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|"
        + "([a-zA-Z]+[\\w-]+\\.)+[a-zA-Z]{2,4})$";

    /*=============================Start: Custom Factory Function ================================*/

    $scope.FirsText = function($event){
        characterService.characterFunction($event);
    };

    $scope.isNumberKey = function($event){
        characterService.numberFunction($event);
    };

    $scope.isCodeKey = function($event){
        characterService.codeFunction($event);
    };

    $scope.isAlphaKey = function($event){
        characterService.alphaFunction($event);
    };



    $timeout(function(){

        $(".datetimepickerfrom").on("dp.change", function (e) {
            console.log(e);
            console.log('sss', $(e.target).val());

            //$(".datetimepickerto").data("DateTimePicker").minDate(e.date);
            var x = e.target.id.split('-');
            var id = x[1];
            $scope.items[id].from.m = $(e.target).val().split("/")[0];
            $scope.items[id].from.y = $(e.target).val().split("/")[1];

            console.log('aaaaaaaaaa', $scope.items);

            $(e.target).trigger("change");

        });

        $(".datetimepickerto").datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY',
            maxDate: new Date()
        });

        $(".datetimepickerto").on("dp.change", function (e) {
            console.log(e);
            console.log($(e.target).val());
            var x = e.target.id.split('-');
            var id = x[1];
            $scope.items[id].too.m = $(e.target).val().split("/")[0];
            $scope.items[id].too.y = $(e.target).val().split("/")[1];

            console.log('bbbbbbbbbbbb', $scope.items);
            //$(".datetimepickerfrom").data("DateTimePicker").maxDate(e.date);
            $(e.target).trigger("change");

        });

        $(".datetimepickerfrom").datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY',
            maxDate: new Date()
        });

    },0);

    /*=============================End: Custom Factory Function ================================*/


    $timeout(function(){
        $('.selectpicker').selectpicker();
    },0);

    $scope.ok = function(){
        ngDialog.close();
    }

    /*============================= Start: Key Skills Section ================================*/

    $scope.instruct = function(){
        $scope.tips = true;
        $timeout(function(){
            $scope.tips = false;
        },10000);
    }

    /*============================= End: Key Skills Section ================================*/

    /*============================= Start: Custom Dropdown Plugin ================================*/

    if($scope.year == undefined || $scope.month == undefined){
        $scope.place = true;
    }


    $scope.calculateYear = function(){
        $scope.place = false;
        console.log($scope.year);
        if($scope.year <= 1){
            $scope.expYear = $scope.year +' year'
        }
        else{
            $scope.expYear = $scope.year +' years'
        }

    }

    $scope.calculateMonth = function(){
        $scope.place = false;
        console.log($scope.month);
        if($scope.month <= 1){
            $scope.expMonth = $scope.month +' month'
        }
        else{
            $scope.expMonth = $scope.month +' months'
        }

    }

    /*============================= End: Custom Dropdown Plugin ================================*/

    /*============================= Start: Preview Dialog Box ================================*/

    $scope.previewResume = function(){
        ngDialog.open({
            template: 'preview',
            className: 'ngdialog-theme-default custom-width-800',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }
    /*============================= End: Preview Dialog Box ================================*/

    var doc = new jsPDF();
    var specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };

    /*============================= Start: Select one checkbox at a time ================================*/

    $scope.updateSelection = function(position, items) {
        angular.forEach(items, function(item, index) {
            if (position != index)
                item.register.cEmp = false;
        });
    };

    /*============================= End: Select one checkbox at a time ================================*/

    //$scope.saveResume = function () {
    //    console.log($scope.register.Name);
    //    doc.fromHTML($('#resume').html(), 15, 15, {
    //        'width': 170,
    //        'elementHandlers': specialElementHandlers
    //    });
    //    doc.save($scope.register.Name + '-resume.pdf');
    //
    //}

    //$scope.saveResume = function () {
    //    html2canvas($("#resume"), {
    //        onrendered: function(canvas) {
    //            theCanvas = canvas;
    //            document.body.appendChild(canvas);
    //
    //            canvas.toBlob(function(blob) {
    //                saveAs(blob, "Dashboard.png");
    //            });
    //        }
    //    });
    //
    //}
    

    /*============================= Start: Add More Clone ================================*/

    $scope.items = [];
    
    var data = {
        id:$scope.items.length+1
    };

    data.from = {};
    data.too = {};
    $scope.items.push(data);

    $scope.addMore = function(){
        var data = {
            id:$scope.items.length+1
        }
        data.from = {};
        data.too = {};
        $scope.items.push(data);

        $timeout(function(){

            $(".datetimepickerfrom").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());

                //$(".datetimepickerto").data("DateTimePicker").minDate(e.date);
                var x = e.target.id.split('-');
                var id = x[1];
                $scope.items[id].from.m = $(e.target).val().split("/")[0];
                $scope.items[id].from.y = $(e.target).val().split("/")[1];

                console.log('aaaaaaaaaa', $scope.items);

                $(e.target).trigger("change");

            });

            $(".datetimepickerto").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                maxDate: new Date()
            });

            $(".datetimepickerto").on("dp.change", function (e) {
                console.log(e);
                console.log($(e.target).val());
                var x = e.target.id.split('-');
                var id = x[1];
                $scope.items[id].too.m = $(e.target).val().split("/")[0];
                $scope.items[id].too.y = $(e.target).val().split("/")[1];

                console.log('bbbbbbbbbbbb', $scope.items);
                //$(".datetimepickerfrom").data("DateTimePicker").maxDate(e.date);
                $(e.target).trigger("change");

            });

            $(".datetimepickerfrom").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                maxDate: new Date()
            });

        },0);
    }



    $scope.educations = [];
    var eduVar = {
        id:$scope.educations.length+1
    }
    $scope.educations.push(eduVar);


    $scope.addMoreEducation = function(){
       var eduVar = {
           id:$scope.educations.length+1
       }
        $scope.educations.push(eduVar);
    }


    /************************ start highest qualifications dropdowns **************/
    $scope.graduation;
    $scope.postGraduation;
    $scope.qualSpecialization = [];

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log(response);
            $scope.countryLists = response.data.countryList;
            $scope.industriesList = response.data.industryList;
            $scope.qualify = response.data.highestQualification;
            $scope.graduation = response.data.Graduation;
            $scope.postGraduation = response.data.PostGraduation;
            $scope.patentLimit = response.data.maxPatentLimit;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    $scope.selectedQualification = function(data,index){

        console.log(data);
        $scope.selHighQual = data.split(" ").join("");

        if($scope.selHighQual == 'Graduation'){


            $scope.specialization = [];

            $scope.qualSpecialization = [];
            _.forEach($scope.graduation, function(value){
                $scope.qualSpecialization.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);

                $scope.graduation[index].spec = $scope.qualSpecialization;
            })

        }
        else if($scope.selHighQual == 'PostGraduation'){

            $scope.qualSpecialization = [];
            _.forEach($scope.postGraduation, function(value){
                $scope.qualSpecialization.push(value.courseName);
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
                $scope.graduation[index].spec = $scope.qualSpecialization;
            })
        }
    }

    /*============================= End: Add More Clone ================================*/


    $scope.saveResume = function (data) {
        console.log($cookieStore.get('AccessToken'));

        $scope.experienceArray = [];
        $scope.educationArray = [];
console.log(data);

        _.forEach($scope.items, function (value) {
            console.log(value);

            $scope.experienceCheck = value.register.companyName;

            if(value.register != undefined){


            $scope.experience = {

                "company": value.register.companyName,
                "durationFrom": value.register.from,
                "durationTo": value.register.to,
                "description": value.register.description,
                "currentEmployer": value.register.cEmp
            }

            //console.log('obj1', $scope.experience);

            $scope.experienceArray.push($scope.experience);

            //console.log('array1', $scope.experienceArray);

            }

        })


        _.forEach($scope.educations, function (value) {
            console.log(value);

            $scope.educationCheck = value.register;

            if(value.register != undefined) {

                $scope.education = {
                    "highestQualification": value.register.qualification,
                    "specialization": value.register.specialization,
                    "passoutYear": value.register.yearPassing,
                    "institute": value.register.institute
                }

            //console.log('obj2', $scope.education);

            $scope.educationArray.push($scope.education);

            //console.log('array2', $scope.educationArray);

            }
        })

        var resumeData = new FormData();

        resumeData.append("name", data.Name);
        resumeData.append("phoneNo", data.mobileNumber);
        resumeData.append("email", data.email);
        resumeData.append("note", "I hereby certify that all the information above is true and accurate.");

        if(data.skills != undefined){
            $scope.allSkills = data.skills;
            $scope.allSkills = $scope.allSkills.split(" ").join("");
            resumeData.append("skills", $scope.allSkills);
        }

        if(data.overview != undefined){
            resumeData.append("overview", data.overview);
        }

        if($scope.educationCheck != undefined){

            resumeData.append("education", JSON.stringify($scope.educationArray));
        }
        if($scope.experienceCheck != undefined){

            resumeData.append("experience", JSON.stringify($scope.experienceArray));
        }

        console.log('Complete data', resumeData);


        $http({
            method:'POST',
            url:CONSTANT.apiUrl+'/api/candidate/createCandidateResume',
            headers:{
                authorization: $cookieStore.get('AccessToken'),
                'Content-type': undefined
            },
            data:resumeData
        })
            .success(function(response){
                console.log(response);
                console.log($window.history.back());
                if(response.statusCode == 201){
                    bootbox.alert('Resume has been uploaded successfully.');
                }
                $state.reload();
                //window.open(response.data.resumeURL, '_blank');

            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }



    /*============================= Start: Custom Drop Down Plugin ================================*/

    //$scope.year;
    //$scope.month;
    //
    //$scope.expYear = '';
    //$scope.expMonth = '';
    //
    //$scope.calculateYear = function(){
    //    console.log($scope.year);
    //    $scope.place = false;
    //    if($scope.year <= 1){
    //        $scope.expYear = $scope.year +' year'
    //    }
    //    else{
    //        $scope.expYear = $scope.year +' years'
    //    }
    //
    //    if($scope.expMonth == ''){
    //        $scope.item.compExp =  $scope.expYear;
    //    }
    //    else{
    //        $scope.item.compExp =  $scope.expYear + ' ' + $scope.expMonth;
    //    }
    //
    //}
    //
    //$scope.calculateMonth = function(){
    //    console.log($scope.month);
    //    $scope.place = false;
    //    if($scope.month <= 1){
    //        $scope.expMonth = $scope.month +' month'
    //    }
    //    else{
    //        $scope.expMonth = $scope.month +' months'
    //    }
    //
    //    if($scope.expYear == '')
    //    {
    //        $scope.item.compExp = $scope.expMonth;
    //    }
    //    else{
    //        $scope.item.compExp = $scope.expYear + ' ' + $scope.expMonth;
    //        console.log('===', $scope.expYear);
    //    }
    //
    //}

    /*============================= End: Custom Drop Down Plugin ================================*/

}]);

angular.module('Cviq').directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});