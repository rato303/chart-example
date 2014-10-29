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

		// 卓の数
		var _tableItems = [];
		for (var i = 0; i < 100; i++) {
			var y = i * 30 + $scope.chartModel.headerHeight;
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

		// 描画モード
		$scope.drawMode = false;

		// Drag & Drop モード
		$scope.ddMode = false;

		/** 描画中のセル情報 */
		$scope.drawingCellItem = null;

		// Drag & Drop 開始セル情報
		$scope.ddStartItem = {
			'x': null,
			'y': null
		};

		// 卓ヘッダ情報
		$scope.tableCaptionItems = [
			{'label': '卓人数', 'x': 0, 'width': 60},
			{'label': '種別', 'x': 60, 'width': 60},
			{'label': '卓名', 'x': 120, 'width': 60},
			{'label': '喫煙', 'x': 180, 'width': 60}
		];

		// 卓情報全体の幅
		$scope.tableCaptionWidth = 240;

    /**
     * 新規追加中の予約情報
     * @type {null}
     */
    $scope.newReservationItem = null;

    /**
     * 予約情報
     *
     * @type {Array}
     */
    $scope.reservationItems = [];

		/**
		 * 予約情報の選択を開始します。
		 *
		 * @param event mouse-downイベント
		 *
		 */
		$scope.startSelect = function (event, tableItem) {
			console.log('startSelect');
			$scope.drawMode = true;
      $scope.moge[tableItem.$$hashKey] = tableItem;
			$scope.drawingCellItem = $scope.createCellItem(event.offsetX, event.offsetY);
		};

		/**
		 * 予約情報の選択を終了します。
		 *
		 * @param event mouse-upイベント
		 *
		 */
		$scope.endSelect = function(event) {
			console.log('endSelect');

			if ($scope.drawMode) {
				$scope.drawMode = false;

        var startTime = $scope.drawingCellItem.startTime;
        var endTime = $scope.getEndTime(event.offsetX);
        // TODO 関数化する
        var newReservationItems = [];

        for (var key in $scope.moge) {
          var newReservationItem = $scope.moge[key];
          newReservationItems.push({
            "startTime": startTime,
            "endTime": endTime,
            "y": newReservationItem.y,
            "takuNinzu": newReservationItem.takuNinzu,
            "shubetsu": newReservationItem.shubetsu,
            "takumei": newReservationItem.takumei,
            "kitsuen": newReservationItem.kitsuen
          });
        }

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

			if ($scope.ddMode) {
				$scope.ddMode = false;
			}

		};

    /**
     * ダイアログを閉じる際の共通処理
     */
    $scope.dialogCloseCommonProcess = function() {
      $scope.drawingCellItem = {"x" : 0, "y" : 0, "height": 0, "width" : 0};
      $scope.moge = {};
    };

    // TODO フィールド名はリファクタリング対象
    $scope.moge = {};
		// TODO メソッド名はリファクタリング対象
		$scope.over = function(event, tableItem) {
      console.log('over');
      if ($scope.drawMode) {
        $scope.moge[tableItem.$$hashKey] = tableItem;
        $scope.updateCellItem($scope.drawingCellItem, event.offsetX, event.offsetY);
      }
      $scope.ddModeProcess(event);

    };

    $scope.drawingCellMove = function(event) {
      if ($scope.drawMode) {
        $scope.updateCellItem($scope.drawingCellItem, event.offsetX, event.offsetY);
      }
      $scope.ddModeProcess(event);
    }

    $scope.ddModeProcess = function(event) {
      if ($scope.ddMode) {
        $scope.ddUpdateCellItem($scope.drawingCellItem, event.offsetX, event.offsetY);
      }
    };

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
      $scope.ddMode = true;
      $scope.ddStartItem.x = $scope.getDrawRectX(event.offsetX);
      $scope.ddStartItem.y = $scope.getDrawRectY(event.offsetY);
      console.log('$scope.ddStartItem.x[' + $scope.ddStartItem.x +
            ']$scope.ddStartItem.y[' + $scope.ddStartItem.y +
            ']');
      $scope.drawingCellItem = cellItem;
    };

    $scope.onscroll = function(event) {
      console.log('scroll');
      console.log('scrollTop[' + event.target.scrollTop + ']scrollLeft[' + event.target.scrollLeft + ']');
      $scope.chartModel.headerY = event.target.scrollTop;
      $scope.chartModel.headerX = event.target.scrollLeft;
    };

    /**
     * 新しいセル情報を生成します。
     *
     * @param offsetX イベント発生時のX座標
     *
     * @param offsetY イベント発生時のY座標
     *
     */
    $scope.createCellItem = function(offsetX, offsetY) {
      var drawRectX = $scope.getDrawRectX(offsetX);
      var drawRectY = $scope.getDrawRectY(offsetY);
      var drawRectWidth = $scope.chartModel.minuteWidth;
      var drawRectHeight = $scope.chartModel.reservationHeight;

      var newCellItem = {
        'x': drawRectX,
        'y': drawRectY,
        'width': drawRectWidth,
        'height': drawRectHeight,
        'fill': 'pink',
        'opacity': 0.9,
        'startTime': $scope.getStartTime(offsetX)
      };

      return newCellItem;
    };

    /**
     * セル情報を更新します。
     *
     * @param drawingCellItem 描画中のセル情報
     *
     * @param offsetX イベント発生時のX座標
     *
     * @param offsetY イベント発生時のY座標
     *
     */
    $scope.updateCellItem = function(drawingCellItem, offsetX, offsetY) {
      // TODO 左にひっぱった場合の対応が未実装

      var newRectWidth = ($scope.getDrawRectX(offsetX) + $scope.chartModel.minuteWidth) - drawingCellItem.x;
      var newRectHeight = ($scope.getDrawRectY(offsetY) + $scope.chartModel.reservationHeight) - drawingCellItem.y;
      drawingCellItem.width = newRectWidth;
      drawingCellItem.height = newRectHeight;

    };

		/**
		 * Drag & Drop 中のセル情報を更新します。
		 *
		 * @param targetCellItem Drag & Drop中のセル情報
		 *
		 * @param offsetX イベント発生時のX座標
		 *
		 * @param offsetY イベント発生時のY座標
		 */
		$scope.ddUpdateCellItem = function(targetCellItem, offsetX, offsetY) {
			var afterX = $scope.getDrawRectX(offsetX);
			var afterY = $scope.getDrawRectY(offsetY);
			var newX = targetCellItem.x - ($scope.ddStartItem.x - afterX);
			var newY = targetCellItem.y - ($scope.ddStartItem.y - afterY);

			targetCellItem.x = newX;
			targetCellItem.y = newY;
			$scope.ddStartItem.x = afterX;
			$scope.ddStartItem.y = afterY;
		};

    /**
     * 描画を開始するX座標を取得します。
     *
     * @param offsetX イベント発生時のX座標
     *
     * @returns {number}
     */
		$scope.getDrawRectX = function(offsetX) {
			return offsetX === 0 ? 0 : Math.floor((offsetX - $scope.tableCaptionWidth) / $scope.chartModel.minuteWidth) * $scope.chartModel.minuteWidth;
		};

    /**
     * 描画を開始するY座標を取得します。
     *
     * @param offsetY イベント発生時のY座標
     *
     * @returns {number}
     */
		$scope.getDrawRectY = function(offsetY) {
			var absoluteY = offsetY - $scope.chartModel.headerHeight;
			return absoluteY === 0 ? 0 : Math.floor(absoluteY / $scope.chartModel.reservationHeight) * $scope.chartModel.reservationHeight + $scope.chartModel.headerHeight;
		};

    /**
     * 選択開始時刻を取得します。
     *
     * @param offsetX イベント発生時のX座標
     *
     * @returns {String}
     */
    $scope.getStartTime = function(offsetX) {
      var startX = $scope.getDrawRectX(offsetX);
      return $scope.getTime(startX);
    };

    /**
     * 選択終了時刻を取得します。
     *
     * @param offsetX イベント発生時のX座標
     *
     * @returns {String}
     */
    $scope.getEndTime = function(offsetX) {
      var endX = $scope.chartModel.minuteWidth + $scope.getDrawRectX(offsetX);
      return $scope.getTime(endX);
    };

    /**
     * X座標に位置する時刻を取得します。
     *
     * @param targetX イベント発生時のX座標
     *
     * @returns {string}
     */
    $scope.getTime = function(targetX) {
      var minuteCount = targetX / $scope.chartModel.minuteWidth;
      var hour = Math.floor(minuteCount / $scope.chartModel.hourSplitCount);
      var minute = minuteCount % $scope.chartModel.hourSplitCount * $scope.chartModel.minuteWidth;
      return ('00' + String(hour)).slice(-2) + ':' + ('00' + String(minute)).slice(-2);
    };

	}])
	.directive('chart', [function () {
		return {
			templateUrl: 'scripts/directives/chart/chart.html',
			restrict: 'E',
			controller: 'ChartCtrl',
      scope: {
        /** チャート全体の幅 */
        "chartWidth": "=",
        /** チャート全体の高さ */
        "chartHeight": "="
      },
			link: function postLink(scope) {
      }
		};

	}]);
