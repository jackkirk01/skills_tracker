define(['ojs/ojcore'],
function (oj) {

  var UserFactory = {

      userUri: 'data/users.json',
      userByIdUri: 'data/user.json',
      
      createUserModel: function () {

          var User = oj.Model.extend({
              urlRoot: this.userByIdUri,
              parse: function(response) {
                
                return {
                    "userId": response.userId,
                    "firstName": response.firstName,
                    "surname": response.surname,
                    "fullName": response.firstName + " " + response.surname,
                    "skills": response.skills,
                    "lastUpdatedSkills": response.lastUpdatedSkills
                };

              },
              idAttribute: "userId"
          });

          return new User();

      },
      
      createUserCollection: function () {

          var Users = oj.Collection.extend({
              url: this.userUri, 
              model: this.createUserModel()
          });

          return new Users();

      }
      
  };

  return UserFactory;

});