var Emedics=angular.module('eMedics', ['ionic','eMedicsMobile','public.core',
  'core.medics','formlyIonic', 'LocalStorageModule','pascalprecht.translate'
  ]);


Emedics.config(function(  $stateProvider, $urlRouterProvider, formlyConfigProvider, $httpProvider,
                         localStorageServiceProvider, $translateProvider) {
  $urlRouterProvider.otherwise('/login');

  formlyConfigProvider.setWrapper({
    name: 'validation',
    types: ['input'],
    templateUrl: 'error-messages.html'
  });


  // Interceptors
  //$httpProvider.interceptors.push('responseErrorInterceptor');
  //$httpProvider.interceptors.push('requestInterceptor');

  // Local storage Prefix
  localStorageServiceProvider.setPrefix('emed');

  // Translations
  $translateProvider.useStaticFilesLoader({
    prefix: 'i18n/translation_',
    suffix: '.json'
  });
});
Emedics.run(function($state,$rootScope,$log,$ionicPlatform, formlyConfig, formlyValidationMessages, checkUserAuth, constants, $translate) {


  $ionicPlatform.ready(function() {
    $rootScope.$state = $state;
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }



  });
  $rootScope.$on('$stateChangeError', function ($rootScope, $state, formlyConfig, formlyValidationMessages, checkUserAuth,$log,constants) {
    var jState = JSON.stringify(toState);
    var jParams = JSON.stringify(toParams);
    $log.error('Cannot change state %s with params %s:\n%s', jState, jParams, error.stack || error);
  });
  $rootScope.$on('$stateNotFound', function (event, toState, fromState) {
    $log.error('$stateNotFound', toState.to, ' from ', fromState.name);
  });

  $translate.use('en');

  formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
  formlyValidationMessages.addStringMessage('required', 'This field is required');

  //$rootScope.$on('$stateChangeStart', function(event, toState) { //toParams, fromParams
  //  if  ( (toState.name).indexOf('private')>-1 ) {
  //    checkUserAuth();
  //  }
  //
  //});

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
