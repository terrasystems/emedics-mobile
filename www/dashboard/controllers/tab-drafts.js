'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')

	.controller('draftsCtrl', function ($scope, $rootScope, $state, db2,
                                      http,localStorageService) {
		var vm = this;
		vm.user = localStorageService.get('userData');
		vm.list = [];
		var base_db = $rootScope.db;

		vm.onEdit = function (id) {
			$state.go('tab.draftsedit', {id: id});
		};

		vm.onSend = function (obj) {
			var paramsPOST = {
				template: {
					id: obj.doc.body.formInfo.rawData.template.id,
					templateDto: null
				},
				patient: obj.doc.body.formInfo.rawData.patient.id
			};
			http.post('private/dashboard/tasks/create', paramsPOST)
				.then(function (res) {
					//blockUI.stop();
					if (res.state && res.state.value && !!res.state.value) {
						var newTaskID = res.result.id;
						paramsPOST = {event:
						{	id: newTaskID,
							patient: res.result.patient,
							template: res.result.template,
							data: {sections: obj.doc.body.sections},
							fromUser: res.result.fromUser,
							toUser: null,
							descr: res.result.descr
						}
						};
						http.post('private/dashboard/tasks/edit', paramsPOST);
							//.then(function (res) {
							//	blockUI.stop();
							//	if (res.result) {
							//
							//		var config = {
							//			templateUrl: 'modules/dashboard/views/modal.addNotif.html',
							//			controller: 'modalAddNotifCtrl',
							//			controllerAs: 'vm',
							//			resolve: {
							//				model: function($q) {
							//					var deferred = $q.defer();
							//					deferred.resolve({data: {task_id: newTaskID, obj: obj.doc.body.formInfo}});
							//					return deferred.promise;
							//				}
							//			}
							//		};
							//		var result = $uibModal.open(config);
							//		result.result.then(function () {
							//			vm.onRefresh();
							//		});
							//
							//	}
							//});
					//} else {
					//	//alertService.add(2, res.state.message);
					}
				});
		};

		vm.onDelete = function(id) {
			//confirmService('Delete draft?')
			//	.then(function(res) {
					db2.del(base_db, id)
						.then(function() {
							vm.onRefresh();
						});
				//});
		};

		vm.onRefresh = function () {
			db2.load_all(base_db, $scope)
				.then(function(res) {
					vm.list = res;
				});
		};
		vm.onRefresh();

		vm.convertDateTime = function (d) {
			return d.slice(0, 19).replace('T', ' / ');
		};

	});
