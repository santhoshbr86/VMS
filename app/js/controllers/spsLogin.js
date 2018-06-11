(function() {
    "use strict";
    var app = angular.module('spsLoginModule', []);
    app.controller('headerController', ['$scope', '$rootScope', '$location', '$window', '$routeParams', 'urlprefix', function($scope, $rootScope, $location, $window, $routeParams, urlprefix) {
        $scope.loggedIn = false;
        $scope.user = {};
        $rootScope.$on('userlogged', function(e, data) {
            if (data.spsUserReturn !== undefined) {
                $scope.user = data.spsUserReturn;
                $scope.loggedIn = true;
            } else {
                $scope.loggedIn = false;
            }
        });

        $scope.callMyAccount = function() {
            $window.open($window.MY_SCHOLASTIC_HOST + '/my-scholastic/profile/my-profile.html', '_blank');
        };

        $scope.signOut = function() {
            $window.localStorage.clear();
            $scope.user = {};
            $scope.loggedIn = false;
            var urlRegister = "/experience/login";
            if ($routeParams.sid !== undefined) {
                urlRegister = urlRegister + "/" + $routeParams.sid;
            }
            $window.maLogOut();
            $location.path(urlRegister);
        };

        //
        // MAIN
        //

        $("#cpt_header-holder").show();
        $("#cpt_footer-holder").show();
        // DJ for UI Calendar UI Performance optimization
        // applyWidthCounter shows how many elements the applyWidth directive has been applied to
        // there are 56 hour cells (8hrs*7days) on each current view  or up to 112 half hours
        $rootScope.applyWidthCounter = 0;
        // time calendar update to cells start and time calendar update to cells end.
        $rootScope.applyWidthStart = new Date();
        // showEveryFiveSeconds will, every 5 seconds, console out the difference between applyWidthStart and timeNow
        //$scope.showEveryFiveSeconds = setInterval(function() {
        //    var timeNow = new Date();
        //    console.log('5s interval', timeNow - $scope.applyWidthStart);
        //}, 5000);
        // showDuration will show the milliseconds between applyWidthStart and timeNow
        $rootScope.perfStartFlag = false;
        $rootScope.perfDuration = 0;
        $rootScope.resetDuration = function() {
            $rootScope.perfDuration = 0;
            $rootScope.perfStartFlag = false;
        };
        $rootScope.showDuration = function() {
            if (!$rootScope.perfStartFlag) { // startFlag is false
                $rootScope.applyWidthStart = new Date();
                $rootScope.perfStartFlag = true;
            } else {
                var timeNow = new Date();
                $rootScope.perfDuration = timeNow - $rootScope.applyWidthStart;
            }
        };
    }]);

    app.controller('spsController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$document', '$window', 'signupSheetService', 'janRainService', 'dumble', 'urlprefix', 'teamsite', function($scope, $rootScope, $http, $location, $routeParams, $document, $window, signupSheetService, janRainService, dumble, urlprefix, teamsite) {
        $scope.showWarning5xx = false;

        $scope.include = {
            bottom: teamsite + "/VolunteerExperienceSignin.html",
            top: teamsite + "/VOLSigninMessage.html",
            custCare: teamsite + "/Login_CustCare.html",
        };

        // Looks like a kids username means it has no '.' or '@'. See spsLogin.test.js for examples.
        $scope.looksLikeKidsUsername = function(email) {
            //console.log(email);
            //console.log(email + ' ' + (angular.isDefined(email) && email.indexOf('.') === -1 && email.indexOf('@') === -1));
            return email && angular.isDefined(email) && email.indexOf('.') === -1 && email.indexOf('@') === -1;
        };

        $scope.looksLikeBadEmail = function(error) {
            if (angular.isDefined(error)) {
                if (error.indexOf('The email information is wrong') > -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        $scope.looksLikeMissingEmail = function(error) {
            if (angular.isDefined(error)) {
                if (error.indexOf('The ID can\'t be found') > -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        $scope.login = function() {
            if ($scope.signup !== undefined) {
                var post_data = {
                    user: $scope.signup.email,
                    password: $scope.signup.password,
                    singleToken: false,
                    userForWS: false,
                    addCookie: true,
                    addExpiration: false
                };
            }
            var urlLogin = "/volunteer-manager/sps/login";
            var nextAction = '';
            if ($routeParams.sid !== undefined) {
                urlLogin = urlLogin + "/" + $routeParams.sid;
                nextAction = 'signup';
            } else {
                //urlLogin = urlLogin;
                nextAction = 'dashboard_no_params';
            }
            $scope.errorMessage = null;
            if ($scope.signup_form.$valid) {


                $http.post(urlprefix + urlLogin, post_data).then(
                    function(response) {
                        console.log('woo logged in!');

                        if (response.data.message === 'success') {
                            console.log('woo logged in !');
                            $window.sessionStorage.removeItem('kidlogged');
                            signupSheetService.setId(response.data.signUpSheetId);
                            signupSheetService.setSpsUserDetails(response.data.spsUserReturn);
                            if (nextAction === 'signup') {
                                $location.path('/experience/signup/' + response.data.requestParamList[0]);
                            } else {
                                $location.path('/experience/dashboard');
                            }
                        } else {
                            console.log('problem with login response. Expected success got !' + response.data.message);
                        }
                    },
                    function(response) {
                        // TODO: some modal/notice is needed.
                        if (response.data !== null && response.data !== undefined) {
                            $scope.errorMessage = response.data.message;
                        } else {
                            $scope.showWarning5xx = true;
                        }
                        console.error('oh no, not logged in!');
                    });
            }
        };

        $scope.cancelRegistration = function() {
            var urlRegister = "/experience/login";
            if ($routeParams.sid !== undefined) {
                urlRegister = urlRegister + "/" + $routeParams.sid;
            }
            $location.path(urlRegister);
        };

        $scope.register = function() {
            if ($scope.user.email !== $scope.user.confirmEmail) {
                console.error('entered emails do not match.');
                $scope.errorMessage = "Email and Confirm Email Don't Match";
                return;
            }
            if ($scope.user.password !== $scope.user.confirmpassword) {
                console.error('entered passwords do not match.');
                $scope.errorMessage = "Password and Confirm Passwords Don't Match";
                return;
            }
            $scope.submitted = true;
            $scope.errorMessage = null;
            if ($scope.registration.$valid) {
                var smaparam = "";
                if (!angular.isUndefined($scope.user.sma)) {
                    smaparam = "~" + $scope.user.sma;
                }
                console.log("smaparam " + smaparam);
                var time = (new Date()).toISOString(),
                    post_data = {
                        "status": "active",
                        "realm": "consumers",
                        "credentials": {
                            "userName": $scope.user.email,
                            "password": $scope.user.password
                        },
                        "basicProfile": {
                            "firstName": $scope.user.firstName,
                            "lastName": $scope.user.lastName,
                            "privacyPolicyAcceptedVer": "1.2",
                            "privacyPolicyAcceptedTime": time + smaparam,
                            "userConsentedLatestPrivPolicy": true,
                            "termsAcceptedVer": "1.2",
                            "termsAcceptedTime": time,
                            "userConsentedLatestTerms": true,
                            "poEnabled": true,
                            "email": $scope.user.email,
                            "appUserType": ["10", "20"],
                            "emailStmts": true
                        }
                    };
                console.log(post_data);
                var nextAction = '';
                var urlRegister = urlprefix + "/volunteer-manager/sps/new";
                if ($routeParams.sid !== undefined) {
                    urlRegister = urlRegister + "/" + $routeParams.sid;
                    nextAction = 'signup';
                } else {
                    //urlRegister = urlRegister;
                    nextAction = 'dashboard_no_params';
                }
                $http.post(urlRegister, post_data)
                    .then(
                        function(response) {
                            $window.sessionStorage.removeItem('kidlogged');
                            if (nextAction === 'signup') {
                                $location.path('/experience/register/signup/' + response.data.requestParamList[0]);
                            } else {
                                $location.path('/experience/dashboard');
                            }
                        },
                        function(response) {
                            // TODO: some modal/notice is needed.
                            if (response.data !== null && response.data !== undefined) {
                                $scope.errorMessage = response.data.message;
                            } else {
                                $scope.showWarning5xx = true;
                            }
                            //$scope.errorMessage = response.data.message;
                            console.error('oh no, no new account for you :(!');
                        });
            }
        };

        $scope.forgot = function() {
            $scope.submitted = true;
            $scope.error = "";
            $scope.shortemail = null;
            var urlNewPass = urlprefix + "/%23/experience/newpass";
            if ($routeParams.sid !== undefined) {
                urlNewPass = urlNewPass + "/" + $routeParams.sid;
            }
            var post_data = {
                "clientID": "VS",
                "emailID": $scope.email,
                "landingPage": urlNewPass
            };

            $http.post(urlprefix + "/volunteer-manager/sps/register/resetpass", post_data)
                .then(
                    function(response) {
                        console.log('woo logged in!');
                        var urlPassSuscess = "/experience/forgotsuccess";
                        $scope.shortemail = response.data.token;
                        if ($routeParams.sid !== undefined) {
                            urlPassSuscess = urlPassSuscess + "/" + $routeParams.sid + "/" + $scope.shortemail;
                        } else if ($scope.shortemail !== undefined) {
                            urlPassSuscess = urlPassSuscess + "/" + $scope.shortemail;
                        }
                        $location.path(urlPassSuscess);
                    },
                    function(response) {
                        console.error(response.data.message);
                        $scope.error = response.data.message;
                    });
            $scope.submitted = false;
        };

        $scope.newpass = function() {
            $scope.submitted = true;
            $scope.error = "";

            var newpasstxt = $document[0].getElementById("newpasstxt").value;
            var pwdConfirm = $document[0].getElementById("pwdConfirm").value;
            if (newpasstxt !== pwdConfirm) {
                $scope.error = "Password must match";
                return;
            }

            var post_data = {
                "clientID": "BKFLX",
                "token": $routeParams.token,
                "newPassword": $scope.newpasstxt
            };
            $http.post(urlprefix + "/volunteer-manager/sps/register/newpass", post_data).then(
                function(response) {
                    console.log($routeParams.token);
                    console.log(response.data.message);
                    console.log(post_data);
                    var urlBackToLogin = "/experience/login";
                    if ($routeParams.sid !== undefined) {
                        urlBackToLogin = urlBackToLogin + "/" + $routeParams.sid;
                    }
                    $location.path(urlBackToLogin);
                },
                function(response) {
                    console.error(response.data.message);
                    $scope.error = response.data.message;
                    console.log($routeParams.token);
                });
            $scope.submitted = false;
        };

        $scope.redirectToForgot = function() {
            /*var urlForgot = "/experience/forgot";
            if ($routeParams.sid !== undefined) {
                urlForgot = urlForgot + "/" + $routeParams.sid;
            }
            $location.path(urlForgot);*/
            $window.setViewType('fp');
            $window.setParentAppName('CPT');
            $window.setMyScholasticLaunchAsModal(true);
            $window.MA_show2();
        };

        $scope.redirectToLoginPage = function() {
            var urlForgotLogin = "/experience/login";
            if ($routeParams.sid !== undefined) {
                urlForgotLogin = urlForgotLogin + "/" + $routeParams.sid;
            }
            $location.path(urlForgotLogin);
        };

        $scope.redirectToRegister = function() {
            var url = "/experience/registration";
            if ($routeParams.sid !== undefined) {
                url = url + "/" + $routeParams.sid;
            }
            $location.path(url);
        };

        $scope.getFacebookJanRain = function() {
            $window.janrain.engage.signin.triggerFlow('facebook');
        };

        $scope.getTwitterJanRain = function() {
            $window.janrain.engage.signin.triggerFlow('twitter');
        };

        $scope.getLinkedInJanRain = function() {
            $window.janrain.engage.signin.triggerFlow('linkedin');
        };

        $scope.getGooglePlusJanRain = function() {
            $window.janrain.engage.signin.triggerFlow('googleplus');
        };

        //
        // MAIN
        //

        $("#cpt_header-holder").show();
        $("#cpt_footer-holder").show();
        if ($window.location.hash.indexOf('/experience/newpass') > -1) {
            dumble.setDumbleData('Volunteer:New Password Page', 'Forgot Password Portal', '', '', 0, '', '', '', '');
        } else if ($window.location.hash.indexOf('/experience/login') > -1) {
            dumble.setDumbleData('Volunteer:Login', 'Login Portal', '', '', 0, '', '', '', '');
        } else if ($window.location.hash.indexOf('/experience/forgot') > -1) {
            dumble.setDumbleData('Volunteer:Forgot Password', 'Forgot Password Portal', '', '', 0, '', '', '', '');
        } else if ($window.location.hash.indexOf('/experience/forgotsuccess') > -1) {
            dumble.setDumbleData('Volunteer:Forgot Password Success', 'Forgot Password Portal', '', '', 0, '', '', '', '');
        } else if ($window.location.hash.indexOf('/experience/registration') > -1 || $window.location.hash.indexOf('/experience/janrain/registration') > -1) {
            dumble.setDumbleData('Volunteer:Registration', 'Registration Portal', '', '', 0, '', '', '', '');
        } else {
            console.error('???');
        }

        if (!angular.isUndefined($routeParams.email)) {
            $scope.shortemail = $routeParams.email;
        }

        $scope.user = {};

        console.log("$routeParams.sid " + $routeParams.sid);
        console.log("janrain error message " + $routeParams.janrainerrormessage);
        console.log("$routeParams.janrainparams  " + $routeParams.janrainparams);

        if (!angular.isUndefined($routeParams.janrainerrormessage)) {
            console.log("janrain error message" + $routeParams.janrainerrormessage);
            $scope.showWarning5xx = true;
        }

        if (!angular.isUndefined($routeParams.janrainparams)) {
            var regisParams = $routeParams.janrainparams.split(":");
            console.log("regisParams length " + regisParams.length);
            var nameParams = regisParams[0].split(" ");
            console.log("nameParams length " + nameParams.length);
            $scope.user.firstName = nameParams[0];
            $scope.user.lastName = nameParams[1];
            $scope.user.email = regisParams[1];
            $scope.user.confirmEmail = regisParams[1];
            $scope.user.sma = regisParams[2] + "~" + regisParams[3];
            console.log("regis sma  " + $scope.user.sma);
        }

        console.log("Using janrain service to login ");
        janRainService.initJanRain('login');

    }]);
})();
