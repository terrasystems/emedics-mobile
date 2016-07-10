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

	.service('alertService',function($ionicPopup) {
		function showAlert (title, template) {

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
				controller:'modalAddNotifCtrl',
				buttons: [
					{ text: 'Cancel' },
					{
						text: '<b>Ok</b>',
						type: 'button-positive',
						onTap: function(res) {
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
	.service('http', function ($http, $q, constants, $translate, alertService) {
		function getOfflineDoc(list) {
			var deferred = $q.defer();

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
				alertService.warning('Warning', $translate.instant(MSG_NO_DATA));
			}
		};
		//Call if error
		function errorListener(error, deferred) {
			deferred.reject(error);
			if (error.status == '401') {
				alertService.error($translate.instant(error.data.state.message));
			}
			else {
				alertService.error(2, error.status + ' ' + error.statusText);
			}
		};
		//Function wrapper on $http service
		function H (url, params, method) {
			var deferred = $q.defer();
			$http[method](constants.restUrl + url, params).then(function (resp) {successListener(resp,deferred)},
				function (error) {errorListener(error, deferred);});
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
	.service('offlineRepository', function ($q, $log, localStorageService, pouchDB) {
		var vm = this



		//Save or add draft document
		function addDraft(id, info, model) {
			var deferred = $q.defer();
			if (id === 'add') {
				var doc = {
					_id: new Date().toISOString(),
					status: 'draft',
					draftName: info.name,
					body: {sections: model, formInfo: info}
				};
				vm.db.put(doc, function (res) {
					deferred.resolve(res);
				});
			} else {
				vm.db.get(id).then(function (doc) {
					doc.body = {sections: model, formInfo: info};
					return doc;
				}, function () {
					deferred.reject(false);
				}).then(function (doc) {
					vm.db.put(doc, function (res) {
						deferred.resolve(res);
					});
				});
			}
			return deferred.promise;
		}

		function createDesignDoc(db) {
			// create a design doc
			var ddoc = {
				_id: '_design/index',
				views: {
					docType: {
						map: function (doc) {
							if (doc.status) {
								emit(doc.status);
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

/*		function get(id) {
			return db.get(id);
		};
		function allDocs(params) {
			return db.allDocs(params);
		};*/
		function init() {
			vm.user = localStorageService.get('userData');
			vm.db = pouchDB(vm.user.id);
			vm.serv.__proto__ = vm.db;
			createDesignDoc(vm.db);
		};
		vm.serv = {
			init: init,
			addDraft: addDraft
			/*get: get,
			 allDocs:allDocs,*/
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
	});

