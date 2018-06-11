var app = angular.module('editBasicInfo', []);
app.controller('editBasicInfoCtrl', ['$scope', '$routeParams', '$location', 'teamsite', '$timeout', '$window', '$http', 'urlprefix', '$filter', 'signupSheetService', function($scope, $routeParams, $location, teamsite, $timeout, $window, $http, urlprefix, $filter, signupSheetService) {
    /*Dummy data*/

    $scope.fair = $scope.$eval($window.sessionStorage.getItem('susData'));

    $scope.submitted = false;
    $scope.include = {
        VOL410_top: teamsite + '/VOL410_top.html'
    };

    $scope.openedStartDate = false;
    $scope.openedEndDate = false;
    $scope.PopupBg = false;
    /*Navigations*/
    $scope.gotoVolunteers = function() {
        $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    };
    $scope.stepBack = function() {
        var appendUrlStr = $scope.fair.previousSignUpId;
        if (appendUrlStr === -1) {
            appendUrlStr = appendUrlStr + '/new';
        }
        $location.path('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + appendUrlStr);
    };
    /*Style calender Pop up*/
    var styleCalPopUp = function($event) {
        $scope.PopupBg = true;
        // To remove extra space in the calender.
        $timeout(function() {
            angular.element(".uib-daypicker thead tr th")[1].setAttribute('colspan', '5');
        }, 0);
    };
    $scope.startDatePopup = function($event) {
        $scope.openedStartDate = true;
        styleCalPopUp($event);
    };
    $scope.endDatePopup = function($event) {
        $scope.openedEndDate = true;
        styleCalPopUp($event);
    };
    $scope.closeCalender = function() {
        $scope.PopupBg = false;
    };
    var col = ['fair.fairStartDate', 'fair.fairEndDate'];
    $scope.$watchGroup(col, function() {
        $scope.closeCalender();
    });
    /*Form Submission*/
    $scope.editFormSubmit = function() {
        $scope.submitted = true;
        if ($scope.basicInfo.$valid) {
            var editBasicInfoPayload = angular.copy($scope.fair);
            editBasicInfoPayload.startDate = $filter('date')($scope.fair.fairStartDate, 'MM/dd/yyyy');
            editBasicInfoPayload.endDate = $filter('date')($scope.fair.fairEndDate, 'MM/dd/yyyy');
            editBasicInfoPayload.signupSheetActivities = [];
            editBasicInfoPayload.fairId = $routeParams.eventId;
            editBasicInfoPayload.schoolId = $routeParams.orgId;
            if (angular.isDefined($scope.fair.signUpSheetId) && $scope.fair.signUpSheetId !== null &&
                $scope.fair.signUpSheetId !== '' && $scope.fair.signUpSheetId !== -1) {
                editBasicInfoPayload.signupSheetId = $scope.fair.signUpSheetId;
                $http.put(urlprefix + '/volunteer-manager/signupsheet/basic/update', editBasicInfoPayload).then(
                    function(data) {
                        console.log("updated successfully");
                        $scope.fair.signUpSheetId = data.data.signupSheetId;
                        $scope.fair.previousSignUpId = data.data.signupSheetId;
                        $scope.stepBack();
                    },
                    function(data) {
                        console.error('error!');
                    });
            } else {
                if (angular.isUndefined($scope.fair.signupSheetId) && $scope.fair.previousSignUpId !== '') {
                    editBasicInfoPayload.signupSheetActivities = signupSheetService.updateSchoolId($scope.fair.signupSheetActivities, $routeParams.orgId);
                }
                editBasicInfoPayload.signupSheetId = -1;
                $http.post(urlprefix + '/volunteer-manager/signupsheet/basic/create', editBasicInfoPayload).then(
                    function(data) {
                        console.log("saved successfully");
                        $scope.fair.signUpSheetId = data.data.signupSheetId;
                        $scope.fair.previousSignUpId = data.data.signupSheetId;
                        $scope.stepBack();
                    },
                    function(data) {
                        console.error('error!');
                    });
            }
        }
    };


}]);
