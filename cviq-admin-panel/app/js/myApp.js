var myApp = angular.module('myAppName', ['angle','uiGmapgoogle-maps','ui.bootstrap']);

myApp.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
//    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}]);
myApp.run(["$log", function ($log) {

    $log.log('I\'m a line from custom.js');

}]);


myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider','$httpProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper,$httpProvider) {
        'use strict';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // default route
        $urlRouterProvider.otherwise('/page/login');
        //$urlRouterProvider.when('/app/approvePartnersMain','/app/approvePartnersMain/approvePartners');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: 'app/pages/login.html',
                resolve: helper.resolveFor('ngDialog')
            })
            .state('page.viewProfile', {
                url : '/viewProfile/:id',
                title: 'viewProfile',
                templateUrl: helper.basepath('candidates/viewProfile.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('page.faredetails', {
                url: '/faredetails/:lat/:lng',
                title: "Fare",
                templateUrl: 'app/pages/faredetails.html',
                resolve: helper.resolveFor('whirl')
            })
            .state('page.register', {
                url: '/register',
                title: "Register",
                templateUrl: 'app/pages/register.html',
                resolve: helper.resolveFor('ngDialog')
            })
            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                templateUrl: 'app/pages/recover.html',
                resolve: helper.resolveFor('ngDialog')
            })
            .state('page.terms', {
                url: '/terms',
                title: "Terms & Conditions",
                templateUrl: 'app/pages/terms.html'
            })
            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            })
            .state('page.resetpassword', {
                url: '/reset-password',
                title: "Reset Password",
                templateUrl: 'app/pages/resetpassword.html'
            })

            //App routes
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('ngDialog','modernizr', 'icons', 'screenfull')
            })
            .state('app.changepassword', {
               url: '/change-password',
               title: 'Change Password',
               templateUrl: helper.basepath('changePassword.html'),
               resolve: helper.resolveFor( 'parsley')
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                templateUrl: helper.basepath('dashboard.html')
            })
            .state('app.landingHome', {
                url: '/landingHome',
                title: 'Home',
                templateUrl: helper.basepath('landing/landingHome.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','inputmask','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.landingAbout', {
                url: '/landingAbout',
                title: 'About',
                templateUrl: helper.basepath('landing/landingAbout.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','inputmask','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.landingFeatures', {
                url: '/landingFeatures',
                title: 'Features',
                templateUrl: helper.basepath('landing/landingFeatures.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','inputmask','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.landingHowItWorks', {
                url: '/landingHowItWorks',
                title: 'How It Works',
                templateUrl: helper.basepath('landing/landingHowItWorks.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','inputmask','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.landingTestimonials', {
                url: '/landingTestimonials',
                title: 'Testimonials',
                templateUrl: helper.basepath('landing/landingTestimonials.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','inputmask','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.landingOurTeam', {
                url: '/landingOurTeam',
                title: 'Our Team',
                templateUrl: helper.basepath('landing/landingOurTeam.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','inputmask','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.landingContactUs', {
                url: '/landingContactUs',
                title: 'Contact Us',
                templateUrl: helper.basepath('landing/landingContactUs.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','inputmask','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.updatePlan', {
                url: '/updatePlan',
                title: 'Update Plan',
                templateUrl: helper.basepath('plans/updatePlan.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.addNewPlan', {
                url: '/addNewPlan',
                title: 'Add New Plan',
                templateUrl: helper.basepath('plans/addNewPlan.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.candidateInterview', {
                url: '/candidateInterview',
                title: 'candidate Interview Rate',
                templateUrl: helper.basepath('plans/candidateInterview.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.allInterviewer', {
                url: '/allInterviewer',
                title: 'allInterviewer',
                templateUrl: helper.basepath('interviewer/allInterviewer.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.approvedInterviewer', {
                url: '/approvedInterviewer',
                title: 'approvedInterviewer',
                templateUrl: helper.basepath('interviewer/approvedInterviewer.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.pendingInterviewer', {
                url: '/pendingInterviewer',
                title: 'pendingInterviewer',
                templateUrl: helper.basepath('interviewer/pendingInterviewer.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.blockedInterviewer', {
                url: '/blockedInterviewer',
                title: 'blockedInterviewer',
                templateUrl: helper.basepath('interviewer/blockedInterviewer.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.PaymentInterviewer', {
                url: '/PaymentInterviewer',
                title: 'Interviewer Paymants',
                templateUrl: helper.basepath('interviewer/PaymentInterviewer.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.allCandidates', {
                url: '/allCandidates',
                title: 'allCandidates',
                templateUrl: helper.basepath('candidates/allCandidates.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.blockedCandidates', {
                url: '/blockedCandidates',
                title: 'blockedCandidates',
                templateUrl: helper.basepath('candidates/blockedCandidates.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.allRecruiters', {
                url: '/allRecruiters',
                title: 'allRecruiters',
                templateUrl: helper.basepath('Recruiter/allRecruiters.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.blockedRecruiters', {
                url: '/blockedRecruiters',
                title: 'blockedRecruiters',
                templateUrl: helper.basepath('Recruiter/blockedRecruiters.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.pastInterviews', {
                url: '/pastInterviews',
                title: 'Past Interviews',
                templateUrl: helper.basepath('interviews/pastInterviews.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.paymentInterviews', {
                url: '/paymentInterviews',
                title: 'Payment Interviews',
                templateUrl: helper.basepath('interviews/paymentInterviews.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.pendingInterviews', {
                url: '/pendingInterviews',
                title: 'Pending Interviews',
                templateUrl: helper.basepath('interviews/pendingInterviews.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
             .state('app.revaluationInterviews', {
                url: '/revaluationInterviews',
                title: 'Revaluation Interviews',
                templateUrl: helper.basepath('interviews/revaluationInterviews.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.upcomingInterviews', {
                url: '/upcomingInterviews',
                title: 'Upcoming Interviews',
                templateUrl: helper.basepath('interviews/upcomingInterviews.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog', 'inputmask' ,'parsley','whirl')
            })
            .state('app.jobs', {
                url: '/jobs',
                title: 'Jobs List',
                templateUrl: helper.basepath('jobs/jobs.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.country', {
                url: '/country',
                title: 'Update Country List',
                templateUrl: helper.basepath('data/country.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.state', {
                url: '/state',
                title: 'Update state List',
                templateUrl: helper.basepath('data/state.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.zipcode', {
                url: '/zipcode',
                title: 'Update Zipcode List',
                templateUrl: helper.basepath('data/zipcode.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.graduation', {
                url: '/graduation',
                title: 'Update Graduation List',
                templateUrl: helper.basepath('data/graduation.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.postGraduation', {
                url: '/postGraduation',
                title: 'Update Post Graduation List',
                templateUrl: helper.basepath('data/postGraduation.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.doctorate', {
                url: '/doctorate',
                title: 'Update Doctorate List',
                templateUrl: helper.basepath('data/doctorate.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.industry', {
                url: '/industry',
                title: 'Update Industry List',
                templateUrl: helper.basepath('data/industry.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.functional', {
                url: '/functional',
                title: 'Update Functional Area List',
                templateUrl: helper.basepath('data/functional.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.scores', {
                url: '/QuantitativeScores',
                title: 'Update Quantitative Scores Data',
                templateUrl: helper.basepath('scores/scores.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.qualitativeScores', {
                url: '/QualitativeScores',
                title: 'Update Qualitative Scores Data',
                templateUrl: helper.basepath('scores/qualitativeScores.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.recruiter', {
                url: '/Recruiter',
                title: 'Add Recruiter Promo Codes',
                templateUrl: helper.basepath('Promo Codes/Recruiter/recruiter.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.recruiterActive', {
                url: '/recruiterActivePromo',
                title: 'Recruiter Active Promo Codes',
                templateUrl: helper.basepath('Promo Codes/Recruiter/recruiterActive.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.recruiterInActive', {
                url: '/recruiterInActivePromo',
                title: 'Recruiter In Active Promo Codes',
                templateUrl: helper.basepath('Promo Codes/Recruiter/recruiterInActive.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.candidate', {
                url: '/Candidate',
                title: 'Add Candidate Promo Codes',
                templateUrl: helper.basepath('Promo Codes/candidate/candidate.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.candidateActive', {
                url: '/CandidateActive',
                title: 'Candidate Active Promo Codes',
                templateUrl: helper.basepath('Promo Codes/candidate/candidateActive.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.candidateInActive', {
                url: '/CandidateInActive',
                title: 'Candidate In Active Promo Codes',
                templateUrl: helper.basepath('Promo Codes/candidate/candidateInActive.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.candidateFaq', {
                url: '/candidateFaq',
                title: 'Update Candidate Faq Data',
                templateUrl: helper.basepath('faq/candidateFaq.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.techQuestionBank', {
                url: '/techQuestionBank',
                title: 'Technical Question Bank',
                templateUrl: helper.basepath('questionBank/techQuestionBank.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.NonTechQuestionBank', {
                url: '/NonTechQuestionBank',
                title: 'Non Technical Question Bank',
                templateUrl: helper.basepath('questionBank/NonTechQuestionBank.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.interviewerFaq', {
                url: '/interviewerFaq',
                title: 'Update Interviewer Faq Data',
                templateUrl: helper.basepath('faq/interviewerFaq.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
            .state('app.recruiterFaq', {
                url: '/recruiterFaq',
                title: 'Update Recruiter Faq Data',
                templateUrl: helper.basepath('faq/recruiterFaq.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            }) 
            .state('app.payments', {
                url: '/payments',
                title: 'Update Recruiter Faq Data',
                templateUrl: helper.basepath('payments/payments.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
             .state('app.candidateMembership', {     
                url: '/candidateMembership',
                title: 'Update Recruiter Faq Data',
                templateUrl: helper.basepath('plans/candidateMembership.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog','parsley','ngTable','ngTableExport','whirl')
            })
        
        $httpProvider.defaults.transformRequest = function(data){
            if (data === undefined) {
                return data;
            }
            return $.param(data);
        };



        App.directive("limitTo", [function() {
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

        /**=========================================================
         * Module: masked,js
         * Initializes the masked inputs
         =========================================================*/
        App.directive('masked', function () {
            return {
                restrict: 'A',
                controller: ["$scope", "$element", function ($scope, $element) {
                    var $elem = $($element);
                    if ($.fn.inputmask)
                        $elem.inputmask();
                }]
            };
        });

        App.directive('googleplace', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, model) {
                    var options = {
                        types: ['geocode'],
                        componentRestrictions: {}
                    };
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                    google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                        scope.$apply(function() {
                            model.$setViewValue(element.val());
                        });
                    });
                }
            };
        });
        App.controller('MapCtrl',function($scope) {
            $scope.gPlace;
        });



    }]);

App.controller('DatepickerDemoCtrl', ['$scope', function ($scope) {
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

}]);

/**=========================================================
 * Module: demo-dialog.js
 * Demo for multiple ngDialog Usage
 * - ngDialogProvider for default values not supported
 *   using lazy loader. Include plugin in base.js instead.
 =========================================================*/

// Called from the route state. 'tpl' is resolved before
App.controller('DialogIntroCtrl', ['$scope', 'ngDialog', 'tpl', function($scope, ngDialog, tpl) {
    'user strict';

    // share with other controllers
    $scope.tpl = tpl;
    // open dialog window
    ngDialog.open({
        template: tpl.path,
        // plain: true,
        className: 'ngdialog-theme-default'
    });

}]);

// Loads from view
App.controller('DialogMainCtrl', ["$scope", "$rootScope", "ngDialog", function ($scope, $rootScope, ngDialog) {
    'user strict';

    $rootScope.jsonData = '{"foo": "bar"}';
    $rootScope.theme = 'ngdialog-theme-default';

    $scope.directivePreCloseCallback = function (value) {
        if(confirm('Close it? MainCtrl.Directive. (Value = ' + value + ')')) {
            return true;
        }
        return false;
    };

    $scope.preCloseCallbackOnScope = function (value) {
        if(confirm('Close it? MainCtrl.OnScope (Value = ' + value + ')')) {
            return true;
        }
        return false;
    };

    $scope.open = function () {
        ngDialog.open({ template: 'firstDialogId', controller: 'InsideCtrl', data: {foo: 'some data'} });
    };

    $scope.openDefault = function () {
        ngDialog.open({
            template: 'firstDialogId',
            controller: 'InsideCtrl',
            className: 'ngdialog-theme-default'
        });
    };

    $scope.openDefaultWithPreCloseCallbackInlined = function () {
        ngDialog.open({
            template: 'firstDialogId',
            controller: 'InsideCtrl',
            className: 'ngdialog-theme-default',
            preCloseCallback: function(value) {
                if (confirm('Close it?  (Value = ' + value + ')')) {
                    return true;
                }
                return false;
            }
        });
    };

    $scope.openConfirm = function () {
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default'
        }).then(function (value) {
        }, function (reason) {
        });
    };

    $scope.openConfirmWithPreCloseCallbackOnScope = function () {
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default',
            preCloseCallback: 'preCloseCallbackOnScope',
            scope: $scope
        }).then(function (value) {
        }, function (reason) {
        });
    };

    $scope.openConfirmWithPreCloseCallbackInlinedWithNestedConfirm = function () {
        ngDialog.openConfirm({
            template: 'dialogWithNestedConfirmDialogId',
            className: 'ngdialog-theme-default',
            preCloseCallback: function(value) {

                var nestedConfirmDialog = ngDialog.openConfirm({
                    template:
                    '<p>Are you sure you want to close the parent dialog?</p>' +
                    '<div>' +
                    '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                    '<button type="button" class="btn btn-primary" ng-click="confirm(1)">Yes' +
                    '</button></div>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });

                return nestedConfirmDialog;
            },
            scope: $scope
        })
            .then(function(value){
                // Perform the save here
            }, function(value){

            });
    };

    $scope.openInlineController = function () {
        $rootScope.theme = 'ngdialog-theme-default';

        ngDialog.open({
            template: 'withInlineController',
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var counter = 0;
                var timeout;
                function count() {
                    $scope.exampleExternalData = 'Counter ' + (counter++);
                    timeout = $timeout(count, 450);
                }
                count();
                $scope.$on('$destroy', function () {
                    $timeout.cancel(timeout);
                });
            }],
            className: 'ngdialog-theme-default'
        });
    };

    $scope.openTemplate = function () {
        $scope.value = true;

        ngDialog.open({
            template: $scope.tpl.path,
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.openTemplateNoCache = function () {
        $scope.value = true;

        ngDialog.open({
            template: $scope.tpl.path,
            className: 'ngdialog-theme-default',
            scope: $scope,
            cache: false
        });
    };

    $scope.openTimed = function () {
        var dialog = ngDialog.open({
            template: '<p>Just passing through!</p>',
            plain: true,
            closeByDocument: false,
            closeByEscape: false
        });
        setTimeout(function () {
            dialog.close();
        }, 2000);
    };

    $scope.openNotify = function () {
        var dialog = ngDialog.open({
            template:
            '<p>You can do whatever you want when I close, however that happens.</p>' +
            '<div><button type="button" class="btn btn-primary" ng-click="closeThisDialog(1)">Close Me</button></div>',
            plain: true
        });
        dialog.closePromise.then(function (data) {
            console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
        });
    };

    $scope.openWithoutOverlay = function () {
        ngDialog.open({
            template: '<h2>Notice that there is no overlay!</h2>',
            className: 'ngdialog-theme-default',
            plain: true,
            overlay: false
        });
    };

    $rootScope.$on('ngDialog.opened', function (e, $dialog) {
    });

    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
    });

    $rootScope.$on('ngDialog.closing', function (e, $dialog) {
    });
}]);

App.controller('InsideCtrl', ["$scope", "ngDialog", function ($scope, ngDialog) {
    'user strict';
    $scope.dialogModel = {
        message : 'message from passed scope'
    };
    $scope.openSecond = function () {
        ngDialog.open({
            template: '<p class="lead m0"><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
            plain: true,
            closeByEscape: false,
            controller: 'SecondModalCtrl'
        });
    };
}]);

App.controller('SecondModalCtrl', ["$scope", "ngDialog", function ($scope, ngDialog) {
    'user strict';
    $scope.closeSecond = function () {
        ngDialog.close();
    };
}]);

App.directive('dndList', function($http) {

    return function(scope, element, attrs) {

        // variables used for dnd
        var toUpdate;
        var startIndex = -1;
        var Token;

        // watch the model, so we always know what element
        // is at a specific position
        scope.$watch(attrs.dndList, function(value) {
            console.log(value);
            toUpdate = value;
            // Token= toUpdate[0].token;
            // console.log(toUpdate.length+"+++++++++"+Token);
            // var eventsJSON1=[];
            // for(var i=0;i<toUpdate.length;i++){
            //     eventsJSON1.push({
            //         "eventId": toUpdate[i].user_id,
            //         "order": toUpdate[i].index.toString()
            //     });
            // }
            // console.log(eventsJSON1);
            // $http({
            //     method: 'PUT',
            //     url: 'http://52.89.66.217:8001/api/v1/admin/rearrangeEvents',
            //     headers: {
            //     'authorization': Token
            //     },
            //     data:
            //     {
            //         'eventsJSON':eventsJSON1
            //     },
            //     success: function(response){
            //         console.log("success");
            //         console.log(response);
            //     },
            //     error: function(response,error){
            //         console.log(response.responseJSON.message);
            //         console.log(error);
            //     }
            // });
//            console.log($cookieStore.get('Token'));
        },true);


        // use jquery to make the element sortable (dnd). This is called
        // when the element is rendered
        $(element[0]).sortable({
            items:'li',
            start:function (event, ui) {
                // on start we define where the item is dragged from
                startIndex = ($(ui.item).index());
            },
            stop:function (event, ui) {
                // on stop we determine the new index of the
                // item and store it there
                var newIndex = ($(ui.item).index());
                var toMove = toUpdate[startIndex];
                toUpdate.splice(startIndex,1);
                toUpdate.splice(newIndex,0,toMove);

                // we move items in the array, if we want
                // to trigger an update in angular use $apply()
                // since we're outside angulars lifecycle
                scope.$apply(scope.list);
            },
            axis:'y'
        })
    }
});







