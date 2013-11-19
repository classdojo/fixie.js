var protoclass = require("protoclass"),
sift           = require("sift"),
toarray        = require("toarray"),
type           = require("type-component"),
comerr         = require("comerr");


function FixieCommand (name, fixtures) {

  this._name     = name;

  //reverse since we're starting from the end on exec
  this._fixtures = toarray(fixtures).reverse().map(function(fixture) {

    // if match exists, then turn it into a testing function
    if(fixture.match) fixture.match = sift(fixture.match);

    // if data exists, then 
    if(fixture.data) {

      // explicitly only one item, or check if the type is not an array
      if(fixture.one == null) fixture.one = type(fixture.data) != "array";

      // convert into an array - easier to work with if the data type 
      // is always the same
      fixture.data = toarray(fixture.data);
    }

    return fixture;
  });
}

/**
 */

protoclass(FixieCommand, {

  /**
   */

  execute: function (query, next) {


    // run through all possibilities, and find the ONE 
    // fixture that matches with the query given
    for(var i = this._fixtures.length; i--;) {
      var fixture = this._fixtures[i];
      if(this._execute(fixture, query, next)) return;
    }

    // otherwise send a 404 error
    return next(comerr.notFound("No fixtures found"));
  },

  /**
   * executes one fixture
   */

  _execute: function (fixture, query, next) {

    // make sure that there's a match, otherwise don't continue
    if(!this._matches(fixture, query)) return false;

    // manual handle
    if(fixture.handle) {
      fixture.handle(query, next);
    }

    // return an error
    else if(fixture.error) {
      next(fixture.error);
    }

    else if(fixture.data) {


      // match specified? return everything, otherwise match against the data
      var matches = fixture.match ? fixture.data : this._matchData(fixture, query);

      // only one should return? 
      if(fixture.one) {
        next(null, matches[0]);
      } else {
        next(null, matches);
      }
    } else {
      next(comerr.invalid("The fixture is invalid"));
    }

    return true;
  },

  /**
   * matches the fixture against the query options
   */

  _matches: function(fixture, query) {


    // explicit match? test against it
    if(fixture.match) {
      return fixture.match.test(query);

    // otherwise test against the data
    } else if(fixture.data) {
      return !!this._matchData(fixture, query).length;
    }

    return false;
  },

  /**
   * loops through 
   */

  _matchData: function (fixture, query) {

    if(!fixture.data) return [];

    var sifter = sift(query), data, matches = [];
    for(var i = fixture.data.length; i--;) {
      if(sifter.test(data = fixture.data[i])) {
        matches.push(data);
      }
    }

    return matches;
  }
});

module.exports = FixieCommand;