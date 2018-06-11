(function() {
    "use strict";
    var app = angular.module('adminTool');
    app.service('httpErrorLoggingService', ['$http', 'uuid4', '_', 'urlprefix', function($http, uuid4, _, urlprefix) {

        var requestsArray = [];

        //set a request data
        this.setRequestData = function(title, method, url, requestPayload) {
            var reqId = uuid4.generate(); // uuid
            requestsArray.push({
                reqId: reqId,
                userAction: title,
                failedRequest: JSON.stringify({
                    method: method,
                    url: url
                }),
                postData: JSON.stringify(requestPayload),
                errorResponse: {}
            });
            //console.log("httpErrorLoggingService.setRequestData");
            return reqId;
        };

        //if success then remove request data
        this.removeRequestData = function(reqId) {
            var deleteSuccess = false;
            // remove obj from array using reqId
            _.remove(requestsArray, function(requestDataObj) {
                return requestDataObj.reqId === reqId;
            });
            //console.log("httpErrorLoggingService.removeRequestData %o", requestDataObj);
            return deleteSuccess;
        };

        //if error then send errorResponse data within the requestData obj
        this.sendRequestData = function(reqId, errorResponse) {
            var sendSuccess = false;

            var requestDataObj = _.find(requestsArray, function(el) {
                return el.reqId === reqId;
            });

            requestDataObj.errorResponse = JSON.stringify(errorResponse);

            var _self = this;
            $http.post(urlprefix + '/volunteer-manager/error-service', requestDataObj).then(
                function success(res) {
                    //success
                    sendSuccess = true;
                    // remove obj from array using reqId
                    _self.removeRequestData(reqId);
                    console.log('error logged success res=', res);
                },
                function failure(res) {
                    //failure should never happen
                    //service always returns 200
                    console.log('error logged failure res=', res);
                }
            ).catch(function(err) {
                //catch error
                console.log('error logged catch res=', err);
            });

            //console.log("httpErrorLoggingService.sendRequestData %o", requestDataObj);
            return sendSuccess;
        };

    }]);

})();
