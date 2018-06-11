(function() {
    "use strict";
    var app = angular.module('importContactsModule', []);
    app.controller('contactImportController', ['$scope', '$http', '$location', '$rootScope', '$routeParams', '$window', '$interval', 'contactService', 'importService', 'janRainService', 'urlprefix', 'teamsite', function($scope, $http, $location, $rootScope, $routeParams, $window, $interval, contactService, importService, janRainService, urlprefix, teamsite) {
        $scope.myFile = {};
        $scope.include = {
            top: teamsite + "/CON400_ImportContacts.html",
            middle: teamsite + "/CON400_CSVSelected.html",
            csv_middle: teamsite + "/CON400_ImportContacts_CSV.html",
        };
        $scope.invalid = false;

        $scope.clearFileAttr = function() {
            $scope.myFile = {};
        };

        $scope.uploadFile = function() {
            var file = $scope.myFile;
            if (file.size > 0) {
                importService.setItem('importing');
                $scope.goToContacts();
                var fd = new FormData();
                fd.append('contacts', file);
                fd.append('orgId', $routeParams.orgId);
                fd.append('eventId', $routeParams.eventId);
                var crmId = $window.sessionStorage.getItem('CrmId');
                var contactType = $window.sessionStorage.getItem('ContactType');
                var SpsId = $window.sessionStorage.getItem('SpsId');
                if (angular.isDefined(crmId) && crmId !== null) {
                    fd.append('crmId', crmId);
                }
                if (angular.isDefined(contactType) && contactType !== null) {
                    fd.append('type', contactType);
                }
                if (angular.isDefined(SpsId) && SpsId !== null) {
                    fd.append('spsId', SpsId);
                } else {
                    fd.append('spsId', '123');
                }

                $http.post(urlprefix + "/volunteer-manager/contact-migration/import", fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(
                    function(data) {
                        console.log('upload good');
                        if (angular.isDefined($window._satellite)) {
                            $window._satellite.track('import_contacts');
                        }
                    },
                    function(data) {
                        console.log(data);
                        console.error('upload failure');
                    });
            } else {
                $scope.invalid = true;
            }
        };

        $scope.getOutLookContacts = function() {
            console.log("In getOutLookContacts " + $routeParams.orgId + '/' + $routeParams.eventId);
            var nonce = $routeParams.orgId + "-" + $routeParams.eventId + "-" + $window.sessionStorage.getItem('CrmId') + "-" + $window.sessionStorage.getItem('ContactType');
            console.log("old urlprefix " + urlprefix);
            var newurlprefix = urlprefix;
            var client_id = '';
            if ((urlprefix === 'http://dev.scholastic.com:8080') || (urlprefix === 'http://localhost:8080') || (urlprefix === 'http://127.0.0.1:8080')) {
                newurlprefix = 'http://localhost:8080';
                client_id = '9595985b-4055-4d46-8123-d0bc19422bf7';
            } else if (urlprefix === 'https://vms-dev.scholastic.com') {
                client_id = '0fe3f248-4f5d-47f2-8af4-263f969e3088';
            } else if (urlprefix === 'https://vms-qa.scholastic.com') {
                client_id = 'e2df1f35-cb6d-4993-b8f7-d495279b1fa3';
            } else {
                client_id = '0553762d-d097-46de-9bd0-05de3ccd5c99';
            }
            console.log("new urlprefix " + newurlprefix);
            console.log("client_id " + client_id);
            var redirectUrl = newurlprefix + '/volunteer-manager/outlook/authorize';
            console.log("redirectUrl " + redirectUrl);
            var uri = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + client_id + '&redirect_uri=' + redirectUrl + '&response_type=code%20id_token&scope=openid%20offline_access%20profile%20https://outlook.office.com/mail.read%20https://outlook.office.com/contacts.read&state=3a043556-c47c-4bed-9189-c0f78d5890a4&nonce=' + nonce + '&response_mode=form_post';

            var popup = $window.open(uri, '', "top=100,left=100,width=700,height=700");

            var popupChecker = $interval(function() {
                if (popup.closed) {
                    console.log("Error logging in.");
                    $interval.cancel(popupChecker);
                    contactService.getGroomContacts($routeParams.orgId, $routeParams.eventId).then(
                        function(data) {
                            $scope.contactList = data.data.volunteers;
                            if (angular.isDefined(data.data.volunteers) && data.data.volunteers.length >= 1) {
                                $location.path('/contacts/groom/' + $routeParams.orgId + '/' + $routeParams.eventId);
                            } else {
                                var closed = $window.localStorage.getItem("manuallyClosed");
                                if (closed === 'no') {
                                    $scope.invalid = true;
                                    $window.localStorage.removeItem("manuallyClosed");
                                }
                            }
                        },
                        function(data) {
                            console.error('getting contacts failed.');
                        });
                }
            }, 100);

        };

        $scope.getYahooContacts = function() {
            //console.log("In Yahoo Trigger Flow");
            //$window.janrain.engage.signin.triggerFlow('yahoo');

            console.log("In getYahooContacts Flow");
            console.log("In getYahooContacts With " + $routeParams.orgId + '/' + $routeParams.eventId);
            var nonce = $routeParams.orgId + "-" + $routeParams.eventId + "-" + $window.sessionStorage.getItem('CrmId') + "-" + $window.sessionStorage.getItem('ContactType');
            console.log("old urlprefix " + urlprefix);
            var newurlprefix = urlprefix;
            var client_id = '';
            if ((urlprefix === 'http://dev.scholastic.com:8080') || (urlprefix === 'http://localhost:8080') || (urlprefix === 'http://127.0.0.1:8080')) {
                newurlprefix = 'http://localhost:8080';
                client_id = 'dj0yJmk9cnNFRXlud3ZMYXNJJmQ9WVdrOVRWTXpRbWMyTlRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD01ZQ--';
            } else if (urlprefix === 'https://vms-dev.scholastic.com') {
                client_id = 'dj0yJmk9VWlHenM2RmlKcVpDJmQ9WVdrOVN6QmFhMUZqTjJrbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1iZA--';
            } else if (urlprefix === 'https://vms-qa.scholastic.com') {
                client_id = 'dj0yJmk9NlA4UXdtU2U3N3BnJmQ9WVdrOWVuVjFlbkpJTXpZbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD03MQ--';
            } else if (urlprefix === 'https://volunteer.scholastic.com') {
                client_id = 'dj0yJmk9QXU3TXVhVmFpRmVTJmQ9WVdrOVJIRkZZVVpaTjJzbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hNg--';
            } else {
                newurlprefix = 'http://localhost:8080';
                client_id = 'dj0yJmk9cnNFRXlud3ZMYXNJJmQ9WVdrOVRWTXpRbWMyTlRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD01ZQ--';
            }
            console.log("new urlprefix " + newurlprefix);
            console.log("client_id " + client_id);
            var redirectUrl = newurlprefix + '/volunteer-manager/yahcontacts/authorize';
            console.log("redirectUrl " + redirectUrl);
            //var uri = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/contacts.readonly&access_type=offline&include_granted_scopes=true&state=' + nonce + '&redirect_uri=' + redirectUrl + '&response_type=code&client_id=' + client_id;
            var uri = 'https://api.login.yahoo.com/oauth2/request_auth?client_id=' + client_id + '&redirect_uri=' + redirectUrl + '&response_type=code&language=en-us' + '&state=' + nonce;
            var popup = $window.open(uri, '', "top=100,left=100,width=700,height=700");
            var popupChecker = $interval(function() {
                if (popup.closed) {
                    console.log("Yahoo Contacts Window Closed.");
                    $interval.cancel(popupChecker);
                    contactService.getGroomContacts($routeParams.orgId, $routeParams.eventId).then(
                        function(data) {
                            $scope.contactList = data.data.volunteers;
                            if (angular.isDefined(data.data.volunteers) && data.data.volunteers.length >= 1) {
                                $location.path('/contacts/groom/' + $routeParams.orgId + '/' + $routeParams.eventId);
                            } else {
                                var closed = $window.localStorage.getItem("manuallyClosed");
                                if (closed === 'no') {
                                    $scope.invalid = true;
                                    $window.localStorage.removeItem("manuallyClosed");
                                }
                            }
                        },
                        function(data) {
                            console.error('getting contacts failed.');
                        });
                }
            }, 100);
        };

        $scope.getGooglePlusContacts = function() {
            console.log("In getGooglePlusContacts Flow");
            console.log("In getGooglePlusContacts With " + $routeParams.orgId + '/' + $routeParams.eventId);
            var nonce = $routeParams.orgId + "-" + $routeParams.eventId + "-" + $window.sessionStorage.getItem('CrmId') + "-" + $window.sessionStorage.getItem('ContactType');
            console.log("old urlprefix " + urlprefix);
            var newurlprefix = urlprefix;
            var client_id = '';
            if ((urlprefix === 'http://dev.scholastic.com:8080') || (urlprefix === 'http://localhost:8080') || (urlprefix === 'http://127.0.0.1:8080')) {
                newurlprefix = 'http://localhost:8080';
                client_id = '933987067260-31t5ejefgetcitiq0du1g6c7u52lnrr8.apps.googleusercontent.com';
            } else if (urlprefix === 'https://vms-dev.scholastic.com') {
                client_id = '76242155749-6p9qdrl4i8vlsqhdvcfiohsk2rg8tqp4.apps.googleusercontent.com';
            } else if (urlprefix === 'https://vms-qa.scholastic.com') {
                client_id = '940775677633-78d2o52cf3aug68midk4u1nne2p8kril.apps.googleusercontent.com';
            } else if (urlprefix === 'https://volunteer.scholastic.com') {
                client_id = '539146463109-e594ptslm0ross04ebt7emonnenbfod6.apps.googleusercontent.com';
            } else {
                newurlprefix = 'http://localhost:8080';
                client_id = '933987067260-31t5ejefgetcitiq0du1g6c7u52lnrr8.apps.googleusercontent.com';
            }
            console.log("new urlprefix " + newurlprefix);
            console.log("client_id " + client_id);
            var redirectUrl = newurlprefix + '/volunteer-manager/googleplus/authorize';
            console.log("redirectUrl " + redirectUrl);
            var uri = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/contacts.readonly&access_type=offline&include_granted_scopes=true&state=' + nonce + '&redirect_uri=' + redirectUrl + '&response_type=code&client_id=' + client_id;
            var popup = $window.open(uri, '', "top=100,left=100,width=700,height=700");
            var popupChecker = $interval(function() {
                if (popup.closed) {
                    console.log("GooglePlus Contacts Window Closed.");
                    $interval.cancel(popupChecker);
                    contactService.getGroomContacts($routeParams.orgId, $routeParams.eventId).then(
                        function(data) {
                            $scope.contactList = data.data.volunteers;
                            if (angular.isDefined(data.data.volunteers) && data.data.volunteers.length >= 1) {
                                $location.path('/contacts/groom/' + $routeParams.orgId + '/' + $routeParams.eventId);
                            } else {
                                var closed = $window.localStorage.getItem("manuallyClosed");
                                if (closed === 'no') {
                                    $scope.invalid = true;
                                    $window.localStorage.removeItem("manuallyClosed");
                                }
                            }
                        },
                        function(data) {
                            console.error('getting contacts failed.');
                        });
                }
            }, 100);
        };

        $scope.goToContacts = function() {
            $location.path('/contacts/all/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        //
        // MAIN
        //

        var val = $window.sessionStorage.getItem('Empty_Import_Contacts');
        if (val === 'true') {
            $scope.invalid = true;
        }

        $window.sessionStorage.removeItem('Empty_Import_Contacts');

        //console.log("Using janrain service to import ");
        //janRainService.initJanRain('import');
    }]);

    app.controller('contactExportController', ['$scope', '$location', 'importService', '$routeParams', 'teamsite', function($scope, $location, importService, $routeParams, teamsite) {
        $scope.include = {
            top: teamsite + "/CON100_ExportContacts.html",
        };

        $scope.export = function() {
            importService.setItem('exporting');
            $location.path('/contacts/all/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.goToContacts = function() {
            $location.path('/contacts/all/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };
    }]);

})();
