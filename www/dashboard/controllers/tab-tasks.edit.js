'use strict';
/*jshint -W117, -W097, -W116*/
angular.module('eMedicsMobile')
	.controller('tasksEditCtrl', function ( http, $q, $stateParams, $state, localStorageService,
                                                $scope, $timeout, $translate, $base64,
                                                $rootScope,db2, forEditTask) {

		if (!$stateParams.type || $stateParams.type === '' || $stateParams.type === null) {
			$state.go('tab.tasks');
			return;
		}

		var vm = this;
		vm.user = localStorageService.get('userData');

		if ($stateParams.type == 'tasks' || $stateParams.type == 'tasks+') {
			vm.mainState = 'tab.tasks';
		} else if ($stateParams.type == 'patients' || $stateParams.type == 'patients+') {
			vm.mainState = 'tab.patients';
		} else if ($stateParams.type == 'tasksAdmin') {
			vm.mainState = 'tab.tasks';
		}

		if (!$stateParams.id || $stateParams.id === '' || $stateParams.id === null) {
			$state.go(vm.mainState);
			return;
		} else {
			vm.id = $stateParams.id;
		}

		if ($stateParams.type == 'patients+' || $stateParams.type == 'tasks+') {
			vm.viewButtons = false;
			vm.viewButtonSave = false;
		} else if ($stateParams.type == 'tasksAdmin') {
			vm.viewButtons = false;
			vm.viewButtonSave = true;
		} else {
			vm.viewButtons = true;
			vm.viewButtonSave = true;
		}

		if ($stateParams.type == 'tasksAdmin') {
			vm.getUrl = 'private/dashboard/tasks/' + vm.id;
			vm.setUrl = 'private/dashboard/stuff/event/adminEdit';
		} else {
			vm.getUrl = 'private/dashboard/tasks/' + vm.id;
			vm.setUrl = 'private/dashboard/tasks/edit';
		}

		vm.data = { sections: [], options: [], model: [], sectionsName: [], selectedSection: '', selectedKey: '', editModel: {} };

		forEditTask.getModel(vm.getUrl, null)
			.then(function(res) {
				vm.data = res;

				$scope.$watch('vm.data.selectedSection', function (newValue) {
					for (var key in vm.data.model) {
						if (newValue == Object.keys(vm.data.model[key])[0]) {
							vm.data.selectedKey = key;
						}
					}
				});
			});

		function save() {
			var deferred = $q.defer();
			var paramsPOST = {event: {id: vm.id, data: {sections: vm.data.model}}};
			paramsPOST.event.patient = vm.data.editModel.patient;
			paramsPOST.event.template = vm.data.editModel.template;
			paramsPOST.event.fromUser = vm.data.editModel.fromUser;
			paramsPOST.event.toUser = vm.data.editModel.toUser;

			http.post(vm.setUrl, paramsPOST)
				.then(function (res) {
					//blockUI.stop();
					deferred.resolve(res);
					if (res.state) {
						//alertService.add(0, res.state.message);
					}
				}, function (error) {
					deferred.reject(error);
				});
			return deferred.promise;
		}

		vm.onSave = function () {
			save().then(function () {
				$state.go(vm.mainState);
			});
		};

		vm.onSaveDraft = function() {
			db2.save($rootScope.db, 'add', vm.data.formInfo, vm.data.model)
				.then(function() {
					//alertService.add(0, 'Saved - Ok!');
					$state.go(vm.mainState);
				});
		};

		vm.onSend = function() {
			var config = {
				templateUrl: 'modules/dashboard/views/modal.addNotif.html',
				controller: 'modalAddNotifCtrl',
				controllerAs: 'vm',
				resolve: {
					model: function($q) {
						var deferred = $q.defer();
						deferred.resolve({data: {task_id: vm.id, obj: vm.data.formInfo}});
						return deferred.promise;
					}
				}
			};

			save().then(function () {
				var result = $uibModal.open(config);
				result.result.then(function () {
					$state.go(vm.mainState);
				});
			});

		};

		vm.onReturn = function () {
			$state.go(vm.mainState);
		};

		vm.onCloseTask = function() {
			//confirmService('Close task?')
			//	.then(function(res) {
					http.get('private/dashboard/tasks/close/'+vm.id)
						.then(function (res) {
							//blockUI.stop();
							//alertService.add(0, res.state.message);
							vm.onReturn();
						});
				//});
		};

	});
