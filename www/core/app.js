var Emedics=angular.module('emedics', ['ionic', 'ngCordova', 'core.dashboard','core.public',
  'core.medics','formlyIonic', 'LocalStorageModule','pascalprecht.translate','base64', 'pouchdb',
  'ion-autocomplete'
  ]);


Emedics.config(function(  $stateProvider, $urlRouterProvider, formlyConfigProvider, $httpProvider,
                         localStorageServiceProvider, $translateProvider, $ionicConfigProvider) {
  $urlRouterProvider.otherwise('/tab/tasks');

  //formlyConfigProvider.setWrapper({
  //  name: 'validation',
  //  types: ['input'],
  //  templateUrl: 'error-messages.html'
  //});


  // Interceptors
   $httpProvider.interceptors.push('responseErrorInterceptor');
  $httpProvider.interceptors.push('requestInterceptor');

  // Local storage Prefix
  localStorageServiceProvider.setPrefix('emed');

  // Translations
  $translateProvider.useStaticFilesLoader({
    prefix: 'i18n/translation_',
    suffix: '.json'
  });

  // ionic Config
  $ionicConfigProvider.backButton.text('').previousTitleText('').icon('ion-ios-arrow-back');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.scrolling.jsScrolling(false); // http://tombuyse.com/improving-the-performance-of-your-ionic-application/
  $ionicConfigProvider.views.maxCache(0);
});
Emedics.run(function($state,$rootScope,$log,$ionicPlatform,constants,$translate, formlyConfig,
                     formlyValidationMessages, checkUserAuth, $cordovaNetwork, offlineRepository,
                     $cordovaKeyboard, localStorageService) {

  $translate.use('en');

  $ionicPlatform.ready(function() {
    $cordovaKeyboard.hideAccessoryBar(true);
    $cordovaKeyboard.disableScroll(true);
    $rootScope.$state = $state;
    /*if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }*/
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (localStorageService.get('userData'))
    offlineRepository.init();
    $rootScope.offlineState = $cordovaNetwork.isOffline();
    $log.info('offlineState=', $rootScope.offlineState);
    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      $rootScope.offlineState = true;
      $log.info('offlineState=', $rootScope.offlineState);
    });

    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      $rootScope.offlineState = false;
      offlineRepository.syncOnline();
      $log.info('offlineState=', $rootScope.offlineState);
    });

  });
  $rootScope.$on('$stateChangeError', function ($rootScope,constants,$translate, $state, formlyConfig, formlyValidationMessages, checkUserAuth,$log) {
    var jState = JSON.stringify(toState);
    var jParams = JSON.stringify(toParams);
    $log.error('Cannot change state %s with params %s:\n%s', jState, jParams, error.stack || error);
  });
  $rootScope.$on('$stateNotFound', function (event, toState, fromState) {
    $log.error('$stateNotFound', toState.to, ' from ', fromState.name);
  });

  formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
  formlyValidationMessages.addStringMessage('required', 'This field is required');

  $rootScope.$on('$stateChangeStart', function(event, toState, fromState) { //toParams, fromParams
    if  ( (toState.name).indexOf('tab')>-1 ) {
      checkUserAuth();
    }


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
