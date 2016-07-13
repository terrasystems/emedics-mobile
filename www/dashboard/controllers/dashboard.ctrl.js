'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')
	.controller('dashboardCtrl', function (http,$state,$rootScope,$scope, $ionicSideMenuDelegate,localStorageService) {

		var vm = this;
		console.log("DashboardCTRL");

		vm.user = localStorageService.get('userData');
		$scope.toggleLeft = function() {
			$ionicSideMenuDelegate.toggleLeft();
		};

		$scope.$on('calc.notif', function count () {
				http.post('private/dashboard/events/notifications/all', { templateId: null, period: null, fromName: null, description: null, formType: null })
					.then(function (res) {
						//blockUI.stop();
						if (res.result) {
							vm.count = res.result.length;
						}
					});
			}
		);
		$rootScope.$broadcast('calc.notif');

		vm.logout = function () {
			$rootScope.userData = null;
			$rootScope.token = null;
			localStorageService.set('token', null);
			localStorageService.set('userData', null);
			$state.go('main.public.login');
		};

/*		$rootScope.db = new PouchDB(vm.user.id);
		var base= $rootScope.db;
		var doc = {
			_id:new Date().toISOString(),
			status:'draft',
			body:{}
		};
		function error(err) {
			$log.error(err);
		}

		function get(res) {
			if (!res.ok) {
				return error(res);
			}
			return base.get(res.id);
		}

		function bind(res) {
			$scope.doc = res;
		}*/
	});
