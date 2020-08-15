/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your user ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/UserFactory', 'ojs/ojcollectiondataprovider', 'ojs/ojarraydataprovider', 'ojs/ojformlayout', 'ojs/ojinputtext',
        'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojtable', 'ojs/ojdialog', 'ojs/ojbutton'],
 function(oj, ko, $, UserFactory, CollectionDataProvider, ArrayDataProvider) {
  
    function UserViewModel() {
      
      var self = this;

      self.apiLoaded = ko.observable(false);

      self.userDatasource = ko.observable();

      self.userCollection = UserFactory.createUserCollection();

      self.dialogTitle = ko.observable();
      self.selectedUser = ko.observable();
      self.selectedUserFirstName = ko.observable();
      self.selectedUserSurname = ko.observable();
      self.selectedUserId = ko.observable();
      self.selectedUserUpdatedDate = ko.observable();
      self.selectedUserSkills = ko.observableArray();

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

      self.dataProvider = ko.observable();
      self.dataProvider(new CollectionDataProvider(self.userCollection, { keyAttributes:'userId' }));
      self.userSkillsDataProvider = new ArrayDataProvider(self.selectedUserSkills);

      self.getCellTemplate = function(cellContext) {

        if (cellContext.keys.column === "skills") {
          
          cellContext.user = self.userCollection.at(cellContext.indexes.row).attributes;

        }

        return oj.KnockoutTemplateUtils.getRenderer('cellTemplate')(cellContext);

      };

      self.userSelectionListener = function (event) {
        var selectedUserModel = self.userCollection.get(event.detail.value.row.values().values().next().value);
        self.selectedUser(selectedUserModel.attributes);
        self.dialogTitle(self.selectedUser().userId + " - " + self.selectedUser().firstName + " " + self.selectedUser().surname)
        self.selectedUserFirstName(self.selectedUser().firstName)
        self.selectedUserSurname(self.selectedUser().surname)
        self.selectedUserId(self.selectedUser().userId);
        self.selectedUserUpdatedDate(self.selectedUser().lastUpdatedSkills);
        self.selectedUserSkills(self.selectedUser().skills);

        oj.Logger.error(self.selectedUserSkills());
        document.getElementById('modalDialog1').open();
      }

      self.createUserListener = function() {
        document.getElementById('createUserDialog').open();
      }

      self.saveUserListener = function() {
        var newUser = UserFactory.createUserModel();
        newUser.set('firstName', self.selectedUserFirstName());
        newUser.set('surname', self.selectedUserSurname());
        newUser.save();
      }

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
