
define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojlistdataproviderview', 'factories/SkillFactory', 'ojs/ojknockout', 'ojs/ojlistviewdnd', 'ojs/ojtable', 'ojs/ojselectsingle', 'ojs/ojinputtext', 'ojs/ojbutton'],
  function (accUtils, ko, Bootstrap, ArrayDataProvider, ListDataProviderView,  SkillFactory) {

    function AboutViewModel() {
      var self = this;
      self.editRow = ko.observable();
      var proficiencies = [{ value: 'introductory', label: 'Introductory' },
        { value: 'progressing', label: 'progressing'},
        { value: 'proficient', label: 'Proficient' },
        { value: 'experienced', label: 'Experienced' },
        { value: 'expert', label: 'Expert' }];

      self.proficiencyOptions = new ArrayDataProvider(proficiencies, { keyAttributes: 'value' });

      self.filter = ko.observable();

      var skills = [{"id":"1","name":"JavaSE","type":"BaseLanguage","stream":["iPaas","ModernApps"],"priority":"High"},
      {"id":"2","name":"JavaEE","type":"WebLanguage","stream":["iPaas","ModernApps"],"priority":"High"},
      {"id":"3","name":"APIManagement","type":"Product","stream":["iPaas"],"priority":"High"},
      {"id":"4","name":"DataIntegration","type":"Unknown","stream":["iPaas"],"priority":"High"},
      {"id":"5","name":"OracleIntegrationCloudService","type":"Product","stream":["iPaas"],"priority":"High"}];

      var skills2 = [{"id":"6","name":"OracleRoboticProcessAutomation","type":"Product","stream":["iPaas"],"priority":"High"},
      {"id":"7","name":"Kafka","type":"Product","stream":["iPaas"],"priority":"High"},
      {"id":"8","name":"NodeJS","type":"Language","stream":["ModernApps"],"priority":"High"},
      {"id":"9","name":"Microservices","type":"WebServices","stream":["ModernApps"],"priority":"High"},
      {"id":"10","name":"OracleJET","type":"JavaScriptToolkit","stream":["ModernApps"],"priority":"High"},
      {"id":"11","name":"OracleApplicationContainerCloudService","type":"Product","stream":["ModernApps"],"priority":"High"},
      {"id":"12","name":"Blockchain","type":"Concept","stream":["ModernApps"],"priority":"Low"}];
      
      self.beforeRowEditListener = function (event) {
        var key = event.detail.rowContext.status.rowKey;
        self.tableDataProvider.fetchByKeys({keys: [key]}).then(function (fetchResult) {
          this.rowData = {};
          Object.assign(this.rowData, fetchResult.results.get(key).data);
        })
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
          deptArray.splice(detail.rowContext.status.rowIndex, 1, this.rowData);
          document.getElementById('rowDataDump').value = (JSON.stringify(this.rowData));
        }
      }

      self.tableSelection = [];
      self.tableArr = ko.observableArray(skills);
      // self.tableDataProvider = new ArrayDataProvider(self.tableArr, { keyAttributes: 'id' });

      self.tableDataProvider = ko.computed(function () {
        var filterRegEx = new RegExp(self.filter(), 'i');
        var filterCriterion = {
          op: '$or',
          criteria: [{ op: '$regex', value: { id: filterRegEx } },
          { op: '$regex', value: { name: filterRegEx } },
          { op: '$regex', value: { type: filterRegEx } },
          { op: '$regex', value: { priority: filterRegEx } }]
        };
        var arrayDataProvider = new ArrayDataProvider(self.tableArr, { keyAttributes: 'id' });
        return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
      }, this);

      self.tableHandleDrop = function (event, context) {
        var data;
        var i;

        event.preventDefault();

        data = event.dataTransfer.getData('application/ojlistviewitems+json');
        if (data != null) {
          data = JSON.parse(data);
          for (i = data.length - 1; i >= 0; i--) {
            skills.splice(context.rowIndex, 0, data[i]);
          }
          self.tableArr.valueHasMutated();
        }
      };

      // eslint-disable-next-line no-unused-vars
      self.tableHandleDragEnd = function (event, context) {
        if (event.dataTransfer.dropEffect !== 'none') {
          oj.Logger.error("hit1");
          for (var i = 0; i < self.tableSelection.length; i++) {
            var startkey = self.tableSelection[i].startKey.row;
            var start = -1;
            for (var j = 0; j < skills.length; j++) {
              if (skills[j].id === startkey) {
                start = j;
                break;
              }
            }
            skills.splice(start, 1);
          }

          self.tableArr.valueHasMutated();
        }
      };

      self.listviewSelection = [];
      self.listviewArr = ko.observableArray(skills2);
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

          oj.Logger.error("hit2");
          for (i = data.length - 1; i >= 0; i--) {
            skills2.splice(index, 0, data[i].data);
          }
        } else {
          // empty list case
          for (i = 0; i < data.length; i++) {
            skills2.push(data[i].data);
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
            for (j = 0; j < skills2.length; j++) {
              // remove the selected items from array
              if (skills2[j].id === self.listviewSelection[i]) {
                skills2.splice(j, 1);
                break;
              }
            }
          }

          self.listviewArr.valueHasMutated();
        }
      };

      self.handleValueChanged = function () {
        self.filter(document.getElementById('filter').rawValue);
      }

      self.clearClick = function (event) {
        self.filter('');
        return true;
      }

      self.highlightingCellRenderer = function (context) {
        var field = null;
        if (context.columnIndex === 0) {
          field = 'id';
        } else if (context.columnIndex === 1) {
          field = 'name';
        } else if (context.columnIndex === 2) {
          field = 'type';
        } else if (context.columnIndex === 3) {
          field = 'priority';
        }
        var data = context.row[field].toString();
        var filterString = self.filter();
        if (filterString && filterString.length > 0) {
          var index = data.toLowerCase().indexOf(filterString.toLowerCase());
          if (index > -1) {
            var highlightedSegment = data.substr(index, filterString.length);
            data = data.substr(0, index) + '<b>' + highlightedSegment + '</b>' + data.substr(index + filterString.length, data.length - 1);
          }
        }
        context.cellContext.parentElement.innerHTML = data;
      }

      self.columnArray = [{
        headerText: 'ID',
        renderer: self.highlightingCellRenderer
      },
      {
        headerText: 'Name',
        renderer: self.highlightingCellRenderer
      },
      {
        headerText: 'Type',
        renderer: self.highlightingCellRenderer
      },
      {
        headerText: 'Priority',
        renderer: self.highlightingCellRenderer
      }];
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
        accUtils.announce('About page loaded.');
        document.title = "About";
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
    return AboutViewModel;
  }
);
