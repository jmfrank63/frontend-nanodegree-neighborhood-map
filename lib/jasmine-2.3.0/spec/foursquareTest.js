$(function () {
    /* The foursquare api test suite
    */
    
    // test initial state
    describe('Foursquare api before call', function () {
        // test the default data variable before call to api
        it('default data variable is defined', function () {
            expect(defaultData).toBeDefined();
        });
        
        it('default data variable is non empty object', function () {
            expect(defaultData).toBeNonEmptyObject();
        });
    });
    
    // test state after call to api
    describe('Foursquare api after call', function () {
        // test the foursquare data variable after call to api
        
        // call the api once at the begining of the test
        beforeEach(function(done) {
           fsqSearch(HOME, 400, 10, 'bar', function () { done(); });
           done();
        });
        
        it('result is not empty after call', function () {
            expect()
        });
    });
});