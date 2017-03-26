describe('workerFunctionFactory', function () {
    'use strict';

    var workerFunctionFactory;

    beforeEach(module('myApp'));

    beforeEach(function () {
        inject([
            'workerFunctionFactory',
            function (_workerFunctionFactory_) {
                workerFunctionFactory = _workerFunctionFactory_;
            }
        ])
    });

    describe('when worker function is used as a constructor', function () {
        var workerFunction;
        var workerFunctionInstance;

        beforeEach(function() {
            workerFunction = new workerFunctionFactory.getWebworkerFunction();
            workerFunctionInstance = new workerFunction();
            workerFunctionInstance.postMessage = jasmine.createSpy('postMessage');
        });

        it('should expose an onmessage method', function () {
            expect(workerFunctionInstance.onmessage).toEqual(jasmine.any(Function));
        });

        describe('when onmessage is called with an event object', function () {
            it('should call postMessage with the expected value', function () {
                workerFunctionInstance.onmessage({data: '1,2,3'});

                expect(workerFunctionInstance.postMessage).toHaveBeenCalledWith(['1','2','3']);
            });
        });
    });
});
