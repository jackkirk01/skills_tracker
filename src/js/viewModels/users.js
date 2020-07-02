/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your user ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/UserFactory',
        'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource'],
 function(oj, ko, $, UserFactory) {
  
    function UserViewModel() {
      
      var self = this;

      self.apiLoaded = ko.observable(false);

      self.userDatasource = ko.observable();

      self.userCollection = UserFactory.createUserCollection();

      self.userDatasource(new oj.CollectionDataGridDataSource(
        self.userCollection,
        {
          rowHeader: 'userId', 
          columns: [
            'firstName',
            'surname',
            'skillsAdded',
            'skills'
          ]
        }
      ));

      self.getCellTemplate = function(cellContext) {

        if (cellContext.keys.column === "skills") {
          
          cellContext.user = self.userCollection.at(cellContext.indexes.row).attributes;

        }

        return oj.KnockoutTemplateUtils.getRenderer('cellTemplate')(cellContext);

      };

      self.onUserSkillButton = function(user) {
        
        // Open CC with user data - Using a CC so can use in My Skills section also
        oj.Logger.error(user);
        alert("Opened User Skills - Check Console");

      };

      self.getCellClassName = function(cellContext) {

        var key = cellContext.keys.column;

        if (key === "skills" || key === "skillsAdded") {
          return "oj-helper-justify-content-center";
        } else {
          return "oj-helper-justify-content-flex-start";
        }

      };

      self.isEmptyInverted = function(param) {
        // Return is inverted due to being used by disabled
        if (param && param.length > 0) {
          return false;
        }

        return true;

      };

      self.connected = function(info) {
        
        self.apiLoaded(false);

        var chartContainer = document.getElementById("pictoContainer");
        busyContext = oj.Context.getContext(chartContainer).getBusyContext();
        resolve = busyContext.addBusyState({"description": "Loading User API Data"});

        self.userCollection.fetch({
          success: function(collection, response, options) {
            
            resolve();

            busyContext.whenReady().then(function() {
              self.apiLoaded(true);
            });

          }
        });

      };

    }
    return new UserViewModel();
  }
);
