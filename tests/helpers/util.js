
// check if running in node
if (typeof window === 'undefined') {
  require('chai').should();
}

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      var arr = [1, 2, 3];

      arr.indexOf(5).should.equal(-1);
      arr.indexOf(0).should.equal(-1);
    });
  });
});
