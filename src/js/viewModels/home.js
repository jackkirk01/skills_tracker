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
      self.mostUsedSkills = ko.observableArray();
      self.chartData = ko.observableArray();

      var skillArray = [];
      self.masterSkillArray = ko.observableArray();

      this.customConverter = {style: {color:'white'}, position: 'center', rendered: 'on', converter: new NumberConverter.IntlNumberConverter({ style: 'percent', pattern: '#,##%' }) };

      this.thresholdValues = [{ max: 33 }, { max: 67 }, {}];

      var busyContext;
      var resolve;

      self.skillModel = ko.observable();

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
              proficiency:"introductory",
              total:introductoryCount,
              group:self.skillModel().get("name")
            },
            {
              proficiency:"progressing",
              total:progressingCount,
              group:self.skillModel().get("name")
            },
            {
              proficiency:"proficient",
              total:proficientCount,
              group:self.skillModel().get("name")
            },
            {
              proficiency:"experienced",
              total:experiencedCount,
              group:self.skillModel().get("name")
            },
            {
              proficiency:"expert",
              total:expertCount,
              group:self.skillModel().get("name")
            }
          ]);
        }
      });
      
      // var chartData = [
      //   {
      //     "id": 0,
      //     "series": "Expert",
      //     "group": "Group A",
      //     "value": 42
      //   },
      //   {
      //     "id": 1,
      //     "series": "Experienced",
      //     "group": "Group A",
      //     "value": 55
      //   },
      //   {
      //     "id": 2,
      //     "series": "Proficient",
      //     "group": "Group A",
      //     "value": 36
      //   },
      //   {
      //     "id": 3,
      //     "series": "Progressing",
      //     "group": "Group A",
      //     "value": 22
      //   },
      //   {
      //     "id": 4,
      //     "series": "Introductory",
      //     "group": "Group A",
      //     "value": 22
      //   }
      // ];
      this.donutDataProvider = new ArrayDataProvider(self.chartData, {keyAttributes: 'id'});

      var browsers = [
        { value: 'IE', label: 'Java SE' },
        { value: 'FF', label: 'Oracle JET' },
        { value: 'CH', label: 'Kafka' },
        { value: 'OP', label: 'Oracle ACCS' },
        { value: 'SA', label: 'HTML5' }
      ];

      // self.skillsDP;

      

      var socialNetworks =   [
        {
          "id": "Java SE",
          // "14-17": 63.7,
          // "18-34": 83.2,
          // "35-54": 74.1,
          "total": 76.8,
          "url": "https://www.facebook.com"
        },
        {
          "id": "Oracle JET",
          "14-17": 81.9,
          "18-34": 77.6,
          "35-54": 54.2,
          "total": 66.4,
          "url": "https://www.youtube.com"
        },
        {
          "id": "Oracle database 12c",
          "14-17": 31,
          "18-34": 38.7,
          "35-54": 28.3,
          "total": 32.8,
          "url": "https://twitter.com"
        },
        {
          "id": "Blockchain",
          "14-17": 56.4,
          "18-34": 37.2,
          "35-54": 16,
          "total": 28.5,
          "url": "https://instagram.com"
        },
        {
          "id": "Microservices",
          "14-17": 24.6,
          "18-34": 25,
          "35-54": 20,
          "total": 22.7,
          "url": "https://plus.google.com"
        },
        {
          "id": "Kafka",
          "14-17": 1.5,
          "18-34": 15.9,
          "35-54": 20,
          "total": 16.6,
          "url": "https://www.linkedin.com"
        },
        {
          "id": "Oracle identity cloud",
          "14-17": 36.8,
          "18-34": 21.1,
          "35-54": 4.2,
          "total": 14.2,
          "url": "https://www.snapchat.com"
        },
        {
          "id": "Node JS",
          "14-17": 23.8,
          "18-34": 15.6,
          "35-54": 5.7,
          "total": 11.5,
          "url": "https://www.tumblr.com"
        },
        {
          "id": "Oracle API platform",
          "14-17": 31.8,
          "18-34": 15.5,
          "35-54": 3.5,
          "total": 11.1,
          "url": "https://vine.co"
        },
        {
          "id": "Oracle Developer CS",
          "14-17": 8,
          "18-34": 9.8,
          "35-54": 4,
          "total": 6.8,
          "url": "https://www.whatsapp.com"
        },
        {
          "id": "Robotic process automation",
          "14-17": 8,
          "18-34": 8.5,
          "35-54": 3.9,
          "total": 6.2,
          "url": "https://www.reddit.com"
        },
        {
          "id": "Oracle ACCS",
          "14-17": 3.6,
          "18-34": 3.9,
          "35-54": 6.9,
          "total": 5.4,
          "url": "https://www.flickr.com"
        },
        {
          "id": "Java EE",
          "14-17": 3.6,
          "18-34": 2,
          "35-54": 0.6,
          "total": 1.5,
          "url": "https://www.pintrest.com"
        }
      ]

      this.tagCloudDataProvider = new ArrayDataProvider(self.mostUsedSkills, {keyAttributes: 'id'})
      oj.Logger.error(self.mostUsedSkills);
      
      function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.total;
        const bandB = b.total;
      
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
      }

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
        self.mostUsedSkills.removeAll();
        self.usersWithHighPrioritySkills(0);
        skillArray = [];        
        self.skillList = SkillFactory.createSkillCollection();
        self.userCollection = UserFactory.createUserCollection();
        
        self.skillList.fetch({
          success: function(collection, response, options) {

            self.totalSkills(collection.size());

            for (var i = 0; i < collection.size(); i++) {
              
              var skill = collection.at(i);
              var tempObject = {
                "name": skill.get("name"),
                "priority": skill.get("priority"),
                // "stream": skill.get("stream"),
                "skilledUsers": []
              };
              skillArray[skill.get("name")] = self.masterSkillArray().length;
              self.masterSkillArray.push(tempObject);
              self.skillOptions.push({
                value:skill.get("name"),
                label:skill.get("name"),
                total: self.masterSkillArray().length
              });
              
            }
            self.skillsDP(new ArrayDataProvider(self.skillOptions()));

            // { value: 'IE', label: 'Java SE' },

            oj.Logger.error(self.skillsDP);
            
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
                oj.Logger.error(self.masterSkillArray());

                self.masterSkillArray().forEach(skill => {
                  self.mostUsedSkills.push({
                    name: skill.name,
                    total: skill.skilledUsers.length
                  })
                })

                // oj.Logger.error(self.mostUsedSkills);

                // var i;
                // self.mostUsedSkills.sort(function (a, b) {
                //   oj.Logger.error(a);
                //   oj.Logger.error(b);
                //   return parseFloat(a.total) - parseFloat(b.total);
                // });
                // oj.Logger.error(self.mostUsedSkills);

              }
            });

          }
        });

      };
    }
    return new HomeViewModel();
  }
);
