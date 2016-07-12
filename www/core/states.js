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
				abstract: true,
				parent:'main'

			})
			.state('main.public.login', {
				url: 'login',
				views: {
					'content@main': {
						templateUrl: 'public/views/login.html',
						controller: 'loginCtrl as vm'
					}

				},
				parent:'main.public'
			})
			.state('main.public.registration',{
				url: 'registration',
				views: {
					'content@main': {
						templateUrl: 'public/views/registration.html',
						controller: 'RegistrationCtrl as vm'
					}
				},
				parent:'main.public'
			})

			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'dashboard/views/tabs.html',
				controller: 'dashboardCtrl as vm'
			})

			.state('tab.sub', {
				url:'',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/sub-tasks.html',
						controller: 'subCtrl as vm'
					}
				},
				parent:'tab'
			})

			.state('tab.sub.tasks', {
				url: '/tasks',
				views: {
					'list': {
						templateUrl: 'dashboard/views/tab-tasks.html',
						controller: 'tasksCtrl as vm'
					}
				},
				parent:'tab.sub'
			})
			.state('tab.sub.sent', {
				url: '/sent',
				views: {
					'list': {
						templateUrl: 'dashboard/views/tab-sent.html',
						controller: 'sentCtrl as vm'
					}
				},
				parent:'tab.sub'
			})
			.state('tab.tasksedit', {
				url: '/tasksedit',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-tasks.edit.html',
						controller: 'tasksEditCtrl as vm'
					},
					parent:'tab'
				},
				params:{
					id: '',
					type: '',
					patId: null
				}
			})
			.state('tab.taskssend', {
				url: '/tasksSend',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/popups/SendTaskFromTasksEdit.html',
						controller: 'SendTaskCTRL as vm'
					}
				},
				params:{
					templates:''
				},
				parent:'tab'
			})
			.state('tab.references', {
				url: '/references',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-references.html',
						controller: 'referencesCtrl as vm'
					}
				},
				parent:'tab'
			})
			.state('tab.addreferences', {
				url: '/addreferences',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/add-references.html',
						controller: 'addReferencesCtrl'
					}
				},
				parent:'tab'
			})
			.state('tab.notifications', {
				url: '/notifications',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-notifications.html',
						controller: 'notificationsCtrl as vm'
					}
				},
				parent:'tab'
			})

			.state('tab.catalog', {
				url: '/catalog',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-catalog.html',
						controller: 'catalogCtrl as vm'
					}
				},
				parent:'tab'
			})
			.state('tab.sendtask',{
				url:'/sendTaskCatalog',
				views:{
					'menuContent':{
						templateUrl:'dashboard/views/popups/SendTaskFromCatalog.html',
						controller:'modalSendTaskMultiCtrl as vm'
					}
				},
				params:{
					templates:''
				}
			})
			.state('tab.drafts', {
				url: '/drafts',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-drafts.html',
						controller: 'draftsCtrl as vm'
					}
				},
				parent:'tab'
			})
			.state('tab.patients', {
				url: '/patients',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-patients.html',
						controller: 'patientsCtrl as vm'
					}
				},
				parent:'tab'
			}).state('tab.addpatient',{
				url: '/addpatients',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-addPatients.html',
						controller: 'addPatientCtrl as vm'
					}
				},
				parent:'tab'
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
				},
				parent:'tab'
			})
			.state('tab.stuffedit',{
				url: '/stuffedit',
				views: {
					'menuContent': {
						templateUrl: 'dashboard/views/tab-stuffEdit.html',
						controller: 'stuffEditCtrl as vm'
					}
				},
				parent:'tab',
				params:{
					id: ''
				}
			});

		$urlRouterProvider.otherwise('/login');

	});
