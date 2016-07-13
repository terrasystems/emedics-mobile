'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')
	.controller('stuffCtrl', function (localStorageService,http,$scope,$state, $rootScope) {

		var vm = this;
		vm.stafs = [];
		vm.user = localStorageService.get('userData');
		vm.offlineState = $rootScope.offlineState;

		if (vm.user.type === 'doctor' && (vm.user.org === 'true' || vm.user.org === true)) {
			vm.canEdit = true;
		} else {
			vm.canEdit = false;
		}

		vm.onRefresh = function() {
			http.post('private/dashboard/stuff', {name: ''})
				.then(function (res) {
					//blockUI.stop();
					if (res.result) {
						vm.stuffs = res.result;
					}
				});
		};
		vm.onRefresh();

		vm.onEdit = function (index) {
			$state.go('tab.stuffedit', {id: index});
		};

		vm.convertDate = function (d) {
			var y = new Date(d);
			return y.toLocaleString().slice(0,10);
		};




		//accordion scripts

		$scope.toggleGroup = function(group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};
		$scope.isGroupShown = function(group) {
			return $scope.shownGroup === group;
		};

	});
