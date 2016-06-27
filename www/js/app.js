var Emedics=angular.module('eMedics', ['ionic','formlyIonic', 'eMedicsMobile','modules.core', 'LocalStorageModule']);

Emedics.run(function($state,$rootScope,$log,$ionicPlatform) {
  $ionicPlatform.ready(function() {
    $rootScope.$state = $state;
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
});
//Emedics.directive('headerShrink', function($document) {
//  var fadeAmt;
//
//  var shrink = function(header, content, amt, max) {
//    amt = Math.min(44, amt);
//    fadeAmt = 1 - amt / 44;
//    ionic.requestAnimationFrame(function() {
//      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
//      for(var i = 0, j = header.children.length; i < j; i++) {
//        header.children[i].style.opacity = fadeAmt;
//      }
//    });
//  };
//
//  return {
//    restrict: 'A',
//    link: function($scope, $element, $attr) {
//      var starty = $scope.$eval($attr.headerShrink) || 0;
//      var shrinkAmt;
//
//      var header = $document[0].body.querySelector('.bar-header');
//      var headerHeight = header.offsetHeight;
//
//      $element.bind('scroll', function(e) {
//        var scrollTop = null;
//        if(e.detail){
//          scrollTop = e.detail.scrollTop;
//        }else if(e.target){
//          scrollTop = e.target.scrollTop;
//        }
//        if(scrollTop > starty){
//          // Start shrinking
//          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
//          shrink(header, $element[0], shrinkAmt, headerHeight);
//        } else {
//          shrink(header, $element[0], 0, headerHeight);
//        }
//      });
//    }
//  }
//});
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
          templateUrl: 'templates/tab-drafts.html',
          controller: 'draftsCtrl as vm'
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
