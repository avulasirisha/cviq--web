angular.module('Cviq').controller('signupCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','$state','$cookieStore','$timeout', function($scope, $rootScope, ngDialog, $http, CONSTANT, $state, $cookieStore, $timeout){


    if($cookieStore.get('AccessToken') != undefined){
        $state.go('home.dashboard');
    }

    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.otp;
    $scope.phoneVerify = false;
    $scope.linkedinData;
    var regExp = /\((.*)\)/i;

    $timeout(function(){
        $('.selectpickers').selectpicker();
    },0);

    //$('body').bind('cut copy paste', function (e) {
    //    e.preventDefault();
    //});


    /*=============================Start: Get Passcode Function ================================*/

    $scope.openPopup = function () {

            if (($('#countryCode').val() == "") || ($('.phone').val() == "") || ($('.mail').val() == "") || $scope.emailValid == true)
            {
                ngDialog.open({
                    template: 'passcodeId',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    closeByEscape:false,
                    closeByDocument:false
                });
            }
            else{
                ngDialog.open({
                    template: 'templateId',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    closeByEscape:false,
                    closeByDocument:false
                });
            }

    };

    /*=============================End: Get Passcode Function ================================*/

    /*=============================Start: Generate Passcode Function ================================*/

    $scope.genPasscode = function(regData){
        console.log(regData);
        var getCode = regData.countryCode;
        $scope.fetchedCode = getCode.match(regExp)[1];

        if($('#onPhoneNumder').is(':checked') || $('#onEmail').is(':checked')) {

            if ($('#onPhoneNumder').is(':checked')) {
                $scope.phoneVerify = true;
            }
            else {
                $scope.phoneVerify = false;
            }

            $http({
                method: 'POST',
                url: CONSTANT.apiUrl + '/api/phoneVerification/generateOTP',
                data: {
                    "email": regData.email,
                    "countryCode": $scope.fetchedCode,
                    "phoneNo": regData.mobileNumber,
                    "duringRegister": true,
                    "verifyThroughPhone": $scope.phoneVerify,
                    "userType": "INTERVIEWER"

                }
            })
                .success(function (response) {
                    console.log("success", response);
                    if(response.statusCode == 201){
                        bootbox.alert('Passcode has been sent to you.');
                    }
                    $scope.otp = response.data.OTP;
                })
                .error(function (response) {
                    console.log("error", response);
                    bootbox.alert(response.message);
                });

            ngDialog.close();

        }
        else{
            $scope.valCheck = "This Field is Required";
        }
    };

    /*=============================End: Get Passcode Function ================================*/

    /*=============================Start: Pop Validation Function ================================*/

    $scope.validCheck = function(){

        if($('#onPhoneNumder').prop("checked") || $('#onEmail').prop("checked")) {
            $("[data-valmsg-for='Otp']").hide();
        } else {
            $("[data-valmsg-for='Otp']").show();
        }
    };

    /*=============================End: Pop Validation Function ================================*/

    /*=============================Start: Signup Function ================================*/

    $scope.signup = function (regData) {
        console.log(regData);
        var getCode = regData.countryCode;
        $scope.fetchedCode = getCode.match(regExp)[1];

        if($('#terms').is(':checked')){
            $scope.subBtn = true;
            $scope.loading = true;
            if($scope.linkedinData == undefined){

                var registerData = new FormData();
                registerData.append("firstName", regData.firstName);
                registerData.append("lastName", regData.lastName);
                registerData.append("countryCode", $scope.fetchedCode);
                registerData.append("phoneNo", regData.mobileNumber);
                registerData.append("OTP", regData.otp);
                registerData.append("email", regData.email);
                registerData.append("password", regData.password);
                registerData.append("verifyThroughPhone", $scope.phoneVerify);
                registerData.append("deviceType", "WEB");

                $http({
                    method:'POST',
                    url:CONSTANT.apiUrl + '/api/interviewer/registerInterviewer',
                    data:registerData,
                    headers:{
                        'Content-type': undefined
                    }
                })
                    .success(function (response) {
                        console.log("success", response);
                        $scope.loading = false;
                        bootbox.alert(response.message);
                        $state.go('home.login',{},{ reload:true });
                        $rootScope.scrollToTop();
                    })
                    .error(function(response){
                        $scope.subBtn = false;
                        $scope.loading = false;
                        console.log("error", response);
                        bootbox.alert(response.message);
                    })

            }
            else{

                var registerData = new FormData();
                registerData.append("firstName", regData.firstName);
                registerData.append("lastName", regData.lastName);
                registerData.append("countryCode", regData.countryCode);
                registerData.append("phoneNo", regData.mobileNumber);
                registerData.append("email", regData.email);
                registerData.append("deviceType", "WEB");
                registerData.append("deviceToken", "string");
                registerData.append("linkedInId", $scope.linkedinData.id);

                $http({
                    method:'POST',
                    url:CONSTANT.apiUrl + '/api/interviewer/registerInterviewerViaLinkedIn',
                    data:registerData,
                    headers:{
                        'Content-type': undefined
                    }
                })
                    .success(function (response) {
                        console.log("successLink", response);
                        $scope.loading = false;
                        bootbox.alert(response.message);
                        $state.go('home.login',{},{ reload:true });
                        $rootScope.scrollToTop();
                    })
                    .error(function(response){
                        $scope.subBtn = false;
                        $scope.loading = false;
                        console.log("errorLink", response);
                        bootbox.alert(response.message);
                    })
            }

            }

        else{
            $scope.authErrorCheck = "This Field is Required";
        }
    };

    /*=============================End: Signup Function ================================*/

    $('#terms').change(function(){
        if($(this).prop("checked")) {
            $("[data-valmsg-for='Location']").hide();
        } else {
            $("[data-valmsg-for='Location']").show();
        }
    });

    /*=============================Start: Resend Passcode Function ================================*/

    $scope.resendPasscode = function(regData){
        console.log(regData);
        var getCode = regData.countryCode;
        $scope.fetchedCode = getCode.match(regExp)[1];

        $http({
            method:'PUT',
            url:CONSTANT.apiUrl + '/api/phoneVerification/resendOTP',
            data:{
                "email": regData.email,
                "countryCode": $scope.fetchedCode,
                "phoneNo": regData.mobileNumber,
                "duringRegister": true,
                "verifyThroughPhone": $scope.phoneVerify,
                "userType": "INTERVIEWER"

            }
        })
            .success(function (response) {
                console.log("success resend otp", response);
                if(response.statusCode == 200){
                    bootbox.alert("Passcode has been sent to you.");
                }
            })
            .error(function(response){
                console.log("error resend otp", response);
                bootbox.alert(response.message);
            });

    };

    /*=============================End: Resend Passcode Function ================================*/

    /*=============================Start: Signup Via LinkedIn Function ================================*/


    $scope.liAuth = function(){
        IN.User.authorize(function(){
            console.log("Inside");
            $scope.onLinkedInLoad();
        });
    };

    $scope.onLinkedInLoad = function() {
        console.log("inside onlinkedinload");
        IN.Event.on(IN, "auth", $scope.getProfileData());
    };

    $scope.getProfileData = function () {

        console.log("insidegetprofiledata");
        IN.API.Raw("/people/~:(id,first-name,last-name,email-address,location,phone-numbers,num-connections,picture-url)?format=json").result(onSuccess).error(onError);
    };

    function onSuccess(data){
        console.log("Success", data);
        $scope.PassField = true;
        $scope.codeClass = "fullWidth";
        $('.mail').attr("readonly", true);
        $scope.linkedinData = data;

        $timeout(function(){

            $scope.register.firstName = $scope.linkedinData.firstName;
            $scope.register.lastName = $scope.linkedinData.lastName;
            $scope.register.email = $scope.linkedinData.emailAddress;

                IN.User.logout(function () {
                    console.log("User logged out of LinkedIn");
                });

        }, 500);

    }

    function onError(error){
        console.log("Error", error);
    }

    /*=============================End: Signup Via LinkedIn Function ================================*/

    /*=============================Start: Country Code Lists ================================*/

    $scope.register = {

        "countryCode": "United States(+1)",
        "values": [

            'Afghanistan(+93)',
            'Åland Islands(+358)',
            'Albania(+355)',
            'Algeria(+213)',
            'American Samoa(+1684)',
            'Andorra(+376)',
            'Angola(+244)',
            'Anguilla(+1264)',
            'Antarctica(+672)',
            'Antigua and Barbuda(+1268)',
            'Argentina(+54)',
            'Armenia(+374)',
            'Aruba(+297)',
            'Australia(+61)',
            'Austria(+43)',
            'Azerbaijan(+994)',
            'Bahamas(+1242)',
            'Bahrain(+973)',
            'Bangladesh(+880)',
            'Barbados(+1246)',
            'Belarus(+375)',
            'Belgium(+32)',
            'Belize(+501)',
            'Benin(+229)',
            'Bermuda(+1441)',
            'Bhutan(+975)',
            'Bolivia(+591)',
            'Bosnia and Herzegovina(+387)',
            'Botswana(+267)',
            'Bouvet Island(+47)',
            'Brazil(+55)',
            'British Indian Ocean Territory(+246)',
            'British Virgin Islands(+1284)',
            'Brunei(+673)',
            'Bulgaria(+359)',
            'Burkina Faso(+226)',
            'Burundi(+257)',
            'Cambodia(+855)',
            'Cameroon(+237)',
            'Canada(+1)',
            'Cape Verde(+238)',
            'Cayman Islands(+1345)',
            'Central African Republic(+236)',
            'Chad(+235)',
            'Chile(+56)',
            'China(+86)',
            'Christmas Island(+61)',
            'Colombia(+57)',
            'Comoros(+269)',
            'Cook Islands(+682)',
            'Costa Rica(+506)',
            'Croatia(+385)',
            'Cuba(+53)',
            'Cyprus(+357)',
            'Czech Republic(+420)',
            'Denmark(+45)',
            'Djibouti(+253)',
            'Dominica(+1767)',
            'Dominican Republic(+1)',
            'DR Congo(+243)',
            'Ecuador(+593)',
            'Egypt(+20)',
            'El Salvador(+503)',
            'Equatorial Guinea(+240)',
            'Eritrea(+291)',
            'Estonia(+372)',
            'Ethiopia(+251)',
            'Falkland Islands(+500)',
            'Faroe Islands(+298)',
            'Fiji(+679)',
            'Finland(+358)',
            'France(+33)',
            'French Guiana(+594)',
            'French Polynesia(+689)',
            'French Southern and Antarctic Lands(+262)',
            'Gabon(+241)',
            'Gambia(+220)',
            'Georgia(+995)',
            'Germany(+49)',
            'Ghana(+233)',
            'Gibraltar(+350)',
            'Greece(+30)',
            'Greenland(+299)',
            'Grenada(+1473)',
            'Guadeloupe(+590)',
            'Guam(+1671)',
            'Guatemala(+502)',
            'Guernsey(+44)',
            'Guinea(+224)',
            'Guinea-Bissau(+245)',
            'Guyana(+592)',
            'Haiti(+509)',
            'Heard Island and McDonald Islands(+672)',
            'Honduras(+504)',
            'Hong Kong(+852)',
            'Hungary(+36)',
            'Iceland(+354)',
            'India(+91)',
            'Indonesia(+62)',
            'Iran(+98)',
            'Iraq(+964)',
            'Ireland(+353)',
            'Isle of Man(+44)',
            'Israel(+972)',
            'Italy(+39)',
            'Ivory Coast(+225)',
            'Jamaica(+1876)',
            'Japan(+81)',
            'Jersey(+44)',
            'Jordan(+962)',
            'Kazakhstan(+7)',
            'Keeling(+61)',
            'Kenya(+254)',
            'Kiribati(+686)',
            'Kuwait(+965)',
            'Kyrgyzstan(+996)',
            'Laos(+856)',
            'Latvia(+371)',
            'Lebanon(+961)',
            'Lesotho(+266)',
            'Liberia(+231)',
            'Libya(+218)',
            'Liechtenstein(+423)',
            'Lithuania(+370)',
            'Luxembourg(+352)',
            'Macau(+853)',
            'Macedonia(+389)',
            'Madagascar(+261)',
            'Malawi(+265)',
            'Malaysia(+60)',
            'Maldives(+960)',
            'Mali(+223)',
            'Malta(+356)',
            'Marshall Islands(+692)',
            'Martinique(+596)',
            'Mauritania(+222)',
            'Mauritius(+230)',
            'Mayotte(+262)',
            'Mexico(+52)',
            'Micronesia(+691)',
            'Moldova(+373)',
            'Monaco(+377)',
            'Mongolia(+976)',
            'Montenegro(+382)',
            'Montserrat(+1664)',
            'Morocco(+212)',
            'Mozambique(+258)',
            'Myanmar(+95)',
            'Namibia(+264)',
            'Nauru(+674)',
            'Nepal(+977)',
            'Netherlands(+31)',
            'Netherlands Antilles(+599)',
            'New Caledonia(+687)',
            'New Zealand(+64)',
            'Nicaragua(+505)',
            'Niger(+227)',
            'Nigeria(+234)',
            'Niue(+683)',
            'Norfolk Island(+672)',
            'North Korea(+850)',
            'Northern Mariana Islands(+1670)',
            'Norway(+47)',
            'Oman(+968)',
            'Pakistan(+92)',
            'Palau(+680)',
            'Palestine(+970)',
            'Panama(+507)',
            'Papua New Guinea(+675)',
            'Paraguay(+595)',
            'Peru(+51)',
            'Philippines(+63)',
            'Pitcairn Islands(+64)',
            'Poland(+48)',
            'Portugal(+351)',
            'Puerto Rico(+1)',
            'Qatar(+974)',
            'Republic of the Congo(+242)',
            'Romania(+40)',
            'Russia(+7)',
            'Rwanda(+250)',
            'Réunion(+262)',
            'Saint Barthélemy(+590)',
            'Saint Helena, Ascension and Tristan da Cunha(+290)',
            'Saint Kitts and Nevis(+1869)',
            'Saint Lucia(+1758)',
            'Saint Martin(+590)',
            'Saint Pierre and Miquelon(+508)',
            'Saint Vincent and the Grenadines(+1784)',
            'Samoa(+685)',
            'San Marino(+378)',
            'Saudi Arabia(+966)',
            'Senegal(+221)',
            'Serbia(+381)',
            'Seychelles(+248)',
            'Sierra Leone(+232)',
            'Singapore(+65)',
            'Slovakia(+421)',
            'Slovenia(+386)',
            'Solomon Islands(+677)',
            'Somalia(+252)',
            'South Africa(+27)',
            'South Georgia(+500)',
            'South Korea(+82)',
            'Spain(+34)',
            'Sri Lanka(+94)',
            'Sudan(+249)',
            'Suriname(+597)',
            'Svalbard and Jan Mayen(+4779)',
            'Swaziland(+268)',
            'Sweden(+46)',
            'Switzerland(+41)',
            'Syria(+963)',
            'São Tomé and Príncipe(+239)',
            'Taiwan(+886)',
            'Tajikistan(+992)',
            'Tanzania(+255)',
            'Thailand(+66)',
            'Timor-Leste(+670)',
            'Togo(+228)',
            'Tokelau(+690)',
            'Tonga(+676)',
            'Trinidad and Tobago(+1868)',
            'Tunisia(+216)',
            'Turkey(+90)',
            'Turkmenistan(+993)',
            'Turks and Caicos Islands(+1649)',
            'Tuvalu(+688)',
            'Uganda(+256)',
            'Ukraine(+380)',
            'United Arab Emirates(+971)',
            'United Kingdom(+44)',
            'United States(+1)',
            'United States Minor Outlying Islands(+1)',
            'United States Virgin Islands(+1340)',
            'Uruguay(+598)',
            'Uzbekistan(+998)',
            'Vanuatu(+678)',
            'Vatican City(+379)',
            'Venezuela(+58)',
            'Vietnam(+84)',
            'Wallis and Futuna(+681)',
            'Western Sahara(+212)',
            'Yemen(+967)',
            'Zambia(+260)',
            'Zimbabwe(+263)']

}



}]);