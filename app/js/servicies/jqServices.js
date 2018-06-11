 var app = angular.module('jqServices', []);
 // All caledar jquery functions will be written in this serivce.
 app.service('jqService', ['$window', '$timeout', function($window, $timeout) {
     var curService = this;
     // This function modified and moved from Controller, updating tasks positions each caledar cell.
     this.addStyle = function() {
         $timeout(function() {

             $('.taskSection dl dd .innerWrap .dataBox').each(function(index, value) {
                 var t = 24;
                 // overlapSpacer is for the number of overlapping tasks
                 // NOT the number of addition spacers required due to tasks being pushed down
                 var overlapSpacerCount = $(this).find('li.overlap').length | 0;
                 if (overlapSpacerCount > 1) {
                     t = overlapSpacerCount * 24;
                 }
                 // nonOverlapingSpacer - tasks being pushed down would be as a result of a non overlapping task pushing down an overlapping task
                 var appliedOnce = false;
                 $(this).find('ul li.spanBlock').each(function(index, value) {
                     // overlapSpacer
                     //$(this).parent('ul').find('li.overlap').each(function(index, value) {
                     //var overlapSpacerCount = $(this).parent('ul').find('li.overlap').length | 0;
                     if (index === 0 && overlapSpacerCount === 0) {
                         //console.log('0 overlapSpacerCount', overlapSpacerCount, 'task', value);
                         $(this).css('top', 0 + 'px');
                     } else if (index > 0 && overlapSpacerCount === 0) {
                         //console.log('1 overlapSpacerCount', overlapSpacerCount, 'task', value);
                         $(this).css('top', t + 'px');
                         t = t + 24;
                     } else if (index === 0 && overlapSpacerCount > 0) {
                         //console.log('2a overlapSpacerCount', overlapSpacerCount, 'task', value);
                         // add the overlap space ONCE for this entire spanBlock
                         if (!appliedOnce) {
                             //console.log('2b overlapSpacerCount', overlapSpacerCount, 'task', value);
                             //t = overlapSpacerCount * 20;
                             appliedOnce = true;
                         }
                         $(this).css('top', t + 'px');
                         t = t + 24;
                     } else if (index > 0 && overlapSpacerCount > 0) {
                         //console.log('3a overlapSpacerCount', overlapSpacerCount, 'task', value);
                         // add the overlap space ONCE for this entire spanBlock
                         if (!appliedOnce) {
                             //t = overlapSpacerCount * 20;
                             //console.log('3b overlapSpacerCount', overlapSpacerCount, 'task', value);
                             appliedOnce = true;
                         }
                         $(this).css('top', t + 'px');
                         t = t + 24;
                     } else {
                         //console.log('addStyles index and overlapSpacerCount else case!!');
                         //console.log(overlapSpacerCount, 'overlapSpacerCount', value);
                     }

                 });

                 // $(this).parent().parent().css('height', tempoffset);

             });


             $('.taskSection dl dd .innerWrap').each(function(index, value) {
                 // when scroll Up/Down position new rows with existing elements [scroll left change].
                 if (index === 0 || index === 6) {
                     var nextElePos = $($(value).parent().parent().siblings().find('.innerWrap')[0]).position().left;
                     $(value).animate({
                         left: nextElePos
                     }, 0);
                 }
                 // Setting height of each row depends on number of task in each row or set minimum height as 60px.
                 var numberofTasks = 1;
                 var tempoffset = 74;
                 var taskHeight = 24;
                 // To find maximum number of tasks in ROW.
                 $(this).find('.taskContainer').each(function(ind, val) {
                     if (val.children.length > 1) {
                         var childArr = val.children;
                         var lastEle = childArr[childArr.length - 1];
                         tempoffset = Math.max(tempoffset, lastEle.offsetTop + taskHeight);
                         // tempoffset = (numberofTasks * taskHeight) + taskHeight;
                     }
                 });
                 // if there are tasks in row
                 if ($(this).find('.taskContainer li').length > 0) {
                     $($('.innerWrapVertical dl dd')[index]).find('.calButton').css('display', 'block');
                 }

                 // Assiging Height to each child element depends on above result.
                 $(value.children).each(function(index, val) {
                     $(this).css('height', tempoffset);
                 });
                 // Assigning height to Date/Day column.
                 var dateColumn = $('.weekdaysCol .innerWrapVertical dl dd').eq(index);
                 dateColumn.css('height', tempoffset);
                 // Assigning height to innerWrap, outerWrap, preIndicatorWrap, nextIndicatorWrap
                 $(this).css('height', tempoffset);
                 $(this).parent().css('height', tempoffset);
                 $(this).parent().siblings().css('height', tempoffset);
             });
         }, 1);
     };
     this.styleCalPopUp = function($event) {
         //  $scope.PopupBg = true;
         // To remove extra space in the calender.
         $timeout(function() {
             if (angular.element('.uib-datepicker-popup').length > 0) {
                 angular.element(".uib-daypicker thead tr th")[1].setAttribute('colspan', '5');
                 angular.element('.uib-datepicker-popup').css({
                     'top': '-127px',
                     'left': '-87px'
                 });
             }
         }, 0);
     };

 }]);
