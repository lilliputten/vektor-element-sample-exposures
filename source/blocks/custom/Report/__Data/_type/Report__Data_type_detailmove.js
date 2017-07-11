/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Data_type_detailmove
 * @overview Расширение модуля обработки полученных данных отчёта (detailmove)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05 11:34:05
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Data_type_detailmove.js 8728 2017-07-10 16:23:49Z miheev $
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
 * @class Report__Data_type_detailmove
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

var __Data_type_detailmove = /** @lends Report__Data_type_detailmove.prototype */ {

    _getDefaultParams : function () {/*{{{*/

        var data = this.__base.apply(this, arguments);

        return Object.assign({}, data, {
            // Данные для выноса в общую стутистику объекта
            fetchCommonFields : [
                'acInfo.typeID',
                'objID',
                'name',
                'typeID',
            ],
        });

    },/*}}}*/

    /** getStatItemsDescription ** {{{ Вспомогательный метод: Получаем описание набора данных для блока статистики.
     * @param {Object} [options] - Параметры создания шаблона
     * @returns {Object} BEMJSON
     */
    getStatItemsDescription : function (options) {

        options = ( options && typeof options === 'object' ) ? options : this.Report.Modules.Params.getDefaultStatOptions();

        var

            Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Все необходимые словари должны быть уже загружены (для поля `MovePeriodType`; см. ниже)
            dictMovePeriodtype = app.get_stored_dict_data('MovePeriodType'),

            // Шаблон для расстояния
            distTemplate = Report.params.distTemplate,

            // Шаблон для периода времени
            durationTemplate = Report.params.durationTemplate,

            // Данные от родителя
            data = this.__base.apply(this, arguments)
        ;

        // Проверяем наличие словаря (должен быть загружен из описания колонок данных для поля MovePeriodType)
        if ( !dictMovePeriodtype ) {
            var error = 'Не загружен словарь MovePeriodType!';
            console.error( error );
            /*DEBUG*//*jshint -W087*/debugger;
            throw new Error (error);
        }

        // Добавить описания извлечённых параметров для показа в блоке статистики (см. Report__Params:reportParamsData)
        Array.isArray(Report.params.showFetchedCommonFields) && Report.params.showFetchedCommonFields.map(function(id){
            // fromCombined -- брать описания данных из объединённого загрузчика (combinedDataloader)
            data.push({ elem : 'Item', id : id, fromCombined : true });
        });

        // Добавляем описания остальных (специфичных для отчёта) параметров
        data = data.concat([
            { elem : 'Item', id : 'Distance', title : 'Дистанция', template : distTemplate },
            { elem : 'Item', id : 'SpeedMax', title : 'Макс.скорость', template : distTemplate },
            {
                elem : 'Item',
                id : 'SpeedAvg',
                average : true,
                title : 'Средняя скорость',
                template : distTemplate
            }, // average=true -- в значении ожидается массив, применяется метод `helpers.average`.
            {
                elem : 'Item',
                id : 'PeriodTime',
                title : 'Общее время движения',
                template : durationTemplate
            },
        ]);

        // Длительности периодов
        data = data.concat(Object.keys(dictMovePeriodtype).map(function (id, n) {
            var itemId = 'MovePeriodType' + Number(id),
                itemTitle = dictMovePeriodtype[id] // 'Длительность ('+dictMovePeriodtype[id]+')'
            ;
            // Добавляем в список отображаемых в `ReportDisplayTitleStat` колонок
            if ( !Report.params.titleStatColumns.includes(itemId) ) {
                Report.params.titleStatColumns.push(itemId);
            }
            // Возвращаем описание
            return {
                elem : 'Item',
                id : itemId,
                title : itemTitle,
                // промежуток времени См. project.helpers.sformat
                template : durationTemplate,
                // conditions : { print : true }, // Проверка условий для `ReportDisplayTitleStat`
            };
        }));

        return data;

    },/*}}}*/

    /** cleanupRowData ** {{{ Удалить "пустые" параметры из данных строки отчёта
     * @param {Object} rowData - Подготовленные данные строки отчёта
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     */
    cleanupRowData : function (rowData, options) {

        var Report__Data = this,
            Report = this.Report
        ;

        // Вызываем родительский метод
        this.__base.apply(this, arguments);

        // ВНИМАНИЕ!!! Если тип "Нет данных" (`=== 3`, см. словарь `MovePeriodType`)
        if ( rowData.MovePeriodType && rowData.MovePeriodType === 3 && Array.isArray(Report.params.deleteZeroRowDataParams) ) {
            // Удаляем нулевые значения
            Report.params.deleteZeroRowDataParams.map(function (id) {
                if ( rowData[id] !== undefined && rowData[id] === 0 ) {
                    delete rowData[id];
                }
            });
        }

    },/*}}}*/

    /** calcTotalsForObject ** {{{ Рассчитываем суммарные значения для строки данных отчёта
     * @param {Object} objectTotals - Суммарные данные для текущего объекта
     * @param {Object} rowData - Подготовленные данные строки отчёта. Объект изменяется.
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     */
    calcTotalsForObject : function (objectTotals, rowData, options) {

        var
            Report__Data = this,
            Report = this.Report,

            fetchCommonFields = Report.params.fetchCommonFields
        ;

        // Вызываем родительский метод
        this.__base.apply(this, arguments);

        // Извлекаем параметры отдельных отсчётов в обобщённые данные формируемой строки (см. Report__Params:reportParamsData)
        Array.isArray(fetchCommonFields) && fetchCommonFields.map(function(id){
            objectTotals[id] = rowData[id];
        }, this);

        // Рассчитываем общие значения (objectTotals)
        // MovePeriodType: {1: "Стоянка", 2: "Движение", 3: "Нет данных"}
        if ( rowData.MovePeriodType === 2 && rowData.PeriodTime ) {
            // Отдельные времена движения для каждого типа периода
            // См. ответное описание данных в `getReportStatBemjson:statItemsDescr`
            // objectTotals.MovePeriodType || ( objectTotals.MovePeriodType = {} );
            objectTotals['MovePeriodType'+rowData.MovePeriodType] || ( objectTotals['MovePeriodType'+rowData.MovePeriodType] = 0 );
            objectTotals['MovePeriodType'+rowData.MovePeriodType] += rowData.PeriodTime;
            // Общее время движения
            objectTotals.PeriodTime || ( objectTotals.PeriodTime = 0 );
            objectTotals.PeriodTime += rowData.PeriodTime;
        }

        // Средняя скорость -- М.б., делить дистанцию на общее время?
        if ( rowData.SpeedAvg ) {
            ( objectTotals.SpeedAvg || ( objectTotals.SpeedAvg = []) ).push(rowData.SpeedAvg);
        }

        // Дистанция
        if ( rowData.Distance ) {
            objectTotals.Distance || ( objectTotals.Distance = 0 );
            objectTotals.Distance += rowData.Distance;
        }

        // Максимальная скорость
        if ( rowData.SpeedMax && ( !objectTotals.SpeedMax || rowData.SpeedMax > objectTotals.SpeedMax ) ) {
            objectTotals.SpeedMax = rowData.SpeedMax;
        }

        // Показываем ли статистику для этого объекта
        objectTotals.show = true;

    },/*}}}*/

    /** calcCommonTotalsForRow ** {{{ Рассчитать общие суммарные по текущей строке данных
     * @param {Object} commonTotals - Общие суммарные данные (изменяется)
     * @param {Object} rowData - Подготовленные данные строки отчёта
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     */
    calcCommonTotalsForRow : function (commonTotals, rowData, options) {

        var

            Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData

        ;

        // Вызываем родительский метод
        this.__base.apply(this, arguments);

        // Дистанция
        if ( rowData.Distance ) {
            commonTotals.Distance || ( commonTotals.Distance = 0 );
            commonTotals.Distance += rowData.Distance;
        }

        // Максимальная скорость
        if ( rowData.SpeedMax && ( !commonTotals.SpeedMax || rowData.SpeedMax > commonTotals.SpeedMax ) ) {
            commonTotals.SpeedMax = rowData.SpeedMax;
        }

    },/*}}}*/

    /** processReceivedDataItem ** {{{ Обработать один элемент данных отчёта (переопределение)
     * @param {Object} dataItem - Данные одной записи (периода; могут не содержать информации о КО -- IdMonObject)
     * @param {Number} [IdMonObject] - Идентификатор объекта (если не задан, должен быть определён `options.objectId`)
     * @param {Object[]} ListDetailMovePeriod - Набор отсчётов по данному элементу (массив объектов данных)
     */
    processReceivedDataItem : function (dataItem) {

        var Report__Data = this, // _type_detailmove
            Report = this.Report,
            that = this,

            // Параметры записи отчёта (информация о КО)
            options = that.getReportItemOptions(dataItem)
        ;

        // Если список периодов...
        if ( Array.isArray(dataItem.ListDetailMovePeriod) ) {
            dataItem.ListDetailMovePeriod.map(function(data){
                // Вызываем родительский (переопределяемый) метод для каждого набора данных
                that.__base(data, options);
            });
        }

    },/*}}}*/

};

provide(__Data.declMod({ modName : 'type', modVal : 'detailmove' }, __Data_type_detailmove)); // provide

}); // module


