
var metal = require('helpers/metal');

describe('helpers/metal', function() {

	it('should exist', function() {
		metal.should.not.be.null;
	});

	describe('#canInvoke(obj, methodName)', function() {
		var canInvoke = metal.canInvoke;

		it('should return true if methodName exists in obj and is a function', function() {
			var obj = {
				test: function() {}
			};

			var Class = function() {};
			Class.prototype = Object.create(obj);
			Class.prototype.constructor = Class;

			canInvoke(obj, 'test').should.be.true;
			canInvoke(new Class(), 'test').should.be.true;
		});
	});

	describe('#makeArray(obj)', function() {
		var makeArray = metal.makeArray;

		it('should return an empty Array if obj isNone', function() {

			var fromNothing = makeArray();
			Array.isArray(fromNothing).should.be.true;
			fromNothing.should.be.empty;

			var fromNull = makeArray(null);
			Array.isArray(fromNull).should.be.true;
			fromNull.should.be.empty;

			var fromUndefined = makeArray(undefined);
			Array.isArray(fromUndefined).should.be.true;
			fromUndefined.should.be.empty;
		});

		it('should return obj if obj is an array', function() {
			var arr = [];

			makeArray(arr).should.equal(arr);
		});

		it('should wrap any other obj in an array', function() {

			var str = 'string';
			var arrStr = makeArray(str);
			Array.isArray(arrStr).should.be.true;
			arrStr[0].should.equal(str);

			var num = 1;
			var arrNum = makeArray(num);
			Array.isArray(arrNum).should.be.true;
			arrNum[0].should.equal(num);

			var obj = {};
			var arrObj = makeArray(obj);
			Array.isArray(arrObj).should.be.true;
			arrObj[0].should.equal(obj);

			var func = function() { };
			var arrFunc = makeArray(func);
			Array.isArray(arrFunc).should.be.true;
			arrFunc[0].should.equal(func);
		});
	});

});
