 var app = angular.module('editScheduleService', []);
 app.service('adminRoles', ['$http', 'urlprefix', function($http, urlprefix) {
     this.getAdminRoles = function(eventId) {
         return $http.get(urlprefix + '/volunteer-manager/admin/volunteer/roles/' + eventId);
     };
     this.getCustomRoles = function(eventId) {
         return $http.get(urlprefix + '/volunteer-manager/signupsheet/custom/tasks/' + eventId);
     };
 }]);

 // This generates dates for Caledar.
 app.service('dateService', ['$filter', function($filter) {
     Date.prototype.addDays = function(days) {
         var dat = new Date(this.valueOf());
         dat.setDate(dat.getDate() + days);
         return dat;
     };

     function getDates(startDate, stopDate) {
         var dateArray = [];
         var currentDate = startDate;
         while (currentDate <= stopDate) {
             dateArray.push(currentDate);
             currentDate = currentDate.addDays(1);
         }
         return dateArray;
     }
     this.dateRange = function(start, end, days) {
         var weekDays = [];
         var dateArray = getDates(start._d, (end._d));
         for (var i = 0; i < dateArray.length; i++) {
             weekDays.push({
                 day: days[dateArray[i].getDay()],
                 dat: $filter('date')(dateArray[i], 'MM/dd'),
                 dateYear: $filter('date')(dateArray[i], 'MM/dd/yyyy')
             });
         }
         return weekDays;
     };
     this.utcConversion = function(dat) {
         return moment.utc(dat).format('MM/DD/YYYY');
     };
 }]);
