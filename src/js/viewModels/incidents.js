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

      var deptArray = [
        {
           id:"1",
           name:"Java SE",
           type:"Base Language",
           priority:"High",
           users:[
              {
                 userId:"1",
                 firstName:"Alex",
                 surname:"Aidoo-Micah",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"3",
                 firstName:"Guy",
                 surname:"Barnes",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"11",
                 firstName:"Emma",
                 surname:"Halliday",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"13",
                 firstName:"Jack",
                 surname:"Kirk",
                 proficiency:"EXPERT"
              },
              {
                 userId:"21",
                 firstName:"James",
                 surname:"Neate",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"23",
                 firstName:"Sander",
                 surname:"Rensen",
                 proficiency:"EXPERT"
              }
           ]
        },
        {
           id:"2",
           name:"Java EE",
           type:"Web Language",
           priority:"Medium",
           users:[
              {
                 userId:"5",
                 firstName:"Ben",
                 surname:"Burbage",
                 proficiency:"EXPERT"
              },
              {
                 userId:"6",
                 firstName:"David",
                 surname:"Carter",
                 proficiency:"EXPERT"
              },
              {
                 userId:"7",
                 firstName:"Vickie",
                 surname:"Challis",
                 proficiency:"PROFICIENT"
              },
              {
                 userId:"8",
                 firstName:"Nicola",
                 surname:"D'Orazio",
                 proficiency:"PROFICIENT"
              },
              {
                 userId:"9",
                 firstName:"Yury",
                 surname:"Fjodorovs",
                 proficiency:"PROFICIENT"
              },
              {
                 userId:"10",
                 firstName:"Jonathan",
                 surname:"Guppy",
                 proficiency:"PROGRESSING"
              },
              {
                 userId:"11",
                 firstName:"Emma",
                 surname:"Halliday",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"15",
                 firstName:"Romesh",
                 surname:"Lokuge",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"16",
                 firstName:"Sam",
                 surname:"Longton",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"17",
                 firstName:"Adrian",
                 surname:"Lowe",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"18",
                 firstName:"Ramesh",
                 surname:"Madhavan",
                 proficiency:"EXPERT"
              },
              {
                 userId:"19",
                 firstName:"Paul",
                 surname:"Martin",
                 proficiency:"PROGRESSING"
              },
              {
                 userId:"20",
                 firstName:"Bipin",
                 surname:"Mistry",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"21",
                 firstName:"James",
                 surname:"Neate",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"25",
                 firstName:"Phil",
                 surname:"Wilkins",
                 proficiency:"EXPERT"
              },
              {
                 userId:"26",
                 firstName:"Alex",
                 surname:"Cooper",
                 proficiency:"PROGRESSING"
              },
              {
                 userId:"27",
                 firstName:"Arjun",
                 surname:"Deo",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"28",
                 firstName:"Amy",
                 surname:"Grange",
                 proficiency:"PROGRESSING"
              }
           ]
        },
        {
           id:"3",
           name:"API Management",
           type:"Product",
           priority:"Medium",
           users:[
              {
                 userId:"1",
                 firstName:"Alex",
                 surname:"Aidoo-Micah",
                 proficiency:"EXPERT"
              },
              {
                 userId:"2",
                 firstName:"Mohamed",
                 surname:"Bara",
                 proficiency:"EXPERT"
              },
              {
                 userId:"12",
                 firstName:"Chris",
                 surname:"Hollies",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"22",
                 firstName:"Ramnik",
                 surname:"Pattni",
                 proficiency:"PROGRESSING"
              }
           ]
        },
        {
           id:"4",
           name:"Data Integration",
           type:"Unknown",
           priority:"Medium",
           users:[
  
           ]
        },
        {
           id:"5",
           name:"Oracle Integration Cloud Service",
           type:"Product",
           priority:"Low",
           users:[
              {
                 userId:"5",
                 firstName:"Ben",
                 surname:"Burbage",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"6",
                 firstName:"David",
                 surname:"Carter",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"7",
                 firstName:"Vickie",
                 surname:"Challis",
                 proficiency:"EXPERT"
              },
              {
                 userId:"9",
                 firstName:"Yury",
                 surname:"Fjodorovs",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"10",
                 firstName:"Jonathan",
                 surname:"Guppy",
                 proficiency:"PROGRESSING"
              },
              {
                 userId:"15",
                 firstName:"Romesh",
                 surname:"Lokuge",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"16",
                 firstName:"Sam",
                 surname:"Longton",
                 proficiency:"PROGRESSING"
              },
              {
                 userId:"17",
                 firstName:"Adrian",
                 surname:"Lowe",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"18",
                 firstName:"Ramesh",
                 surname:"Madhavan",
                 proficiency:"EXPERT"
              },
              {
                 userId:"19",
                 firstName:"Paul",
                 surname:"Martin",
                 proficiency:"EXPERT"
              },
              {
                 userId:"20",
                 firstName:"Bipin",
                 surname:"Mistry",
                 proficiency:"EXPERT"
              },
              {
                 userId:"25",
                 firstName:"Phil",
                 surname:"Wilkins",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"26",
                 firstName:"Alex",
                 surname:"Cooper",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"27",
                 firstName:"Arjun",
                 surname:"Deo",
                 proficiency:"EXPERT"
              },
              {
                 userId:"28",
                 firstName:"Amy",
                 surname:"Grange",
                 proficiency:"INTRODUCTORY"
              }
           ]
        },
        {
           id:"6",
           name:"Oracle Robotic Process Automation",
           type:"Product",
           priority:"Low",
           users:[
              {
                 userId:"4",
                 firstName:"Andy",
                 surname:"Bell",
                 proficiency:"PROFICIENT"
              },
              {
                 userId:"14",
                 firstName:"Richard",
                 surname:"Lanchbury",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"24",
                 firstName:"Luis",
                 surname:"Weir",
                 proficiency:"EXPERT"
              }
           ]
        },
        {
           id:"7",
           name:"Kafka",
           type:"Product",
           priority:"Low",
           users:[
              {
                 userId:"4",
                 firstName:"Andy",
                 surname:"Bell",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"14",
                 firstName:"Richard",
                 surname:"Lanchbury",
                 proficiency:"INTRODUCTORY"
              },
              {
                 userId:"24",
                 firstName:"Luis",
                 surname:"Weir",
                 proficiency:"INTRODUCTORY"
              }
           ]
        },
        {
           id:"8",
           name:"Node JS",
           type:"Language",
           priority:"High",
           users:[
  
           ]
        },
        {
           id:"9",
           name:"Microservices",
           type:"Web Services",
           priority:"High",
           users:[
              {
                 userId:"3",
                 firstName:"Guy",
                 surname:"Barnes",
                 proficiency:"PROGRESSING"
              },
              {
                 userId:"13",
                 firstName:"Jack",
                 surname:"Kirk",
                 proficiency:"PROGRESSING"
              },
              {
                 userId:"23",
                 firstName:"Sander",
                 surname:"Rensen",
                 proficiency:"PROGRESSING"
              }
           ]
        },
        {
           id:"10",
           name:"Oracle JET",
           type:"JavaScript Toolkit",
           priority:"High",
           users:[
              {
                 userId:"1",
                 firstName:"Alex",
                 surname:"Aidoo-Micah",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"2",
                 firstName:"Mohamed",
                 surname:"Bara",
                 proficiency:"EXPERIENCED"
              },
              {
                 userId:"12",
                 firstName:"Chris",
                 surname:"Hollies",
                 proficiency:"EXPERT"
              },
              {
                 userId:"22",
                 firstName:"Ramnik",
                 surname:"Pattni",
                 proficiency:"PROFICIENT"
              }
           ]
        },
        {
           id:"11",
           name:"Oracle Application Container Cloud Service",
           type:"Product",
           priority:"High",
           users:[
  
           ]
        },
        {
           id:"12",
           name:"Blockchain",
           type:"Concept",
           priority:"Low",
           users:[
  
           ]
        }
     ];

      // var deptArray = [{ DepartmentId: 1001, DepartmentName: 'ADFPM 1001 neverending', LocationId: 200, Type: 'Finance', Currency: 'USD', Date: ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date(2013, 0, 1)), Primary: ['checked'] },
      // { DepartmentId: 556, DepartmentName: 'BB', LocationId: 200, Type: 'Sales', Currency: 'JPY', Date: ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date(2014, 0, 1)), Primary: [] },
      // { DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200, Type: 'HR', Currency: 'EUR', Date: ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date(2011, 0, 1)), Primary: ['checked'] },
      // { DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200, Type: 'Sales', Currency: 'USD', Date: ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date(2010, 0, 1)), Primary: [] }];
      self.deptObservableArray = ko.observableArray(deptArray);

      self.skillCollection = ko.observable(SkillFactory.createSkillCollection());
      
      self.dataprovider = new CollectionDataProvider(self.skillCollection(), { keyAttributes: 'id' });
      // self.dataprovider = new ArrayDataProvider(self.deptObservableArray, { keyAttributes: 'id' });

      // // NUMBER AND DATE CONVERTER ////

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
        // the DataCollectionEditUtils.basicHandleRowEditEnd is a utility method
        // which will handle validation of editable components and also handle
        // canceling the edit
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
          // self.skillCollection().set(model);
          // oj.Logger.error(self.skillCollection().get(self.rowData.id));
          // self.skillCollection().set(self.rowDate);
          
          // deptArray.splice(detail.rowContext.status.rowIndex, 1, self.rowData);
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
