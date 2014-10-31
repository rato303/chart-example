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

      // TODO 全体のmouseMove jsDoc
      $scope.chartMouseMove = function(event) {
        $scope.chartModel.resizeCellItem(event.offsetX, event.offsetY);
        $scope.chartModel.moveCellItem(event.offsetX, event.offsetY);
      };

      /**
       * 卓情報上のMouseDown処理です。
       * 新規予約情報の選択を開始します。
       *
       * @param event MouseDownイベント
       *
       * @param index MouseDown時の卓情報のインデックス
       *
       */
      $scope.tableMouseDown = function(event, index) {
        $scope.chartModel.drawMode = true;
        $scope.chartModel.drawingCellItem = $scope.chartModel.createCellItem(event.offsetX, event.offsetY);
        $scope.chartModel.setMouseDownTableIndex(index);
      };

      // TODO 全体のmouseUp jsDoc
      $scope.chartMouseUp = function(event) {
        console.log('chartMouseUp');
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

      /** チャートの情報 */
      $scope.chartModel = chartModel.createHeaderItems(0, 24);

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
