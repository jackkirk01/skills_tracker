define(['ojs/ojcore'],
function (oj) {

  var UserFactory = {

      userUri: 'data/users.json',
      
      createUserModel: function () {

          var User = oj.Model.extend({
              urlRoot: this.userUri,
              parse: function(response) {

                var skillsAdded;

                if (response.skills && response.skills.length > 0) {
                    skillsAdded = "Y";
                } else {
                    skillsAdded = "N";
                }

                return {
                    "id": response.id,
                    "firstName": response.firstName,
                    "lastName": response.lastName,
                    "stream": response.stream,
                    "skills": response.skills,
                    "skillsAdded": skillsAdded
                };

              },
              idAttribute: "id"
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