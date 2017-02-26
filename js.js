var myApp = angular.module('myApp',[]);

myApp.factory('workerFunctionFactory', function () {
    'use strict';

    function workerFunction() {
        var self = this;

        self.onmessage = function(event) {
            var splitedString = event.data.split(',');

            self.postMessage(splitedString);
        }
    };

    return {
        getWebworkerFunction: function () {
            return workerFunction;
        }
    }
});

myApp.factory('workerFactory', function ($window) {
    'use strict';

    function createWorker(workerFunction) {
        var dataObj = '(' + workerFunction + ')();';
        var blob = new $window.Blob([dataObj.replace('"use strict";', '')]);

        var blobURL = ($window.URL ? URL : webkitURL).createObjectURL(blob, {
            type: 'application/javascript; charset=utf-8'
        });

        return new Worker(blobURL);
    };

    return {
        createWorker: createWorker
    }
});

myApp.controller('MyCtrl', function MyCtrl($timeout, workerFactory, workerFunctionFactory) {
    'use strict';

    var worker;
    var self = this;

    this.inputText = '';
    this.data = '';

    this.sendMessage = function () {
        worker.postMessage(self.inputText);
    };

    function setData(data) {
        self.data = data;
    }

    (function init() {
        worker = workerFactory.createWorker(workerFunctionFactory.getWebworkerFunction());

        worker.onmessage = function (message) {
            $timeout(function () {
                setData(message.data)
            }, 0);
        }
    }());
});
