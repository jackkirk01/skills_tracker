/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your home ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/UserFactory', 'factories/SkillFactory', 'ojs/ojarraydataprovider', 'ojs/ojconverter-number', 'ojs/ojtagcloud',
        'ojs/ojknockout', 'ojs/ojpictochart', 'ojs/ojmodel', 'ojs/ojgauge', 'ojs/ojlabel', 'ojs/ojchart', 'ojs/ojselectsingle'],
 function(oj, ko, $, UserFactory, SkillFactory, ArrayDataProvider, NumberConverter) {
  
    function HomeViewModel() {

      var self = this;

      self.apiLoaded = ko.observable(false);

      self.skillsCollection = null;
      self.userCollection = null;
      self.totalUsers = ko.observable(0);
      self.totalSkills = ko.observable();
      self.tagCloudDataProvider = ko.observable();
      self.usersWithHighPrioritySkills = ko.observable(0);
      this.highPrioritySkillPercentage = ko.computed(function () {
        if(self.usersWithHighPrioritySkills() == 0 && self.totalUsers() == 0) {
          return 0;
        } else {
          return self.usersWithHighPrioritySkills()/self.totalUsers()*100
        }
      }, this);
      self.skillOptions = ko.observableArray();
      self.skillsDP = ko.observable();
      self.skillSelectorValue = ko.observable(1);
      self.mostUsedSkills = ko.observableArray();
      self.chartData = ko.observableArray();
      self.pieChartLabel = ko.observable();

      var skillArray = [];
      self.masterSkillArray = ko.observableArray();
      self.highPrioritySkills;
      self.mediumPrioritySkills;
      self.lowPrioritySkills;

      this.customConverter = {style: {color:'white'}, position: 'center', rendered: 'on', converter: new NumberConverter.IntlNumberConverter({ style: 'percent', pattern: '#,##%' }) };

      this.thresholdValues = [{ max: 33 }, { max: 67 }, {}];

      var busyContext;
      var resolve;

      self.skillModel = ko.observable();

      self.skillSelectorChanged = function (event) {

        self.pieChartLabel(self.skillOptions().find(skill => skill.value === event.detail.value).label);
        
        self.skillModel(SkillFactory.createSkillModel());

        self.skillModel().fetch({
          success: function(model, response, options) {

            var introductoryCount = 0;
            var progressingCount = 0;
            var proficientCount = 0;
            var experiencedCount = 0;
            var expertCount = 0;

            model.get("users").forEach(user => {
      
              switch(user.proficiency) {
                case "INTRODUCTORY":
                  introductoryCount++
                  break;
                case "PROGRESSING":
                  progressingCount++
                  break;
                case "PROFICIENT":
                  proficientCount++
                  break;
                case "EXPERIENCED":
                  experiencedCount++
                  break;
                case "EXPERT":
                  expertCount++
                  break;
              }
            })

            self.chartData([
              {
                proficiency:"Introductory",
                total:introductoryCount,
                group:self.skillModel().get("name")
              },
              {
                proficiency:"Progressing",
                total:progressingCount,
                group:self.skillModel().get("name")
              },
              {
                proficiency:"Proficient",
                total:proficientCount,
                group:self.skillModel().get("name")
              },
              {
                proficiency:"Experienced",
                total:experiencedCount,
                group:self.skillModel().get("name")
              },
              {
                proficiency:"Expert",
                total:expertCount,
                group:self.skillModel().get("name")
              }
            ]);
          }
        });
      }

      this.donutDataProvider = new ArrayDataProvider(self.chartData, {keyAttributes: 'id'});

      self.tagCloudDataProvider(new ArrayDataProvider(self.mostUsedSkills, {keyAttributes: 'name'}));
      
      function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.total;
        const bandB = b.total;
      
        let comparison = 0;
        if (bandA > bandB) {
          comparison = -1;
        } else if (bandA < bandB) {
          comparison = 1;
        }
        return comparison;
      }

      self.tooltipFunction = function(dataContext) {
        return {'insert':dataContext.name};
      };
      
      self.loadSkillData = function(skill) {

        var skilledUsersArray = skill.skilledUsers;
        
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

      this.getTooltip = function (context) {
        var tooltip;
        if (context.componentElement.id === 'gaugeWithReferenceLines')
          tooltip = 'Value: ' + context.label + '<br>Reference Lines: Low 33, Medium 67, High 100';
        else
          tooltip = 'Value: ' + context.label + '<br>Thresholds: Low 33, Medium 67, High 100';
        return { insert: tooltip };
      }

      self.connected = function(info) {

        self.apiLoaded(false);

        var chartContainer = document.getElementById("pictoContainer");
        busyContext = oj.Context.getContext(chartContainer).getBusyContext();
        resolve = busyContext.addBusyState({"description": "Loading API Data"});
        self.masterSkillArray.removeAll();
        self.mostUsedSkills([]);
        self.usersWithHighPrioritySkills(0);
        skillArray = [];        
        self.skillList = SkillFactory.createSkillCollection();
        self.userCollection = UserFactory.createUserCollection();
        
        self.skillList.fetch({
          success: function(collection, response, options) {

            self.totalSkills(collection.size());

            for (var i = 0; i < collection.size(); i++) {
              
              var skill = collection.at(i);
              oj.Logger.error(skill);
              var tempObject = {
                "name": skill.get("name"),
                "priority": skill.get("priority"),
                // "stream": skill.get("stream"),
                "skilledUsers": []
              };
              skillArray[skill.get("name")] = self.masterSkillArray().length;
              self.masterSkillArray.push(tempObject);
              
              self.skillOptions.push({
                value:skill.get("id"),
                label:skill.get("name"),
                total: self.masterSkillArray().length
              });
              
            }
            self.skillsDP(new ArrayDataProvider(self.skillOptions(), { keyAttributes: 'value' }));

            self.userCollection.fetch({
              success: function(collection, response, options) {
                self.totalUsers(self.userCollection.size());
                
                for (var j = 0; j < collection.size(); j++) {

                  var user = collection.at(j);
                  var userSkills = user.get("skills");

                  if (userSkills) {
                    for(var l = 0; l < userSkills.length; l++) {
                      if(userSkills[l].priority === "High") {
                        self.usersWithHighPrioritySkills(self.usersWithHighPrioritySkills() +1)
                        break;
                      }
                    }

                    for (var k = 0; k < userSkills.length; k++) {
                      var skillIndex = skillArray[userSkills[k].name];
                      var specificSkill = self.masterSkillArray()[skillIndex];
                      specificSkill.skilledUsers[specificSkill.skilledUsers.length] = (user.get("firstName") + " " + user.get("surname"));
                    }
                  }

                }

                resolve();

                busyContext.whenReady().then(function() { 
                  self.apiLoaded(true);
                });
                self.highPrioritySkills = self.masterSkillArray().filter(skill => skill.priority === 'High');
                self.mediumPrioritySkills = self.masterSkillArray().filter(skill => skill.priority === 'Medium');
                self.lowPrioritySkills = self.masterSkillArray().filter(skill => skill.priority === 'Low');

                self.masterSkillArray().sort(function(a, b) {
                  if (a.skilledUsers.length > b.skilledUsers.length) {
                    return -1;
                  } else if (a.skilledUsers.length == b.skilledUsers.length) {
                    return 0;
                  } else {
                    return 1;
                  }
                }).slice(0,10).forEach(skill => self.mostUsedSkills.push({
                  name: skill.name,
                  total: skill.skilledUsers.length
                }));

                self.skillSelectorValue("1");

              }
            });

          }
        });

      };
    }
    return new HomeViewModel();
  }
);
