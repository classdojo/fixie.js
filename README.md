
```javascript
var fixie = require("fixie");

var fixtures = {
  register: [
    {
      match: { email: {$in: ["t1@classdjo.com"] },
      error: new Error("that's a teacher account")
    }
  ],
  loadProfile: [
    {
      data: {
        _id: "profile1"
    }
  ],
  loadClasses: {
    data: [
      {
        _id: "class1",
        profile: "profile1"
      },
      {
        _id: "class2",
        profile: "profile1"
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