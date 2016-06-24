'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('dashboardCtrl', function ($scope, $ionicSideMenuDelegate) {

		var vm = this;
		console.log("DashboardCTRL");

		$scope.toggleLeft = function() {
			$ionicSideMenuDelegate.toggleLeft();
		};

	});
