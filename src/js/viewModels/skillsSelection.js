
define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojcollectiondataprovider', 'ojs/ojarraydataprovider', 'ojs/ojlistdataproviderview', 'factories/SkillFactory', 'factories/UserFactory', 'ojs/ojconverter-number', 'ojs/ojdatacollection-utils', 'ojs/ojknockout', 'ojs/ojlistviewdnd', 'ojs/ojtable', 'ojs/ojselectcombobox', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojselectsingle'],
  function (accUtils, ko, Bootstrap, CollectionDataProvider, ArrayDataProvider, ListDataProviderView, SkillFactory, UserFactory, NumberConverter, DataCollectionEditUtils) {

    function SkillsSelectionViewModel() {
      var self = this;
      self.editRow = ko.observable();
      var proficiencies = [{ value: 'introductory', label: 'Introductory' },
                          { value: 'progressing', label: 'progressing' },
                          { value: 'proficient', label: 'Proficient' },
                          { value: 'experienced', label: 'Experienced' },
                          { value: 'expert', label: 'Expert' }];

      self.proficiencyOptions = new ArrayDataProvider(proficiencies, { keyAttributes: 'value' });

      self.filter = ko.observable();

      self.tableSelection = [];

      self.listDataProviderView = ko.observable();
      self.skillsCollection = ko.observable()
      self.skillsCollection(SkillFactory.createSkillCollection());

      //---------------------------------------------------------------------------------------
      // WIP code for removing items from the all skills list if user already has those skills.
      //---------------------------------------------------------------------------------------

      self.skillsCollection().fetch({
        success: function (collection) {
          oj.Logger.error(collection.length);
          oj.Logger.error(collection.models[0]);
              
          UserFactory.createUserModel().fetch({
            success: function (model) {
  
              self.listviewArr(model.get('skills'));

              self.skillsCollection().remove(model.get('skills'));
  
              oj.Logger.error(self.skillsCollection().models);
            }
          })
  
          }
      })

      self.tableDataProvider = ko.computed(function () {
        var filterRegEx = new RegExp(self.filter(), 'i');
        var filterCriterion = {
          op: '$or',
          criteria: [{ op: '$regex', value: { id: filterRegEx } },
          { op: '$regex', value: { name: filterRegEx } },
          { op: '$regex', value: { type: filterRegEx } },
          { op: '$regex', value: { priority: filterRegEx } }]
        };

        arrayDataProvider = new CollectionDataProvider(self.skillsCollection(), { keyAttributes: 'id' });
        return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
      }, this);

      // // HANDLE DRAG AND DROP // //
      self.tableHandleDrop = function (event, context) {
        var data;
        var i;

        event.preventDefault();

        data = event.dataTransfer.getData('application/ojlistviewitems+json');
        if (data != null) {
          data = JSON.parse(data);
          for (i = data.length - 1; i >= 0; i--) {
            self.skillsCollection().add(data[i], {at:context.rowIndex});
          }
        }
      };

      self.tableHandleDragEnd = function (event, context) {
        if (event.dataTransfer.dropEffect !== 'none') {
          for (var i = 0; i < self.tableSelection.length; i++) {
            var startkey = self.tableSelection[i].startKey.row;
            var start = -1;
            for (var j = 0; j < self.skillsCollection().length; j++) {
              if (self.skillsCollection().models[j].id=== startkey) {
                start = j;
                self.skillsCollection().remove(self.skillsCollection().models[j])
                break;
              }
            }
          }
        }
      };

      self.listviewSelection = [];
      self.listviewArr = ko.observableArray();
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
            self.listviewArr().splice(index, 0, data[i].data);
          }
        } else {
          // empty list case
          for (i = 0; i < data.length; i++) {
            self.listviewArr().push(data[i].data);
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
            for (j = 0; j < self.listviewArr().length; j++) {
              // remove the selected items from array
              if (self.listviewArr()[j].id === self.listviewSelection[i]) {
                self.listviewArr().splice(j, 1);
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

      self.columnArray =
        [{
          field: 'id',
          headerText: "ID",
          headerClassName: "oj-helper-text-align-end",
          style: "min-width: 60px; max-width: 60px",
          className: "oj-helper-text-align-end oj-read-only"
        },
        {
          field: "name",
          headerText: "Name",
          headerStyle: "min-width: 15em; max-width: 15em; width: 15em",
          style: "min-width: 15em; max-width: 100%;",
          renderer: self.highlightingCellRenderer
        },
        {
          field: "type",
          headerText: "Type",
          headerStyle: "min-width: 12em; max-width: 12em; width: 12em",
          headerClassName: "oj-helper-text-align-end",
          style: "min-width: 12em; max-width: 12em; width: 12em",
          className: "oj-helper-text-align-end",
          renderer: self.highlightingCellRenderer
        },
        {
          field: "priority",
          headerText: "Priority",
          // headerStyle: "min-width: 10em; max-width: 10em; width: 10em",
          style: "min-width: 80px; max-width: 80px; width: 80px",
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
        document.title = "Skills Selection";
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
    return SkillsSelectionViewModel;
  }
);
