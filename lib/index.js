var protoclass = require("protoclass"),
FixieCommand   = require("./command");

/**
 */

function Fixie (methods) {
  this._fixtures(methods);
}

/**
 */

protoclass(Fixie, {

  /**
   */

  _fixtures: function (methods) {
    for(var method in methods) {
      this._addMethod(method, methods[method]);
    }
  },

  /**
   */

  _addMethod: function (method, fixtures) {

    // defer all logic to a new class, but bind the execution method to this
    // object
    var cmd = new FixieCommand(method, fixtures);

    this[method] = function(data, next) {
      cmd.execute.call(cmd, data, next);
    }
  }
});

/**
 */

module.exports = function(methods) {
  return new Fixie(methods);
};