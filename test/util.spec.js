describe('Kilo Core Util Spec', function() {
  var Util = use('Util');

  describe('Value "123"', function() {
    var aString = '123';

    it('should be defined', function() {
      expect(Util.isDefined(aString)).toBe(true);
    });

    it('should be a string', function() {
      expect(Util.isString(aString)).toBe(true);
    });

    it('should not be an object', function() {
      expect(Util.isObject(aString)).toBe(false);
    });
  });

  describe('Value 123', function() {
    var aNumber = 123;

    it('should be defined', function () {
      expect(Util.isDefined(aNumber)).toBe(true);
    });

    it('should be a number', function() {
      expect(Util.isNumber(aNumber)).toBe(true);
    });

    it('should not be an object', function() {
      expect(Util.isObject(aNumber)).toBe(false);
    });
  });

  describe('Object', function() {
    var anObject = {};

    it('should be defined', function () {
      expect(Util.isDefined(anObject)).toBe(true);
    });

    it('should be an object', function() {
      expect(Util.isObject(anObject)).toBe(true);
    });

    it('should not be an array', function() {
      expect(Util.isArray(anObject)).toBe(false);
    });
  });

  describe('Array', function() {
    var anArray = [];

    it('should be defined', function () {
      expect(Util.isDefined(anArray)).toBe(true);
    });

    it('should be an array', function() {
      expect(Util.isArray(anArray)).toBe(true);
    });

    it('should not be an object', function() {
      expect(Util.isObject(anArray)).toBe(false);
    });
  });

  describe('def', function() {
    var undefinedVar, definedVar = 'foo';

    it('should set undefined var to "foo"', function() {
      expect(Util.def(undefinedVar, 'foo')).toBe('foo');
    });

    it('should set not set defined var to "bar"', function() {
      expect(Util.def(definedVar, 'bar')).toBe('foo');
    });
  });

  // to be moved out of kilo.js
  /*describe('GID with prefix "MyId"', function() {
    var prefix = 'MyId';
    it('should be MyId1', function() {
      expect(Util.getGID(prefix)).toBe('MyId1');
    });
    it('should be MyId2', function() {
      expect(Util.getGID(prefix)).toBe('MyId2');
    });
  });*/
});