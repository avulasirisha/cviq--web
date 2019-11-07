 if( window.location.hostname == "localhost"  ){
    api_url = 'http://localhost:8000' ;
 }else{
    api_url = 'http://34.207.125.7:3005' ;
 }                        
angular.module('Cviq').constant('CONSTANT',{
    apiUrl: api_url,
    linkedClienid: '77t8dsm7xpnm33',
    linkClineSecret:'Hc43cDPfSGSjjvOD'
    
});
angular.module('Cviq')
    // Optional configuration
    .config(['ChartJsProvider', function (ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions({
            chartColors: ['#02a5db'],
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
        .state('home.homeScreen',{
            url:'/homeScreen',
            templateUrl:'app/landingPage/landingPage.view.html',
            controller:'landingPageCtrl',
            abstract:true,
            params:{
                var: 'LANDING PAGE'
            }
        })
        .state('home.homeScreen.search',{
            url:'/search',
            templateUrl:'app/landingPage/search/search.view.html',
            controller:'searchCtrl'
        })
        .state('home.homeScreen.completeJobDetails',{
            url:'/completeJobDetails',
            templateUrl:'app/landingPage/completeJobDetails/completeJobDetails.view.html',
            controller:'completeJobDetailsCtrl'
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
            abstract:true
        })
        .state('home.dashboard.aggregatedScore',{
            url:'/aggregatedScore',
            templateUrl:'app/dashboard/aggregatedScore/aggregatedScore.view.html',
            controller:'aggregatedScoreCtrl',
            params:{
                var: 'HOME',
                variable: 'AGGREGATE'
            }
        })
        .state('home.dashboard.quantitativeScore',{
            url:'/quantitativeScore',
            templateUrl:'app/dashboard/quantitativeScore/quantitativeScore.view.html',
            controller:'quantitativeScoreCtrl',
            params:{
                var: 'HOME',
                variable: 'QUANTITATIVE'
            }
        })
        .state('home.dashboard.qualitativeScore',{
            url:'/qualitativeScore',
            templateUrl:'app/dashboard/qualitativeScore/qualitativeScore.view.html',
            controller:'qualitativeScoreCtrl',
            abstract: true,
            params:{
                variable: 'QUALITATIVE',
                var: 'HOME'
            }
        })

        .state('home.dashboard.qualitativeScore.pastInterview',{
            url:'/pastInterview',
            templateUrl:'app/dashboard/qualitativeScore/pastInterview/pastInterview.view.html',
            controller:'pastInterviewCtrl',
            params:{
                inter: 'PAST',
                var: 'HOME'
            }
        })

        .state('home.dashboard.qualitativeScore.upcomingInterview',{
            url:'/upcomingInterview',
            templateUrl:'app/dashboard/qualitativeScore/upcomingInterview/upcomingInterview.view.html',
            controller:'upcomingInterviewCtrl',
            params:{
                inter: 'UPCOMING',
                var: 'HOME'
            }
        })

        .state('home.completeYourProfile',{
            url:'/completeYourProfile',
            templateUrl:'app/completeYourProfile/completeYourProfile.view.html',
            controller:'completeYourProfileCtrl',
            params:{
                var: 'COMPLETE PROFILE'
            }
        })
        
         .state('home.search',{
            url:'/search',
            templateUrl:'app/searchjobs/search.view.html',
            controller:'searchCtrl',
            params:{
                var: 'COMPLETE PROFILE'
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
         .state('home.contactus',{
            url:'/contactus',
            templateUrl:'app/contactus/contactus.view.html',
            controller:'contactusCtrl',
            params:{
                var: 'GET PAID'
            }
        })
        .state('home.redirect',{
            url:'/redirect',
            templateUrl:'app/redirect/redirectUrl.view.html',
            controller:'redirectUrlCtrl'
        })
        .state('home.instructions',{
            url:'/instructions',
            templateUrl:'app/instructions/instructions.view.html',
            controller:'instructionsCtrl'
        })
        .state('home.description',{
            url:'/description',
            templateUrl:'app/description/description.view.html',
            controller:'descriptionCtrl'
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
        .state('home.createResume',{
            url:'/createResume',
            templateUrl:'app/createResume/createResume.view.html',
            controller:'createResumeCtrl'
        })
        .state('home.membership',{
            url:'/membership',
            templateUrl:'app/membership/membership.view.html',
            controller:'membershipCtrl'
        })
        .state('home.redirectUrl',{
            url:'/redirectUrl',
            templateUrl:'app/redirectUrl/redirectUrl.view.html',
            controller:'redirectUrlCtrl'
        })
        .state('home.inbox',{
            url:'/inbox',
            abstract:true,
            templateUrl:'app/inbox/inbox.view.html',
            controller:'inboxCtrl'
        })
        .state('home.search.appliedJobs',{
            url:'/appliedJobs',
            templateUrl:'app/searchjobs/appliedJobs/appliedJobs.view.html',
            controller:'appliedJobsCtrl',
            params:{
                var:'JOBS',
                var1:'APPLIED JOBS'
            }
        })
        .state('home.inbox.matchedJobs',{
            url:'/matchedJobs',
            templateUrl:'app/inbox/matchedJobs/matchedJobs.view.html',
            controller:'matchedJobsCtrl',
            params:{
                var:'JOBS',
                var1:'MATCHED JOBS'
            }
        })
        .state('home.inbox.suggestedJobs',{
            url:'/suggestedJobs',
            templateUrl:'app/inbox/suggestedJobs/suggestedJobs.view.html',
            controller:'suggestedJobsCtrl',
            params:{
                var:'JOBS',
                var1:'SUGGESTED JOBS'
            }
        })
        .state('home.search.favouritejobs',{
            url:'/favouritejobs',
            templateUrl:'app/searchjobs/favouritejobs/favouritejobs.view.html',
            controller:'favouritejobs',
            params:{
                var:'JOBS',
                var1:'FAVOURITE JOBS'
            }
        })
        .state('home.search.searchJobs',{
            url:'/searchJobs',
            templateUrl:'app/searchjobs/searchJobs/searchJobs.view.html',
            controller:'searchJobsCtrl',
            params:{
                var:'JOBS',
                var1:'SEARCH JOBS'
            }
        })
        .state('home.search.viewedProfile',{
            url:'/viewedProfile',
            templateUrl:'app/searchjobs/viewedProfile/viewedProfile.view.html',
            controller:'viewedProfileCtrl',
            params:{
                var:'JOBS',
                var1:'VIEWED PROFILE'
            }
        })
        .state('home.inbox.desiredJob',{
            url:'/desiredJob',
            templateUrl:'app/inbox/desiredJob/desiredJob.view.html',
            controller:'desiredJobCtrl',
            params:{
                var:'JOBS',
                var1:'DESIRED JOB'
            }
        })
        .state('home.inbox.awards',{
            url:'/awards',
            templateUrl:'app/inbox/awards/awards.view.html',
            controller:'awardsCtrl',
            params:{
                var:'JOBS',
                var1:'AWARDS'
            }
        })
        .state('home.inbox.patents',{
            url:'/patents',
            templateUrl:'app/inbox/patents/patents.view.html',
            controller:'patentsCtrl',
            params:{
                var:'JOBS',
                var1:'PATENTS'
            }
        })
        .state('home.inbox.inboxTab',{
            url:'/inboxTab',
            abstract:true,
            templateUrl:'app/inbox/inboxTab/inboxTab.view.html',
            controller:'inboxTabCtrl'
        })
        .state('home.inbox.inboxTab.alerts',{
            url:'/alerts',
            templateUrl:'app/inbox/inboxTab/alerts/alerts.view.html',
            controller:'alertsCtrl',
            params:{
                variable : 'ALERTS',
                var: 'INBOX',
                var1: 'INBOX ALERTS'
            }
        })
        .state('home.inbox.inboxTab.mails',{
            url:'/mails',
            templateUrl:'app/inbox/inboxTab/mails/mails.view.html',
            controller:'mailsCtrl',
            params:{
                variable: 'MAILS',
                var : 'INBOX',
                var1: 'INBOX MAILS'
            }
        })

        .state('home.inbox.inboxTab.chat',{
            url:'/chat',
            templateUrl:'app/inbox/inboxTab/chat/chat.view.html',
            controller:'chatCtrl',
            params:{
                variable: 'MAILS',
                var : 'MAILS',
                var1: 'INBOX MAILS'
            }
        })
        .state('home.inbox.profile',{
            url:'/profile',
            templateUrl:'app/inbox/profile/profile.view.html',
            controller:'profileCtrl',
            params:{
                var: 'INBOX',
                var1: 'MY PROFILE'
            }
        })
        .state('home.inbox.workExperience',{
            url:'/workExperience',
            templateUrl:'app/inbox/workExperience/workExperience.view.html',
            controller:'workExperienceCtrl',
            params:{
                var: 'INBOX',
                var1: 'WORK EXPERIENCE'
            }
        })
        .state('home.inbox.education',{
            url:'/education',
            templateUrl:'app/inbox/education/education.view.html',
            controller:'educationCtrl',
            params:{
                var: 'INBOX',
                var1: 'EDUCATION'
            }
        })
        .state('home.inbox.certifications',{
            url:'/certifications',
            templateUrl:'app/inbox/certifications/certifications.view.html',
            controller:'certificationsCtrl',
            params:{
                var: 'INBOX',
                var1: 'CERTIFICATIONS'
            }
        })
        .state('home.inbox.resume',{
            url:'/resume',
            templateUrl:'app/inbox/resume/resume.view.html',
            controller:'resumeCtrl',
            params:{
                var: 'INBOX',
                var1: 'RESUME'
            }
        })
        .state('home.search.jobDetails',{
            url:'/jobDetails',
            templateUrl:'app/searchjobs/jobDetails/jobDetails.view.html',
            controller:'jobDetailsCtrl'
        })
        .state('home.search.recruiterDetails',{
            url:'/recruiterDetails',
            templateUrl:'app/searchjobs/recruiterDetails/recruiterDetails.view.html',
            controller:'recruiterDetailsCtrl',
            params:{
                var:'JOBS',
                var1:'VIEWED PROFILE'
            }
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
                var: 'MANAGE INTERVIEWS'
            }
        })
        .state('home.interview.new',{
            url:'/new',
            templateUrl:'app/interview/new/new.view.html',
            controller:'newCtrl'
        })
        .state('home.interview.upcoming',{
            url:'/upcoming',
            templateUrl:'app/interview/upcoming/upcoming.view.html',
            controller:'upcomingCtrl'
        })
        .state('home.upcoming',{
            url:'/upcomingPage',
            templateUrl:'app/upcoming.view.html',
            controller:'soonCtrl'
        })
});