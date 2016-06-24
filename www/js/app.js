// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var Emedics=angular.module('eMedics', ['ionic', 'eMedicsMobile']);

Emedics.run(function($rootScope,$log,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      var jState = JSON.stringify(toState);
      var jParams = JSON.stringify(toParams);
      $log.error('Cannot change state %s with params %s:\n%s', jState, jParams, error.stack || error);
    });
    $rootScope.$on('$stateNotFound', function (event, toState, fromState) {
      $log.error('$stateNotFound', toState.to, ' from ', fromState.name);
    });
  });
})

Emedics.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
      controller:'dashboardCtrl as vm'
  })

  // Each tab has its own nav history stack:

  .state('tab.tasks', {
    url: '/tasks',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-tasks.html',
        controller: 'tasksCtrl as vm'
      }
    }
  })

  .state('tab.references', {
      url: '/references',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-references.html',
          controller: 'referencesCtrl as vm'
        }
      }
    })
    .state('tab.notifications', {
      url: '/notifications',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-notifications.html',
          controller: 'notificationsCtrl as vm'
        }
      }
    })

  .state('tab.catalog', {
    url: '/catalog',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-catalog.html',
        controller: 'catalogCtrl as vm'
      }
    }
  })
    .state('tab.drafts', {
      url: '/drafts',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-catalog.html',
          controller: 'catalogCtrl as vm'
        }
      }
    })
    .state('tab.patients', {
      url: '/patients',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-patients.html',
          controller: 'patientsCtrl as vm'
        }
      }
    })
    .state('tab.stuff', {
      url: '/stuff',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-stuff.html',
          controller: 'stuffCtrl as vm'
        }
      }
    });

  $urlRouterProvider.otherwise('/tab/tasks');

});
