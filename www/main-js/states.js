'use strict';
/*jshint -W117, -W097*/
angular.module('core.medics')
	.config(function ($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('main', {
				url: '',
				templateUrl: 'public/views/main.html',
				abstract: true
			})

			//public
			.state('main.public', {
				url: '/',
				abstract: true

			})
			.state('main.public.login', {
				url: 'login',
				views: {
					'content@main': {
						templateUrl: 'public/views/login.html',
						controller: 'loginCtrl as vm'
					}

				}

			})
			.state('main.public.registration',{
				url: 'registration',
				views: {
					'content@main': {
						templateUrl: 'public/views/registration.html',
						controller: 'RegistrationCtrl as vm'
					}
				}
			})

			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'dashboard/views/tabs.html',
				controller: 'dashboardCtrl as vm'
			})



			.state('tab.tasks', {
				url: '/tasks',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-tasks.html',
						controller: 'tasksCtrl as vm'
					}
				}
			})

			.state('tab.references', {
				url: '/references',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-references.html',
						controller: 'referencesCtrl as vm'
					}
				}
			})
			.state('tab.addreferences', {
				url: '/addreferences',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/add-references.html',
						controller: 'addReferencesCtrl'
					}
				}
			})
		//	.state('tab.notifications', {
		//		url: '/notifications',
		//		views: {
		//			'menuContent': {
		//				templateUrl: 'templates/tab-notifications.html',
		//				controller: 'notificationsCtrl as vm'
		//			}
		//		}
		//	})
		//
			.state('tab.catalog', {
				url: '/catalog',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-catalog.html',
						controller: 'catalogCtrl as vm'
					}
				}
			});
		//	.state('tab.drafts', {
		//		url: '/drafts',
		//		views: {
		//			'menuContent': {
		//				templateUrl: 'templates/tab-drafts.html',
		//				controller: 'draftsCtrl as vm'
		//			}
		//		}
		//	})
		//	.state('tab.patients', {
		//		url: '/patients',
		//		views: {
		//			'menuContent': {
		//				templateUrl: 'templates/tab-patients.html',
		//				controller: 'patientsCtrl as vm'
		//			}
		//		}
		//	})
		//	.state('tab.stuff', {
		//		url: '/stuff',
		//		views: {
		//			'menuContent': {
		//				templateUrl: 'templates/tab-stuff.html',
		//				controller: 'stuffCtrl as vm'
		//			}
		//		}
		//	});
		//
		$urlRouterProvider.otherwise('/login');

	});
