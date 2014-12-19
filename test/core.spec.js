/**
 * Created by Shaun on 12/7/2014.
 */
describe('Kilo Core Spec', function() {
  describe('existing dependency', function() {
    var valIsDefined, Util;

    use('Util', function(_Util) {
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

    beforeEach(function(done) {
      register(['registerAll'], function(registerAll) {
        registerAll({
          MyDep1: function() {
            return 'foo';          
          },
          MyDep2: function() {
            return 'bar';        
          }
        });
      });

      use(['MyDep1', 'MyDep2'], function(_MyDep1, _MyDep2) {
        MyDep1 = _MyDep1;
        MyDep2 = _MyDep2;
        done();
      });
    });

    it('should have registered MyDep1', function() {
      expect(MyDep1).not.toBe(null);
      expect(MyDep1()).toBe('foo');
    });

    it('should have registered MyDep2', function() {
      expect(MyDep2).not.toBe(null);
      expect(MyDep2()).toBe('bar');
    });
  });
});