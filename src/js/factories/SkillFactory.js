define(['ojs/ojcore'],
function (oj) {

  var SkillFactory = {

    //   skillUri: 'data/skills.json',
    //   skillUri: 'http://140.238.89.200:8080/skills-tracker/v1/skills/',
    //   skillUri: 'https://private-532dfa-skillstracker.apiary-mock.com/skills-tracker/v1/skills/',
      skillUri: 'http://140.238.89.200:8080/skills-tracker/v1/skills',
      skillsInUseUri: 'data/skillsInUse.json',
      skillByIdUri: 'data/skill.json',
      
      createSkillModel: function () {

          var Skill = oj.Model.extend({
              urlRoot: this.skillUri, 
              parse: function(response) {

            //     var iPaas = "N";
            //     var modernApps = "N";
            //     var devOps = "N";

            //     // if (response.stream.indexOf("iPaas") >= 0) {
            //     //     iPaas = "Y";    
            //     // }

            //     // if (response.stream.indexOf("Modern Apps") >= 0) {
            //     //     modernApps = "Y";   
            //     // }

            //     // if (response.stream.indexOf("DevOps") >= 0) {
            //     //     devOps = "Y";   
            //     // }

                return {
                    "skillId": response.skillId,
                    "name": response.name,
                    "type": response.type,
                    // "iPaas": iPaas,
                    // "ModernApps": modernApps,
                    // "DevOps": devOps,
                    "priority": response.priority,
                    "users": response.users
                };

              },
              idAttribute: "skillId"
          });

          return new Skill();

      },
      
      createSkillCollection: function () {

          var Skills = oj.Collection.extend({
              url: this.skillUri, 
              model: this.createSkillModel(),
              idAttribute: "skillId"
          });

          return new Skills();

      },

      createSkillsInUseModel: function () {

        var Skill = oj.Model.extend({
            urlRoot: this.skillsInUseUri,
            idAttribute: "skillId"
        });

        return new Skill();

      },
    
      createSkillsInUseCollection: function () {

          var Skills = oj.Collection.extend({
              url: this.skillsInUseUri, 
              model: this.createSkillsInUseModel()
          });

          return new Skills();

      }
      
  };

  return SkillFactory;

});