/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojconverter-number', 'ojs/ojconverter-datetime', 'ojs/ojconverterutils-i18n', 'ojs/ojvalidator-numberrange', 'ojs/ojdatacollection-utils', 'ojs/ojknockout', 'ojs/ojinputtext',
  'ojs/ojdatetimepicker', 'ojs/ojselectcombobox', 'ojs/ojcheckboxset', 'ojs/ojtable'],
  function (accUtils, ko, Bootstrap, ArrayDataProvider, NumberConverter, DateTimeConverter, ConverterUtils, NumberRangeValidator, DataCollectionEditUtils) {

    function DashboardViewModel() {
      var self = this;

      var deptArray = [
          {
            "id": "1",
            "name": "Java SE",
            "type": "Base Language",
            "stream": [
              "iPaas",
              "Modern Apps"
            ],
            "priority": "High"
          },
          {
            "id": "2",
            "name": "Java EE",
            "type": "Web Language",
            "stream": [
              "iPaas",
              "Modern Apps"
            ],
            "priority": "High"
          },
          {
            "id": "3",
            "name": "API Management",
            "type": "Product",
            "stream": [
              "iPaas"
            ],
            "priority": "High"
          },
          {
            "id": "4",
            "name": "Data Integration",
            "type": "Unknown",
            "stream": [
              "iPaas"
            ],
            "priority": "High"
          },
          {
            "id": "5",
            "name": "Oracle Integration Cloud Service",
            "type": "Product",
            "stream": [
              "iPaas"
            ],
            "priority": "High"
          },
          {
            "id": "6",
            "name": "Oracle Robotic Process Automation",
            "type": "Product",
            "stream": [
              "iPaas"
            ],
            "priority": "High"
          },
          {
            "id": "7",
            "name": "Kafka",
            "type": "Product",
            "stream": [
              "iPaas"
            ],
            "priority": "High"
          },
          {
            "id": "8",
            "name": "Node JS",
            "type": "Language",
            "stream": [
              "Modern Apps"
            ],
            "priority": "High"
          },
          {
            "id": "9",
            "name": "Microservices",
            "type": "Web Services",
            "stream": [
              "Modern Apps"
            ],
            "priority": "High"
          },
          {
            "id": "10",
            "name": "Oracle JET",
            "type": "JavaScript Toolkit",
            "stream": [
              "Modern Apps"
            ],
            "priority": "High"
          },
          {
            "id": "11",
            "name": "Oracle Application Container Cloud Service",
            "type": "Product",
            "stream": [
              "Modern Apps"
            ],
            "priority": "High"
          },
          {
            "id": "12",
            "name": "Blockchain",
            "type": "Concept",
            "stream": [
              "Modern Apps"
            ],
            "priority": "Low"
          }
        ];
      self.deptObservableArray = ko.observableArray(deptArray);
      self.dataprovider = new ArrayDataProvider(self.deptObservableArray, { keyAttributes: 'id' });

      // // NUMBER AND DATE CONVERTER ////
      self.numberConverter = new NumberConverter.IntlNumberConverter();
      self.dateConverter = new DateTimeConverter.IntlDateTimeConverter({ year: '2-digit', month: '2-digit', day: '2-digit' });

      var rangeValidator = new NumberRangeValidator({ min: 100, max: 500 });
      self.validators = [rangeValidator];

      self.editRow = ko.observable();

      self.beforeRowEditListener = function (event) {
        var key = event.detail.rowContext.status.rowKey;
        self.dataprovider.fetchByKeys({ keys: [key] }).then(function (fetchResult) {
          self.rowData = {};
          Object.assign(self.rowData, fetchResult.results.get(key).data);
        }.bind(this));
      }

      self.beforeRowEditEndListener = function (event) {
        // the DataCollectionEditUtils.basicHandleRowEditEnd is a utility method
        // which will handle validation of editable components and also handle
        // canceling the edit
        var detail = event.detail;
        if (detail.cancelEdit == true) {
          return;
        }
        if (DataCollectionEditUtils.basicHandleRowEditEnd(event, detail) === false) {
          event.preventDefault();
        } else {
          deptArray.splice(detail.rowContext.status.rowIndex, 1, self.rowData);
          // document.getElementById('rowDataDump').value = (JSON.stringify(self.rowData));
        }
      }

      self.handleUpdate = function (event, context) {
        self.editRow({ rowKey: context.key });
      }

      // eslint-disable-next-line no-unused-vars
      self.handleDone = function (event, context) {
        self.editRow({ rowKey: null });
      }
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
        accUtils.announce('Dashboard page loaded.');
        document.title = "Dashboard";
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
    return DashboardViewModel;
  }
);
