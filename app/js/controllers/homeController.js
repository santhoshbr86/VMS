(function() {
    "use strict";
    var app = angular.module('adminModule', []);
    app.controller('adminController', ['$scope', '$location', 'dumble', 'teamsite', function($scope, $location, dumble, teamsite) {
        $scope.include = {
            top: teamsite + "/VolunteerAdminHomepage.html",
        };

        $scope.goToRoles = function() {
            $location.path('/admin/roles');
        };

        $scope.goToMessages = function() {
            $location.path('/admin/message');
        };

        dumble.setDumbleData('Admin:Home Page', 'Landing Page', '', '', 1, '', '', '', '');
    }]);

    app.controller('adminRoleController', ['$scope', '$http', '$window', '$location', '$timeout', '$document', 'dumble', 'urlprefix', 'teamsite', function($scope, $http, $window, $location, $timeout, $document, dumble, urlprefix, teamsite) {
        $scope.task = {};
        $scope.task1 = {};
        $scope.task2 = {};
        $scope.task3 = {};
        $scope.task4 = {};
        $scope.task5 = {};
        $scope.task6 = {};
        $scope.ind = 0;
        $scope.edited = false;
        $scope.submitted = false;
        $scope.showInactive = false;
        $scope.disablePublishLater = false;
        $scope.disablePublishNow = false;
        $scope.showInactive1 = false;
        $scope.disablePublishLater1 = false;
        $scope.disablePublishNow1 = false;
        $scope.showInactive2 = false;
        $scope.disablePublishLater2 = false;
        $scope.disablePublishNow2 = false;
        $scope.showInactive3 = false;
        $scope.disablePublishLater3 = false;
        $scope.disablePublishNow3 = false;
        $scope.showInactive4 = false;
        $scope.disablePublishLater4 = false;
        $scope.disablePublishNow4 = false;
        $scope.showInactive5 = false;
        $scope.disablePublishLater5 = false;
        $scope.disablePublishNow5 = false;
        $scope.showInactive6 = false;
        $scope.disablePublishLater6 = false;
        $scope.disablePublishNow6 = false;
        $scope.buttonSel = false;
        $scope.buttonSel1 = false;
        $scope.buttonSel2 = false;
        $scope.buttonSel3 = false;
        $scope.buttonSel4 = false;
        $scope.buttonSel5 = false;
        $scope.buttonSel6 = false;
        $scope.whyFile = null;
        $scope.howFile = null;
        $scope.roles = [];
        $scope.assetsURL = "/volunteer-manager/admin/assets/how";
        $scope.include = {
            top: teamsite + "/VolunteerAdminRoles.html",
        };

        //$scope.fairTypes = ["Preschool", "Elementary", "Middle", "BOGO", "Tabletop"];
        $scope.fairTypes = [];
        $scope.goToHome = function() {
            $location.path('/admin/home');
        };

        $scope.initRoles = function(action) {
            console.log("In only  Init Roles");
            $http.get(urlprefix + '/volunteer-manager/admin/roles').then(function(data) {
                $scope.roles = data.data.rolesStatus;
                $scope.fairTypes = data.data.adminFairTypes;
                console.log("After getting roles again %o", $scope.roles);
            });
        };

        $scope.addRole = function(action, typeForm) {
            // $scope.resetFileName();
            // $scope.resetFileName1();
            $scope.formdata = new FormData();

            // if ($scope.whyFile !== null && $scope.howFile !== null) {
            //     $scope.assetsURL = "/volunteer-manager/admin/assets";
            //     $scope.formdata.append('howFile', $scope.howFile);
            //     $scope.formdata.append('whyFile', $scope.whyFile);
            //     console.log("url=" + $scope.assetsURL);
            // }

            // if ($scope.whyFile !== null && $scope.howFile === null) {
            //     $scope.assetsURL = "/volunteer-manager/admin/assets/why";
            //     $scope.formdata.append('whyFile', $scope.whyFile);
            //     console.log("url=" + $scope.assetsURL);
            // }

            // if ($scope.whyFile === null && $scope.howFile !== null) {
            //     $scope.assetsURL = "/volunteer-manager/admin/assets/how";
            //     $scope.formdata.append('howFile', $scope.howFile);
            //     console.log("url=" + $scope.assetsURL);
            // }
            if (typeForm === 'Form') {
                if (!$scope.rolesTask.$valid) {
                    $scope.submitted = true;
                } else {
                    $scope.submitted = false;
                }
            } else if (typeForm === 'Form1') {
                if (!$scope.rolesTask1.$valid) {
                    $scope.submitted1 = true;
                } else {
                    $scope.submitted1 = false;
                }
            } else if (typeForm === 'Form2') {
                if (!$scope.rolesTask2.$valid) {
                    $scope.submitted2 = true;
                } else {
                    $scope.submitted2 = false;
                }
            } else if (typeForm === 'Form3') {
                if (!$scope.rolesTask3.$valid) {
                    $scope.submitted3 = true;
                } else {
                    $scope.submitted3 = false;
                }
            } else if (typeForm === 'Form4') {
                if (!$scope.rolesTask4.$valid) {
                    $scope.submitted4 = true;
                } else {
                    $scope.submitted4 = false;
                }
            } else if (typeForm === 'Form5') {
                if (!$scope.rolesTask5.$valid) {
                    $scope.submitted5 = true;
                } else {
                    $scope.submitted5 = false;
                }
            } else if (typeForm === 'Form6') {
                if (!$scope.rolesTask6.$valid) {
                    $scope.submitted6 = true;
                } else {
                    $scope.submitted6 = false;
                }
            }

            if (typeForm === 'Form' && $scope.rolesTask.$valid) {
                if (jQuery.isEmptyObject($scope.editedRole)) {
                    $scope.edited = false;
                } else {
                    $scope.edited = true;
                }
            } else if (typeForm === 'Form1' && $scope.rolesTask1.$valid) {
                if (jQuery.isEmptyObject($scope.editedRole1)) {
                    $scope.edited = false;
                } else {
                    $scope.edited = true;
                }
            } else if (typeForm === 'Form2' && $scope.rolesTask2.$valid) {
                if (jQuery.isEmptyObject($scope.editedRole2)) {
                    $scope.edited = false;
                } else {
                    $scope.edited = true;
                }
            } else if (typeForm === 'Form3' && $scope.rolesTask3.$valid) {
                if (jQuery.isEmptyObject($scope.editedRole3)) {
                    $scope.edited = false;
                } else {
                    $scope.edited = true;
                }
            } else if (typeForm === 'Form4' && $scope.rolesTask4.$valid) {
                if (jQuery.isEmptyObject($scope.editedRole4)) {
                    $scope.edited = false;
                } else {
                    $scope.edited = true;
                }
            } else if (typeForm === 'Form5' && $scope.rolesTask5.$valid) {
                if (jQuery.isEmptyObject($scope.editedRole5)) {
                    $scope.edited = false;
                } else {
                    $scope.edited = true;
                }
            } else if (typeForm === 'Form6' && $scope.rolesTask6.$valid) {
                if (jQuery.isEmptyObject($scope.editedRole6)) {
                    $scope.edited = false;
                } else {
                    $scope.edited = true;
                }
            }

            if (($scope.rolesTask.$valid && $scope.submitted === false) ||
                ($scope.rolesTask1.$valid && $scope.submitted1 === false) ||
                ($scope.rolesTask2.$valid && $scope.submitted2 === false) ||
                ($scope.rolesTask3.$valid && $scope.submitted3 === false) ||
                ($scope.rolesTask4.$valid && $scope.submitted4 === false) ||
                ($scope.rolesTask5.$valid && $scope.submitted5 === false) ||
                ($scope.rolesTask6.$valid && $scope.submitted6 === false)) {
                if ($scope.edited) {
                    console.log("In Edited New Role %o", $scope.editedRole);

                    var editRol;
                    if (typeForm === 'Form') {
                        editRol = angular.copy($scope.editedRole);
                    } else if (typeForm === 'Form1') {
                        editRol = angular.copy($scope.editedRole1);
                    } else if (typeForm === 'Form2') {
                        editRol = angular.copy($scope.editedRole2);
                    } else if (typeForm === 'Form3') {
                        editRol = angular.copy($scope.editedRole3);
                    } else if (typeForm === 'Form4') {
                        editRol = angular.copy($scope.editedRole4);
                    } else if (typeForm === 'Form5') {
                        editRol = angular.copy($scope.editedRole5);
                    } else if (typeForm === 'Form6') {
                        editRol = angular.copy($scope.editedRole6);
                    }


                    //     if ($scope.editedRole.assetsStatus[0].type === 'WHYFILE') {
                    //         $scope.editedRole.whyId = $scope.editedRole.assetsStatus[0].assetId;
                    //         $scope.editedRole.whyFileName = $scope.editedRole.assetsStatus[0].fileName;
                    //         console.log("whyFile 0 " + $scope.editedRole.whyId + " " + $scope.editedRole.assetsStatus[0].type + " " + $scope.editedRole.assetsStatus[0].fileName);
                    //     } else {
                    //         console.log("howFile 0 " + $scope.editedRole.assetsStatus[0].type + " " + $scope.editedRole.assetsStatus[0].fileName);
                    //         $scope.editedRole.howId = $scope.editedRole.assetsStatus[0].assetId;
                    //         $scope.editedRole.howFileName = $scope.editedRole.assetsStatus[0].fileName;
                    //         console.log("howFile 0 " + $scope.editedRole.howId + " " + $scope.editedRole.assetsStatus[0].type + " " + $scope.editedRole.assetsStatus[0].fileName);
                    //     }
                    // }

                    /* if (typeof $scope.editedRole.assetsStatus[1] === 'undefined' || $scope.editedRole.assetsStatus[1] === null) {
                         //$scope.task.howFileName = '';
                         console.log("No Assets 1");
                     }*/
                    // else {
                    //     if ($scope.editedRole.assetsStatus[1].type === 'HOWFILE') {
                    //         console.log("howfile 1 " + $scope.editedRole.assetsStatus[1].type + " " + $scope.editedRole.assetsStatus[1].fileName);
                    //         $scope.editedRole.howId = $scope.editedRole.assetsStatus[1].assetId;
                    //         $scope.editedRole.howFileName = $scope.editedRole.assetsStatus[1].fileName;
                    //         console.log("howfile 1 " + $scope.editedRole.howId + " " + $scope.editedRole.howFileName);
                    //     } else {
                    //         console.log("whyfile 1 " + $scope.editedRole.assetsStatus[1].type + " " + $scope.editedRole.assetsStatus[1].fileName);
                    //         $scope.editedRole.whyId = $scope.editedRole.assetsStatus[1].assetId;
                    //         $scope.editedRole.whyFileName = $scope.editedRole.assetsStatus[1].fileName;
                    //         console.log("whyfile 1 " + $scope.editedRole.whyId + " " + $scope.editedRole.whyFileName);
                    //     }
                    // }

                    $scope.edited = false;
                    var payloadEdit = getPayload(action, typeForm);
                    editRol.title = payloadEdit.title;
                    editRol.description = payloadEdit.description;
                    editRol.action = action;
                    editRol.status = action;
                    editRol.activeFlag = payloadEdit.activeFlag;
                    if (typeof editRol.assetsStatus[0] === 'undefined' || editRol.assetsStatus[0] === null) {
                        console.log("No Assets 0");
                        if (!angular.isUndefined(payloadEdit.fileData) &&
                            payloadEdit.fileData !== null && payloadEdit.fileData !== '') {
                            editRol.howFileName = payloadEdit.title;
                            editRol.fileData = payloadEdit.fileData;
                        }
                    } else {
                        editRol.howId = editRol.assetsStatus[0].assetId;
                        editRol.howFileName = payloadEdit.title;
                        editRol.fileData = payloadEdit.fileData;
                    }
                    console.log("editRol  " + editRol);
                    // if ($scope.whyFile !== null) {
                    //     $scope.editedRole.whyFileName = $scope.whyFile.name;
                    // }
                    $http.put(urlprefix + '/volunteer-manager/admin/roles', editRol).then(
                        function(data) {
                            console.log(data);
                            $scope.statusMessage = data.data.statusMessage;
                            // $scope.roles.splice($scope.ind, 1);
                            // $scope.roles.splice($scope.ind, 0, data.data.rolesStatus[0]);
                            console.log("Trying to get New Roles Again- Not Edited Mode !!!");

                            $http.get(urlprefix + '/volunteer-manager/admin/roles').then(function(data) {
                                $scope.roles = data.data.rolesStatus;
                                $scope.fairTypes = data.data.adminFairTypes;
                                console.log("After getting roles again %o", $scope.roles);
                            });
                            $scope.statusBox = true;
                            $timeout(function() {
                                $scope.statusMessage = "";
                                $scope.statusBox = false;
                            }, 3000);
                        },
                        function(data, status) {
                            console.error(data);
                            if (angular.isUndefined(data.data.statusMessage)) {

                                if (data.data.errors[0].message === "UNABLE TO UPDATE ROLES/ASSETS") {
                                    $scope.statusMessage = "Unable to update Roles/Assets for " + editRol.title +
                                        " and Fair Type " + editRol.fairType;
                                } else {
                                    $scope.statusMessage = data.data.errors[0].message;
                                }

                            } else {

                                if (data.data.statusMessage === "UNABLE TO UPDATE ROLES/ASSETS") {
                                    $scope.statusMessage = "Unable to update Roles/Assets for " + editRol.title +
                                        " and Fair Type " + editRol.fairType;
                                } else {
                                    $scope.statusMessage = data.data.statusMessage;
                                }

                            }

                            $window.scrollTo(0, 0);
                            $scope.statusBoxerror = true;
                            $timeout(function() {
                                $scope.statusMessage = " ";
                                $scope.statusBoxerror = false;
                            }, 3000);
                        });

                } else {
                    console.log("In Not Edited New Role ");
                    var payload = getPayload(action, typeForm);
                    if (typeForm === 'Form' && angular.equals($scope.buttonSel, false)) {
                        payload.activeFlag = true;
                    } else if (typeForm === 'Form1' && angular.equals($scope.buttonSel1, false)) {
                        payload.activeFlag = true;
                    } else if (typeForm === 'Form2' && angular.equals($scope.buttonSel2, false)) {
                        payload.activeFlag = true;
                    } else if (typeForm === 'Form3' && angular.equals($scope.buttonSel3, false)) {
                        payload.activeFlag = true;
                    } else if (typeForm === 'Form4' && angular.equals($scope.buttonSel4, false)) {
                        payload.activeFlag = true;
                    } else if (typeForm === 'Form5' && angular.equals($scope.buttonSel5, false)) {
                        payload.activeFlag = true;
                    } else if (typeForm === 'Form6' && angular.equals($scope.buttonSel6, false)) {
                        payload.activeFlag = true;
                    } else {
                        console.log("form param is not matching");
                    }
                    console.log("In Not Edited New Role payload " + payload);
                    // if ($scope.whyFile !== null) {
                    //     $scope.task.whyFileName = $scope.whyFile.name;
                    // }
                    if (!angular.isUndefined(payload.fileData) &&
                        payload.fileData !== null && payload.fileData !== '') {
                        payload.howFileName = payload.title;
                    }

                    $http.post(urlprefix + '/volunteer-manager/admin/roles', payload).then(
                        function(data) {
                            //$scope.roles.push(data.data.rolesStatus[0]);
                            console.log("Trying to get New Roles Again- Not Edited Mode !!!");

                            $http.get(urlprefix + '/volunteer-manager/admin/roles').then(function(data) {
                                $scope.roles = data.data.rolesStatus;
                                $scope.fairTypes = data.data.adminFairTypes;
                                console.log("After getting roles again %o", $scope.roles);
                            });
                            $scope.statusMessage = data.data.statusMessage;
                            $scope.statusBox = true;
                            $timeout(function() {
                                $scope.statusMessage = "";
                                $scope.statusBox = false;
                            }, 3000);
                        },
                        function(data) {
                            $scope.statusMessage = data.data.message;
                            $scope.statusBoxerror = true;
                            $timeout(function() {
                                $scope.statusMessage = "";
                                $scope.statusBoxerror = false;
                            }, 3000);
                        });
                }

                if (typeForm === 'Form') {
                    $scope.task = {
                        title: '',
                        description: '',
                        fileData: ''
                    };
                    $scope.edited = false;
                    $scope.editedRole = {};
                    $scope.submitted = false;
                    $scope.showInactive = false;
                    $scope.buttonSel = false;
                } else if (typeForm === 'Form1') {
                    $scope.task1 = {
                        title: '',
                        description: '',
                        fileData: ''
                    };
                    $scope.edited = false;
                    $scope.editedRole1 = {};
                    $scope.submitted1 = false;
                    $scope.showInactive1 = false;
                    $scope.buttonSel1 = false;
                } else if (typeForm === 'Form2') {
                    $scope.task2 = {
                        title: '',
                        description: '',
                        fileData: ''
                    };
                    $scope.edited = false;
                    $scope.editedRole2 = {};
                    $scope.submitted2 = false;
                    $scope.showInactive2 = false;
                    $scope.buttonSel2 = false;
                } else if (typeForm === 'Form3') {
                    $scope.task3 = {
                        title: '',
                        description: '',
                        fileData: ''
                    };
                    $scope.edited = false;
                    $scope.editedRole3 = {};
                    $scope.submitted3 = false;
                    $scope.showInactive3 = false;
                    $scope.buttonSel3 = false;
                } else if (typeForm === 'Form4') {
                    $scope.task4 = {
                        title: '',
                        description: '',
                        fileData: ''
                    };
                    $scope.edited = false;
                    $scope.editedRole4 = {};
                    $scope.submitted4 = false;
                    $scope.showInactive4 = false;
                    $scope.buttonSel4 = false;
                } else if (typeForm === 'Form5') {
                    $scope.task5 = {
                        title: '',
                        description: '',
                        fileData: ''
                    };
                    $scope.edited = false;
                    $scope.editedRole5 = {};
                    $scope.submitted5 = false;
                    $scope.showInactive5 = false;
                    $scope.buttonSel5 = false;
                } else if (typeForm === 'Form6') {
                    $scope.task6 = {
                        title: '',
                        description: '',
                        fileData: ''
                    };
                    $scope.edited = false;
                    $scope.editedRole6 = {};
                    $scope.submitted6 = false;
                    $scope.showInactive6 = false;
                    $scope.buttonSel6 = false;
                }
                $scope.changeStatus(typeForm);
                // $scope.whyFile = null;
                // $scope.howFile = null;
            }

        };

        function getPayload(action, typeForm) {
            if (typeForm === 'Form' && $scope.rolesTask.$valid) {
                $scope.task.action = action;
                $scope.task.fairType = $scope.fairTypes[0];
                $scope.task.activeFlag = $scope.showInactive;
                return $scope.task;
            } else if (typeForm === 'Form1' && $scope.rolesTask1.$valid) {
                $scope.task1.action = action;
                $scope.task1.fairType = $scope.fairTypes[1];
                $scope.task1.activeFlag = $scope.showInactive1;
                return $scope.task1;
            } else if (typeForm === 'Form2' && $scope.rolesTask2.$valid) {
                $scope.task2.action = action;
                $scope.task2.fairType = $scope.fairTypes[2];
                $scope.task2.activeFlag = $scope.showInactive2;
                return $scope.task2;
            } else if (typeForm === 'Form3' && $scope.rolesTask3.$valid) {
                $scope.task3.action = action;
                $scope.task3.fairType = $scope.fairTypes[3];
                $scope.task3.activeFlag = $scope.showInactive3;
                return $scope.task3;
            } else if (typeForm === 'Form4' && $scope.rolesTask4.$valid) {
                $scope.task4.action = action;
                $scope.task4.fairType = $scope.fairTypes[4];
                $scope.task4.activeFlag = $scope.showInactive4;
                return $scope.task4;
            } else if (typeForm === 'Form5' && $scope.rolesTask5.$valid) {
                $scope.task5.action = action;
                $scope.task5.fairType = $scope.fairTypes[5];
                $scope.task5.activeFlag = $scope.showInactive5;
                return $scope.task5;
            } else {
                $scope.task6.action = action;
                $scope.task6.fairType = $scope.fairTypes[6];
                $scope.task6.activeFlag = $scope.showInactive6;
                return $scope.task6;
            }
        }

        $scope.editRole = function(role, index) {
            /* $scope.resetFileName();
             $scope.resetFileName1();*/
            $scope.disabledSave = false;
            $scope.disabledSave1 = false;
            $scope.disabledSave2 = false;
            $scope.disabledSave3 = false;
            $scope.disabledSave4 = false;
            $scope.disabledSave5 = false;
            $scope.disabledSave6 = false;
            $scope.editedRole = {};
            $scope.editedRole1 = {};
            $scope.editedRole2 = {};
            $scope.editedRole3 = {};
            $scope.editedRole4 = {};
            $scope.editedRole5 = {};
            $scope.editedRole6 = {};
            $scope.disablePublishNow = false;
            $scope.disablePublishLater = false;
            $scope.disablePublishNow1 = false;
            $scope.disablePublishLater1 = false;
            $scope.disablePublishNow2 = false;
            $scope.disablePublishLater2 = false;
            $scope.disablePublishNow3 = false;
            $scope.disablePublishLater3 = false;
            $scope.disablePublishNow4 = false;
            $scope.disablePublishLater4 = false;
            $scope.disablePublishNow5 = false;
            $scope.disablePublishLater5 = false;
            $scope.disablePublishNow6 = false;
            $scope.disablePublishLater6 = false;


            $scope.ind = index;

            if (role.fairType === $scope.fairTypes[0]) {
                $scope.task.title = angular.copy(role.title);
                $scope.task.description = angular.copy(role.description);
                if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                    $scope.task.fileData = '';
                    console.log("No Assets 0");
                } else {
                    $scope.task.fileData = role.assetsStatus[0].fileData;
                }
                $scope.editedRole = role;
                if (angular.equals(role.activeFlag, true)) {
                    $scope.showInactive = true;
                } else {
                    $scope.showInactive = false;
                }
                switch ($scope.editedRole.status) {
                    case 'SAVE':
                        $scope.disabledSave = true;
                        break;
                    case 'PUBLISH_LATER':
                        $scope.disablePublishLater = true;
                        break;
                    case 'PUBLISH_NOW':
                        $scope.disablePublishNow = true;
                        $scope.disablePublishLater = true;
                        break;
                    default:
                        console.error('bad status');
                        break;
                }
            } else {
                $scope.task = {};
            }
            if (role.fairType === $scope.fairTypes[1]) {
                $scope.task1.title = angular.copy(role.title);
                $scope.task1.description = angular.copy(role.description);
                if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                    $scope.task1.fileData = '';
                    console.log("No Assets 0");
                } else {
                    $scope.task1.fileData = role.assetsStatus[0].fileData;
                }
                $scope.editedRole1 = role;
                if (angular.equals(role.activeFlag, true)) {
                    $scope.showInactive1 = true;
                } else {
                    $scope.showInactive1 = false;
                }
                switch ($scope.editedRole1.status) {
                    case 'SAVE':
                        $scope.disabledSave1 = true;
                        break;
                    case 'PUBLISH_LATER':
                        $scope.disablePublishLater1 = true;
                        break;
                    case 'PUBLISH_NOW':
                        $scope.disablePublishNow1 = true;
                        $scope.disablePublishLater1 = true;
                        break;
                    default:
                        console.error('bad status');
                        break;
                }
            } else {
                $scope.task1 = {};
            }
            if (role.fairType === $scope.fairTypes[2]) {
                $scope.task2.title = angular.copy(role.title);
                $scope.task2.description = angular.copy(role.description);
                if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                    $scope.task2.fileData = '';
                    console.log("No Assets 0");
                } else {
                    $scope.task2.fileData = role.assetsStatus[0].fileData;
                }
                $scope.editedRole2 = role;
                if (angular.equals(role.activeFlag, true)) {
                    $scope.showInactive2 = true;
                } else {
                    $scope.showInactive2 = false;
                }
                switch ($scope.editedRole2.status) {
                    case 'SAVE':
                        $scope.disabledSave2 = true;
                        break;
                    case 'PUBLISH_LATER':
                        $scope.disablePublishLater2 = true;
                        break;
                    case 'PUBLISH_NOW':
                        $scope.disablePublishNow2 = true;
                        $scope.disablePublishLater2 = true;
                        break;
                    default:
                        console.error('bad status');
                        break;
                }
            } else {
                $scope.task2 = {};
            }
            if (role.fairType === $scope.fairTypes[3]) {
                $scope.task3.title = angular.copy(role.title);
                $scope.task3.description = angular.copy(role.description);
                if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                    $scope.task3.fileData = '';
                    console.log("No Assets 0");
                } else {
                    $scope.task3.fileData = role.assetsStatus[0].fileData;
                }
                $scope.editedRole3 = role;
                if (angular.equals(role.activeFlag, true)) {
                    $scope.showInactive3 = true;
                } else {
                    $scope.showInactive3 = false;
                }
                switch ($scope.editedRole3.status) {
                    case 'SAVE':
                        $scope.disabledSave3 = true;
                        break;
                    case 'PUBLISH_LATER':
                        $scope.disablePublishLater3 = true;
                        break;
                    case 'PUBLISH_NOW':
                        $scope.disablePublishNow3 = true;
                        $scope.disablePublishLater3 = true;
                        break;
                    default:
                        console.error('bad status');
                        break;
                }
            } else {
                $scope.task3 = {};
            }
            if (role.fairType === $scope.fairTypes[4]) {
                $scope.task4.title = angular.copy(role.title);
                $scope.task4.description = angular.copy(role.description);
                if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                    $scope.task4.fileData = '';
                    console.log("No Assets 0");
                } else {
                    $scope.task4.fileData = role.assetsStatus[0].fileData;
                }
                $scope.editedRole4 = role;
                if (angular.equals(role.activeFlag, true)) {
                    $scope.showInactive4 = true;
                } else {
                    $scope.showInactive4 = false;
                }
                switch ($scope.editedRole4.status) {
                    case 'SAVE':
                        $scope.disabledSave4 = true;
                        break;
                    case 'PUBLISH_LATER':
                        $scope.disablePublishLater4 = true;
                        break;
                    case 'PUBLISH_NOW':
                        $scope.disablePublishNow4 = true;
                        $scope.disablePublishLater4 = true;
                        break;
                    default:
                        console.error('bad status');
                        break;
                }
            } else {
                $scope.task4 = {};
            }
            if (role.fairType === $scope.fairTypes[5]) {
                $scope.task5.title = angular.copy(role.title);
                $scope.task5.description = angular.copy(role.description);
                if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                    $scope.task5.fileData = '';
                    console.log("No Assets 0");
                } else {
                    $scope.task5.fileData = role.assetsStatus[0].fileData;
                }
                $scope.editedRole5 = role;
                if (angular.equals(role.activeFlag, true)) {
                    $scope.showInactive5 = true;
                } else {
                    $scope.showInactive5 = false;
                }
                switch ($scope.editedRole5.status) {
                    case 'SAVE':
                        $scope.disabledSave5 = true;
                        break;
                    case 'PUBLISH_LATER':
                        $scope.disablePublishLater5 = true;
                        break;
                    case 'PUBLISH_NOW':
                        $scope.disablePublishNow5 = true;
                        $scope.disablePublishLater5 = true;
                        break;
                    default:
                        console.error('bad status');
                        break;
                }
            } else {
                $scope.task5 = {};
            }
            if (role.fairType === $scope.fairTypes[6]) {
                $scope.task6.title = angular.copy(role.title);
                $scope.task6.description = angular.copy(role.description);
                if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                    $scope.task6.fileData = '';
                    console.log("No Assets 0");
                } else {
                    $scope.task6.fileData = role.assetsStatus[0].fileData;
                }
                $scope.editedRole6 = role;
                if (angular.equals(role.activeFlag, true)) {
                    $scope.showInactive6 = true;
                } else {
                    $scope.showInactive6 = false;
                }
                switch ($scope.editedRole6.status) {
                    case 'SAVE':
                        $scope.disabledSave6 = true;
                        break;
                    case 'PUBLISH_LATER':
                        $scope.disablePublishLater6 = true;
                        break;
                    case 'PUBLISH_NOW':
                        $scope.disablePublishNow6 = true;
                        $scope.disablePublishLater6 = true;
                        break;
                    default:
                        console.error('bad status');
                        break;
                }
            } else {
                $scope.task6 = {};
            }
            if (role.roleMessageList !== null) {
                for (var i = 0; i < role.roleMessageList.length; i++) {
                    if (role.roleMessageList[i].fairType === $scope.fairTypes[0]) {
                        $scope.task.title = angular.copy(role.roleMessageList[i].title);
                        $scope.task.description = angular.copy(role.roleMessageList[i].description);
                        var roleAsset = role.roleMessageList[i];
                        if (typeof roleAsset.assetsStatus[0] === 'undefined' || roleAsset.assetsStatus[0] === null) {
                            $scope.task.fileData = '';
                            console.log("No Assets 0");
                        } else {
                            $scope.task.fileData = roleAsset.assetsStatus[0].fileData;
                        }
                        $scope.editedRole = role.roleMessageList[i];
                        if (angular.equals($scope.editedRole.activeFlag, true)) {
                            $scope.showInactive = true;
                        } else {
                            $scope.showInactive = false;
                        }
                        switch ($scope.editedRole.status) {
                            case 'SAVE':
                                $scope.disabledSave = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow = true;
                                $scope.disablePublishLater = true;
                                break;
                            default:
                                console.error('bad status');
                                break;
                        }
                    }
                    if (role.roleMessageList[i].fairType === $scope.fairTypes[1]) {
                        $scope.task1.title = angular.copy(role.roleMessageList[i].title);
                        $scope.task1.description = angular.copy(role.roleMessageList[i].description);
                        var roleAsset1 = role.roleMessageList[i];
                        if (typeof roleAsset1.assetsStatus[0] === 'undefined' || roleAsset1.assetsStatus[0] === null) {
                            $scope.task1.fileData = '';
                            console.log("No Assets 0");
                        } else {
                            $scope.task1.fileData = roleAsset1.assetsStatus[0].fileData;
                        }
                        $scope.editedRole1 = role.roleMessageList[i];
                        if (angular.equals($scope.editedRole1.activeFlag, true)) {
                            $scope.showInactive1 = true;
                        } else {
                            $scope.showInactive1 = false;
                        }
                        switch ($scope.editedRole1.status) {
                            case 'SAVE':
                                $scope.disabledSave1 = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater1 = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow1 = true;
                                $scope.disablePublishLater1 = true;
                                break;
                            default:
                                console.error('bad status');
                                break;
                        }
                    }
                    if (role.roleMessageList[i].fairType === $scope.fairTypes[2]) {
                        $scope.task2.title = angular.copy(role.roleMessageList[i].title);
                        $scope.task2.description = angular.copy(role.roleMessageList[i].description);
                        var roleAsset2 = role.roleMessageList[i];
                        if (typeof roleAsset2.assetsStatus[0] === 'undefined' || roleAsset2.assetsStatus[0] === null) {
                            $scope.task2.fileData = '';
                            console.log("No Assets 0");
                        } else {
                            $scope.task2.fileData = roleAsset2.assetsStatus[0].fileData;
                        }
                        $scope.editedRole2 = role.roleMessageList[i];
                        if (angular.equals($scope.editedRole2.activeFlag, true)) {
                            $scope.showInactive2 = true;
                        } else {
                            $scope.showInactive2 = false;
                        }
                        switch ($scope.editedRole2.status) {
                            case 'SAVE':
                                $scope.disabledSave2 = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater2 = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow2 = true;
                                $scope.disablePublishLater2 = true;
                                break;
                            default:
                                console.error('bad status');
                                break;
                        }
                    }
                    if (role.roleMessageList[i].fairType === $scope.fairTypes[3]) {
                        $scope.task3.title = angular.copy(role.roleMessageList[i].title);
                        $scope.task3.description = angular.copy(role.roleMessageList[i].description);
                        var roleAsset3 = role.roleMessageList[i];
                        if (typeof roleAsset3.assetsStatus[0] === 'undefined' || roleAsset3.assetsStatus[0] === null) {
                            $scope.task3.fileData = '';
                            console.log("No Assets 0");
                        } else {
                            $scope.task3.fileData = roleAsset3.assetsStatus[0].fileData;
                        }
                        $scope.editedRole3 = role.roleMessageList[i];
                        if (angular.equals($scope.editedRole3.activeFlag, true)) {
                            $scope.showInactive3 = true;
                        } else {
                            $scope.showInactive3 = false;
                        }
                        switch ($scope.editedRole3.status) {
                            case 'SAVE':
                                $scope.disabledSave3 = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater3 = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow3 = true;
                                $scope.disablePublishLater3 = true;
                                break;
                            default:
                                console.error('bad status');
                                break;
                        }
                    }
                    if (role.roleMessageList[i].fairType === $scope.fairTypes[4]) {
                        $scope.task4.title = angular.copy(role.roleMessageList[i].title);
                        $scope.task4.description = angular.copy(role.roleMessageList[i].description);
                        var roleAsset4 = role.roleMessageList[i];
                        if (typeof roleAsset4.assetsStatus[0] === 'undefined' || roleAsset4.assetsStatus[0] === null) {
                            $scope.task4.fileData = '';
                            console.log("No Assets 0");
                        } else {
                            $scope.task4.fileData = roleAsset4.assetsStatus[0].fileData;
                        }
                        $scope.editedRole4 = role.roleMessageList[i];
                        if (angular.equals($scope.editedRole4.activeFlag, true)) {
                            $scope.showInactive4 = true;
                        } else {
                            $scope.showInactive4 = false;
                        }
                        switch ($scope.editedRole4.status) {
                            case 'SAVE':
                                $scope.disabledSave4 = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater4 = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow4 = true;
                                $scope.disablePublishLater4 = true;
                                break;
                            default:
                                console.error('bad status');
                                break;
                        }
                    }
                    if (role.roleMessageList[i].fairType === $scope.fairTypes[5]) {
                        $scope.task5.title = angular.copy(role.roleMessageList[i].title);
                        $scope.task5.description = angular.copy(role.roleMessageList[i].description);
                        var roleAsset5 = role.roleMessageList[i];
                        if (typeof roleAsset5.assetsStatus[0] === 'undefined' || roleAsset5.assetsStatus[0] === null) {
                            $scope.task5.fileData = '';
                            console.log("No Assets 0");
                        } else {
                            $scope.task5.fileData = roleAsset5.assetsStatus[0].fileData;
                        }
                        $scope.editedRole5 = role.roleMessageList[i];
                        if (angular.equals($scope.editedRole5.activeFlag, true)) {
                            $scope.showInactive5 = true;
                        } else {
                            $scope.showInactive5 = false;
                        }
                        switch ($scope.editedRole5.status) {
                            case 'SAVE':
                                $scope.disabledSave5 = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater5 = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow5 = true;
                                $scope.disablePublishLater5 = true;
                                break;
                            default:
                                console.error('bad status');
                                break;
                        }
                    }
                    if (role.roleMessageList[i].fairType === $scope.fairTypes[6]) {
                        $scope.task6.title = angular.copy(role.roleMessageList[i].title);
                        $scope.task6.description = angular.copy(role.roleMessageList[i].description);
                        var roleAsset6 = role.roleMessageList[i];
                        if (typeof roleAsset6.assetsStatus[0] === 'undefined' || roleAsset6.assetsStatus[0] === null) {
                            $scope.task6.fileData = '';
                            console.log("No Assets 0");
                        } else {
                            $scope.task6.fileData = roleAsset6.assetsStatus[0].fileData;
                        }
                        $scope.editedRole6 = role.roleMessageList[i];
                        if (angular.equals($scope.editedRole6.activeFlag, true)) {
                            $scope.showInactive6 = true;
                        } else {
                            $scope.showInactive6 = false;
                        }
                        switch ($scope.editedRole6.status) {
                            case 'SAVE':
                                $scope.disabledSave6 = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater6 = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow6 = true;
                                $scope.disablePublishLater6 = true;
                                break;
                            default:
                                console.error('bad status');
                                break;
                        }
                    }
                }
            }

            // XXX: Is there a better way to check if it exists?
            /* if (typeof role.assetsStatus[0] === 'undefined' || role.assetsStatus[0] === null) {
                 $scope.task.whyFileName = '';
                 $scope.task.howFileName = '';
                 console.log("No Assets 0");
             } else {
                 console.log("Why " + role.assetsStatus[0].type + " " + role.assetsStatus[0].fileName);
                 if (role.assetsStatus[0].type === 'WHYFILE') {
                     $scope.task.whyFileName = role.assetsStatus[0].fileName;
                     $scope.task.howFileName = '';
                     console.log("whyFile 0 " + role.assetsStatus[0].type + " " + role.assetsStatus[0].fileName);
                 } else {
                     console.log("howFile 0 " + role.assetsStatus[0].type + " " + role.assetsStatus[0].fileName);
                     $scope.task.howFileName = role.assetsStatus[0].fileName;
                     $scope.task.whyFileName = '';
                 }
             }*/

            /*  if (typeof role.assetsStatus[1] === 'undefined' || role.assetsStatus[1] === null) {
                  //$scope.task.howFileName = '';
                  console.log("No Assets 1");
              } else {
                  if (role.assetsStatus[1].type === 'HOWFILE') {
                      console.log("howfile 1 " + role.assetsStatus[1].type + " " + role.assetsStatus[1].fileName);
                      $scope.task.howFileName = role.assetsStatus[1].fileName;
                  } else {
                      console.log("whyfile 1 " + role.assetsStatus[1].type + " " + role.assetsStatus[1].fileName);
                      $scope.task.whyFileName = role.assetsStatus[1].fileName;
                  }
              }*/

            /*if (role.activeFlag === "Y") {
                $scope.showInactive = true;
            } else {
                $scope.showActive = true;
            }*/

            $scope.edited = true;
            /*$scope.editedRole = role;
            switch ($scope.editedRole.status) {
                case 'SAVE':
                    $scope.disabledSave = true;
                    break;
                case 'PUBLISH_LATER':
                    $scope.disablePublishLater = true;
                    break;
                case 'PUBLISH_NOW':
                    $scope.disablePublishNow = true;
                    $scope.disablePublishLater = true;
                    break;
                default:
                    console.error('bad status');
                    break;
            }*/
        };

        /*$scope.resetFileName = function() {
            console.log("Reset fileName ");
            var textinput = $document[0].getElementById("filename");
            textinput.value = "";
        };

        $scope.resetFileName1 = function() {
            console.log("Reset fileName1");
            var textinput = $document[0].getElementById("filename1");
            textinput.value = "";
        };
*/
        $scope.clear = function() {
            $scope.task = {};
            $scope.edited = false;
            $scope.editedRole = {};
            $scope.submitted = false;
            $scope.showInactive = false;
            $scope.buttonSel = false;
            $scope.changeStatus('Form');
            $scope.task1 = {};
            $scope.edited = false;
            $scope.editedRole1 = {};
            $scope.changeStatus('Form1');
            $scope.submitted1 = false;
            $scope.showInactive1 = false;
            $scope.buttonSel1 = false;
            $scope.task2 = {};
            $scope.edited = false;
            $scope.editedRole2 = {};
            $scope.changeStatus('Form2');
            $scope.submitted2 = false;
            $scope.showInactive2 = false;
            $scope.buttonSel2 = false;
            $scope.task3 = {};
            $scope.edited = false;
            $scope.submitted3 = false;
            $scope.showInactive3 = false;
            $scope.buttonSel3 = false;
            $scope.editedRole3 = {};
            $scope.changeStatus('Form3');
            $scope.task4 = {};
            $scope.edited = false;
            $scope.submitted4 = false;
            $scope.showInactive4 = false;
            $scope.buttonSel4 = false;
            $scope.editedRole4 = {};
            $scope.changeStatus('Form4');
            $scope.task5 = {};
            $scope.edited = false;
            $scope.submitted5 = false;
            $scope.showInactive5 = false;
            $scope.buttonSel5 = false;
            $scope.editedRole5 = {};
            $scope.changeStatus('Form5');
            $scope.task6 = {};
            $scope.edited = false;
            $scope.submitted6 = false;
            $scope.showInactive6 = false;
            $scope.buttonSel6 = false;
            $scope.editedRole6 = {};
            $scope.changeStatus('Form6');
        };

        $scope.changeStatus = function(typeForm) {

            if (typeForm === 'Form') {
                $scope.disablePublishLater = false;
                $scope.disablePublishNow = false;
                $scope.disabledSaveandAdd = false;
                $scope.disabledSave = false;
            } else if (typeForm === 'Form1') {
                $scope.disablePublishLater1 = false;
                $scope.disablePublishNow1 = false;
                $scope.disabledSaveandAdd1 = false;
                $scope.disabledSave1 = false;
            } else if (typeForm === 'Form2') {
                $scope.disablePublishLater2 = false;
                $scope.disabledSaveandAdd2 = false;
                $scope.disablePublishNow2 = false;
                $scope.disabledSave2 = false;
            } else if (typeForm === 'Form3') {
                $scope.disablePublishLater3 = false;
                $scope.disablePublishNow3 = false;
                $scope.disabledSaveandAdd3 = false;
                $scope.disabledSave3 = false;
            } else if (typeForm === 'Form4') {
                $scope.disablePublishLater4 = false;
                $scope.disablePublishNow4 = false;
                $scope.disabledSaveandAdd4 = false;
                $scope.disabledSave4 = false;
            } else if (typeForm === 'Form5') {
                $scope.disablePublishLater5 = false;
                $scope.disablePublishNow5 = false;
                $scope.disabledSaveandAdd5 = false;
                $scope.disabledSave5 = false;
            } else if (typeForm === 'Form6') {
                $scope.disablePublishLater6 = false;
                $scope.disablePublishNow6 = false;
                $scope.disabledSaveandAdd6 = false;
                $scope.disabledSave6 = false;
            }

        };

        //
        // MAIN
        //
        dumble.setDumbleData('Admin:Create Roles', 'Landing Page', '', '', 1, '', '', '', '');
        $scope.initRoles();
    }]);

    app.controller('adminMessageController', ['$scope', '$http', '$location', 'messSer', 'dumble', 'urlprefix', 'teamsite', function($scope, $http, $location, messSer, dumble, urlprefix, teamsite) {
        $scope.disabledSave = false;
        $scope.disablePublishLater = false;
        $scope.disablePublishNow = false;
        $scope.disablePublishLater = false;
        $scope.submitted = false;
        $scope.postData = {};
        $scope.include = {
            top: teamsite + "/VolunteerAdminMessage.html",
        };

        $scope.goToHome = function() {
            $location.path('/admin/home');
        };

        $scope.addMessage = function(action) {
            $scope.submitted = true;
            $scope.postData.message = $scope.message;
            $scope.postData.status = action;
            $scope.postData.action = action;
            if ($scope.messageform.$valid) {
                $http.put(urlprefix + '/volunteer-manager/admin/message', $scope.postData).then(
                    function(data) {
                        switch (data.data.status) {
                            case 'SAVE':
                                $scope.disabledSave = true;
                                break;
                            case 'PUBLISH_LATER':
                                $scope.disablePublishLater = true;
                                break;
                            case 'PUBLISH_NOW':
                                $scope.disablePublishNow = true;
                                $scope.disablePublishLater = true;
                                break;
                            default:
                                break;
                        }
                        $scope.message = data.data.message;
                    },
                    function(data) {
                        console.error('error!');
                    });
            }
        };

        $scope.clear = function() {
            $scope.message = "";
        };

        $scope.changeStatus = function() {
            $scope.disablePublishLater = false;
            $scope.disablePublishNow = false;
            $scope.disabledSave = false;
        };

        //
        // MAIN
        //

        dumble.setDumbleData('Admin:Message', 'Landing Page', '', '', 1, '', '', '', '');

        var promise = messSer.getMessages();
        promise.then(function(data) {
            $scope.postData = data.data;
            $scope.message = $scope.postData.message;
            switch ($scope.postData.status) {
                case 'SAVE':
                    $scope.disabledSave = true;
                    break;
                case 'PUBLISH_LATER':
                    $scope.disablePublishLater = true;
                    break;
                case 'PUBLISH_NOW':
                    $scope.disablePublishNow = true;
                    $scope.disablePublishLater = true;
                    break;
                default:
                    break;
            }

        }, function(data) {
            console.error(data);
        });
    }]);

    app.controller('shingleController', ['', function() {}]);

})();
