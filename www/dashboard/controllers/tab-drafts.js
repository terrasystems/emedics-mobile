'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')

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
			var paramsCreate = {
				template: {
					id: obj.doc.body.formInfo.rawData.template.id,
					templateDto: null
				},
				patient: obj.doc.body.formInfo.rawData.patient ? obj.doc.body.formInfo.rawData.patient.id : null,
				fromID: null, //vm.user.id,
				data: JSON.stringify({sections: obj.doc.body.sections})
			};
			if (vm.user.type === 'stuff' || vm.user.type === 'patient') {
				http.get('private/dashboard/tasks/findTask/' + obj.doc.body.formInfo.rawData.template.id)
					.then(function (res) {
						if (res.result) {
							//edit promis
							var newTaskID = res.result.id;
							var paramsEdit = {
								event: {
									id: newTaskID,
									patient: res.result.patient,
									template: res.result.template,
									data: {sections: obj.doc.body.sections}, // !!!!!
									fromUser: res.result.fromUser,
									toUser: null,
									descr: res.result.descr
								}
							};
							http.post('private/dashboard/tasks/edit', paramsEdit);
							//.then(function (res) {
							//	blockUI.stop();
							//	//modal window
							//	if (res.state && res.state.value && !!res.state.value) {
							//		var config = {
							//			templateUrl: 'modules/dashboard/views/modal.addNotif.html',
							//			controller: 'modalAddNotifCtrl',
							//			controllerAs: 'vm',
							//			resolve: {
							//				model: function ($q) {
							//					var deferred = $q.defer();
							//					deferred.resolve({
							//						data: {
							//							task_id: newTaskID,
							//							obj: obj.doc.body.formInfo
							//						}
							//					});
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
							//create promis with model
							//				http.post('private/dashboard/tasks/create', paramsCreate)
							//					.then(function (res) {
							//						blockUI.stop();
							//						if (res.state && res.state.value && !!res.state.value) {
							//							var newTaskID = res.result.id;
							//							//modal window
							//							var config = {
							//								templateUrl: 'modules/dashboard/views/modal.addNotif.html',
							//								controller: 'modalAddNotifCtrl',
							//								controllerAs: 'vm',
							//								resolve: {
							//									model: function ($q) {
							//										var deferred = $q.defer();
							//										deferred.resolve({
							//											data: {
							//												task_id: newTaskID,
							//												obj: obj.doc.body.formInfo
							//											}
							//										});
							//										return deferred.promise;
							//									}
							//								}
							//							};
							//							var result = $uibModal.open(config);
							//							result.result.then(function () {
							//								vm.onRefresh();
							//							});
							//						}
							//					});
							//			}
							//		});
							//}

							//}else {
							//		//create with model
							//		http.post('private/dashboard/tasks/create', paramsCreate)
							//			.then(function (res) {
							//				blockUI.stop();
							//				if (res.state && res.state.value && !!res.state.value) {
							//					var newTaskID = res.result.id;
							//					//modal window
							//					var config = {
							//						templateUrl: 'modules/dashboard/views/modal.addNotif.html',
							//						controller: 'modalAddNotifCtrl',
							//						controllerAs: 'vm',
							//						resolve: {
							//							model: function ($q) {
							//								var deferred = $q.defer();
							//								deferred.resolve({data: {task_id: newTaskID, obj: obj.doc.body.formInfo}});
							//								return deferred.promise;
							//							}
							//						}
							//					};
							//					var result = $uibModal.open(config);
							//					result.result.then(function () {
							//						vm.onRefresh();
							//					});
							//				}
							//			});
						}
					});
			}
		};

		vm.Delete = function(id,$event) {
			if($event){
				$event.stopPropagation();
				$event.preventDefault();
			}
			       db2.del(base_db, id)
						.then(function() {
							vm.onRefresh();
						});

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
