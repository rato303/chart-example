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
      $scope.startSelect = function (event) {
        console.log('startSelect');
        $scope.chartModel.drawMode = true;
        $scope.chartModel.drawingCellItem = $scope.chartModel.createCellItem(event.offsetX, event.offsetY);
        $scope.chartModel.setMouseDownTableIndex(event.offsetY);
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
          $scope.chartModel.setMouseUpTableIndex(event.offsetY);

          $scope.modalInstance = $modal.open({
            controller: 'ReservationDialogCtrl',
            templateUrl: 'scripts/directives/chart/components/dialog/reservation-dialog.html',
            resolve: {
              dialogModel: function() {
                return $scope.chartModel.createDialogModel(event, $scope.tableItems);
              }
            }
          });

          $scope.modalInstance.result.then(function (dialogModel) {
            console.log('確定');
            $scope.reservationItems = $scope.reservationItems.concat(dialogModel.newReservationItems);
            $scope.chartModel.clearDrawingCellItem();
          }, function () {
            console.log('キャンセル');
            $scope.chartModel.clearDrawingCellItem();
          });

        }

        $scope.chartModel.releasesDragMode($scope.reservationItems, $scope.chartWidth, $scope.chartHeight);

        // TODO モデル側にリファクタリング
        if ($scope.chartModel.resizeMode) {
          $scope.chartModel.ddMovingCellItem.setThemeTemporaryReservation();
          $scope.chartModel.resizeMode = false;
        }

      };

      // TODO メソッド名はリファクタリング対象
      $scope.over = function(event, tableItem) {
        console.log('over');
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

        // TODO モデル側にリファクタリング
        var reservationEndY = cellItem.y + $scope.chartModel.reservationHeight;
        var reservationEndX = cellItem.x + cellItem.width;
        var resizeStartX = reservationEndX - 8;
        var resizeStartY = reservationEndY - 8;
        // TODO canResizable? canDraggable?
        if (resizeStartX < event.offsetX && resizeStartY < event.offsetY) {
          $scope.chartModel.resizeMode = true;
        } else {
          $scope.chartModel.isDragState = true;

          $scope.chartModel.ddWaitingCellItem = angular.copy(cellItem);
          $scope.chartModel.ddWaitingCellItem.setThemeDragAndDropWaiting();

          $scope.chartModel.ddMovingCellItem = cellItem;
          $scope.chartModel.ddMovingCellItem.index = index;
          $scope.chartModel.ddMovingCellItem.setThemeDraging();
          $scope.reservationItems.push($scope.reservationItems.splice(index, 1)[0]);
        }

        // TODO モデル側にリファクタリング
        $scope.chartModel.ddStartItem.x = $scope.chartModel.getDrawRectX(event.offsetX);
        $scope.chartModel.ddStartItem.y = $scope.chartModel.getDrawRectY(event.offsetY);
      };

      // TODO jsDoc
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
