/**
 * Created by user on 14/10/29.
 */
'use strict';

/**
 * @ngdoc function
 * @name chartExampleApp.controller:ReservationDialogCtrl
 * @description
 * # MainCtrl
 * Controller of the chartExampleApp
 */
angular.module('chartExampleApp')
  .controller('ReservationDialogCtrl',
  ['$scope', '$modalInstance', 'selectItems',
    function ($scope, $modalInstance, selectItems) {

      $scope.selectItems = angular.copy(selectItems);

      $scope.ok = function () {
        $modalInstance.close($scope.selectItems);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    }
  ]
);
