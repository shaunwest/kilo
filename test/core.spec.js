/**
 * Created by Shaun on 12/7/2014.
 */
describe('Kilo Core Spec', function() {
  kilo.log = false;
  
  describe('existing dependency', function() {
    var valIsDefined, Util;

    // happens to be synchronous
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

  describe('function with no dependencies', function() {
    var MyFunc1

    beforeEach(function(done) {
      register('MyFunc1', function() {
        return function(val) {
          return val + '!';
        };
      });

      use('MyFunc1', function(_MyFunc1) {
        MyFunc1 = _MyFunc1;
        done();
      });
    });

    afterEach(function() {
      kilo.unresolve('MyFunc1');
    });

    it('should have been registered', function() {
      expect(MyFunc1);
      expect(MyFunc1('foo')).toBe('foo!');
    });
  });

  describe('function with a dependency', function() {
    var MyFunc1

    beforeEach(function(done) {
      register('MyFunc1', ['Util'], function(Util) {
        return function(val) {
          if(Util.isDefined(val)) {
            return 'foo';
          }
          return 'bar';
        };
      });

      use('MyFunc1', function(_MyFunc1) {
        MyFunc1 = _MyFunc1;
        done();
      });
    });

    afterEach(function() {
      kilo.unresolve('MyFunc1');
    });

    it('should have been registered', function() {
      expect(MyFunc1);
      expect(MyFunc1(1)).toBe('foo');
    });
  });

  describe('function with a dependency (advanced method 1)', function() {
    var MyFunc1

    beforeEach(function(done) {
      register('MyFunc1', ['Util'])
      .factory(function(Util) {
        return function(val) {
          if(Util.isDefined(val)) {
            return 'foo';
          }
          return 'bar';
        };
      });

      use('MyFunc1', function(_MyFunc1) {
        MyFunc1 = _MyFunc1;
        done();
      });
    });

    afterEach(function() {
      kilo.unresolve('MyFunc1');
    });

    it('should have been registered', function() {
      expect(MyFunc1);
      expect(MyFunc1(1)).toBe('foo');
    });
  });

  describe('function with a dependency (advanced method 2)', function() {
    var MyFunc1

    beforeEach(function(done) {
      register('MyFunc1')
      .depends('Util')
      .factory(function(Util) {
        return function(val) {
          if(Util.isDefined(val)) {
            return 'foo';
          }
          return 'bar';
        };
      });

      use('MyFunc1', function(_MyFunc1) {
        MyFunc1 = _MyFunc1;
        done();
      });
    });

    afterEach(function() {
      kilo.unresolve('MyFunc1');
    });

    it('should have been registered', function() {
      expect(MyFunc1);
      expect(MyFunc1(1)).toBe('foo');
    });
  });

  describe('multiple functions', function() {
    var MyFunc1, MyFunc2

    beforeEach(function(done) {
      use('registerAll', function(registerAll) {
        registerAll({
          MyFunc1: function() {
            return 'foo';          
          },
          MyFunc2: function() {
            return 'bar';        
          }
        });
      });

      use(['MyFunc1', 'MyFunc2'], function(_MyFunc1, _MyFunc2) {
        MyFunc1 = _MyFunc1;
        MyFunc2 = _MyFunc2;
        done();
      });
    });

    afterEach(function() {
      kilo.unresolve('MyFunc1');
      kilo.unresolve('MyFunc2');
    });

    it('should have been registered (MyFunc1)', function() {
      expect(MyFunc1).not.toBe(null);
      expect(MyFunc1()).toBe('foo');
    });

    it('should have been registered (MyFunc2)', function() {
      expect(MyFunc2).not.toBe(null);
      expect(MyFunc2()).toBe('bar');
    });
  });
});