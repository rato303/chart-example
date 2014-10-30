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
  ['$scope', '$modalInstance', 'dialogModel',
    function ($scope, $modalInstance, dialogModel) {

      $scope.dialogModel = angular.copy(dialogModel);

      $scope.ok = function () {
        $modalInstance.close($scope.dialogModel);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    }
  ]
);
