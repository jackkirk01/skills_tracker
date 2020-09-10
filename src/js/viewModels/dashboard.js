/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/UserFactory', 'factories/SkillFactory', 'ojs/ojarraydataprovider', 'ojs/ojconverter-number', 'text!../data/skills.json', 'text!../data/users.json', 'ojs/ojtagcloud',
  'ojs/ojknockout', 'ojs/ojpictochart', 'ojs/ojmodel', 'ojs/ojgauge', 'ojs/ojlabel', 'ojs/ojchart', 'ojs/ojselectsingle', 'ojs/ojlegend'],
  function (oj, ko, $, UserFactory, SkillFactory, ArrayDataProvider, NumberConverter, skillsJson, usersJson) {

    function DashboardViewModel() {

      var self = this;

      self.apiLoaded = ko.observable(false);

      self.skillList = ko.observable(SkillFactory.createSkillCollection());
      self.userCollection = null;
      self.totalUsers = ko.observable(0);
      self.totalSkills = ko.observable();
      self.tagCloudDataProvider = ko.observable();
      self.usersWithHighPrioritySkills = ko.observable(0);
      this.highPrioritySkillPercentage = ko.computed(function () {
        if (self.usersWithHighPrioritySkills() == 0 && self.totalUsers() == 0) {
          return 0;
        } else {
          return self.usersWithHighPrioritySkills() / self.totalUsers() * 100
        }
      }, this);
      self.totalUsersUpdatedRecently = ko.observable(0);
      this.recentlyUpdatedSkillsPercentage = ko.computed(function () {
        if (self.totalUsersUpdatedRecently() == 0 && self.totalUsers() == 0) {
          return 0;
        } else {
          return (self.totalUsersUpdatedRecently() / self.totalUsers() * 100).toFixed(2)
        }
      }, this);
      self.skillOptions = ko.observableArray();
      self.skillSelectorDP = ko.observable();
      self.skillSelectorValue = ko.observable(2);
      self.mostUsedSkills = ko.observableArray();
      self.chartData = ko.observableArray();
      self.pieChartLabel = ko.observable();

      self.masterSkillArray = ko.observableArray();
      self.highPrioritySkills = [];
      self.mediumPrioritySkills = [];
      self.lowPrioritySkills = [];

      self.tagCloudLegend = [{
        text: "High",
        color: "rgb(237, 102, 71)",
      },
      {
        text: "Medium",
        color: "rgb(250, 213, 92)",
      },
      {
        text: "Low",
        color: "rgb(104, 193, 130)",
      }
      ]
      self.legendDP = new ArrayDataProvider(self.tagCloudLegend, { keyAttributes: 'text' });


      this.customConverter = { style: { color: 'white' }, position: 'center', rendered: 'on', converter: new NumberConverter.IntlNumberConverter({ style: 'percent', pattern: '#,##%' }) };

      this.thresholdValues = [{ max: 33 }, { max: 67 }, {}];

      var busyContext;
      var resolve;

      self.skillModel = ko.observable();

      self.skillSelectorChanged = function (event) {

        var selectedSkill = { value: 2, label: "Java SE", total: 15 };

        if (event) {
          selectedSkill = self.skillOptions().find(skill => skill.value === parseInt(event.detail.value));

        }

        self.pieChartLabel(selectedSkill.label);

        self.skillModel(self.skillList().get(selectedSkill.value));

        var introductoryCount = 0;
        var progressingCount = 0;
        var proficientCount = 0;
        var experiencedCount = 0;
        var expertCount = 0;

        if (self.skillModel().get("users") != []) {
          self.skillModel().get("users").forEach(user => {
            switch (user.proficiency) {
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
        }

        self.chartData([
          {
            proficiency: "Introductory",
            total: introductoryCount,
            group: self.skillModel().get("name")
          },
          {
            proficiency: "Progressing",
            total: progressingCount,
            group: self.skillModel().get("name")
          },
          {
            proficiency: "Proficient",
            total: proficientCount,
            group: self.skillModel().get("name")
          },
          {
            proficiency: "Experienced",
            total: experiencedCount,
            group: self.skillModel().get("name")
          },
          {
            proficiency: "Expert",
            total: expertCount,
            group: self.skillModel().get("name")
          }
        ]);

      }

      this.donutDataProvider = new ArrayDataProvider(self.chartData, { keyAttributes: 'id' });

      self.tagCloudDataProvider(new ArrayDataProvider(self.mostUsedSkills, { keyAttributes: 'name' }));

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

      self.tooltipFunction = function (dataContext) {
        return { 'insert': dataContext.name };
      };

      self.loadSkillData = function (skill) {


        var skilledUsersArray = skill.get('users');

        var set = [];

        for (var i = 0; i < skilledUsersArray.length; i++) {

          var color = "#C0C0C0";

          switch (skilledUsersArray[i].proficiency) {
            case 'INTRODUCTORY':
              color = 'rgb(35, 123, 177)'
              ordering = 5;
              break;
            case 'PROGRESSING':
              color = 'rgb(104, 193, 130)'
              ordering = 4;
              break;
            case 'PROFICIENT':
              color = 'rgb(250, 213, 92)'
              ordering = 3;
              break;
            case 'EXPERIENCED':
              color = 'rgb(237, 102, 71)'
              ordering = 2;
              break;
            case 'EXPERT':
              color = 'rgb(133, 97, 200)'
              ordering = 1;
              break;
          }

          set.push({
            name: skilledUsersArray[i].firstName + " " + skilledUsersArray[i].surname + ": " + skilledUsersArray[i].proficiency,
            shape: 'human',
            color: color,
            order: ordering
          });

        }

        set.push({
          name: '',
          shape: 'human',
          color: 'rgb(192, 192, 192)',
          count: self.userCollection.size() - skilledUsersArray.length
        });

        return set.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));

      };

      self.loadSkillPercent = function (skilledUsersArray) {

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

      self.connected = function (info) {

        self.apiLoaded(false);

        var chartContainer = document.getElementById("pictoContainer");
        busyContext = oj.Context.getContext(chartContainer).getBusyContext();
        resolve = busyContext.addBusyState({ "description": "Loading API Data" });
        self.masterSkillArray.removeAll();
        self.mostUsedSkills([]);
        self.usersWithHighPrioritySkills(0);
        skillArray = [];
        self.skillList(SkillFactory.createSkillCollection());
        self.userCollection = UserFactory.createUserCollection();

        // -------------------------------------------------
        // code used to call API endpoint to create test data
        // -------------------------------------------------
        // var jsonArray = JSON.parse(skillsJson).skills;

        // for(i in jsonArray) {
        //   jsonArray[i].priority = jsonArray[i].priority.toUpperCase();
        //   oj.Logger.error(jsonArray[i]);
        //   self.skillList().create(jsonArray[i]);
        // }

        // var jsonArray = JSON.parse(usersJson).users;

        // for(i in jsonArray) {
        //   jsonArray[i].role = "USER";
        //   oj.Logger.error(self.userCollection);
        //   self.userCollection.save(jsonArray[i]);
        // }

        // -------------------------------------------------
        // code used to call API endpoint to create test data
        // -------------------------------------------------

        self.skillList().fetch({
          success: function (collection, response, options) {

            self.totalSkills(collection.size());

            collection.each(skill => self.skillOptions.push({
              value: skill.get("skillId"),
              label: skill.get("name"),
              total: collection.size()
            })
            );

            self.skillSelectorDP(new ArrayDataProvider(self.skillOptions(), { keyAttributes: 'value' }));

            self.highPrioritySkills = self.skillList().models.filter(skill => skill.get("priority").toUpperCase() === 'HIGH');
            self.mediumPrioritySkills = self.skillList().models.filter(skill => skill.get("priority").toUpperCase() === 'MEDIUM');
            self.lowPrioritySkills = self.skillList().models.filter(skill => skill.get("priority").toUpperCase() === 'LOW');

            self.skillList().models.sort(function (a, b) {
              if (a.get('users').length > b.get('users').length) {
                return -1;
              } else if (a.get('users').length == b.get('users').length) {
                return 0;
              } else {
                return 1;
              }
            }).slice(0, 10).forEach(skill => {

              var color;

              switch (skill.get('priority').toUpperCase()) {
                case 'HIGH':
                  color = 'rgb(237, 102, 71)'
                  break;
                case 'MEDIUM':
                  color = 'rgb(250, 213, 92)'
                  break;
                case 'LOW':
                  color = 'rgb(104, 193, 130)'
                  break;
              }

              self.mostUsedSkills.push({
                name: skill.get('name'),
                total: skill.get('users').length,
                color: color
              })
            });
            self.skillSelectorChanged();

          }
        });

        self.userCollection.fetch({
          success: function (collection, response, options) {
            // -------------------------------------------------
            // code used to call API endpoint to create test data
            // -------------------------------------------------

            // for(i in jsonArray) {
            //   jsonArray[i].role = "USER";

            //   for(j in jsonArray[i].skills) {
            //     jsonArray[i].skills[j].priority = jsonArray[i].skills[j].priority.toUpperCase();
            //   }

            //   oj.Logger.error(self.userCollection.get(i));
            //   // self.userCollection.save(jsonArray[i]);

            //   var model = self.userCollection.models[i];
            //   model.save(jsonArray[i]);
            // }

            // -------------------------------------------------
            // code used to call API endpoint to create test data
            // -------------------------------------------------

            self.totalUsers(self.userCollection.size());
            var sixMonthsAgoDate = new Date();
            sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);

            collection.each(user => {

              if (Date.parse(user.get("lastUpdatedSkills")) > sixMonthsAgoDate) {
                self.totalUsersUpdatedRecently(self.totalUsersUpdatedRecently() + 1);
              }

              var userSkills = user.get("skills");

              if (userSkills) {
                for (skill of userSkills) {
                  if (skill.priority.toUpperCase() === "HIGH") {
                    self.usersWithHighPrioritySkills(self.usersWithHighPrioritySkills() + 1)
                    break;
                  }

                }

              }
            })

            resolve();

            busyContext.whenReady().then(function () {
              self.apiLoaded(true);
            });

          }
        });

      };
    }
    return new DashboardViewModel();
  }
);
