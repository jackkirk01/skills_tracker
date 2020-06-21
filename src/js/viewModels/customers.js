/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojcollectiondataprovider', 'factories/SkillFactory', 'ojs/ojknockout', 'ojs/ojlistviewdnd', 'ojs/ojtable'],
  function (accUtils, ko, Bootstrap, ArrayDataProvider, CollectionDataProvider, SkillFactory) {

    function CustomerViewModel() {

      var self = this;
      var tableDataArray = SkillFactory.createSkillCollection();
      // var tableDataArray = [{ id: 10, name: 'Dan Raphael', department: 'Research', salary: 150000, job: 'Director'},
      //                         { id: 11, name: 'David Young', department: 'Marketing', salary: 120000, job: 'Marketing Manager'},
      //                         { id: 12, name: 'Julia Chen', department: 'Marketing', salary: 120000, job: 'Marketing Manager'},
      //                         { id: 13, name: 'Jon Wu', department: 'Research', salary: 120000, job: 'Product Manager'},
      //                         { id: 14, name: 'Kelly Sullivan', department: 'Marketing', salary: 150000, job: 'Director'},
      //                         { id: 15, name: 'Laura Bissot', department: 'Accounts', salary: 80000, job: 'Accountant'},
      //                         { id: 16, name: 'Simon Austin', department: 'Research', salary: 100000, job: 'Developer'}];
      self.tableSelection = [];
      // self.tableArr = ko.observableArray(tableDataArray);
      self.tableDataProvider = ko.observable();
      self.tableDataProvider(new CollectionDataProvider(tableDataArray, { keyAttributes: 'id' }));

  
      self.tableHandleDrop = function (event, context) {
        var data;
        var i;
  
        event.preventDefault();
  
        data = event.dataTransfer.getData('application/ojlistviewitems+json');
        if (data != null) {
          data = JSON.parse(data);
          for (i = data.length - 1; i >= 0; i--) {
            // tableDataArray.splice(context.rowIndex, 0, data[i]);
            tableDataArray.add(data[i], {at:context.rowIndex});
          }
          self.tableArr.valueHasMutated();
        }
      };
  
      // eslint-disable-next-line no-unused-vars
      self.tableHandleDragEnd = function (event, context) {
        if (event.dataTransfer.dropEffect !== 'none') {
          for (var i = 0; i < self.tableSelection.length; i++) {
            var startkey = self.tableSelection[i].startKey.row;
            var start = -1;
            oj.Logger.error(startkey);
            for (var j = 0; j < tableDataArray.length; j++) {
              // oj.Logger.error(tableDataArray.models[j].id);
              if (tableDataArray.models[j].id === startkey) {
                start = j;
                tableDataArray.remove(tableDataArray.models[j]);
                break;
              }
            }
          }
  
          self.tableArr.valueHasMutated();
        }
      };
  
      var listviewDataArray = [{ id: 0, name: 'Amy Bartlet', department: 'Accounts', salary: 200000, job: 'Vice President' },
                                     { id: 1, name: 'Andy Jones', department: 'Accounts', salary: 150000, job: 'Director'},
                                     { id: 2, name: 'Andrew Bugsy', department: 'Research', salary: 100000, job: 'Individual Contributor'},
                                     { id: 3, name: 'Annett Barnes', department: 'Research', salary: 100000, job: 'Individual Contributor'},
                                     { id: 4, name: 'Bob Jones', department: 'Sales', salary: 75000, job: 'Salesman'},
                                     { id: 5, name: 'Bart Buckler', department: 'Accounts', salary: 75000, job: 'Purchasing'},
                                     { id: 6, name: 'Bobby Fisher', department: 'Research', salary: 100000, job: 'Individual Contributor'}];
  
      self.listviewSelection = [];
      self.listviewArr = ko.observableArray(listviewDataArray);
      self.listviewDataProvider = new ArrayDataProvider(self.listviewArr, { keyAttributes: 'id' });
  
      self.listviewHandleDrop = function (event, context) {
        var data;
        var index;
        var i;
        var itemContext;
  
        event.preventDefault();
  
        data = event.dataTransfer.getData('application/ojtablerows+json');
        data = JSON.parse(data);
  
        if (context.item) {
          itemContext = document.getElementById('listview').getContextByNode(context.item);
          index = itemContext.index;
          if (context.position === 'after') {
            index += 1;
          }
  
          for (i = data.length - 1; i >= 0; i--) {
            listviewDataArray.splice(index, 0, data[i].data);
          }
        } else {
                  // empty list case
          for (i = 0; i < data.length; i++) {
            listviewDataArray.push(data[i].data);
          }
        }
        self.listviewArr.valueHasMutated();
      };
  
      // eslint-disable-next-line no-unused-vars
      self.listviewHandleDragEnd = function (event, context) {
        var i;
        var j;
  
        if (event.dataTransfer.dropEffect !== 'none') {
          for (i = 0; i < self.listviewSelection.length; i++) {
            for (j = 0; j < listviewDataArray.length; j++) {
                          // remove the selected items from array
              if (listviewDataArray[j].id === self.listviewSelection[i]) {
                listviewDataArray.splice(j, 1);
                break;
              }
            }
          }
  
          self.listviewArr.valueHasMutated();
        }
      };

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        accUtils.announce('Customers page loaded.');
        document.title = "Customers";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return CustomerViewModel;
  }
);
