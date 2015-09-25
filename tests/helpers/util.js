
var util = require('helpers/util');
var expect = chai.expect;

describe('helpers/util', function() {
  describe('#isNone(obj)', function() {
    var isNone = util.isNone;

    it('should return true for `null` or `undefined` ', function() {
      isNone().should.be.true;
      isNone(null).should.be.true;
      isNone(undefined).should.be.true;
    });

    it('should return false for anything else', function() {
      isNone('').should.not.be.true;
      isNone([]).should.not.be.true;
      isNone({}).should.not.be.true;
      isNone(function() {}).should.not.be.true;
    });
  });

  describe('#isEmpty(obj)', function() {
    var isEmpty = util.isEmpty;
    
    it('should return true for `null`, `undefined`, empty string, or array', function() {
      isEmpty().should.be.true;
      isEmpty(null).should.be.true;
      isEmpty(undefined).should.be.true;
      isEmpty('').should.be.true;
      isEmpty([]).should.be.true;
    });

    it('should return false for a string or array with length, or any object', function() {
      isEmpty('something').should.not.be.true;
      isEmpty([1, 2, 3]).should.not.be.true;
      isEmpty({}).should.not.be.true;
      isEmpty(function() {}).should.not.be.true;
    });
  });

  describe('#isBlank(obj)', function() {
    var isBlank = util.isBlank;

    it('should return ture for `null` or `undefined`', function() {
      isBlank().should.be.true;
      isBlank(null).should.be.true;
      isBlank(undefined).should.be.true;
    });

    it('should return true for empty or only whitespace characters', function() {
      isBlank('').should.be.true;
      isBlank(' ').should.be.true;
      isBlank('\t').should.be.true;
      isBlank('\n').should.be.true;
      isBlank('\r\n').should.be.true;
      isBlank('  \t  \n  \r\n  ').should.be.true;
    });
  });

  describe('#isEmptyObject(obj)', function() {
    var isEmptyObject = util.isEmptyObject;

    it('should return true for no enumerable keys', function() {
      isEmptyObject({}).should.be.true;
      var obj = {};
      Object.defineProperty(obj, 'one', {
        value: 1
      });
      isEmptyObject(obj).should.be.true;
    });

    it('should return false for when an enumerable key is present', function() {
      isEmptyObject({value: 1}).should.not.be.true;
    });

    it('should return true for `null`, `undefined`, empty string, numbers, or empty array', function() {
      isEmptyObject().should.be.true;
      isEmptyObject(null).should.be.true;
      isEmptyObject(undefined).should.be.true;
      isEmptyObject('').should.be.true;
      isEmptyObject(1).should.be.true;
      isEmptyObject([]).should.be.true;
    });

    it ('should return false for a string or array with length', function() {
      isEmptyObject('something').should.not.be.true;
      isEmptyObject([1,2,3]).should.not.be.true;
    });
  });

  describe('#getPropertyOwner(obj, propName)', function() {

    // TODO
    
  });

});
