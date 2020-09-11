/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your skills ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/SkillFactory', 'ojs/ojcollectiondataprovider', 'ojs/ojdatacollection-utils',
  'ojs/ojlistdataproviderview', 'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource',
  'ojs/ojinputtext', 'ojs/ojselectcombobox', 'ojs/ojtable', 'ojs/ojvalidationgroup'],

  function (oj, ko, $, SkillFactory, CollectionDataProvider, DataCollectionEditUtils, ListDataProviderView) {

    function SkillsViewModel() {

      var self = this;

      self.filter = ko.observable();

      self.skillCollection = ko.observable(SkillFactory.createSkillCollection());

      self.dataprovider = new CollectionDataProvider(self.skillCollection(), { keyAttributes: 'skillId'});
      self.dataproviderView = new ListDataProviderView(self.dataprovider, {sortCriteria: [{ attribute: 'skillId', direction: 'descending' }]});

      self.editRow = ko.observable();

      self.inputName = ko.observable();
      self.inputType = ko.observable();
      self.inputPriority = ko.observable();

      self.beforeRowEditListener = function (event) {
        var key = event.detail.rowContext.status.rowKey;
        self.dataprovider.fetchByKeys({ keys: [key] }).then(function (fetchResult) {
          self.rowData = {};
          Object.assign(self.rowData, fetchResult.results.get(key).data);
        })
      }

      self.beforeRowEditEndListener = function (event) {
        var detail = event.detail;

        if (detail.cancelEdit == true) {
          return;
        }
        if (DataCollectionEditUtils.basicHandleRowEditEnd(event, detail) === false) {
          event.preventDefault();
        } else {
          // self.skillCollection().set([self.rowData]);
          self.skillCollection().get(self.rowData.skillId).save(self.rowData);
        }
      }

      self.handleUpdate = function (event, context) {
        
        if(!context.key) {
          self.editRow({ rowKey: null, rowIndex: 0});

        }

        self.editRow({ rowKey: context.key });
      }

      // eslint-disable-next-line no-unused-vars
      self.handleDone = function (event, context) {
        self.editRow({ rowKey: null });
      }

      self.addSkill = function() {

        var validationGroup = document.getElementById('validationGroup');

        if(validationGroup.valid.includes("invalid")) {
          validationGroup.showMessages();
        } else {

          self.skillCollection().create({name:self.inputName(), type:self.inputType(), priority:self.inputPriority()}, {at:0});

          self.inputName("");
          self.inputType("");
          // self.skillCollection().refresh();
        }
      };

      /**
     * Optional ViewModel method invoked when this ViewModel is about to be
     * used for the View transition.  The application can put data fetch logic
     * here that can return a Promise which will delay the handleAttached function
     * call below until the Promise is resolved.
     * @param {Object} info - An object with the following key-value pairs:
     * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
     * @param {Function} info.valueAccessor - The binding's value accessor.
     * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
     * the promise is resolved
     */
      self.handleActivated = function (info) {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
       */
      self.handleAttached = function (info) {
        // Implement if needed
      };


      /**
       * Optional ViewModel method invoked after the bindings are applied on this View. 
       * If the current View is retrieved from cache, the bindings will not be re-applied
       * and this callback will not be invoked.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       */
      self.handleBindingsApplied = function (info) {
        // Implement if needed
      };

      /*
       * Optional ViewModel method invoked after the View is removed from the
       * document DOM.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
       */
      self.handleDetached = function (info) {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new SkillsViewModel();
  }
);
