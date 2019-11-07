if( window.location.hostname == "localhost"  ){
        api_url = 'http://localhost:8000' ;
}else{
        api_url = 'http://34.207.125.7:3005' ;
}

angular.module('Cviq').constant('CONSTANT',{
    //apiUrl: 'http://52.24.206.96:3001'
    apiUrl:api_url
});

angular.module('Cviq').config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: ['#02a5db', '#eff2f5'],
        responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
        showLines: true
    });
}]);

angular.module('Cviq').config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home/login');

    $stateProvider
        .state('home',{
            url:'/home',
            abstract:true,
            templateUrl:'app/home.view.html',
            controller:'homeCtrl'
        })
        .state('home.searchCandidate',{
            url:'/searchCandidate',
            templateUrl:'app/searchCandidate/searchCandidate.html',
            controller:'searchCandidateCtrl',
            params:{
                var: 'SEARCH_CANDIDATE'
            }
        })
        .state('home.login',{
            url:'/login',
            templateUrl:'app/login/login.view.html',
            controller:'loginCtrl',
            params:{
                var: 'SIGN IN'
            }
        })
        .state('home.signup',{
            url:'/signup',
            templateUrl:'app/signup/signup.view.html',
            controller:'signupCtrl',
            params:{
                var: 'SIGN UP'
            }
        })
        .state('home.package',{
            url:'/package',
            templateUrl:'app/package/package.html',
            controller:'packageCtrl',
            params:{
                var: 'MEMBERSHIP'
            }

        })
        .state('home.upgradePackage',{
            url:'/upgradePackage',
            templateUrl:'app/package/upgrade/upgradePackage.html',
            controller:'upgradePackageCtrl',
            params:{
                var: 'MEMBERSHIP'
            }
        })
        .state('home.gateway',{
            url:'/gateway',
            templateUrl:'app/gateway/gateway.html',
            controller:'gatewayCtrl',
            params:{
                var: 'MEMBERSHIP'
            }
        })
        .state('home.redirectUrl',{
            url:'/redirectUrl',
            templateUrl:'app/gateway/redirectUrl/redirectUrl.html',
            controller:'redirectCtrl',
            params:{
                var: 'MEMBERSHIP'
            }
        })
        .state('home.candidateGateway',{
            url:'/candidateGateway?candidate&Payment',
            templateUrl:'app/gateway/candidate/candidateGateway.html',
            controller:'candidateGateway',
            params:{
                var: 'MEMBERSHIP'
            }
        })
        .state('home.candidateRedirectUrl',{
            url:'/candidateRedirectUrl',
            templateUrl:'app/gateway/candidate/candidateRedirectUrl.html',
            controller:'candidateRedirectUrl',
            params:{
                var: 'MEMBERSHIP'
            }
        })
        .state('home.dashboard',{
            url:'/dashboard',
            templateUrl:'app/dashboard/dashboard.view.html',
            controller:'dashboardCtrl',
            abstract:true,
            params:{
                var: 'HOME'
            }
        })
        .state('home.dashboard.recentlyPostedJobs',{
            url:'/recentlyPostedJobs',
            templateUrl:'app/dashboard/recentlyPostedJobs/recentlyPostedJobs.html',
            controller:'recentlyPostedJobsCtrl',
            params:{
                var: 'HOME',
                variable: 'RECENT'
            }
        })
        .state('home.dashboard.scheduledJobs',{
            url:'/scheduledJobs',
            templateUrl:'app/dashboard/scheduledJobs/scheduledJobs.html',
            controller:'scheduledJobsCtrl',
            params:{
                var: 'HOME',
                variable: 'SCHEDULED'
            }
        })
        .state('home.dashboard.favouriteCandidates',{
            url:'/favouriteCandidates',
            templateUrl:'app/dashboard/favouriteCandidates/favouriteCandidates.html',
            controller:'favouriteCandidatesCtrl',
            params:{
                var: 'HOME',
                variable: 'FAVOURITE'
            }
        })

        .state('home.candidate',{
            url:'/candidate',
            templateUrl:'app/candidateProfile/candidate.html',
            controller:'candidateCtrl',
            abstract:true,
            params:{
                var: 'SEARCH_CANDIDATE'
            }
        })
        
        .state('home.candidate.aggregated',{
            url:'/aggregated/:id',
            templateUrl:'app/candidateProfile/aggregated/aggregated.html',
            controller:'aggragatedCtrl',
            params:{
                variable: 'AGGREGATED'
            }
        })
        .state('home.candidate.qualitative',{
            url:'/qualitative/:id',
            templateUrl:'app/candidateProfile/qualitative/qualitative.html',
            controller:'qualitativeCtrl',
            params:{
                variable: 'QUALITATIVE'
            }
        })
        .state('home.candidate.quantitative',{
            url:'/quantitative/:id',
            templateUrl:'app/candidateProfile/quantitative/quantitative.html',
            controller:'quantitativeCtrl',
            params:{
                variable: 'QUANTITATIVE'
            }
        })
        .state('home.jobDetails',{
            url : '/jobDetails/:id',
            templateUrl : 'app/jobDetails/jobDetails.html',
            controller : 'jobDetailsCtrl'
        })
         .state('home.appliedCandidates',{
            url : '/appliedCandidates/:id',
            templateUrl : 'app/appliedCandidates/appliedCandidates.html',
            controller : 'appliedCandidatescntrl'
        })
        .state('home.createNewJob',{
            url:'/createNewJob',
            templateUrl:'app/createNewJob/createNewJob.html',
            controller:'createNewJobCtrl',
            params:{
                var: 'JOBS'
            }
        })
        .state('home.postLater',{
            url:'/postLater',
            templateUrl:'app/createNewJob/postLater/postLater.html',
            controller:'postLaterctrl',

        })
        .state('home.postNow',{
            url:'/postNow',
            templateUrl:'app/createNewJob/postNow/postNow.html',
            controller:'postNowCtrl',

        })
        .state('home.questions',{
            url:'/questions',
            templateUrl:'app/questions/questions.view.html',
            controller:'questionsCtrl',
            params:{
                var: 'QUESTION BANK'
            }
        })
        .state('home.forgotPassword',{
            url:'/forgotPassword',
            templateUrl:'app/forgotPassword/forgotPassword.view.html',
            controller:'forgotPasswordCtrl'
        })
        .state('home.changePassword',{
            url:'/changePassword',
            templateUrl:'app/changePassword/changePassword.view.html',
            controller:'changePasswordCtrl'
        })
        .state('home.faq',{
            url:'/faq',
            templateUrl:'app/faq/faq.view.html',
            controller:'faqCtrl'
        })
        .state('home.inbox',{
            url:'/inbox',
            templateUrl:'app/inbox/inbox.html',
            controller:'inboxCtrl',
            params:{
                var:'INBOX'
            }
        })
        .state('home.inboxMessages',{
            url:'/inboxMessages/:id',
            templateUrl:'app/inbox/inbox_messages/inboxMessages.html',
            controller:'inboxMessagesCtrl',
            params:{
                var:'INBOX'
            }
        })
});