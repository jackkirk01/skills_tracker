/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your user ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/UserFactory', 'ojs/ojcollectiondataprovider', 'ojs/ojarraydataprovider', 'ojs/ojlistdataproviderview', 'ojs/ojformlayout', 'ojs/ojinputtext',
        'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojtable', 'ojs/ojdialog', 'ojs/ojbutton'],
 function(oj, ko, $, UserFactory, CollectionDataProvider, ArrayDataProvider, ListDataProviderView) {
  
    function UserViewModel() {
      
      var self = this;

      self.filter = ko.observable();

      self.apiLoaded = ko.observable(false);

      // self.userDatasource = ko.observable();

      self.userCollection = UserFactory.createUserCollection();

      self.dialogTitle = ko.observable();
      self.selectedUser = ko.observable();
      self.selectedUserFirstName = ko.observable();
      self.selectedUserSurname = ko.observable();
      self.selectedUserId = ko.observable();
      self.selectedUserUpdatedDate = ko.observable();
      self.selectedUserSkills = ko.observableArray();

      self.userDatasource = ko.computed(function () {
        var filterRegEx = new RegExp(self.filter(), 'i');
        var filterCriterion = {
          op: '$or',
          criteria: [{ op: '$regex', value: { userId: filterRegEx } },
                    { op: '$regex', value: { fullName: filterRegEx } }]
        };
        arrayDataProvider = new CollectionDataProvider(self.userCollection, { keyAttributes: 'userId' });
        return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
      }, this);

      // self.userDatasource(new oj.CollectionDataGridDataSource(
      //   self.userCollection,
      //   {
      //     rowHeader: 'userId', 
      //     columns: [
      //       'firstName',
      //       'surname',
      //       'skillsAdded',
      //       'skills'
      //     ]
      //   }
      // ));

      self.dataProvider = ko.observable();
      self.dataProvider(new CollectionDataProvider(self.userCollection, { keyAttributes:'userId' }));
      self.userSkillsDataProvider = new ArrayDataProvider(self.selectedUserSkills);

      self.handleValueChanged = function () {
        self.filter(document.getElementById('filter').rawValue);
      }

      self.highlightingCellRenderer = function (context) {
        let field = null;
        if (context.columnIndex === 0) {
          field = 'userId';
        } else if (context.columnIndex === 1) {
          field = 'fullName';
        } 
        // else if (context.columnIndex === 2) {
        //   field = 'surname';
        // }
        let data = context.row[field].toString();
        const filterString = self.filter();
        if (filterString && filterString.length > 0) {
          const index = data.toLowerCase().indexOf(filterString.toLowerCase());
          if (index > -1) {
            const highlightedSegment = data.substr(index, filterString.length);
            data = data.substr(0, index) + '<b>' + highlightedSegment + '</b>' + data.substr(index + filterString.length, data.length - 1);
          }
        }
        context.cellContext.parentElement.innerHTML = data;
      }

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

      self.columnArray = 
      [{headerText: "ID",
        field: "userId",
        renderer: self.highlightingCellRenderer },
      {headerText: "Name",
        field: "fullName",
        renderer: self.highlightingCellRenderer },
      // {headerText: "First Name", 
      //   field: "firstName",
      //   headerClassName: "oj-sm-only-hide",
      //   className: "oj-sm-only-hide",
      //   resizable: "enabled",
      //   renderer: self.highlightingCellRenderer },
      //   {headerText: "Surname", 
      //   field: "surname",
      //   resizable: "enabled",
      //   renderer: self.highlightingCellRenderer },
      {headerText: "Skills Added Date", 
        field: "lastUpdatedSkills",
        headerClassName: "oj-sm-only-hide",
        className: "oj-sm-only-hide",
        resizable: "enabled"}];

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
