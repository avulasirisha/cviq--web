if( window.location.hostname == "localhost"  ){
        api_url = 'http://localhost:8000' ;
}else{
        api_url = 'http://34.207.125.7:3005' ;
}
angular.module('Cviq').constant('CONSTANT',{
    apiUrl: api_url
});

angular.module('Cviq').config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home/login');

    $stateProvider
        .state('home',{
            url:'/home',
            abstract:true,
            templateUrl:'app/home.view.html',
            controller:'homeCtrl'
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
        .state('home.dashboard',{
            url:'/dashboard',
            templateUrl:'app/dashboard/dashboard.view.html',
            controller:'dashboardCtrl',
            params:{
                var: 'HOME'
            }
        })
        .state('home.payment',{
            url:'/payment',
            templateUrl:'app/payment/payment.view.html',
            controller:'paymentCtrl',
            params:{
                var: 'GET PAID'
            }
        })
        .state('home.description',{
            url:'/description',
            templateUrl:'app/description/description.view.html',
            controller:'descriptionCtrl',
            params:{
                var: 'MANAGE INTERVIEWS'
            }
        })
        .state('home.availability',{
            url:'/availability',
            templateUrl:'app/availability/availability.view.html',
            controller:'availabilityCtrl'
        })
        .state('home.questions',{
            url:'/questions',
            templateUrl:'app/questions/questions.view.html',
            controller:'questionsCtrl',
            params:{
                var: 'QUESTION BANK'
            }
        })
        .state('home.rating',{
            url:'/rating',
            templateUrl:'app/rating/rating.view.html',
            controller:'ratingCtrl',
            params:{
                var: 'RATING'
            }
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
        .state('home.skypeInterview',{
            url:'/skypeInterview',
            templateUrl:'app/skypeInterview/skypeInterview.view.html',
            controller:'skypeInterviewCtrl'
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
        .state('home.status',{
            url:'/status',
            templateUrl:'app/status/status.view.html',
            controller:'statusCtrl'
        })
        .state('home.interview',{
            url:'/interview',
            abstract:true,
            templateUrl:'app/interview/interview.view.html',
            controller:'interviewCtrl'
        })
        .state('home.interview.past',{
            url:'/past',
            templateUrl:'app/interview/past/past.view.html',
            controller:'pastCtrl',
            params:{
                var: 'MANAGE INTERVIEWS',
                var1: 'PAST'
            }
        })
        .state('home.interview.new',{
            url:'/new',
            templateUrl:'app/interview/new/new.view.html',
            controller:'newCtrl',
            params:{
                var: 'MANAGE INTERVIEWS',
                var1: 'NEW'
            }
        })
        .state('home.interview.upcoming',{
            url:'/upcoming',
            templateUrl:'app/interview/upcoming/upcoming.view.html',
            controller:'upcomingCtrl',
            params:{
                var: 'MANAGE INTERVIEWS',
                var1: 'UPCOMING'
            }
        })
        .state('home.upcoming',{
            url:'/upcomingPage',
            templateUrl:'app/upcoming.view.html',
            controller:'soonCtrl'
        })
});