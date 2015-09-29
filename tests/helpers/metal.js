
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

});
