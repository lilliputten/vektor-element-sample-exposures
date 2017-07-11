/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Data_type_milage
 * @overview Расширение модуля обработки полученных данных отчёта (milage)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05, 20:07
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-06-06 21:53:11 +0300 (Вт, 06 июн 2017) $
 * $Id: Report__Data_type_milage.js 8558 2017-06-06 18:53:11Z miheev $
 *
 */

modules.define('Report__Data', [
        'i-bem-dom',
        'vow',
        'project',
        'jquery',
    ],
    function(provide,
        BEMDOM,
        vow,
        project,
        $,
    __Data) {

/**
 *
 * @exports
 * @class Report__Data_type_milage
 * @bem
 * @classdesc __INFO__
 *
 * TODO
 * ====
 *
 * ОПИСАНИЕ
 * ========
 *
 */

// Ссылка на описание модуля
var __module = this;

var __Data_type_milage = /** @lends Report__Data_type_milage.prototype */ {

    // Переопределяемые методы для отчёта milage...

    /** getStatItemsDescription ** {{{ Вспомогательный метод: Получаем описание набора данных для блока статистики.
     * @returns {Object} BEMJSON
     */
    getStatItemsDescription : function () {

        var

            Report__Data = this,
            Report = this.Report,

            // Шаблон для расстояния
            distTemplate = Report.params.distTemplate,

            // Шаблон для периода времени (секунды)
            durationTemplate = Report.params.durationSecTemplate,

            // Данные от родителя
            data = this.__base.apply(this, arguments)
        ;

        return data.concat([
            { elem: 'Item', id: 'Dist', title: 'Суммарный пробег', template: distTemplate },
            { elem: 'Item', id: 'MoveTime', title: 'Суммарное время', template: durationTemplate },
        ]);

    },/*}}}*/

    /** calcCommonTotalsForRow ** {{{ Рассчитать общие суммарные по текущей строке данных
     * @param {Object} commonTotals - Общие суммарные данные (изменяется)
     * @param {Object} rowData - Подготовленные данные строки отчёта
     */
    calcCommonTotalsForRow : function (commonTotals, rowData) {

        var

            Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData

        ;

        // Вызываем родительский метод
        this.__base.apply(this, arguments);

        // Дистанция
        if ( Number(rowData.Dist) ) {
            commonTotals.Dist || ( commonTotals.Dist = 0 );
            commonTotals.Dist += Number(rowData.Dist); // Время в секундах -> время в милисекундах
        }

        // Время работы (секунды)
        if ( Number(rowData.MoveTime) ) {
            commonTotals.MoveTime || ( commonTotals.MoveTime = 0 );
            commonTotals.MoveTime += Number(rowData.MoveTime); // Время в секундах -> время в милисекундах
        }

    },/*}}}*/

};

provide(__Data.declMod({ modName : 'type', modVal : 'milage' }, __Data_type_milage)); // provide

}); // module


