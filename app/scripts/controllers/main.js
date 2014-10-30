'use strict';

/**
 * @ngdoc function
 * @name chartExampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chartExampleApp
 */
angular.module('chartExampleApp')
.controller('MainCtrl',
	['$scope',
		function ($scope) {

      // 卓の数
      var _tableItems = [];
      for (var i = 0; i < 100; i++) {
      	var y = i * 30 + 20;
      	_tableItems.push({
      		'y': y,
      		'labelY': y + 12,
      		'takuNinzu': i + '人',
      		'shubetsu': '種別' + i,
      		'takumei': '卓名' + i,
      		'kitsuen': i % 2 === 0 ? true : false
      	});
      }
      $scope.tableItems = _tableItems;

      $scope.reservationItems = [];

		}
	]
);
