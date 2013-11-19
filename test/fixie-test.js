var fixie = require(".."),
expect    = require("expect.js"),
type      = require("type-component");

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

  /**
   */

  it("sends a 404 error", function (next) {
    fixie({
      load: {
        _id: "not-found"
      }
    }).load({ _id: "found?"}, function (err) {
      expect(err.code).to.be("404");
      next()
    });
  });

  /**
   */

  it("sends a 602 error", function (next) {
    fixie({
      load: {
        match: { _id: "1" }
      }
    }).load({ _id: "1" }, function (err) {
      expect(err.code).to.be("602");
      next()
    });
  });

  /**
   */

  it("can send a custom error", function (next) {
    fixie({
      load: {
        match: { _id: "1" },
        error: new Error("danger!")
      }
    }).load({ _id: "1" }, function (err) {
      expect(err.message).to.be("danger!");
      next();
    })
  })


  /**
   */

  it("can match against a query", function (next) {
    fixie({
      load: {
        match: { _id: { $in: ["1", "2"] } },
        data: {
          message: "hello-world"
        }
      }
    }).load({ _id: "1" }, function (err, data) {
      expect(data.message).to.be("hello-world");
      next()
    })
  });

  /**
   */

  it("returns all data if match is specified", function (next) {
    fixie({
      getNextPage: {
        match: { page: 1},
        data: [1, 2, 3, 4]
      }
    }).getNextPage({ page: 1}, function (err, data) {
      expect(data).not.to.be(undefined);
      next()
    })
  });

  /**
   */

  it("can return only one item implicitly", function () {
    fixie({
      load: {
        data: {
          name: "craig"
        }
      }
    }).load({ name: "craig" }, function(err, data) {
      expect(type(data)).to.be("object");
    })
  });

  /**
   */

  it("can return only one item explicitly", function () {
    fixie({
      load: {
        one: true,
        data: [{
          name: "craig"
        }]
      }
    }).load({ name: "craig" }, function(err, data) {
      expect(type(data)).to.be("object");
    })
  });

  /**
   */

  it("can return many items implicitly", function () {
    fixie({
      load: {
        data: [{
          name: "craig"
        }]
      }
    }).load({ name: "craig" }, function(err, data) {
      expect(type(data)).to.be("array");
    })
  });

  /**
   */

  it("can return many items explicitly", function () {
    fixie({
      load: {
        one: false,
        data: {
          name: "craig"
        }
      }
    }).load({ name: "craig" }, function(err, data) {
      expect(type(data)).to.be("array");
    })
  });

  /**
   */

  it("can manually handle a request", function () {
    fixie({
      load: {
        match: { name: "craig" },
        handle: function(query, next) {
          next(null, { message: "hello!" });
        }
      }
    }).load({ name: "craig" }, function (err, data) {
      expect(data.message).to.be("hello!");
    });
  });
  // handle

});