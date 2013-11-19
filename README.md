Fixie makes it easy to setup fixtures for that act as a drop-in replacement for
functions. It's used specifically used to fake commands in [https://github.com/classdojo/mojo.js](mojo.js). 



### Fixture Syntax

```bash
  - method - the method name
    - match (optional) - match against the query
    - error (optional) - error to return for the given match
    - data (obj/fn) (optional) - data to return
    - handle (fn) - manually handle respnse
    - one (bool) - only return one item
```

### Example


```javascript
var fixie = require("fixie");

var commands = fixie({
  
  /**
   */

  registerUser: [
    {
      match: { username: "taken" },
      error: new Error("that username is already taken")
    },
    {
      match: { username: "free" },
      data: {
        _id: "user1",
        username: "free"
      }
    }
  ],

  /**
   */

  loadFriends: {
    data: [
      {
        _id: "friend1",
        user: "user1",
      },
      {
        _id: "friend2",
        user: "user1"
      }
    ]
  },

  /**
   */

  forgotUsername: {
    handle: function (query, next) {

      if(query.username != "existing") {
        return next(new Error("username not found"));
      }

      return next();
    }
  }
});


commands.registerUser({ username: "free" }, function (err, user) {
    
    // loaded free user
    commands.loadFriends({ user: user._id }, function (err, friends) {
      //loaded friends 1, and 2
    });
});
```