/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojrouter', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'factories/UserFactory', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojinputtext','ojs/ojformlayout'],
  function(ko, moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, Router, ArrayDataProvider, KnockoutTemplateUtils, UserFactory) {
     function ControllerViewModel() {
        var self = this;

        self.KnockoutTemplateUtils = KnockoutTemplateUtils;

        self.loggedIn = ko.observable(false);

        // Handle announcements sent when pages change, for Accessibility.
        self.manner = ko.observable('polite');
        self.message = ko.observable();
        document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

        function announcementHandler(event) {
          setTimeout(function() {
            self.message(event.detail.message);
            self.manner(event.detail.manner);
          }, 200);
        };

      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

       // Router setup
       self.router = Router.rootInstance;
       self.router.configure({
         'dashboard': {label:'Dashboard', isDefault: true},
         'skills': {label: 'Skills'},
         'users': {label: 'Users'},
         'test': {label: 'Test'},
         'skillsSelection': {label: 'Select Skills'},
         'customers': {label: 'Customers'},
         'incidents': {label: 'Incidents'},
       });
      Router.defaults['urlAdapter'] = new Router.urlParamAdapter();

      self.loadModule = function () {
        self.moduleConfig = ko.pureComputed(function () {
          var name = self.router.moduleConfig.name();
          var viewPath = 'views/' + name + '.html';
          var modelPath = 'viewModels/' + name;
          return moduleUtils.createConfig({ viewPath: viewPath,
            viewModelPath: modelPath, params: { parentRouter: self.router } });
        });
      };

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("Capgemini - Skills tracker");
      // Current user
      self.user = ko.observable()
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("Jack Kirk");

      self.navData = ko.observableArray([
        {name: 'Dashboard', id: 'dashboard',
         iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
        {name: 'Skills Manager', id: 'skills',
         iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'},
        {name: 'Users', id: 'users',
         iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'},
        {name: 'My Skills', id: 'skillsSelection',
         iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
        ]);

      self.navDataProvider = new ArrayDataProvider(self.navData(), {keyAttributes: 'id'});

      self.signIn = function () {

        if (self.userLogin().toUpperCase() === "JACK") {
          self.userLogin("Jack Kirk");
          // Navigation setup
          self.navData([
            {name: 'Dashboard', id: 'dashboard',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
            {name: 'Skills Manager', id: 'skills',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'},
            {name: 'Users', id: 'users',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'},
            {name: 'My Skills', id: 'skillsSelection',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
          ]);
        } else {
          
          self.userLogin("Chris Hollies");
          
          
          self.navData([
            {name: 'My Skills', id: 'skillsSelection',
            iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
          ]);
          self.router.configure({
            'dashboard': {label:'Dashboard'},
            'skills': {label: 'Skills'},
            'users': {label: 'Users'},
            'test': {label: 'Test'},
            'skillsSelection': {label: 'Select Skills', isDefault: true},
            'customers': {label: 'Customers'},
            'incidents': {label: 'Incidents'},
          });
        }
        self.navDataProvider = new ArrayDataProvider(self.navData(), {keyAttributes: 'id'});

        self.loggedIn(true);
      }

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Capgemini', 'aboutOracle', 'https://www.capgemini.com/our-company/'),
        new footerLink('Contact Us', 'contactUs', 'https://www.capgemini.com/contact-capgemini/'),
        new footerLink('Legal Notices', 'legalNotices', 'https://www.capgemini.com/legal-information-mentions-legales/'),
        new footerLink('Terms Of Use', 'termsOfUse', 'https://www.capgemini.com/terms-of-use/'),
        new footerLink('Privacy Policy', 'yourPrivacyRights', 'https://www.capgemini.com/privacy-policy/')
      ]);
     }

     return new ControllerViewModel();
  }
);
