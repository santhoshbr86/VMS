(function() {
    "use strict";
    var app = angular.module("adminTool", [
        'adminModule',
        'loginModule',
        'contactsModule',
        'spsLoginModule',
        'sendEmailModule',
        'signupSheetModule',
        'volScheduleModule',
        'printSignupSheetsModule',
        'importContactsModule',
        'socialContactsModule',
        'timeings',
        'appDirectives',
        'editBasicInfo',
        'editContactInfo',
        'editSchedule',
        'editScheduleService',
        'taskDetails',
        'jqServices',
        'calendarDirective',

        'appService',
        'signUpService',
        'taggingService',

        'ngRoute',
        'ui.select2',
        'ui.bootstrap',
        'uuid4'
    ]);

    var urlprefix = window.location.protocol + '//' + window.location.host; // eslint-disable-line angular/window-service
    var teamsite = window.location.protocol + '//' + window.location.host + "/include"; // eslint-disable-line angular/window-service

    if (window.location.host.indexOf('127.0.0.1') >= 0 || window.location.host.indexOf('localhost') >= 0) { // eslint-disable-line angular/window-service
        //urlprefix = 'http://127.0.0.1:8080';
        urlprefix = 'https://vms-dev.scholastic.com';
        //urlprefix = 'https://vms-qa.scholastic.com';
        //urlprefix = 'https://vms-qa.scholastic.com';
        //urlprefix = 'https://vms-uat.scholastic.com';
        //urlprefix = 'https://volunteer.scholastic.com';
    }

    if (window.location.host.indexOf('10.33.22.225') >= 0) { // eslint-disable-line angular/window-service
        urlprefix = 'http://10.33.22.225:9999';
    }

    //urlprefix = 'https://vms-qa.scholastic.com';

    app.constant('_', window._); // eslint-disable-line angular/window-service
    app.constant('urlprefix', urlprefix);
    app.constant('teamsite', teamsite);

    app.run(['$rootScope', '$window', function($rootScope, $window) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (!current) {
                $window.sessionStorage.removeItem('emailcontacts');
            }
        });
    }]);
    app.config(['$routeProvider', '$httpProvider', 'uibDatepickerConfig', '$sceDelegateProvider', '$compileProvider', function($routeProvider, $httpProvider, uibDatepickerConfig, $sceDelegateProvider, $compileProvider) {
        // Call the following in the browser console if you need debug tags.
        //angular.reloadWithDebugInfo();
        $compileProvider.debugInfoEnabled(false);

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            urlprefix + '/**',
            teamsite + '/**'
        ]);

        $httpProvider.interceptors.push('httpRequestInterceptor');

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        $routeProvider.
        when('/admin', {
            templateUrl: '/partials/admin-login.html',
            controller: 'adminLoginController'
        }).
        when('/admin/home', {
            templateUrl: '/partials/admin-home.html',
            controller: 'adminController'
        }).
        when('/admin/message', {
            templateUrl: '/partials/admin-message.html',
            controller: 'adminMessageController'
        }).
        when('/admin/roles', {
            templateUrl: '/partials/admin-roles.html',
            controller: 'adminRoleController'
        }).
        when('/contacts/add/:orgId/:eventId', {
            templateUrl: '/partials/contacts-add.html',
            controller: 'contactAddController'
        }).
        when('/contacts/all/:orgId/:eventId', {
            templateUrl: '/partials/contacts-all.html',
            controller: 'contactController'
        }).
        when('/contacts/all/:orgId/:eventId/:crmid/:type/:spsid', {
            templateUrl: '/partials/contacts-all.html',
            controller: 'contactController'
        }).
        when('/contacts/all/:orgId/:eventId/:crmid/:type/', {
            templateUrl: '/partials/contacts-all.html',
            controller: 'contactController'
        }).
        when('/contacts/all/:orgId/:eventId/:crmid/:type', {
            templateUrl: '/partials/contacts-all.html',
            controller: 'contactController'
        }).
        when('/contacts/groom/:orgId/:eventId', {
            templateUrl: '/partials/contacts-groomingImport.html',
            controller: 'contactsGroomController'
        }).
        when('/contacts/export/:orgId/:eventId', {
            templateUrl: '/partials/contacts-export.html',
            controller: 'contactExportController'
        }).
        when('/contacts/import/:orgId/:eventId', {
            templateUrl: '/partials/contacts-import.html',
            controller: 'contactImportController'
        }).
        when('/vms/import/contacts', {
            templateUrl: '/partials/contacts-import.html',
            controller: 'contactImportController'
        }).
        when('/contacts/message/:orgId/:eventId', {
            templateUrl: '/partials/sendMessage.html',
            controller: 'sendEmailController'
        }).
        when('/chairperson/signup/:sid', {
            templateUrl: '/partials/volunteers-experience-signup.html',
            controller: 'volunteersExperienceSignupController'
        }).
        when('/editBasicInfo/:orgId/:eventId', {
            templateUrl: '/partials/edit-basicInfo.html',
            controller: 'editBasicInfoCtrl'
        }).
        when('/editContactInfo/:orgId/:eventId', {
            templateUrl: '/partials/edit-contactInfo.html',
            controller: 'editContactInfo'
        }).
        when('/editSchedule/:orgId/:eventId', {
            templateUrl: '/partials/edit-schedule.html',
            controller: 'editScheduleCtrl'
        }).
        when('/experience/dashboard', {
            templateUrl: '/partials/volunteer-dashboard.html',
            controller: 'volunteerDashboardController'
        }).
        when('/experience/dashboard/:sid/:vid', {
            templateUrl: '/partials/volunteer-dashboard.html',
            controller: 'volunteerDashboardController'
        }).
        when('/experience/login', {
            templateUrl: '/partials/sps-login.html',
            controller: 'spsController'
        }).
        when('/experience/forgot', {
            templateUrl: '/partials/sps-forgetpass.html',
            controller: 'spsController'
        }).
        when('/experience/forgotsuccess/:email', {
            templateUrl: '/partials/sps-forgetpassuccess.html',
            controller: 'spsController'
        }).
        when('/experience/newpass', {
            templateUrl: '/partials/sps-newpass.html',
            controller: 'spsController'
        }).
        when('/experience/registration', {
            templateUrl: '/partials/sps-registration.html',
            controller: 'spsController'
        }).
        when('/experience/registration/:sid/:vid', {
            templateUrl: '/partials/sps-registration.html',
            controller: 'spsController'
        }).
        when('/experience/registration/:sid', {
            templateUrl: '/partials/sps-registration.html',
            controller: 'spsController'
        }).
        when('/experience/janrain/registration/:sid/:janrainparams', {
            templateUrl: '/partials/sps-registration.html',
            controller: 'spsController'
        }).
        when('/experience/signup/thankyou/:sid', {
            templateUrl: '/partials/signupsheet-thankYou.html',
            controller: 'thankyouVolunteerSignUpController'
        }).
        when('/experience/signup/print', {
            templateUrl: '/partials/volunteer-signupsheet-print.html',
            controller: 'printVolunteerSignUpController'
        }).
        when('/experience/login/:sid/:vid', {
            templateUrl: '/partials/sps-login.html',
            controller: 'spsController'
        }).
        when('/experience/login/:sid', {
            templateUrl: '/partials/sps-login.html',
            controller: 'spsController'
        }).
        when('/experience/login/error/:sid/:janrainerrormessage', {
            templateUrl: '/partials/sps-login.html',
            controller: 'spsController'
        }).
        when('/experience/register/signup/:sid', {
            templateUrl: '/partials/volunteers-experience-home.html',
            controller: 'volunteersExperienceLoginController'
        }).
        when('/experience/signup/:sid', {
            templateUrl: '/partials/volunteers-experience-home.html',
            controller: 'volunteersExperienceLoginController'
        }).
        when('/experience/signup', {
            templateUrl: '/partials/volunteers-experience-home.html',
            controller: 'volunteersExperienceLoginController'
        }).
        when('/experience/forgot/:sid', {
            templateUrl: '/partials/sps-forgetpass.html',
            controller: 'spsController'
        }).
        when('/experience/forgotsuccess/:sid', {
            templateUrl: '/partials/sps-forgetpassuccess.html',
            controller: 'spsController'
        }).
        when('/experience/forgotsuccess/:sid/:email', {
            templateUrl: '/partials/sps-forgetpassuccess.html',
            controller: 'spsController'
        }).
        when('/fairs/:orgId/spsid/:spsId', {
            templateUrl: '/partials/events-info.html',
            controller: 'signupSheetController'
        }).
        when('/signup/:sid', {
            templateUrl: '/partials/volunteers-experience-home.html',
            controller: 'signupUrlController'
        }).
        when('/signupsheet/print/:sid', {
            templateUrl: '/partials/signupsheet-print.html',
            controller: 'signupSheetPrintController'
        }).
        when('/outlook/contacts/close', {
            templateUrl: '/partials/social-contacts.html',
            controller: 'socialContactsController'
        }).
        when('/googleplus/contacts/close', {
            templateUrl: '/partials/social-contacts.html',
            controller: 'socialContactsController'
        }).
        when('/yahcontacts/contacts/close', {
            templateUrl: '/partials/social-contacts.html',
            controller: 'socialContactsController'
        }).
        when('/taskDetails/:orgId/:eventId', {
            templateUrl: '/partials/editTaskDetails.html',
            controller: 'taskDetailsCtrl'
        }).
        when('/volunteers/builder/:orgId/:eventId', {
            templateUrl: '/partials/signupsheet-builder.html',
            controller: 'signupSheetBuilderController'
        }).
        when('/volunteers/builder/:orgId/:eventId/:sid', {
            templateUrl: '/partials/signupsheet-builder.html',
            controller: 'signupSheetBuilderController'
        }).
        when('/volunteers/builder/:orgId/:eventId/:sid/:action', {
            templateUrl: '/partials/signupsheet-builder.html',
            controller: 'signupSheetBuilderController'
        }).
        when('/volunteers/:orgId/:eventId', {
            templateUrl: '/partials/volunteers-signup.html',
            controller: 'signupSheetController'
        }).
        when('/volunteers/:orgId/:eventId/:crmid/:type', {
            templateUrl: '/partials/volunteers-signup.html',
            controller: 'signupSheetController'
        }).
        when('/volunteers/:orgId/:eventId/:crmid/:type/:spsid', {
            templateUrl: '/partials/volunteers-signup.html',
            controller: 'signupSheetController'
        }).
        when('/volunteers/invite/:orgId/:eventId', {
            templateUrl: '/partials/volunteers-invite.html',
            controller: 'sendEmailController'
        }).
        when('/volunteers/share/:orgId/:eventId', {
            templateUrl: '/partials/volunteers-share.html',
            controller: 'shareController'
        }).
        when('/volunteers/invitePreview/:orgId/:eventId', {
            templateUrl: '/partials/invitePreview.html',
            controller: 'invitePreviewController'
        }).
        when('/experience/newpass/:sid', {
            templateUrl: '/partials/sps-newpass.html',
            controller: 'spsController'
        }).
        when('/', {
            redirectTo: '/experience/login'
        }).
        when('/index', {
            templateUrl: '/partials/shingle.html',
            controller: 'shingleContoller'
        }).
        when('/404', {
            templateUrl: '/partials/404.html'
        }).
        otherwise({
            redirectTo: '/404'
        });
    }]);
})();
