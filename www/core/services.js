'use strict';
/*jshint -W117, -W097*/

angular.module('core.medics')

	.service('auth', function ($rootScope, localStorageService, offlineRepository) {
		return {
			saveUserData: function (data) {
				if (data.token) {
					$rootScope.token = data.token;
					localStorageService.set('token', data.token);
				}
				if (data.user) {
					$rootScope.userData = data.user;
					localStorageService.set('userData', data.user);
					offlineRepository.init();
				}
			}
		};
	})
	//.service('utilsService', function($ionicModal) {
	//
	//	this.showModal = function() {
	//
	//		var service = this;
	//
	//		$ionicModal.fromTemplateUrl('dashboard/views/popups/SendTaskFromPatientTab.html', {
	//			scope: null,
	//			controller: 'modalAddNotifCtrl as vm'
	//		}).then(function(modal) {
	//			service.modal = modal;
	//			service.modal.show();
	//		});
	//	};
	//
	//	this.hideModal = function() {
	//		this.modal.hide();
	//	};
	//
	//})

	.service('alertService', function ($ionicPopup) {
		function showAlert(title, template) {

			return $ionicPopup.alert({
				title: title,
				template: template ? template : ''
			});
		}

		return {
			showPopap: function (title, subTitle, template) {
				return $ionicPopup.show({
					templateUrl: template,
					//controller: 'modalAddNotifCtrl as vm',
					//controllerAs: 'vm',
					title: title,
					subTitle: subTitle,
					scope: null,
					controller: 'modalAddNotifCtrl',
					buttons: [
						{text: 'Cancel'},
						{
							text: '<b>Ok</b>',
							type: 'button-positive',
							onTap: function (res) {
								// Returning a value will cause the promise to resolve with the given value.
								return res;
							}
						}
					]
				});
			},
			success: function (template) {
				showAlert('Success', template);
			},
			warning: function (template) {
				showAlert('Warning', template);
			},
			error: function (template) {
				showAlert('Error', template);
			},
			showAlert: showAlert

		};
	})
	.service('http', function ($http, $q, constants, $translate, alertService, $rootScope, offlineRepository, localStorageService, $log) {
		//variables
		var deferred = $q.defer(),
			offlineResp = {data: {state: {message: '', value: ''}}},
			error = {status: '', statusText: ''},
			user = localStorageService.get('userData');

		error.status = $translate.instant('MSG_NOT_OF_WORK');
		error.statusText = $translate.instant('MSG_OFFLINE_MODE')

		function syncDoc(url, list) {

			function saveDoc(list, type) {
				var ids = _.map(list, 'id'),
					pushDocs = [],
					diff;

				offlineRepository.allDocs({keys: ids, include_docs: true}).then(function (docs) {

					pushDocs = _.filter(docs.rows, function (row) {
						if (!row.error) {
							var rev = row.doc._rev;
							row.doc = _.find(list, {id: row.doc._id});
							if (row.doc) {
								row.doc._id = row.doc.id;
								row.doc._rev = rev;
								row.doc.type = type;
								return row.doc;
							}
						}
					});

					diff = _.differenceBy(list, pushDocs, 'id');

					diff = _.map(diff, function (item) {
						item.type = type;
						item._id = item.id;
						return item;
					});
					offlineRepository.bulkDocs(pushDocs);
					offlineRepository.bulkDocs(diff);
				});
			}

			if (!user)
				return;

			switch (url) {
				case 'private/dashboard/tasks/all':
				{
					saveDoc(list, 'task');
					break;
				}
				case 'private/dashboard/' + user.type + '/references':
				{
					saveDoc(list, 'reference');
					break;
				}
				case 'private/dashboard/template':
				{
					saveDoc(list, 'template');
					break;
				}
				case 'private/dashboard/user/template':
				{
					saveDoc(list, 'userTemplate');
					break;
				}
				case 'private/dashboard/stuff':
				{
					saveDoc(list, 'staff');
					break;
				}
				/*
				 case '':
				 {
				 break;
				 }*/
				default:
				{
					$log.warn('Offline synchronisation: method not allowed to sync')
				}
			}
		}

		//offline http
		function getOfflineDoc(url, params) {

			var deferred = $q.defer();
			//all good
			function successList(resp, deferred) {
				var list = null;
				if (resp && resp.rows)
					list = _.map(resp.rows, 'doc');
				else
					list = resp;
				offlineResp.data.state.value = true;
				offlineResp.data.result = list;
				deferred.resolve(offlineResp);
			};
			///if error
			function errorList(error, deferred) {
				deferred.reject(error);
			};


			switch (true) {
				case (url.indexOf('private/dashboard/tasks/send') > -1):
				{
					offlineRepository.sendTask(params).then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}
				case (url.indexOf('private/dashboard/tasks/edit') > -1):
				{
					offlineRepository.editTask(params).then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}
				case (url.indexOf('private/dashboard/tasks/all') > -1):
				{
					offlineRepository.getAllTasks().then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}
				case (url.indexOf('private/dashboard/' + user.type + '/references') > -1):
				{
					offlineRepository.getReferences().then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}
				case (url.indexOf('private/dashboard/template') > -1):
				{
					offlineRepository.getAllTemplates().then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}
				case (url.indexOf('private/dashboard/user/template') > -1):
				{
					offlineRepository.getUserTemplates().then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}
				case (url.indexOf('private/dashboard/tasks/') > -1):
				{
					offlineRepository.getTask(url.replace('private/dashboard/tasks/', '')).then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}
				case (url.indexOf('private/dashboard/stuff') > -1):
				{
					offlineRepository.getStaff().then(function (resp) {
						successList(resp, deferred);
					}, function (error) {
						errorList(error, deferred);
					});
					break;
				}

				default:
				{
					deferred.reject(error);
				}
			}

			return deferred.promise;
		};
		//Call if all good
		function successListener(resp, deferred) {
			resp.data.state.message = $translate.instant(resp.data.state.message);
			if (resp.data && resp.data.state && resp.data.state.value) {
				deferred.resolve(resp.data);
			}
			else {
				deferred.reject(false);
				alertService.warning($translate.instant('MSG_NO_DATA'));
			}
		};
		//Call if error
		function errorListener(error, deferred) {
			deferred.reject(error);
			if (error.status == '401') {
				alertService.error($translate.instant(error.data.state.message));
			}
			else {
				alertService.error(error.status + ' ' + error.statusText);
			}
		};
		//Function wrapper on $http service
		function H(url, params, method) {

			var deferred = $q.defer();
			if (!$rootScope.offlineState)
				$http[method](constants.restUrl + url, params).then(function (resp) {
						successListener(resp, deferred);
						syncDoc(url, resp.data.result);
					},
					function (error) {
						errorListener(error, deferred);
					});
			else {
				getOfflineDoc(url, params).then(function (resp) {
						successListener(resp, deferred)
					},
					function (error) {
						errorListener(error, deferred);
					});
			}
			return deferred.promise;
		}

		//******
		return {
			get: function (url, params) {
				return H(url, params, 'get');
			},
			post: function (url, params) {
				return H(url, params, 'post');
			}
		};
	})
//
	.service('offlineRepository', function ($q, $log, localStorageService, pouchDB, $http, constants) {
		var vm = this

		function syncOnline() {
			var promises = [], tmp = [];
			promises.push(vm.db.query('index/docType', {key: 'task', include_docs: true}));
			promises.push(vm.db.query('index/docType', {key: 'sent', include_docs: true}));
			$q.all(promises).then(function (results) {
				_.each(results, function (res) {
					tmp = tmp.concat(_.map(res.rows, 'doc'));
				});
				$http.post(constants.restUrl +'/private/dashboard/tasks/syncTasks', tmp).then(function (resp) {
					$log.info(JSON.stringify(resp));
				}, function (error) {
					$log.error(error);
				});
				//
			});
		};

		//Save or add draft document
		function addDraft(id, info, model) {
			var deferred = $q.defer();
			if (id === 'add')
			{
				id = 'draft:' + info.rawData.template.id;

			}// else {
				vm.db.get(id).then(function (doc) {
					doc.body = {sections: model, formInfo: info};

					vm.db.put(doc, function (res) {
						deferred.resolve(res);
					});
				}, function (error) {
					if (404 === error.status)
					{
						var doc = {
							_id: 'draft:' + info.rawData.template.id,
							type: 'draft',
							name: info.name,
							body: {sections: model, formInfo: info}
						};
						vm.db.put(doc, function (res) {
						 deferred.resolve(res);
						 });
					}
					//deferred.reject(false);
				});
			//}
			return deferred.promise;
		}

		function createDesignDoc(db) {
			// create a design doc
			var ddoc = {
				_id: '_design/index',
				views: {
					docType: {
						map: function (doc) {
							if (doc.type) {
								emit(doc.type);
							}
						}.toString()
					}
				}
			};
			// get/set design
			db.get('_design/index').then(function (doc) {
				if (!_.isEqual(_.omit(doc, '_rev'), ddoc)) { // check if docs are equal to not update on every page refresh
					ddoc._rev = doc._rev;
					db.put(ddoc).then(function (res) {
						$log.debug('design Doc updated, ', res.rev);
					}, function (err) {
						if (err.status !== 409) $log.error('design Doc put failed, ', err);
					});
				}
			}, function (err) {
				$log.warn('design Doc get failed, lets create', err);
				db.post(ddoc).then(function (res) {
					$log.debug('design Doc created, ', res.rev);
				}, function (err) {
					if (err.status !== 409) $log.error('design Doc put failed, ', err);
				});
			});
		};
		function getAllTasks() {
			return vm.db.query('index/docType', {key: 'task', include_docs: true});
		};
		function getAllTemplates() {
			return vm.db.query('index/docType', {key: 'template', include_docs: true});
		};
		function getUserTemplates() {
			return vm.db.query('index/docType', {key: 'userTemplate', include_docs: true});
		};
		function getReferences() {
			return vm.db.query('index/docType', {key: 'reference', include_docs: true});
		};
		function getTask(id) {
			return vm.db.get(id);
		};
		function getPatients() {

		};
		function getStaff() {
			return vm.db.query('index/docType', {key: 'staff', include_docs: true});
		};
		function sendTask(params) {
			var deferred = $q.defer();

			vm.db.get(params.event).then(function (doc) {
				//var ddoc = JSON.parse(JSON.stringify(doc));

				params._id = doc._id;
				params._rev = doc._rev;
				params.type = 'sent';
				vm.db.put(params, function (res) {
					deferred.resolve(res);
				});
			}, function (error) {
				if (404 === error.status)
				{
					params.type = 'sent';
					params._id = params.event;
					vm.db.put(params, function (res) {
						deferred.resolve(res);
					});
				}
				//deferred.reject(false);
			});

			//vm.db.put(params);
      return deferred.promise;
		};
		function editTask(params) {
			var deferred = $q.defer();
			if (params.event) {


					vm.db.get(params.event.id).then(function (doc) {
						//var ddoc = JSON.parse(JSON.stringify(doc));

						params.event._id = doc._id;
						params.event._rev = doc._rev;
						params.event.type = 'task';
						vm.db.put(params.event, function (res) {
							deferred.resolve(res);
						});
					}, function (error) {
						if (404 === error.status) {
							params.event.type = 'task';
							params.event._id = params.event;
							vm.db.put(params.event, function (res) {
								deferred.resolve(res);
							});
						}
						//deferred.reject(false);
					});
			}
			return deferred.promise;
		}
		function loadTask() {

		};
		function init() {
			vm.user = localStorageService.get('userData');
			vm.db = pouchDB(vm.user.id);
			vm.serv.__proto__ = vm.db;
			createDesignDoc(vm.db);
		};
		vm.serv = {
			init: init,
			syncOnline:syncOnline,
			addDraft: addDraft,
			getAllTasks: getAllTasks,
			getAllTemplates: getAllTemplates,
			getUserTemplates: getUserTemplates,
			getReferences: getReferences,
			getPatients: getPatients,
			getStaff: getStaff,
			getTask: getTask,
			sendTask: sendTask,
			loadTask: loadTask,
			editTask:editTask
		}
		return vm.serv;
	})
//// Error interceptor
	.service('responseErrorInterceptor', function ($rootScope, $q, $injector) {
		return {
			'response': function (response) {
				//console.log('int.responce: '+response);
				return response;
			},
			'responseError': function (rejection) {
				//console.log('int.rejection: ' + rejection);


				switch (rejection.status) {
					case 401:
					{
						$injector.get('$state').go('main.public.login', {reload: true});
						break;
					}
					case 404:
					{
						//$injector.get('$state').go('main.public.login',{reload: true});
						break;
					}
					default:
					{
						//console.log(rejection);
						break;
					}
				}
				return $q.reject(rejection);
			}
		};
	})


	.service('checkUserAuth', function ($location, localStorageService, $rootScope) {
		var checkUserAuth = function () {
			var originalPath = $location.path();
			$location.path('/login');
			var authToken = localStorageService.get('token');
			if ((authToken !== undefined) && (authToken !== null)) {
				$rootScope.token = authToken;
				$rootScope.userData = localStorageService.get('userData');
				$location.path(originalPath);
				return;
			}
		};
		return checkUserAuth;
	})


//Сервис интерцептора запроса, вставляет токен в хедер
	.service('requestInterceptor', function ($rootScope, $q) {
		return {
			'request': function (config) {
				if ($rootScope.token) {
					var authToken = $rootScope.token;
					config.headers['X-Auth-Token'] = authToken;
				}
				return config || $q.when(config);
			}
		};
	})

//инициализация параметров для $http запроса
	.service('initParamsPOST', function () {
		var paramsPOST = {
			"page": {
				"start": 0,
				"count": 20,
				"size": 0
			},
			"criteria": {
				"search": '',
				"list": []
			}
		};
		return {
			'params': paramsPOST
		};
	})
	//
	.service('ModalService', function ($ionicModal, $rootScope) {


		var init = function (tpl, $scope) {

			var promise;
			$scope.model = {};
			$scope = $scope || $rootScope.$new();

			promise = $ionicModal.fromTemplateUrl(tpl, {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modal = modal;
				return modal;
			});

			$scope.openModal = function () {
				return $scope.modal.show();
			};
			$scope.modalOk = function () {
				$rootScope.$broadcast('modalOk', $scope.model)
				$scope.modal.hide();
			};
			$scope.modalCancel = function () {
				$scope.modal.hide();
			};
			$scope.$on('$destroy', function () {
				$scope.modal.remove();
			});

			return promise;
		}

		return {
			init: init
		}

	});

