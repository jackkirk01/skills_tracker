define(['ojs/ojcore'],
function (oj) {

  var UserFactory = {

      // userUri: 'data/users.json',
      userUri: 'http://132.145.61.54:8090/skills-tracker/v1/users',
    //   userByIdUri: 'data/user.json',
      userByIdUri: 'https://private-532dfa-skillstracker.apiary-mock.com/skills-tracker/v1/Users',
      
      createUserModel: function (userId) {

          var User = oj.Model.extend({
              urlRoot: this.userUri,
              parse: function(response) {
                
                return {
                    "userId": response.userId,
                    "firstName": response.firstName,
                    "surname": response.surname,
                    "fullName": response.firstName + " " + response.surname,
                    "skills": response.skills,
                    "lastUpdatedSkills": response.lastUpdatedSkills,
                    "role": response.role
                };

              },
              parseSave: function(model) {
                // var fullName = model.fullName;
                // var firstName = fullName.substring(0, fullName.indexOf(" "));
                // var surname = fullName.substring(fullName.indexOf(" ") + 1, fullName.length);

                return {
                  "userId": model.userId,
                  "firstName": model.firstName,
                  "surname": model.surname,
                  "skills": model.skills,
                  "lastUpdatedSkills": model.lastUpdatedSkills,
                  "role": model.role
                }
              },
              idAttribute: "userId"
          });

          return new User();

      },
      
      createUserCollection: function () {

          var Users = oj.Collection.extend({
              url: this.userUri, 
              model: this.createUserModel(),
              idAttribute:"userId"
          });

          return new Users();

      }
      
  };

  return UserFactory;

});