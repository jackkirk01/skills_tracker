/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/SkillFactory', 'ojs/ojcollectiondataprovider', 'ojs/ojarraydataprovider', 'ojs/ojlistdataproviderview', 'ojs/ojdatacollection-utils', 'ojs/ojinputtext',
  'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojtable', 'ojs/ojdialog', 'ojs/ojbutton', 'ojs/ojdatetimepicker', 'ojs/ojselectcombobox', 'ojs/ojcheckboxset', 'ojs/ojtable'],
  function (oj, ko, $, SkillFactory, CollectionDataProvider, ArrayDataProvider, ListDataProviderView, DataCollectionEditUtils) {

    function IncidentsViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      self.filter = ko.observable();

      self.skillCollection = ko.observable(SkillFactory.createSkillCollection());
      
      self.dataprovider = new CollectionDataProvider(self.skillCollection(), { keyAttributes: 'id' });

      self.editRow = ko.observable();

      self.beforeRowEditListener = function (event) {
        var key = event.detail.rowContext.status.rowKey;
        self.dataprovider.fetchByKeys({ keys: [key] }).then(function (fetchResult) {
          self.rowData = {};
          oj.Logger.error(fetchResult.results.get(key).data);
          Object.assign(self.rowData, fetchResult.results.get(key).data);
        })
      }

      self.beforeRowEditEndListener = function (event) {
        var detail = event.detail;

        oj.Logger.error(event);
        if (detail.cancelEdit == true) {
          return;
        }
        if (DataCollectionEditUtils.basicHandleRowEditEnd(event, detail) === false) {
          event.preventDefault();
        } else {
          oj.Logger.error(self.rowData);
          oj.Logger.error(self.skillCollection().get(self.rowData.id));
          self.skillCollection().get(self.rowData.id).save();
        }
      }

      self.handleUpdate = function (event, context) {
        self.editRow({ rowKey: context.key });
      }

      // eslint-disable-next-line no-unused-vars
      self.handleDone = function (event, context) {
        self.editRow({ rowKey: null });
      }

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        // accUtils.announce('Incidents page loaded.');
        document.title = "Incidents";
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
    return IncidentsViewModel;
  }
);
