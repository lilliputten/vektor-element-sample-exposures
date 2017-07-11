/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Params_type_milage
 * @overview Расширение модуля загрузки и инициализации параметров отчёта
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05 11:34:05
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-06-02 17:43:07 +0300 (Пт, 02 июн 2017) $
 * $Id: Report__Params_type_milage.js 8479 2017-06-02 14:43:07Z miheev $
 *
 */

modules.define('Report__Params', [
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
    __Params) {

/**
 *
 * @exports
 * @class Report__Params_type_milage
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

var __Params_type_milage = /** @lends Report__Params_type_milage.prototype */ {

    /** showColumnsList ** {{{ Список полей данных, которые показываем в таблице отчётов
     * @returns {String[]}
     */
    showColumnsList : function () {

        var data = this.__base.apply(this, arguments);

        return data.concat([

            'MoveTime',          // Длительность
            'Dist',              // Пробег за период
            'AvgSpeed',          // Средняя скорость за период запроса
            'AvgMoveSpeed',      // Средняя скорость за время движения

        ]);

    },/*}}}*/

    /** ownReportColumns ** {{{ Описание полей данных для показа отчёта
     *
     * Описания данных, которые не приходят с сервера. Описания колонок,
     * представляющих базовые свойства КО, будут браться из `koDataloader`.
     *
     * Порядок показа колонок таблицы задаётся массивом `showColumnList`
     *
     * Перечислены общие данные. Предполагается расширение своими данными для каждого типа отчёта.
     *
     * Формат описания данных см. в TCMAdministrationController.
     *
     * @returns {Object[]} */
    ownReportColumns : function () {

        // Данные от "родителя"
        var data = this.__base.apply(this, arguments);

        return data.concat([

            /*{{{ Dist */{
                id : 'Dist',
                title : 'Пробег за период',
                show : true,
                template : '%.3f',
                local : true,
            },/*}}}*/
            /*{{{ MoveTime */{
                id : 'MoveTime',
                title : 'Длительность',
                show : true,
                type : 'duration_s',
                // template : '%T',
                local : true,
            },/*}}}*/
            /*{{{ AvgSpeed */{
                id : 'AvgSpeed',
                title : 'Средняя скорость за период запроса',
                show : true,
                template : '%.2f',
                local : true,
            },/*}}}*/
            /*{{{ AvgMoveSpeed */{
                id : 'AvgMoveSpeed',
                title : 'Средняя скорость за период запроса',
                show : true,
                template : '%.2f',
                local : true,
            },/*}}}*/

        ]);

    },/*}}}*/

};

provide(__Params.declMod({ modName : 'type', modVal : 'milage' }, __Params_type_milage)); // provide

}); // module

