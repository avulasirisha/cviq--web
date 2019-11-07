angular.module('Cviq').controller('completeYourProfileCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','characterService','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, characterService, $state){

    //if($cookieStore.get('AccessToken') == undefined){
    //    $state.go('home.login');
    //}
    //else{
    //    $state.go('home.dashboard.aggregatedScore');
    //}

    $timeout(function(){

        $(".datetimepickervalidity").datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY'
        });

        $(".datetimepickervalidity").on("dp.change", function (e) {
            console.log(e);
            console.log($(e.target).val());
            $(e.target).trigger("change");
        });

    },0);

    $timeout(function(){
        $('.selectpicker').selectpicker();

        $(".datetimepickerfrom").on("dp.change", function (e) {
            console.log(e);
            console.log('sss', $(e.target));

            //$(".datetimepickerto").data("DateTimePicker").minDate(e.date);
            var x = e.target.id.split('-');
            var id = x[1];
            $scope.employer[id].from.m = $(e.target).val().split("/")[0];
            $scope.employer[id].from.y = $(e.target).val().split("/")[1];

            console.log('aaaaaaaaaa', $scope.employer);

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
            $scope.employer[id].too.m = $(e.target).val().split("/")[0];
            $scope.employer[id].too.y = $(e.target).val().split("/")[1];

            console.log('bbbbbbbbbbbb', $scope.employer);
            //$(".datetimepickerfrom").data("DateTimePicker").maxDate(e.date);
            $(e.target).trigger("change");

        });

        $(".datetimepickerfrom").datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY',
            maxDate: new Date()
        });

    },0);

    /*=============================Start: add more Employer ================================*/

    $scope.employer = [];

    var employerVar = {
        id: $scope.employer.length+1
    }
    employerVar.from = {};
    employerVar.too = {};
    $scope.employer.push(employerVar);

    $scope.addMoreEmployer = function(){

        var employerVar = {
            id: $scope.employer.length+1
        }
        employerVar.from = {};
        employerVar.too = {};
        $scope.employer.push(employerVar);

        $timeout(function(){
            $(".datetimepickerfrom").on("dp.change", function (e) {
                console.log(e);
                console.log('sss', $(e.target).val());

                console.log($scope.b);
                //$(".datetimepickerto").data("DateTimePicker").minDate(e.date);
                var x = e.target.id.split('-');
                var id = x[1];
                $scope.employer[id].from.m = $(e.target).val().split("/")[0];
                $scope.employer[id].from.y = $(e.target).val().split("/")[1];


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
                $scope.employer[id].too.m = $(e.target).val().split("/")[0];
                $scope.employer[id].too.y = $(e.target).val().split("/")[1];

                //$(".datetimepickerfrom").data("DateTimePicker").maxDate(e.date);
                $(e.target).trigger("change");

            });

            $(".datetimepickerfrom").datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY',
                maxDate: new Date()
            });

        },0);

        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },0);
    }



    /*=============================End: add more Employer ================================*/



    $('#upload-profile-pic').click(function(){
        $('#profile').click();
    });

    $scope.profilePic = function (File) {

        $scope.profilePics = File[0];

        var reader = new FileReader(); // instance of the FileReader
        reader.readAsDataURL(File[0]); // read the local file

        reader.onloadend = function(){ // set image data as background of div

            $('.ppic').attr("src",this.result);

        };
    };

    $scope.changeDate = function(data){
        console.log('a', data);
    };

    $scope.updateSelection = function(position, employer) {
        angular.forEach(employer, function(em, index) {
            if (position != index)
                em.profile.cEmp = false;
        });
    };


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

    /*=============================End: Custom Factory Function ================================*/

    /*=============================Start: Call Get Drop Down Data API ================================*/

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


    //$scope.selectedQualification = function(data){
    //
    //    console.log(data);
    //    $scope.selHighQual = data.split(" ").join("");
    //    console.log('++++', $scope.selHighQual);
    //
    //    if($scope.selHighQual == 'Graduation'){
    //
    //        $scope.qualSpecialization = [];
    //        _.forEach($scope.graduation, function(value){
    //            $scope.qualSpecialization.push(value.courseName);
    //            $timeout(function(){
    //                $('.selectpicker').selectpicker('refresh');
    //            },0);
    //            console.log($scope.qualSpecialization);
    //        })
    //
    //    }
    //    else if($scope.selHighQual == 'PostGraduation'){
    //
    //        $scope.qualSpecialization = [];
    //        _.forEach($scope.postGraduation, function(value){
    //            $scope.qualSpecialization.push(value.courseName);
    //            $timeout(function(){
    //                $('.selectpicker').selectpicker('refresh');
    //            },0);
    //        })
    //    }
    //}

    $scope.selectedQualification = function(data,index){

        console.log(data);
        $scope.selHighQual = data.split(" ").join("");

        if($scope.selHighQual == 'Graduation'){


            $scope.special = [];

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

    /*=============================End: Call Get Country list API ================================*/
    
    
    $scope.selNationality = function (response) {
        console.log(response);

        $scope.selectedCountryID = {
            countryID:response._id
        }

        $http({
            method:'GET',
            url: CONSTANT.apiUrl +'/api/common/getStateList',
            params:$scope.selectedCountryID
        })
            .success(function(response){
                console.log(response);
                $scope.stateRefinedList = response.data;
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
    }

    /*=============================Start: All Array Data ================================*/


    $scope.dateInMonths = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
    $scope.monthsInYear = ['01','02','03','04','05','06','07','08','09','10','11','12'];

    var currentYear = new Date().getFullYear();
    $scope.years = [];

    for(var i = 0; i < 57; i++){
        $scope.years.push(currentYear - i);
    }
    console.log('yearArray', $scope.years);

    //$scope.years = ['1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012'];



    /*=============================End: All Array Data ================================*/

    /*=============================Start: add more educations ================================*/

    $scope.education = [];

    var data = {
        id: $scope.education.length+1
    }
    var specialization = [];
    data.spec = specialization;
    $scope.education.push(data);

    $scope.addMoreEdu = function(){
        var data = {
            id: $scope.education.length+1
        }
        var specialization = [];
        data.spec = specialization;

        $scope.education.push(data);
        console.log( $scope.education);

        $timeout(function(){
            $('.datetimepickerfrom').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            $(".datetimepickerfrom").on("dp.change", function (e) {
                console.log(e);
                console.log($(e.target).val());
                $(e.target).trigger("change");
            });
        },0);


        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },0);
    }

    /*=============================End: add more educations ================================*/

    /*=============================Start: add more awards and accomplishments ================================*/

    $scope.awards = [];

    var awardData = {
        id: $scope.awards.length+1
    }

    $scope.awards.push(awardData);
    
    $scope.addMoreAwards = function () {
        var awardData = {
            id: $scope.awards.length+1
        }
        $scope.awards.push(awardData);
    }



    /*=============================End: add more awards and accomplishments ================================*/

    /*=============================Start: add more patents and publications ================================*/

    $scope.patents = [];
    var patentData = {
        id:$scope.patents.length+1
    };
    $scope.patents.push(patentData);

    $scope.addMorePatents = function () {
        var patentData = {
            id:$scope.patents.length+1
        };
        $scope.patents.push(patentData);
    }



    /*=============================End: add more patents and publications ================================*/



    /*=============================Start: add more Certificates ================================*/

    //$scope.certificate = [];
    //
    //var certificateVar = {
    //    id: $scope.certificate.length+1
    //}
    //$scope.certificate.push(certificateVar);
    //
    //$scope.addMoreCertificate = function(){
    //    var certificateVar = {
    //        id: $scope.certificate.length+1
    //    }
    //    console.log(certificateVar.id);
    //
    //    $scope.certificate.push(certificateVar);
    //
    //    $timeout(function(){
    //        $(".datetimepickervalidity").datetimepicker({
    //            viewMode: 'years',
    //            format: 'MM/YYYY'
    //        });
    //
    //        $(".datetimepickervalidity").on("dp.change", function (e) {
    //            console.log(e);
    //            console.log($(e.target).val());
    //            $(e.target).trigger("change");
    //        });
    //
    //    },0);
    //
    //    $timeout(function(){
    //        $('.selectpicker').selectpicker('refresh');
    //    },0);
    //}



    /*=============================End: add more Certificates ================================*/

    /*=============================Start: add more Employer ================================*/

    //$scope.employer = [];
    //
    //var employerVar = {
    //    id: $scope.employer.length+1
    //}
    //$scope.employer.push(employerVar);
    //
    //$scope.addMoreEmployer = function(){
    //
    //    var employerVar = {
    //        id: $scope.employer.length+1
    //    }
    //    $scope.employer.push(employerVar);
    //
    //    $timeout(function(){
    //        $('.datetimepickerfrom').datetimepicker({
    //            viewMode: 'years',
    //            format: 'MM/YYYY'
    //        });
    //
    //        $(".datetimepickerfrom").on("dp.change", function (e) {
    //            console.log(e);
    //            console.log($(e.target).val());
    //            $(e.target).trigger("change");
    //        });
    //    },0);
    //
    //    $timeout(function(){
    //        $('.selectpicker').selectpicker('refresh');
    //    },0);
    //}



    /*=============================End: add more Employer ================================*/

    //$scope.certificateAsDocuments = function(){
    //    $('#certificates-upload').click();
    //}

    $scope.open1 = function() {
            $scope.popup1 = true;

    };

    $scope.close1 = function() {
           $scope.popup1 = false;
    };

    //$('#certificates-upload').change(function(){
    //    console.log($(this)[0].files[0].name);
    //    if($(this)[0].files[0].name.length > 0){
    //        $scope.certificateUp = $(this)[0].files[0].name;
    //    }
    //    else {
    //        $scope.certificateUp = false;
    //    }
    //    $timeout( function(){
    //        $scope.$apply();
    //    }, 1000);
    //})

    //$('.certificates-upload').change(function(){
    //    if ($(this).val() != "") {
    //        $(this).css('color', '#333');
    //        $(this).css('background', '#000');
    //        $(this).css('margin-left', '30px');
    //    }else{
    //        $(this).css('color', 'transparent');
    //    }
    //    $timeout( function(){
    //        $scope.$apply();
    //    }, 1000);
    //})


    /*=============================Start: Submit Profile Data ================================*/

    //$scope.empDetailsArray = [];
    //$scope.eduDetailsArray = [];
    //$scope.cerDetailsArray = [];
    //
    //
    //$scope.educationDetailsObject = {
    //    "_id": "",
    //    "qualificationLevel": '',
    //    "specialization": '',
    //    "instituteName": '',
    //    "passoutYear": ''
    //}
    //
    //
    //$scope.candidateProfile = function(data){
    //
    //    console.log('my data', data);
    //
    //    $rootScope.loading = true;
    //
    //    $scope.cerDetailsArray = [];
    //    $scope.empDetailsArray = [];
    //    $scope.eduDetailsArray = [];
    //    $scope.locationArray = [];
    //
    //    _.forEach($scope.employer, function(value){
    //
    //        console.log('val', value);
    //
    //        $scope.empCheck = value.profile.designation;
    //
    //        if(value.profile == undefined) {
    //            value.profile = {};
    //        }
    //
    //        if(value.profile.indust == undefined) {
    //            value.profile.indust = {};
    //        }
    //
    //        //$scope.employmentDetailsObject = {
    //        //    "_id": "",
    //        //    "designation": value.profile.designation,
    //        //    "durationFrom": value.profile.from,
    //        //    "durationTo": value.profile.to,
    //        //    "companyName": value.profile.company,
    //        //    "industry":value.profile.indust.industryName,
    //        //    "accomplishments": value.profile.accomplish,
    //        //    "currentEmployer": value.profile.cEmp,
    //        //    "annualSalary": {
    //        //        "min": 0,
    //        //        "max": value.profile.salary
    //        //    }
    //        //}
    //
    //
    //        if(value.profile.cEmp == true){
    //
    //            $scope.employmentDetailsObject = {
    //                "_id": "",
    //                "designation": value.profile.designation,
    //                "durationFrom": value.profile.from,
    //                "companyName": value.profile.company,
    //                "industry":value.profile.indust.industryName,
    //                "accomplishments": value.profile.accomplish,
    //                "currentEmployer": value.profile.cEmp,
    //                "annualSalary":value.profile.salary
    //            }
    //        }
    //        else{
    //            $scope.employmentDetailsObject = {
    //                "_id": "",
    //                "designation": value.profile.designation,
    //                "durationFrom": value.profile.from,
    //                "durationTo": value.profile.to,
    //                "companyName": value.profile.company,
    //                "industry":value.profile.indust.industryName,
    //                "accomplishments": value.profile.accomplish,
    //                "currentEmployer": value.profile.cEmp,
    //                "annualSalary":value.profile.salary
    //            }
    //        }
    //
    //        $scope.empDetailsArray.push($scope.employmentDetailsObject);
    //
    //    });
    //
    //
    //    _.forEach($scope.education, function(value){
    //
    //        console.log('val1', value);
    //
    //        if(value.profile == undefined){
    //            value.profile = {};
    //            $scope.eduCheck = undefined;
    //        }
    //        else{
    //            $scope.eduCheck = value.profile.highQual;
    //        }
    //
    //        //if(value.profile.highQual == undefined){
    //        //    $scope.eduCheck = undefined;
    //        //}
    //
    //        $scope.educationDetailsObject = {
    //            "_id": "",
    //            "qualificationLevel": value.profile.highQual,
    //            "specialization": value.profile.special,
    //            "instituteName": value.profile.institute,
    //            "passoutYear": value.profile.passingYear
    //        }
    //
    //        $scope.eduDetailsArray.push($scope.educationDetailsObject);
    //
    //    });
    //
    //    _.forEach($scope.certificate, function(value){
    //
    //        console.log('val2', value);
    //
    //        $scope.certCheck = value.profile.certificate;
    //
    //        if(value.profile == undefined){
    //            value.profile = {};
    //        }
    //
    //
    //        $scope.certificateDetailsObject = {
    //            "_id": "",
    //            "certificationName": value.profile.certificate,
    //            "issuedBy": value.profile.issuedBy,
    //            "validity": value.profile.validity,
    //            "lifeTimeValidity": value.profile.lvalid,
    //            "doc": value.profile.doc
    //        }
    //
    //        $scope.cerDetailsArray.push($scope.certificateDetailsObject);
    //
    //        console.log('www', $scope.cerDetailsArray);
    //
    //    });
    //     function fileUpload1(files){console.log('123123123123'+files);}
    //    $scope.comDate = data.year+'-'+data.months+'-'+data.dated;
    //
    //
    //    if(data.location1 == undefined || data.location1 == null){
    //        data.location1 = '';
    //    }
    //    else if(data.location1 != undefined){
    //        $scope.locationArray.push(data.location1.stateName);
    //    }
    //
    //    if(data.location2 == undefined || data.location2 == null){
    //        data.location2 = '';
    //    }
    //    else{
    //        $scope.locationArray.push(data.location2.stateName);
    //    }
    //
    //    if(data.location3 == undefined || data.location3 == null){
    //        data.location3 = '';
    //    }
    //    else{
    //        $scope.locationArray.push(data.location3.stateName);
    //    }
    //
    //    if(data.location4 == undefined || data.location4 == null){
    //        data.location4 = '';
    //    }
    //    else{
    //        $scope.locationArray.push(data.location4.stateName);
    //    }
    //
    //    console.log('loc', $scope.locationArray);
    //
    //
    //    var profileData = new FormData();
    //
    //    if($('#profile')[0].files[0] != undefined){
    //        profileData.append("profilePic", $('#profile')[0].files[0]);
    //    }
    //
    //    if($('.resume-file')[0].files[0] != undefined){
    //        profileData.append("resume", $('.resume-file')[0].files[0]);
    //    }
    //
    //    if(data.jobType != undefined){
    //        profileData.append("jobType", data.jobType);
    //    }
    //
    //    if($scope.locationArray.length > 0){
    //        profileData.append("desiredJobLocations", JSON.stringify($scope.locationArray));
    //    }
    //
    //    if($scope.empCheck != undefined){
    //        profileData.append("workHistory", JSON.stringify($scope.empDetailsArray));
    //    }
    //
    //    if($scope.eduCheck != undefined){
    //        profileData.append("education", JSON.stringify($scope.eduDetailsArray));
    //    }
    //
    //    if($scope.certCheck != undefined){
    //        profileData.append("certification", JSON.stringify($scope.cerDetailsArray));
    //    }
    //
    //    if(data.candSalary != undefined){
    //        profileData.append("salary", data.candSalary);
    //    }
    //
    //    profileData.append("profileTitle", data.pTitle);
    //    profileData.append("nationality", data.nationality.countryName);
    //    profileData.append("gender", data.gender);
    //    profileData.append("dob", $scope.comDate);
    //
    //
    //    $http({
    //        method:'PUT',
    //        url: CONSTANT.apiUrl +'/api/candidate/editCandidateProfile',
    //        data:profileData,
    //        headers:{
    //            authorization: $cookieStore.get('AccessToken'),
    //            'Content-type': undefined
    //        }
    //    })
    //        .success(function(response){
    //            console.log(response);
    //            $rootScope.loading = false;
    //            localStorage.setItem('UserDetails',JSON.stringify(response.data));
    //            bootbox.alert('Your profile has been submitted successfully.');
    //            $state.go('home.dashboard.aggregatedScore');
    //            $rootScope.scrollToTop();
    //            $timeout(function () {
    //                $state.reload();
    //            },500);
    //
    //        })
    //        .error(function(response){
    //            console.log(response);
    //            if(response.statusCode == 401){
    //                bootbox.alert('Your session has been expired.');
    //                $cookieStore.put('loggedIn', false);
    //                $cookieStore.remove('loggedIn');
    //                $cookieStore.remove('AccessToken');
    //                localStorage.removeItem('UserDetails');
    //                sessionStorage.removeItem('SearchedParameter');
    //                $state.go('home.login');
    //                $timeout(function () {
    //                    $state.reload();
    //                },500);
    //            }
    //        })
    //}

    /*=============================End: Submit Profile Data ================================*/

    $scope.empDetailsArray = [];
    $scope.eduDetailsArray = [];
    //$scope.cerDetailsArray = [];

    $scope.awardsArray = [];
    $scope.patentsArray = [];


    $scope.educationDetailsObject = {
        "_id": "",
        "qualificationLevel": '',
        "specialization": '',
        "instituteName": '',
        "passoutYear": ''
    }


    $scope.candidateProfile = function(data){

        console.log('my data', data);

        $rootScope.loading = true;

        //$scope.cerDetailsArray = [];
        $scope.empDetailsArray = [];
        $scope.eduDetailsArray = [];
        $scope.locationArray = [];

        _.forEach($scope.employer, function(value){

            console.log('val', value);

            $scope.empCheck = value.profile.designation;

            if(value.profile == undefined) {
                value.profile = {};
            }

            if(value.profile.indust == undefined) {
                value.profile.indust = {};
            }

            if(value.profile.cEmp == true){

                $scope.employmentDetailsObject = {
                    "_id": "",
                    "designation": value.profile.designation,
                    "durationFrom": value.profile.from,
                    "companyName": value.profile.company,
                    "industry":value.profile.indust.industryName,
                    "accomplishments": value.profile.accomplish,
                    "currentEmployer": value.profile.cEmp,
                    "annualSalary":value.profile.salary
                }
            }
            else{
                $scope.employmentDetailsObject = {
                    "_id": "",
                    "designation": value.profile.designation,
                    "durationFrom": value.profile.from,
                    "durationTo": value.profile.to,
                    "companyName": value.profile.company,
                    "industry":value.profile.indust.industryName,
                    "accomplishments": value.profile.accomplish,
                    "currentEmployer": value.profile.cEmp,
                    "annualSalary":value.profile.salary
                }
            }

            $scope.empDetailsArray.push($scope.employmentDetailsObject);

        });


        _.forEach($scope.education, function(value){

            console.log('val1', value);

            if(value.profile == undefined){
                value.profile = {};
                $scope.eduCheck = undefined;
            }
            else{
                $scope.eduCheck = value.profile.highQual;
            }

            $scope.educationDetailsObject = {
                "_id": "",
                "qualificationLevel": value.profile.highQual,
                "specialization": value.profile.special,
                "instituteName": value.profile.institute,
                "passoutYear": value.profile.passingYear
            }

            $scope.eduDetailsArray.push($scope.educationDetailsObject);

        });

        $scope.cerDetailsObject = {
            "_id": "",
            "certificationName": data.certificate,
            "issuedBy": data.issuedBy,
            "validity": data.validity,
            "lifeTimeValidity": data.lvalid
        }

        console.log('obj', $scope.cerDetailsObject);

        $scope.comDate = data.year+'-'+data.months+'-'+data.dated;


        //if(data.location1 == undefined || data.location1 == null){
        //    data.location1 = '';
        //}
        //else if(data.location1 != undefined){
        //    $scope.locationArray.push(data.location1.stateName);
        //}
        //
        //if(data.location2 == undefined || data.location2 == null){
        //    data.location2 = '';
        //}
        //else{
        //    $scope.locationArray.push(data.location2.stateName);
        //}
        //
        //if(data.location3 == undefined || data.location3 == null){
        //    data.location3 = '';
        //}
        //else{
        //    $scope.locationArray.push(data.location3.stateName);
        //}
        //
        //if(data.location4 == undefined || data.location4 == null){
        //    data.location4 = '';
        //}
        //else{
        //    $scope.locationArray.push(data.location4.stateName);
        //}
        //
        //console.log('loc', $scope.locationArray);

        _.forEach($scope.awards, function(value){

            if(value.profile == undefined){
                value.profile = {};
                $scope.awardCheck = undefined;
            }
            else{
                $scope.awardCheck = value.profile.award;
            }

            var awardsObj = {
                "_id": "",
                "description": value.profile.award
            }

            $scope.awardsArray.push(awardsObj);

        });

        console.log($scope.awardsArray);

        _.forEach($scope.patents, function(value){

            if(value.profile == undefined){
                value.profile = {};
                $scope.patentCheck = undefined;
            }
            else{
                $scope.patentCheck = value.profile.patent;
            }

            var patentsObj = {
                "_id": "",
                "description": value.profile.patent
            }

            $scope.patentsArray.push(patentsObj);

        });

        console.log($scope.patentsArray);

        $scope.desiredJobObj = {
            "jobLocation": data.desLocation,
            "industry": data.desIndustry,
            "functionalArea": data.desFunArea,
            "salary": data.desSalary
        }


        var profileData = new FormData();

        if($('#profile')[0].files[0] != undefined){
            profileData.append("profilePic", $('#profile')[0].files[0]);
        }

        if($('#certificates-upload')[0].files[0] != undefined){
            profileData.append("doc", $('#certificates-upload')[0].files[0]);
        }

        if($('.resume-file')[0].files[0] != undefined){
            profileData.append("resume", $('.resume-file')[0].files[0]);
        }

        if(data.jobType != undefined){
            profileData.append("jobType", data.jobType);
        }

        //if($scope.locationArray.length > 0){
        //    profileData.append("desiredJobLocations", JSON.stringify($scope.locationArray));
        //}

        if($scope.empCheck != undefined){
            profileData.append("workHistory", JSON.stringify($scope.empDetailsArray));
        }

        if($scope.eduCheck != undefined){
            profileData.append("education", JSON.stringify($scope.eduDetailsArray));
        }

        if($scope.awardCheck != undefined){
            profileData.append("award", JSON.stringify($scope.awardsArray));
        }

        if($scope.patentCheck != undefined){
            profileData.append("patent", JSON.stringify($scope.patentsArray));
        }

        if(data.certificate != undefined){
            profileData.append("certification", JSON.stringify($scope.cerDetailsObject));
        }

        if(data.desIndustry != undefined){
            profileData.append("desiredJob", JSON.stringify($scope.desiredJobObj));
        }

        if(data.candSalary != undefined){
            profileData.append("salary", data.candSalary);
        }

        profileData.append("profileTitle", data.pTitle);
        profileData.append("nationality", data.nationality.countryName);
        profileData.append("gender", data.gender);
        profileData.append("dob", $scope.comDate);


        $http({
            method:'PUT',
            url: CONSTANT.apiUrl +'/api/candidate/editCandidateProfile',
            data:profileData,
            headers:{
                authorization: $cookieStore.get('AccessToken'),
                'Content-type': undefined
            }
        })
            .success(function(response){
                console.log(response);
                $rootScope.loading = false;
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                bootbox.alert('Your profile has been submitted successfully.');
                $state.go('home.dashboard.aggregatedScore');
                $rootScope.scrollToTop();
                $timeout(function () {
                    $state.go('home.dashboard.aggregatedScore');
                },500);

            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

}]);

/*=============================Start: Update certificates trigger immediately ================================*/

angular.module('Cviq').directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ngModel){
            //change event is fired when file is selected
            el.bind('change',function(){
                scope.$apply(function(){
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                })
            })
        }
    }
});

/*=============================End: Update certificates trigger immediately ================================*/