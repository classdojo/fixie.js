var protoclass = require("protoclass"),
sift           = require("sift"),
toarray        = require("toarray"),
type           = require("type-component"),
comerr         = require("comerr");


/*

{
  match: 
}

*/



function FixieCommand (name, fixtures) {

  this._name     = name;

  //reverse since we're starting from the end on exec
  this._fixtures = toarray(fixtures).reverse().map(function(fixture) {

    //fix it up
    if(fixture.match) fixture.match = sift(fixture.match);

    if(fixture.data) {
      fixture.one = type(fixture.data) != "array";
      fixture.data = toarray(fixture.data);
    }

    return fixture;
  });

}

protoclass(FixieCommand, {

  /**
   */

  execute: function (options, next) {

    for(var i = this._fixtures.length; i--;) {
      var fixture = this._fixtures[i];
      if(this._execute(fixture, options, next)) return;
    }

    return next(comerr.notFound("No fixtures found"));
  },

  /**
   */

  _execute: function (fixture, options, next) {


    if(!this._matches(fixture, options)) return false;

    // manual handle
    if(fixture.handle) {
      fixture.handle(options, next);
      return true;
    }

    // return an error
    if(fixture.error) {
      next(fixture.error);
      return true;
    }

    if(fixture.data) {
      var matches = this._matchData(fixture, options);


      if(fixture.one) {
        next(null, matches[0]);
      } else {
        next(null, matches);
      }
      return true;
    }

    return false;
  },

  /**
   */

  _matches: function(fixture, options) {

    if(fixture.match) {
      return fixture.match.test(options);
    } else if(fixture.data) {
      return !!this._matchData(fixture, options).length;
    }

    return false;
  },


  /**
   */

  _matchData: function (fixture, options) {

    if(!fixture.data) return [];

    var sifter = sift(options), data, matches = [];
    for(var i = fixture.data.length; i--;) {
      if(sifter.test(data = fixture.data[i])) {
        matches.push(data);
      }
    }

    return matches;
  }
});

module.exports = FixieCommand;