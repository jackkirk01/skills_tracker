/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your skills ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'factories/SkillFactory',
        'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource',
        'ojs/ojinputtext', 'ojs/ojselectcombobox'],

 function(oj, ko, $, SkillFactory) {

    function SkillsViewModel() {

      var self = this;

      self.dataSource = ko.observable();
      // Below are a subset of the ViewModel methods invoked by the ojModule binding
      // Please reference the ojModule jsDoc for additional available methods.

      self.skillCollection = SkillFactory.createSkillCollection();
      self.handleEditEnd = oj.DataCollectionEditUtils.basicHandleEditEnd;
      self.scrollPosValue = ko.observable({rowIndex:0});

      self.dataSource(new oj.CollectionDataGridDataSource(
        self.skillCollection,
        {
          rowHeader: 'id', 
          columns: [
            'name',
            'type',
            'iPaas',
            'ModernApps',
            'DevOps',
            'priority'
          ]
        }
      ));

      self.skillCollection.fetch();
      
      self.getCellTemplate = function(cellContext)
        {
            var mode;
            mode = cellContext['mode'];
            if (mode === 'edit')
            {
              oj.Logger.error(cellContext);
                return oj.KnockoutTemplateUtils.getRenderer('editCellTemplate')(cellContext);
            }
            else if (mode === 'navigation')
            {
                return oj.KnockoutTemplateUtils.getRenderer('cellTemplate')(cellContext);
            }
        };
    
      self.addSkill = function(cellContext) {

        self.skillCollection.add(SkillFactory.createSkillModel(), {at:0});

      };

      self.saveChanges = function(){

        for(var i = 0 ; self.skillCollection.length > i; i++) {
          if(self.skillCollection.models[i].id == null || self.skillCollection.models[i].id == "") {

          } else if (self.skillCollection.models[i].name == null || self.skillCollection.models[i].name == "") {

          } else if (self.skillCollection.models[i].type == null || self.skillCollection.models[i].type == "") {
            // "type": response.type,
            //         "iPaas": iPaas,
            //         "ModernApps": modernApps,
            //         "DevOps": devOps,
            //         "priority": response.priority
          } else if (self.skillCollection.models[i].iPaas == null || self.skillCollection.models[i].iPaas == "") {

          } else if (self.skillCollection.models[i].ModernApps == null || self.skillCollection.models[i].ModernApps == "") {

          } else if (self.skillCollection.models[i].DevOps == null || self.skillCollection.models[i].DevOps == "") {

          } else if (self.skillCollection.models[i].priority == null || self.skillCollection.models[i].priority == "") {

          }
        }

      }

      self.getColumnWidth = function (columnContext) {

        var key = columnContext['key'];

        if (key === "ModernApps" || key === "iPaas" || key === "DevOps" || key === "priority") {
            return 'width:100px';
        } else if (key === "type") {
            return 'width:200px';
        } else if (key === "name") {
            return 'width:375px';
        } else {
            return 'width:125px';
        }

    }

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
      self.handleActivated = function(info) {
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
      self.handleAttached = function(info) {
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
      self.handleBindingsApplied = function(info) {
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
      self.handleDetached = function(info) {
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
