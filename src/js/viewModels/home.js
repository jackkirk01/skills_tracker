/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your home ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/UserFactory', 'factories/SkillFactory',
        'ojs/ojknockout', 'ojs/ojpictochart', 'ojs/ojmodel'],
 function(oj, ko, $, UserFactory, SkillFactory) {
  
    function HomeViewModel() {

      var self = this;

      self.apiLoaded = ko.observable(false);

      self.skillsCollection = null;
      self.userCollection = null;

      var skillArray = [];
      self.masterSkillArray = ko.observableArray();

      var busyContext;
      var resolve;

      self.tooltipFunction = function(dataContext) {
        return {'insert':dataContext.name};
      };
      
      self.loadSkillData = function(skilledUsersArray) {

        
        var set = [];
        
        for (var i = 0; i < skilledUsersArray.length; i++) {
          
          set.push({
            name: skilledUsersArray[i],
            shape: 'human',
            color: '#60D683'
            // color: '#68C182'
            // color: '#FFD700'
          });
          
        }

        set.push({
          name: '',
          shape: 'human',
          color: '#C0C0C0',
          count: self.userCollection.size() - skilledUsersArray.length
        });

        return set;

      };

      self.loadSkillPercent = function(skilledUsersArray) {

        return Math.round((100 / self.userCollection.size()) * skilledUsersArray.length) + "%";

      };

      self.connected = function(info) {

        self.apiLoaded(false);

        var chartContainer = document.getElementById("pictoContainer");
        busyContext = oj.Context.getContext(chartContainer).getBusyContext();
        resolve = busyContext.addBusyState({"description": "Loading API Data"});
        self.masterSkillArray.removeAll();
        skillArray = [];
        
        self.skillList = SkillFactory.createSkillCollection();
        self.userCollection = UserFactory.createUserCollection();

        self.skillList.fetch({
          success: function(collection, response, options) {
            
            for (var i = 0; i < collection.size(); i++) {
              
              var skill = collection.at(i);
              var tempObject = {
                "name": skill.get("name"),
                "priority": skill.get("priority"),
                "stream": skill.get("stream"),
                "skilledUsers": []
              };
              
              skillArray[skill.get("name")] = self.masterSkillArray().length;
              self.masterSkillArray.push(tempObject);
              
            }

            self.userCollection.fetch({
              success: function(collection, response, options) {

                for (var j = 0; j < collection.size(); j++) {

                  var user = collection.at(j);
                  var userSkills = user.get("skills");

                  if (userSkills) {

                    for (var k = 0; k < userSkills.length; k++) {

                      var skillIndex = skillArray[userSkills[k]];
                      var specificSkill = self.masterSkillArray()[skillIndex];
                      specificSkill.skilledUsers[specificSkill.skilledUsers.length] = (user.get("firstName") + " " + user.get("lastName"));

                    }

                  }

                }

                resolve();

                busyContext.whenReady().then(function() {
                  self.apiLoaded(true);
                });

              }
            });

          }
        });

      };
    }
    return new HomeViewModel();
  }
);
