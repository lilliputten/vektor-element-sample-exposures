/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Data_type_efficiency
 * @overview Расширение модуля обработки полученных данных отчёта (efficiency)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05 11:34:05
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-06-06 21:53:11 +0300 (Вт, 06 июн 2017) $
 * $Id: Report__Data_type_efficiency.js 8558 2017-06-06 18:53:11Z miheev $
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
 * @class Report__Data_type_efficiency
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

var __Data_type_efficiency = /** @lends Report__Data_type_efficiency.prototype */ {

    /** getStatItemsDescription ** {{{ Вспомогательный метод: Получаем описание набора данных для блока статистики.
     * @returns {Object} BEMJSON
     *
     * Информация для статистики отчёта efficiency:
     *
     *   CommonResult - {}
     *   CommonResult.AllDivisionCarCount - int Всего ТС в выбранных подразделениях
     *   CommonResult.AllMonObjectCount - int Доступных КО
     *   CommonResult.AllMonObjectInUse - int Всего использовалось КО
     *   CommonResult.AllNotWorkComplect int Всего неработоспособных НАП
     *
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
            { elem: 'Item', id: 'WorkTime', title: 'Длительность работы', template: durationTemplate },
            { elem: 'Item', id: 'NoDataTime', title: 'Длительность отсутствия связи', template: durationTemplate },
            { elem: 'Item', id: 'AllMonObjectCount', title: 'Доступных КО' },
            { elem: 'Item', id: 'AllDivisionCarCount', title: 'Всего ТС в выбранных подразделениях' },
            { elem: 'Item', id: 'AllMonObjectInUse', title: 'Всего использовалось КО' },
            { elem: 'Item', id: 'AllNotWorkComplect', title: 'Всего неработоспособных НАП' },
        ]);

    },/*}}}*/

    /** calcTotalsForObject ** {{{ Рассчитываем суммарные значения для строки данных отчёта
     * @param {Object} objectTotals - Суммарные данные для текущего объекта
     * @param {Object} rowData - Подготовленные данные строки отчёта.
     */
    calcTotalsForObject : function (objectTotals, rowData) {

        var
            Report__Data = this,
            Report = this.Report
        ;

        // Вызываем родительский метод
        this.__base.apply(this, arguments);

        // Время работы (секунды)
        if ( rowData.WorkTime !== undefined ) {
            objectTotals.WorkTime || ( objectTotals.WorkTime = 0 );
            objectTotals.WorkTime += Number(rowData.WorkTime);
        }

        // Время отсутствия связи (секунды)
        if ( rowData.NoDataTime !== undefined ) {
            objectTotals.NoDataTime || ( objectTotals.NoDataTime = 0 );
            objectTotals.NoDataTime += Number(rowData.NoDataTime);
        }

        // Показываем ли статистику для этого объекта
        objectTotals.show = false;

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

        // Время работы (секунды)
        if ( Number(rowData.WorkTime) ) {
            commonTotals.WorkTime || ( commonTotals.WorkTime = 0 );
            commonTotals.WorkTime += Number(rowData.WorkTime); // Время в секундах -> время в милисекундах
        }

        // Время отсутствия связи (секунды)
        if ( Number(rowData.NoDataTime) ) {
            commonTotals.NoDataTime || ( commonTotals.NoDataTime = 0 );
            commonTotals.NoDataTime += Number(rowData.NoDataTime); // Время в секундах -> время в милисекундах
        }

    },/*}}}*/

};

provide(__Data.declMod({ modName : 'type', modVal : 'efficiency' }, __Data_type_efficiency)); // provide

}); // module


