Fixie makes it easy to setup fixtures for that act as a drop-in replacement for
functions. It's used specifically used to fake commands in [https://github.com/classdojo/mojo.js](mojo.js). 

### Example:


```javascript
var fixie = require("fixie");

var fixtures = {
  loadUser: [
    {
      data: {
        _id: "user1"
    }
  ],
  loadClasses: {
    data: [
      {
        _id: "class1",
        user: "user1"
      },
      {
        _id: "class2",
        user: "user1"
      }
    ]
  },
  loadStudents: {
    data: [
      {
        _id: "student1",
        "class": "class1"
      }
    ]
  }
};

var fix = fixie(fixtures);

fix.loadProfile({ _id: profile1 }, function (err, profile) {
  fix.loadClasses({ profile: profile._id }, function (err, classes) {
    // do stuff with fixtures
  });
});
```


### Fixture Syntax

```
  - method - the method name
    - match (optional) - match against the query
    - error (optional) - error to return for the given match
    - data (obj/fn) (optional) - data to return
    
```