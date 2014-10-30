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
          // TODO createDialogModelメソッドを作成して、newReservationItemsとstartTime,endTimeを梱包する
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
            $scope.reservationItems = $scope.reservationItems.concat(dialogModel.selectItems);
            $scope.dialogCloseCommonProcess();
          }, function () {
            console.log('キャンセル');
            $scope.dialogCloseCommonProcess();
          });

        }

        if ($scope.chartModel.ddMode) {
          $scope.chartModel.ddCellItem.opacity = '1.0';
          $scope.chartModel.ddCellItem.fill = 'green';
          $scope.chartModel.ddMode = false;
        }

        if ($scope.chartModel.resizeMode) {
          $scope.chartModel.ddCellItem.opacity = '1.0';
          $scope.chartModel.ddCellItem.fill = 'green';
          $scope.chartModel.resizeMode = false;
        }

      };

      /**
       * TODO chart-model側にリファクタリング
       * ダイアログを閉じる際の共通処理
       */
      $scope.dialogCloseCommonProcess = function() {
        $scope.chartModel.clearDrawingCellItem();
        $scope.moge = {};
      };

      // TODO フィールド名はリファクタリング対象
      $scope.moge = {};
      // TODO メソッド名はリファクタリング対象
      $scope.over = function(event, tableItem) {
        console.log('over');
        if ($scope.chartModel.drawMode) {
          $scope.moge[tableItem.$$hashKey] = tableItem;
        }
        $scope.chartModel.resizeCellItem(event.offsetX, event.offsetY);
        $scope.chartModel.moveCellItem(event.offsetX, event.offsetY);
      };

      /**
       * 予約情報のセルオブジェクト上でマウスを動かした場合の処理
       *
       * @param event mouse-moveイベント
       *
       * @param reservationItem 予約情報
       */
      $scope.reservationMouseMove = function(event, reservationItem) {
        $scope.chartModel.moveCellItem(event.offsetX, event.offsetY);
        $scope.chartModel.resizeCellItem(event.offsetX, event.offsetY);
      };

      /**
       * 描画中のセルオブジェクト上でマウスを動かした場合の処理
       *
       * @param event mouse-moveイベント
       */
      $scope.drawingCellMove = function(event) {
        $scope.chartModel.resizeCellItem(event.offsetX, event.offsetY);
        $scope.chartModel.moveCellItem(event.offsetX, event.offsetY);
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

      /**
       * 予約情報マウス押下処理
       *
       * @param event mouse-downイベント
       *
       * @param index 予約情報の配列のインデックス
       *
       * @param cellItem マウスが押下された予約情報
       */
      $scope.reservationMouseDown = function(event, index, cellItem) {
        console.log('reservationMouseDown');

        var reservationEndY = cellItem.y + $scope.chartModel.reservationHeight;
        var reservationEndX = cellItem.x + cellItem.width;
        var resizeStartX = reservationEndX - 8;
        var resizeStartY = reservationEndY - 8;
        if (resizeStartX < event.offsetX && resizeStartY < event.offsetY) {
          $scope.chartModel.resizeMode = true;
        } else {
          $scope.chartModel.ddMode = true;
        }

        $scope.chartModel.ddStartItem.x = $scope.chartModel.getDrawRectX(event.offsetX);
        $scope.chartModel.ddStartItem.y = $scope.chartModel.getDrawRectY(event.offsetY);
        console.log('$scope.chartModel.ddStartItem.x[' + $scope.chartModel.ddStartItem.x +
              ']$scope.chartModel.ddStartItem.y[' + $scope.chartModel.ddStartItem.y +
              ']');

        cellItem.fill = 'aqua';
        cellItem.opacity = '0.5';
        $scope.chartModel.ddCellItem = cellItem;

        $scope.reservationItems.push(cellItem);
        $scope.reservationItems.splice(index, 1);
      };

      $scope.onScroll = function(event) {
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
