'use strict';

/**
 * @ngdoc directive
 * @name chartExampleApp.directive:ChartCtrl
 * @description
 * # ChartCtrl
 */
angular.module('chartExampleApp')
	.controller('ChartCtrl', ['$scope', 'chartModel', '$modal',
    function ChartCtrl($scope, chartModel, $modal) {

      /** チャートの情報 */
      $scope.chartModel = chartModel.createHeaderItems(0, 24);

      /**
       * 予約情報の選択を開始します。
       *
       * @param event mouse-downイベント
       *
       */
      $scope.startSelect = function (event, tableItem) {
        console.log('startSelect');
        $scope.chartModel.drawMode = true;
        $scope.moge[tableItem.$$hashKey] = tableItem;
        $scope.chartModel.drawingCellItem = $scope.chartModel.createCellItem(event.offsetX, event.offsetY);
      };

      /**
       * 予約情報の選択を終了します。
       *
       * @param event mouse-upイベント
       *
       */
      $scope.endSelect = function(event) {
        console.log('endSelect');

        if ($scope.chartModel.drawMode) {
          $scope.chartModel.drawMode = false;
          var newReservationItems = $scope.chartModel.createReservationItems(event, $scope.moge);

          // TODO createReservationItems内で呼ばれているので呼び出し方を考える
          var startTime = $scope.chartModel.drawingCellItem.startTime;
          var endTime = $scope.chartModel.getEndTime(event.offsetX);

          $scope.modalInstance = $modal.open({
            controller: 'ReservationDialogCtrl',
            templateUrl: 'scripts/directives/chart/components/dialog/reservation-dialog.html',
            resolve: {
              dialogModel: function() {
                return {
                  "startTime": startTime,
                  "endTime": endTime,
                  "selectItems": newReservationItems
                };
              }
            }
          });

          $scope.modalInstance.result.then(function (dialogModel) {
            console.log('確定');
            // TODO 関数化
            for (var i = 0; i < dialogModel.selectItems.length; i++) {
              // TODO createCellItemのpush先を抽象化
            }

            $scope.dialogCloseCommonProcess();
          }, function () {
            console.log('キャンセル');
            $scope.dialogCloseCommonProcess();
          });

        }

        if ($scope.chartModel.ddMode) {
          $scope.chartModel.ddMode = false;
        }

      };

      /**
       * TODO chart-model側にリファクタリング
       * ダイアログを閉じる際の共通処理
       */
      $scope.dialogCloseCommonProcess = function() {
        $scope.chartModel.drawingCellItem = {"x" : 0, "y" : 0, "height": 0, "width" : 0};
        $scope.moge = {};
      };

      // TODO フィールド名はリファクタリング対象
      $scope.moge = {};
      // TODO メソッド名はリファクタリング対象
      $scope.over = function(event, tableItem) {
        console.log('over');
        if ($scope.chartModel.drawMode) {
          $scope.moge[tableItem.$$hashKey] = tableItem;
          $scope.chartModel.updateCellItem(event.offsetX, event.offsetY);
        }
        $scope.chartModel.ddUpdateCellItem(event.offsetX, event.offsetY);

      };

      $scope.drawingCellMove = function(event) {
        if ($scope.chartModel.drawMode) {
          $scope.chartModel.updateCellItem(event.offsetX, event.offsetY);
        }
        $scope.chartModel.ddUpdateCellItem(event.offsetX, event.offsetY);
      }

      // TODO メソッド名はリファクタリング対象
      $scope.enter = function(event) {
        //console.log('enter');
        //console.log('offsetX[' + event.offsetX + '] offsetY[' + event.offsetY + ']');
      };

      // TODO メソッド名はリファクタリング対象
      $scope.leave = function(event) {
        //console.log('leave');
        //console.log('offsetX[' + event.offsetX + '] offsetY[' + event.offsetY + ']');
      };

      $scope.reservationMouseDown = function(event, cellItem) {
        console.log('reservationMouseDown');
        $scope.chartModel.ddMode = true;
        $scope.chartModel.ddStartItem.x = $scope.chartModel.getDrawRectX(event.offsetX);
        $scope.chartModel.ddStartItem.y = $scope.chartModel.getDrawRectY(event.offsetY);
        console.log('$scope.chartModel.ddStartItem.x[' + $scope.chartModel.ddStartItem.x +
              ']$scope.chartModel.ddStartItem.y[' + $scope.chartModel.ddStartItem.y +
              ']');
        $scope.chartModel.drawingCellItem = cellItem;
      };

      $scope.onscroll = function(event) {
        console.log('scroll');
        console.log('scrollTop[' + event.target.scrollTop + ']scrollLeft[' + event.target.scrollLeft + ']');
        $scope.chartModel.headerY = event.target.scrollTop;
        $scope.chartModel.headerX = event.target.scrollLeft;
      };

	}])
	.directive('chart', [function () {
		return {
			templateUrl: 'scripts/directives/chart/chart.html',
			restrict: 'E',
			controller: 'ChartCtrl',
      scope: {
        /**
         * チャート全体の幅
         *
         * @type {Number}
         */
        "chartWidth": "=",
        /**
         * チャート全体の高さ
         *
         * @type {Number}
         */
        "chartHeight": "=",
        /**
         * 卓の配列
         *
         * @type {Array}
         */
        "tableItems": "=",
        /**
         * 予約情報
         *
         * @type {Array}
         */
        "reservationItems": "="
      },
			link: function postLink(scope) {
      }
		};

	}]);
