/**
 * Created by Shaun on 12/7/2014.
 */
describe('Kilo Core Spec', function() {
  describe('existing dependency', function() {
    var valIsDefined, Util;

    require('Util', function(_Util) {
      Util = _Util;
      valIsDefined = Util.isDefined('123');
    });

    it('should be defined', function() {
      expect(Util);
    });

    it('should work as expected', function() {
      expect(valIsDefined).toBe(true);
    });
  });

  describe('new dependencies', function() {
    var MyDep1, MyDep2

    require(function() {
      return {
        MyDep1: function() {
          return 'foo';          
        },
        MyDep2: function() {
          return 'bar';          
        }
      }
    });

    it('should have registered MyDep1', function() {
      require('MyDep1', function(MyDep1) {
        expect(MyDep1).not.toBe(null);
        expect(MyDep1()).toBe('foo');
      });
    });

    it('should have registered MyDep2', function() {
      require('MyDep2', function(MyDep2) {
        expect(MyDep2).not.toBe(null);
        expect(MyDep2()).toBe('bar');
      });
    });
  });
});