/**
 * Created by Shaun on 11/15/2014.
 */
describe('Kilo Core Injector Spec', function() {
  var Injector;

  describe('registered function', function() {
    var returnedFunc, newFunc;

    beforeEach(function(done) {
      use(['Injector'], function(_Injector) {
        Injector = _Injector;

        Injector.register('IsDefinedTester', ['Util'], function(Util) {
          return function(val) {
            return Util.isDefined(val);
          }
        });

        Injector.getDependency('IsDefinedTester', function(IsDefinedTester) {
          returnedFunc = IsDefinedTester;
          done();
        });
      });
    });

    afterEach(function() {
      Injector.unresolve('IsDefinedTester');
      returnedFunc = null;      
    })

    it('should be returned', function() {
      expect(returnedFunc);
    });

    it('should return the proper value', function() {
      expect(returnedFunc('123')).toBe(true);
    });

    it('should be unresolved', function() {
      Injector.unresolve('IsDefinedTester');
      expect(Injector.unresolved['IsDefinedTester']);
      expect(Injector.modules['IsDefinedTester']).toBe(undefined);
    });

    it('should be a new function instance', function() {
      var newFunc;
      Injector.getDependency('IsDefinedTester', function(_newFunc) {
        newFunc = _newFunc;
      });

      expect(newFunc).not.toBe(returnedFunc);
      expect(newFunc('456')).toBe(true);
    });

    it('should return the proper dependency', function() {
      var IsDefinedTester;
      Injector.process(['IsDefinedTester'], function(_IsDefinedTester) {
        IsDefinedTester = _IsDefinedTester;
      });
      expect(IsDefinedTester('456')).toBe(true);
    });
  });
});