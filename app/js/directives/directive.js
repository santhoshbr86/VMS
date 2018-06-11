(function() {
    "use strict";
    var app = angular.module('appDirectives', []);

    app.directive('contactCarousel', function() {
        return {
            restrict: 'E',
            templateUrl: '/partials/contacts-helpOverlay.html',
            controller: 'carousel'
        };
    });

    app.directive('signupsheetHelp', function() {
        return {
            restrict: 'E',
            templateUrl: '/partials/signup-helpoverlay.html',
            controller: 'signupSheetCarousel'
        };
    });

    app.directive('taskDuplicate', function() {
        return {
            restrict: "E",
            templateUrl: "/partials/duplicate.html"
        };
    });

    //Position Delete popup based on cursor positon.
    app.directive('ngPosition', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.on('click', function(e) {
                    var rls = e.currentTarget.innerText;
                    if (rls === 'Delete Selected' || rls === 'DELETE CONTACT') {
                        angular.element('.popUp').css('top', e.clientY - 30);
                    } else {
                        angular.element('.addGroup').css('top', e.clientY - 120);
                    }
                });
            }
        };
    });

    // Formats a phone number. Takes out all non-digits, and removes the first
    // '1' if applicable. According to the North American Numbering Plan no
    // area codes can begin with 1.
    app.directive('formatPhone', [function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function link(scope, iElement, iAttrs, ngModelController) {
                ngModelController.$parsers.push(function(phone) {
                    var masterPhone = phone;
                    phone = phone.replace(/\D/g, '').replace(/^1/g, '');
                    if ((masterPhone.length > 0 && phone === '') || (phone.length !== 10 && phone.length !== 0)) {
                        ngModelController.$error.length = true;
                        return undefined;
                    }
                    delete ngModelController.$error.length;
                    console.log("cleaned phone: %o", phone);

                    return phone;
                });
            }
        };
    }]);

    // Mobile divces fix, to accept only numbers.
    app.directive('numbersOnly', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {

                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    } else {
                        return text;
                    }


                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });
    app.directive('schedulerCarousel', function() {
        return {
            restrict: 'E',
            templateUrl: '/include/VOL430_helpBubble.html',
            controller: 'scheduleCarouselCtrl'
        };
    });
    app.directive('listPopup', function() {
        return {
            restrict: 'E',
            templateUrl: '/include/VOL430_listpopup.html'
        };
    });

    app.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    app.directive('slideTog', function() {
        return {
            link: function(scope, element) {
                element.parent().find('a.slideDown').bind('click', function() {
                    element.stop().slideToggle(300);
                });
            }
        };
    });

    app.directive('showScheduler', ['jqService', function(jqService) {
        return {
            link: function(scope, element) {
                element.parent().find('#show').bind('click', function() {
                    $(this).hide();
                    $(this).siblings('#hide').show();
                    element.stop().slideDown(300);
                    jqService.addStyle();
                });
                element.parent().find('#hide').bind('click', function() {
                    $(this).hide();
                    $(this).siblings('#show').show();
                    element.stop().slideUp(300);
                });
            }
        };
    }]);

    app.directive('actionPanel', function() {
        return {
            link: function(scope, element) {
                // find and return closest selected actionPanel
                function findClosestSiblingElementId(recentlyUncheckedParent, allElementsToTest) {
                    var uncheckedID = recentlyUncheckedParent.find("input").attr("id"),
                        uncheckedIndex, foundClosestID, closestDistance = null;
                    var squaredArray = [],
                        checkedArray = [];
                    // build array
                    for (var i = 0; i < allElementsToTest.length; i++) {
                        var id = allElementsToTest[i].getElementsByTagName("INPUT")[0].id;
                        if (id === uncheckedID) {
                            uncheckedIndex = i;
                        }
                        if (id) {
                            // console.log("squaredOne id", id);
                            squaredArray.push({
                                i: i,
                                id: id,
                                checked: allElementsToTest[i].getElementsByTagName("INPUT")[0].checked
                            });
                        }
                    }
                    // specify distance from unchecked
                    for (var j = 0; j < squaredArray.length; j++) {
                        if (squaredArray[j].checked === true) {
                            squaredArray[j].distance = j - uncheckedIndex;
                            checkedArray.push(squaredArray[j]);
                            if (closestDistance === null || closestDistance > Math.abs(squaredArray[j].distance)) {
                                closestDistance = Math.abs(squaredArray[j].distance);
                                foundClosestID = squaredArray[j].id;
                            }
                        }
                    }


                    return allElementsToTest.find("#" + foundClosestID);
                }

                element.parent().find('input.openPanel').bind('click', function() {
                    // If All Contacts are selected then - DONE in selectAll()
                    // do not show any other panel - DONE in selectAll()
                    if (scope.checkAll) {
                        // If All Contacts are no longer selected then
                        // do not show All Contacts actionPanel
                        scope.checkAll = false;
                    }
                    if ($(this).is(':checked')) {
                        // if is checked then unselect
                        element.stop().show();
                        if (element.parent('li').find('input').attr('id') === 'squaredOneHead') {
                            scope.checkAll = true;
                        }
                        element.parent('li').siblings().find('.actionPanel').hide();
                    } else {
                        // else is unchecked then
                        var recentlyUncheckedParent = element.parent('li');
                        var allElementsToTest = element.parent('li').parent().children();
                        if ($(this).closest('li').find('.actionPanel').css('display') === 'block') {
                            // if is actionPanel displayed then
                            // stop it and hide it
                            element.stop().hide();
                            // show closest selected actionPanel
                            findClosestSiblingElementId(recentlyUncheckedParent, allElementsToTest).closest('li').find('.actionPanel').stop().show();
                            scope.$parent.checkAll = false;
                            scope.$parent.selectAllChecked = false;
                            scope.$apply();
                        } else {
                            // else is actionPanel hidden
                            // first hide all
                            $(".actionPanel").hide();
                            // then show closest selected actionPanel
                            findClosestSiblingElementId(recentlyUncheckedParent, allElementsToTest).closest('li').find('.actionPanel').stop().show();
                            scope.$parent.selectAllChecked = false;
                            scope.$parent.checkAll = false;
                            scope.$apply();
                        }
                    }
                });
            }
        };
    });

    app.directive('checkAll', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                angular.element('#checkAll').bind('change', function() {
                    element.children('input').attr('checked', true);
                });
            }
        };
    });

    app.directive("checkboxGroup", function() {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                if (scope.deleteList.indexOf(scope.contact.id) !== -1) {
                    elem[0].checked = true;
                }
                elem.bind('click', function() {
                    var index = -1;

                    // Find the index of the contact in the deleteList.
                    // Since we compare to an object, we can't use indexOf :(
                    for (var q = 0; q < scope.deleteList.length; q++) {
                        if (scope.deleteList[q].id === scope.contact.volId && scope.deleteList[q].extId === scope.contact.volunteerExt.transId) {
                            index = q;
                            break;
                        }
                    }

                    if (elem[0].checked) {
                        if (index === -1) {
                            scope.deleteList.push({
                                'volId': scope.contact.id,
                                'extId': scope.contact.volunteerExt.transId
                            });
                            scope.selectedContacts.push(scope.contact);
                        }
                    } else {
                        if (index !== -1) {
                            scope.deleteList.splice(index, 1);
                        }

                        for (var i = 0; i < scope.selectedContacts.length; i++) {
                            if (scope.contact.volunteerExt.transId === scope.selectedContacts[i].volunteerExt.transId) {
                                scope.selectedContacts.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    scope.$apply(scope.deleteList.sort(function(a, b) {
                        return a - b;
                    }));
                });
            }
        };
    });

    app.directive("addGroup", function() {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                if (scope.selectGrp.indexOf(scope.group.id) !== -1) {
                    elem[0].checked = true;
                }
                elem.bind('click', function() {
                    var index = scope.selectGrp.indexOf(scope.group.id);
                    if (elem[0].checked) {
                        if (index === -1) {
                            scope.selectGrp.push(scope.group.id);
                        }
                    } else {
                        if (index !== -1) {
                            scope.selectGrp.splice(index, 1);
                        }
                    }
                    scope.$apply(scope.selectGrp.sort(function(a, b) {
                        return a - b;
                    }));
                });
            }
        };
    });

    app.filter('pagination', function() {
        return function(input, start) {
            start = +start;
            if (start >= 24) {
                start = 0;
            }
            return input.slice(start);
        };
    });

    app.filter('dateScroller', function() {
        return function(input, start) {
            start = +start;
            return input.slice(start);
        };
    });

    app.directive('showBtn', function() {
        return {
            link: function(scope, element) {
                element.parent().bind('mouseover', function() {
                    element.stop().show();
                });
                element.parent().bind('mouseout', function() {
                    element.stop().hide();
                });
            }
        };
    });

    app.directive('selectBar', function() {
        return {
            link: function(scope, element, attr) {
                element.siblings().find('#showSelected').bind('click', function() {
                    element.removeClass('hide');
                    element.addClass('show');
                    $(this).parent('p').removeClass('show');
                    $(this).parent('p').addClass('hide');
                    // $("#selectedCount").show();
                    if (element.find('.details').hasClass('show')) {
                        element.find('.details').removeClass('show');
                        element.find('.details').addClass('hide');
                    }
                });
                element.find('#hideSelected').bind('click', function() {
                    element.removeClass('show');
                    element.addClass('hide');
                    element.find('p').removeClass('hide');
                    element.find('p').addClass('show');
                    element.parent('li').find('#select').removeClass('hide');
                    element.parent('li').find('#select').addClass('show');
                    // $("#selectedCount").hide();
                    if (element.parent('li').find('.details').hasClass('show')) {
                        element.parent('li').find('.details').removeClass('show');
                        element.parent('li').find('.details').addClass('hide');
                    }
                });
            }
        };
    });

    app.directive('showDetails', function() {
        return {
            link: function(scope, element, attr) {
                element.parent().find('#showDetails').bind('click', function() {
                    element.removeClass('hide');
                    element.addClass('show');
                    element.parent('li').find('#select').removeClass('show');
                    element.parent('li').find('#select').addClass('hide');
                    element.find('p').removeClass('hide');
                    element.find('p').addClass('show');
                });
                element.find('#hideDetails').bind('click', function() {
                    element.removeClass('show');
                    element.addClass('hide');
                    element.parent().find('p').removeClass('hide');
                    element.parent().find('p').addClass('show');
                });
            }
        };
    });

    app.directive('showTasks', function() {
        return {
            link: function(scope, element, attr) {
                element.parent().find('#openPanel').bind('click', function() {
                    element.removeClass('hide');
                    element.addClass('show');
                    $(this).removeClass('show');
                    $(this).addClass('hide');
                    $(this).siblings('#closePanel').addClass('show');
                    element.closest('li').siblings().each(function(ind, val) {
                        $(this).find('#panelBody').removeClass('show');
                        $(this).find('#panelBody').addClass('hide');
                        if ($(this).find('#closePanel').hasClass('show')) {
                            $(this).find('#closePanel').removeClass('show');
                            $(this).find('#closePanel').addClass('hide');
                            $(this).find('#openPanel').removeClass('hide');
                            $(this).find('#openPanel').addClass('show');
                        }
                    });
                });
                element.parent().find('#closePanel').bind('click', function() {
                    element.removeClass('show');
                    element.addClass('hide');
                    $(this).removeClass('show');
                    $(this).addClass('hide');
                    $(this).siblings('#openPanel').addClass('show');
                });
            }
        };
    });

    app.directive('showCommitments', function() {
        return {
            link: function(scope, element, attr) {
                element.prev().find('#hideDetails').bind('click', function() {
                    element.removeClass('hide');
                    element.addClass('show');
                });
                element.find('#keepCommit').bind('click', function() {
                    element.removeClass('show');
                    element.addClass('hide');
                });
                element.find('#cancelCommit').bind('click', function() {
                    //element.parent().find('#ConfirmPopup').removeClass('hide');
                    //element.parent().find("#ConfirmPopup").addClass('show');
                    element.removeClass('show');
                    element.addClass('hide');
                    scope.activity.volunteerName = null;
                    scope.activity.volunteerId = null;
                    scope.$digest();
                });
                element.parent().find('#ConfirmPopup').find('.btn-primary').bind('click', function() {
                    //element.parent().find('#ConfirmPopup').removeClass('show');
                    //element.parent().find("#ConfirmPopup").addClass('hide');
                    /* scope.activity.volunteerName = null;
                     scope.activity.volunteerId = null;
                     scope.$digest();*/
                });
            }
        };
    });
    app.directive('togglePanel', function() {
        return {
            link: function(scope, element, attr) {
                element.prev().find('#openPanel').bind('click', function() {
                    element.toggleClass('show hide');
                    $(this).find('.glyphicon').toggleClass('glyphicon-triangle-top glyphicon-triangle-bottom');
                });
            }
        };
    });


})();
