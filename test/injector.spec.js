/**
 * Created by Shaun on 11/15/2014.
 */
describe('Kilo Core Injector Spec', function() {
  var Injector = kilo('Injector');

  describe('registered function', function() {
    var returnedFunc, newFunc;

    Injector.register('IsDefinedTester', ['Util'], function(Util) {
      return function(val) {
        return Util.isDefined(val);
      }
    });

    returnedFunc = Injector.getDependency('IsDefinedTester');

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
      newFunc = Injector.getDependency('IsDefinedTester');
      expect(newFunc).not.toBe(returnedFunc);
    });

    it('should still work the same', function() {
      expect(newFunc('456')).toBe(true);
    });
  });
});