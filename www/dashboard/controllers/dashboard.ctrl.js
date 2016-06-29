'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('dashboardCtrl', function ($rootScope,$scope, $ionicSideMenuDelegate,localStorageService) {

		var vm = this;
		console.log("DashboardCTRL");
		vm.user = localStorageService.get('userData');
		$scope.toggleLeft = function() {
			$ionicSideMenuDelegate.toggleLeft();
		};


		//$rootScope.db = new PouchDB(vm.user.id);
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
		}
	});
