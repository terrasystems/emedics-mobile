'use strict';
/*jshint -W117, -W097, -W116*/
angular.module('eMedicsMobile')
	.controller('draftsEditCtrl', function ($stateParams, $state, $scope, $translate, $rootScope, db2, forEditTask) {
		var vm = this;
console.log('draftsEditCtrl');
		if (!$stateParams.id || $stateParams.id === '' || $stateParams.id === null) {
			$state.go('tab.drafts');
			return;
		}

		vm.data = { sections: [], options: [], model: [], sectionsName: [], selectedSection: '', selectedKey: '', editModel: {}, formInfo: {} };

		forEditTask.getModel('', $stateParams.id)
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

		vm.onSaveDraft = function() {
			db2.save($rootScope.db, $stateParams.id, vm.data.formInfo, vm.data.model)
				.then(function() {
					//alertService.add(0, 'Saved - Ok!');
					$state.go('tab.drafts');
				});
		};

		vm.onReturn = function () {
			$state.go('tab.drafts');
		};

	});
