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
			.state('tab.tasksedit', {
				url: '/tasksedit',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-tasks.edit.html',
						controller: 'tasksEditCtrl as vm'
					}
				},
				params:{
					id: '',
					type: '',
					patId: null
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
			.state('tab.notifications', {
				url: '/notifications',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-notifications.html',
						controller: 'notificationsCtrl as vm'
					}
				}
			})

			.state('tab.catalog', {
				url: '/catalog',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-catalog.html',
						controller: 'catalogCtrl as vm'
					}
				}
			})
			.state('tab.drafts', {
				url: '/drafts',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-drafts.html',
						controller: 'draftsCtrl as vm'
					}
				}
			})
			.state('tab.patients', {
				url: '/patients',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-patients.html',
						controller: 'patientsCtrl as vm'
					}
				}
			})
			.state('tab.draftsedit',{
				url: '/draftsedit',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-drafts.edit.html',
						controller: 'draftsEditCtrl as vm'
					}
				},

		params:{
			id: ''
		}
			})
			.state('tab.stuff', {
				url: '/stuff',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-stuff.html',
						controller: 'stuffCtrl as vm'
					}
				}
			})
			.state('tab.stuffedit',{
				url: '/stuffedit',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-stuffEdit.html',
						controller: 'stuffEditCtrl as vm'
					}
				},
				params:{
					id: ''
				}
			});

		$urlRouterProvider.otherwise('/login');

	});
