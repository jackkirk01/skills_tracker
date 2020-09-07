/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojrouter', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojinputtext','ojs/ojformlayout'],
  function(ko, moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, Router, ArrayDataProvider, KnockoutTemplateUtils) {
     function ControllerViewModel() {
        var self = this;

        self.KnockoutTemplateUtils = KnockoutTemplateUtils;

        self.loggedIn = ko.observable(true);

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
      self.userLogin = ko.observable("");

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
          oj.Logger.error("hit");
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
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
     }

     return new ControllerViewModel();
  }
);
