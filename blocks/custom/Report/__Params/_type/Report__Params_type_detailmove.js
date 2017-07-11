/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Params_type_detailmove
 * @overview Расширение модуля загрузки и инициализации параметров отчёта
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05 11:34:05
 * @version 2017.05.05, 16:13
 *
 * $Date: 2017-07-10 15:04:06 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Params_type_detailmove.js 8721 2017-07-10 12:04:06Z miheev $
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
 * @class Report__Params_type_detailmove
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

var __Params_type_detailmove = /** @lends Report__Params_type_detailmove.prototype */ {

    /** showColumnsList ** {{{ Список полей данных, которые показываем в таблице отчётов
     * @returns {String[]}
     */
    showColumnsList : function () {

        // Данные от "родителя"
        var data = this.__base.apply(this, arguments);

        // Возвращаем полностью переопределённый список
        return data.concat([

            'MovePeriodType',    // Тип периода
            'PeriodTime',        // Длительность
            'BeginTime',         // Время начала периода
            'EndTime',           // Время конца периода
            'Distance',          // Пробег за период
            'SpeedMax',          // Максимальная скорость
            'SpeedAvg',          // Средняя скорость
            // 'SumSpeedAvg',    // Средняя скорость за время движения // ???

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

            /*{{{ MovePeriodType */{
                id : 'MovePeriodType',
                title : 'Тип периода',
                show : true,
                dict : 'MovePeriodType',
                local : true,
            },/*}}}*/
            /*{{{ PeriodTime */{
                id : 'PeriodTime',
                title : 'Длительность',
                show : true,
                type : 'duration',
                local : true,
            },/*}}}*/
            /*{{{ BeginTime */{
                id : 'BeginTime',
                title : 'Начало движения',
                show : true,
                type : 'datetime',
                local : true,
            },/*}}}*/
            /*{{{ EndTime */{
                id : 'EndTime',
                title : 'Окончание движения',
                show : true,
                type : 'datetime',
                local : true,
            },/*}}}*/
            /*{{{ Distance */{
                id : 'Distance',
                title : 'Пробег за период',
                show : true,
                template : '%.3f',
                local : true,
            },/*}}}*/
            /*{{{ SpeedMax */{
                id : 'SpeedMax',
                title : 'Максимальная скорость',
                show : true,
                template : '%.2f',
                local : true,
            },/*}}}*/
            /*{{{ SpeedAvg */{
                id : 'SpeedAvg',
                title : 'Средняя скорость',
                show : true,
                template : '%.2f',
                local : true,
            },/*}}}*/
            // /*{{{ SumSpeedAvg (detailmove) ??? */{
            //     id : 'SumSpeedAvg',
            //     title : 'Средняя скорость за время движения',
            //     show : true,
            //     template : '%.2f',
            //     local : true,
            // },/*}}}*/

        ]);

    },/*}}}*/

    /** reportParamsData ** {{{ */
    reportParamsData : function () {

        var data = this.__base.apply(this, arguments);

        // Дополняем собственными параметрами...

        // Прячем колонки таблицы
        // См. `Report__Content:_getObjectReportGroup` -- Создаём описание одной группы отчёта
        data.hiddenColumns = [
            // 'objID',
            'typeID',
            'name',
            'acInfo.typeID',
        ];

        // Извлекаем параметры отдельных отсчётов в обобщённые данные формируемой строки
        // См. `Report__Data:calcTotalsForObject` -- Извлекаем параметры отдельных отсчётов в обобщённые данные формируемой строки
        data.fetchCommonFields = data.hiddenColumns;

        // Показывать извлечённые параметры в блоке статистики для каждого КО
        // См. `Report__Data:getStatItemsDescription` -- Добавляем описания элементов статистики для показа
        data.showFetchedCommonFields = data.hiddenColumns;

        // Столбцы для показа в `ReportDisplayTitleStat`
        data.titleStatColumns = [
            'typeID',
            'name',
            'acInfo.typeID',
            // 'MovePeriodType',
            'PeriodTime',
            // 'BeginTime',
            // 'EndTime',
            'Distance',
            'SpeedMax',
            'SpeedAvg',
        ];

        return data;

    },/*}}}*/

};

provide(__Params.declMod({ modName : 'type', modVal : 'detailmove' }, __Params_type_detailmove)); // provide

}); // module


