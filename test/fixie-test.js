var fixie = require(".."),
expect    = require("expect.js");

describe("fixie#", function () {

  /**
   */

  it("can create a fixie", function () {

    var f = fixie({
      load: {

      },
      load2: {

      }
    });

    expect(f.load).not.to.be(undefined);
    expect(f.load2).not.to.be(undefined);
  });

  /**
   */

  it("can setup basic fixture data", function (next) {
    var u, f = fixie({
      loadUser: {
        data: u = {
          _id: "user1"
        }
      }
    });

    f.loadUser({ _id: "user1" }, function(err, user) {
      expect(user).to.be(u);
      next()
    })
  });

});