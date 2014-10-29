'use strict';

/**
 * @ngdoc service
 * @name csmMediaAngularApp.customerInputModel
 * @description
 * # customerInputModel
 * Factory in the csmMediaAngularApp.
 */
angular.module('chartExampleApp')
  .factory('chartModel', function () {
    return {
      /** 時間テキストのy軸*/
      "headerLabelY": 14,
      /** 時間ヘッダの高さ */
      "headerHeight": 20,
      /** ヘッダの縦位置 */
      "headerY": 0,
      /** ヘッダの横位置 */
      "headerX": 0,
      /** 分の最小単位 */
      "minuteWidth": 15,
      /** 1時間の分割量 */
      "hourSplitCount": 4,
      /** 1予約分の高さ */
      "reservationHeight": 30,
      /** 時間ヘッダの配列 */
      "headerItems": [],
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
      }
    };
  });
