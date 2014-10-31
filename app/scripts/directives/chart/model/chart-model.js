'use strict';

/**
 * @ngdoc service
 * @name chartExampleApp.chartModel
 * @description
 * # chartModel
 * Factory in the chartExampleApp.
 */
angular.module('chartExampleApp')
  .factory('chartModel', ['CellItemModel', function (CellItemModel) {

    return {
      /** 時間テキストのy軸*/
      "headerLabelY": 14,
      /** 時間ヘッダの高さ */
      "headerHeight": 20,
      /** ヘッダの縦位置 */
      "headerY": 0,
      /** ヘッダの横位置 */
      "headerX": 0,
      // TODO 60をhourSplitCountで割った数をminuteWidthに設定するようにする
      /** 分の最小単位 */
      "minuteWidth": 15,
      /** 1時間の分割量 */
      "hourSplitCount": 4,
      /** 1予約分の高さ */
      "reservationHeight": 30,
      /** 時間ヘッダの配列 */
      "headerItems": [],
      /** 描画モード */
      "drawMode": false,
      /** Drag状態 */
      "isDragState": false,
      /** Resizeモード */
      "resizeMode": false,
      /** Drag & Drop中のセル情報 */
      "ddMovingCellItem": new CellItemModel(),
      /** Drag & Drop待機中のセル情報 */
      "ddWaitingCellItem": new CellItemModel(),
      /** 描画中のセル情報 */
      "drawingCellItem": new CellItemModel(),
      /** Drag & Drop 開始セル情報 */
      "ddStartItem": {
        "x": 0,
        "y": 0
      },
      /** マウス押下時の卓情報のインデックス */
      "mouseDownTableIndex": -1,
      /** マウス開放時の卓情報のインデックス */
      "mouseUpTableIndex": -1,
      /** 卓ヘッダ情報 */
      "tableCaptionItems": [
        {'label': '卓人数', 'x': 0, 'width': 60},
        {'label': '種別', 'x': 60, 'width': 60},
        {'label': '卓名', 'x': 120, 'width': 60},
        {'label': '喫煙', 'x': 180, 'width': 60}
      ],
      /** 卓情報全体の幅 */
      "tableCaptionWidth": 240,
      /**
       * 時間ヘッダの配列を生成します。
       *
       * @param startTime チャート開始時刻
       *
       * @param endTime チャート終了時刻
       *
       * @returns {chartModel} 時間ヘッダ生成後のインスタンス
       */
      "createHeaderItems": function(startTime, endTime) {
        for (var i = startTime; i <= endTime; i++) {
          var label = ('00' + i).slice(-2) + ':00'; // TODO 0埋め関数を作成
          var x = (i * this.minuteWidth * this.hourSplitCount);
          var width = this.minuteWidth * this.hourSplitCount;
          this.headerItems.push({
            'x': x,
            'width': width,
            'labelX': x + this.minuteWidth,
            'label': label
          });
        }
        return this;
      },
      "createDialogModel": function(event, tableItems) {
        var startTime = this.drawingCellItem.startTime;
        var endTime = this.getEndTime(event.offsetX);
        return {
          'startTime': startTime,
          'endTime': endTime,
          'newReservationItems': this.createReservationItems(startTime, endTime, tableItems)
        };
      },
      /**
       * 仮予約情報を生成します。
       *
       * @param startTime 予約開始時刻
       *
       * @param endTime 予約終了時刻
       *
       * @param tableItems 卓情報の配列
       *
       * @returns {Array} 仮予約情報の配列
       */
      "createReservationItems": function(startTime, endTime, tableItems) {

        var newReservationItems = [];
        for (var i = this.mouseDownTableIndex; i < this.mouseUpTableIndex; i++) {
          var tableItem = tableItems[i];
          var newReservationItem = new CellItemModel();
          newReservationItem.setThemeTemporaryReservation();
          newReservationItem.startTime = startTime;
          newReservationItem.endTime = endTime;
          newReservationItem.x = this.timeToX(startTime);
          newReservationItem.y = tableItem.y;
          newReservationItem.height = this.reservationHeight;
          newReservationItem.width = this.timeToX(endTime) - newReservationItem.x;
          newReservationItem.takuNinzu = tableItem.takuNinzu;
          newReservationItem.shubetsu = tableItem.shubetsu;
          newReservationItem.takumei = tableItem.takumei;
          newReservationItem.kitsuen = tableItem.kitsuen;
          newReservationItem.label = '予約者名 ' + '100人';
          newReservationItems.push(newReservationItem);
        }

        return newReservationItems;
      },
      /**
       * 描画中のセル情報をクリアします。
       */
      "clearDrawingCellItem": function () {
        this.drawingCellItem = new CellItemModel();
      },
      /**
       * 新しいセル情報を生成します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @param offsetY イベント発生時のY座標
       *
       * @returns {Object} 新しいセル情報
       */
      "createCellItem": function(offsetX, offsetY) {

        var newCellItem = new CellItemModel();
        newCellItem.x = this.getDrawRectX(offsetX);
        newCellItem.y = this.getDrawRectY(offsetY);
        newCellItem.width = this.minuteWidth;
        newCellItem.height = this.reservationHeight;
        newCellItem.fill = 'pink';
        newCellItem.opacity = '0.9';
        newCellItem.startTime = this.getStartTime(offsetX);

        return newCellItem;
      },
      /**
       * セル情報をリサイズします。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @param offsetY イベント発生時のY座標
       *
       */
      "resizeCellItem": function(offsetX, offsetY) {
        // TODO 左にひっぱった場合の対応が未実装
        var targetCellItem = null;

        if (this.drawMode) {
          targetCellItem = this.drawingCellItem;
          var newRectHeight = (this.getDrawRectY(offsetY) + this.reservationHeight) - targetCellItem.y;
          targetCellItem.height = newRectHeight;
        }
        if (this.resizeMode) {
          targetCellItem = this.ddMovingCellItem;
        }

        if (targetCellItem == null) { return; }

        var newRectWidth = (this.getDrawRectX(offsetX) + this.minuteWidth) - targetCellItem.x;
        targetCellItem.width = newRectWidth;

      },
      /**
       * セル情報を移動します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @param offsetY イベント発生時のY座標
       */
      "moveCellItem": function(offsetX, offsetY) {
        var targetCellItem = null;
        if (this.isDragState) {
          targetCellItem = this.ddMovingCellItem;
        }

        if (targetCellItem == null) { return; }

        var afterX = this.getDrawRectX(offsetX);
        var afterY = this.getDrawRectY(offsetY);
        var newX = targetCellItem.x - (this.ddStartItem.x - afterX);
        var newY = targetCellItem.y - (this.ddStartItem.y - afterY);

        targetCellItem.x = newX;
        targetCellItem.y = newY;
        this.ddStartItem.x = afterX;
        this.ddStartItem.y = afterY;
      },
      /**
       * 描画を開始するX座標を取得します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @returns {number}
       */
      "getDrawRectX": function(offsetX) {
        return offsetX === 0 ? 0 : Math.floor((offsetX - this.tableCaptionWidth) / this.minuteWidth) * this.minuteWidth;
      },
      /**
       * 描画を開始するY座標を取得します。
       *
       * @param offsetY イベント発生時のY座標
       *
       * @returns {number}
       */
      "getDrawRectY": function(offsetY) {
        var absoluteY = offsetY - this.headerHeight;
        return absoluteY === 0 ? 0 : Math.floor(absoluteY / this.reservationHeight) * this.reservationHeight + this.headerHeight;
      },
      /**
       * 選択開始時刻を取得します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @returns {String}
       */
      "getStartTime": function(offsetX) {
        var startX = this.getDrawRectX(offsetX);
        return this.xToTime(startX);
      },
      /**
       * 選択終了時刻を取得します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @returns {String}
       */
      "getEndTime": function(offsetX) {
        var endX = this.minuteWidth + this.getDrawRectX(offsetX);
        return this.xToTime(endX);
      },
      /**
       * X座標に位置する時刻を取得します。
       *
       * @param targetX イベント発生時のX座標
       *
       * @returns {string}
       */
      "xToTime": function(targetX) {
        var minuteCount = targetX / this.minuteWidth;
        var hour = Math.floor(minuteCount / this.hourSplitCount);
        var minute = minuteCount % this.hourSplitCount * this.minuteWidth;
        return ('00' + String(hour)).slice(-2) + ':' + ('00' + String(minute)).slice(-2);
      },
      /**
       * 時刻に位置するX座標を取得します。
       *
       * @param time X座標を取得する時刻
       *
       */
      "timeToX": function(time) {
        var timeArr = time.split(":");

        var hour = Number(timeArr[0]);
        var minute = Number(timeArr[1]);

        minute += this.minuteWidth * this.hourSplitCount * hour;

        return minute;
      },
      /**
       * マウス押下時の卓情報のインデックスを設定します。
       *
       * @param offsetY イベント発生時のY座標
       *
       */
      "setMouseDownTableIndex": function(offsetY) {
        this.mouseDownTableIndex = this.getYtoTableIndex(offsetY, Math.floor);
      },
      /**
       * マウス開放時の卓情報のインデックスを設定します。
       *
       * @param offsetY イベント発生時のY座標
       *
       */
      "setMouseUpTableIndex": function(offsetY) {
        this.mouseUpTableIndex = this.getYtoTableIndex(offsetY, Math.ceil);
        console.log('(offsetY - this.headerHeight)[' + (offsetY - this.headerHeight) +']');
        console.log('mouseUpTableIndex[' + this.mouseUpTableIndex +']');
      },
      /**
       * Y座標に値する卓情報のインデックスを取得します。
       *
       * @param offsetY 取得する卓情報のY座標
       *
       * @returns {number} 卓情報のインデックス
       */
      "getYtoTableIndex": function(offsetY, mathFunc) {
        return mathFunc((offsetY - this.headerHeight) / this.reservationHeight);
      },
      /**
       * Drag状態を解放します。
       *
       * @param reservationItems 予約情報
       *
       * @param chartWidth チャートの幅
       *
       * @param chartHeight チャートのたkさ
       *
       */
      "releasesDragMode": function(reservationItems, chartWidth, chartHeight) {
        if (this.isDragState) {

          //var dropSuccess = true;
          //
          //if (this.ddMovingCellItem.isOutsideOfDropArea(this.tableCaptionWidth, chartWidth, this.headerHeight, chartHeight)) {
          //
          //}
          //
          //var _this = this;
          //angular.forEach(reservationItems, function(reservationCellItem, index) {
          //  if (_this.ddMovingCellItem.isOverlap(reservationCellItem)) {
          //    dropSuccess = false;
          //    return true;
          //  }
          //});

          if (this.isIllegalDrop(reservationItems, chartWidth, chartHeight)) {
          //if (dropSuccess) {
            console.log('isIllegalDrop');
            this.ddMovingCellItem.x = this.ddWaitingCellItem.x;
            this.ddMovingCellItem.y = this.ddWaitingCellItem.y;
          }
          this.ddMovingCellItem.setThemeTemporaryReservation();
          this.ddWaitingCellItem = new CellItemModel();
          this.isDragState = false;

        }
      },
      "isIllegalDrop": function(reservationItems, chartWidth, chartHeight) {

        if (this.ddMovingCellItem.iIllegaDropArea(this.tableCaptionWidth, chartWidth, this.headerHeight, chartHeight)) {
          return true;
        }

        var isOverlap = true;
        var _this = this;
        angular.forEach(reservationItems, function(reservationCellItem, index) {
          if (_this.ddMovingCellItem.isOverlap(reservationCellItem)) {
            isOverlap = false;
            return true;
          }
        });

        return isOverlap;
      }

    };
  }]);
