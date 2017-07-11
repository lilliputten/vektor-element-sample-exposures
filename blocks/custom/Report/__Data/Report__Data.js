/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Data
 * @overview Блок-функционал для обработки полученных данных
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-06-26 19:56:05 +0300 (Пн, 26 июн 2017) $
 * $Id: Report__Data.js 8630 2017-06-26 16:56:05Z miheev $
 *
 */

modules.define('Report__Data', [
    'ReportDisplay',
    'ReportDisplayGroup',
    'vow',
    'i-bem-dom',
    'project',
    'objects',
    'jquery',
],
function(provide,
    ReportDisplay,
    ReportDisplayGroup,
    vow,
    BEMDOM,
    project,
    objects,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__Data
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

var __Data = /** @lends Report__Data.prototype */ {

    /** exportData ** {{{ Экспортируем данные для печати/экспорта из объектов в созданном DOM
     * @returns {Object}
     */
    exportData : function (conditions) {

        var ReportDisplayBlock = this.Report.findChildBlock(ReportDisplay);

        return ReportDisplayBlock.exportData(conditions);

    },/*}}}*/

    /** getStatItemsDescription ** {{{ Вспомогательный метод: Получаем описание набора данных для блока статистики.
     * @returns {Object} BEMJSON
     * Вызвается и кэшируется в Report__ResultDom:createPreparedData
     */
    getStatItemsDescription : function () {

        /*
         * BeginTime : 1480280400000
         * BeginTimeStr : "28.11.2016 00:00"
         * EndTime : 1480366800000
         * EndTimeStr : "29.11.2016 00:00"
         * ReportTime : 1495539856926
         * ReportTimeStr : "23.05.2017 14:44"
         * list : Array(1)
         * op : "detailmove"
         * title : "Базовый модуль показа отчётов"
         * userID : 134
         * username : "555"
         */
        return [
            { elem: 'Item', id: 'ReportTimeStr', title: 'Время создания отчёта', conditions : { export : true, print : true } },
            { elem: 'Item', id: 'BeginTimeStr', title: 'Начало периода', conditions : { export : true, print : true } },
            { elem: 'Item', id: 'EndTimeStr', title: 'Конец периода', conditions : { export : true, print : true } },
            { elem: 'Item', id: 'title', title: 'Название отчёта', conditions : { hidden : true } },
            { elem: 'Item', id: 'username', title: 'Имя пользователя', conditions : { export : true, print : true } },
            // { elem: 'Item', id: 'WorkTime', title: 'Длительность работы', template: durationTemplate },
        ];

    },/*}}}*/

    /** getStatReportCommonData ** {{{ Данные для общей статистики */
    getStatReportCommonData : function () {

        var
            // Данные отчёта
            reportData = this.Report.params.reportData || {},

            // Статистика
            totals = reportData.totals || {}
        ;

        return totals.common;

    },/*}}}*/

    /** getStatReportObjectsData ** {{{ Данные для пообъектной статистики */
    getStatReportObjectsData : function () {

        var
            // Данные отчёта
            reportData = this.Report.params.reportData || {},

            // Статистика
            totals = reportData.totals || {}
        ;

        return Object.keys(totals.objects)
            .filter(function(id){
                return totals.objects[id] && totals.objects[id].show;
            })
            .map(function(id){
                return {
                    elem : 'Group',
                    elemMods : {
                        sub : true,
                    },
                    title : 'Объект : ' + totals.objects[id].name,
                    data : totals.objects[id],
                };
            })
        ;

    },/*}}}*/

    /** combineReportColumns() ** {{{ Собираем описания колонок для отчёта
     * По списку из поисаний колонок отчёта по умолчанию (Report.params.ownReportColumns) и колонок КО (Report.params.koDataColumns)
     * @param {string[]} columns_list - Список колонок (См. Report.params.showColumnsList)
     * TODO: Сделать универсальную процедуру, собирающую набор данных из списка источников?
     */
    combineReportColumns : function (columns_list) {

        var Report__Data = this,
            Report = this.Report,

            // Собственные описания данных
            ownColumnsIndices = Report.params.ownReportColumns.map(function (item) {
                return item.id;
            }),

            // Общие описания данных для списка КО
            koColumnsIndices = Report.params.koDataColumns.map(function (item) {
                return item.id;
            }),

            // TODO: Оптимизировать (?)
            columns = Report.params.showColumnsList
                .map(function (id) {
                    var n;
                    if ( ( n = ownColumnsIndices.indexOf(id) ) !== -1 ) {
                        // return project.helpers.extend({}, Report.params.ownReportColumns[n]);
                        return Report.params.ownReportColumns[n];
                    }
                    if ( ( n = koColumnsIndices.indexOf(id) ) !== -1 ) {
                        // return project.helpers.extend({}, Report.params.koDataColumns[n]);
                        return Report.params.koDataColumns[n];
                    }
                })
                .map(function(column){
                    return Object.assign({}, column, {
                        show : true,
                    });
                })

        ;

        return columns;

    },/*}}}*/

    /** getReportItemOptions ** {{{ Подготовить параметры КО для элемента данных отчёта
     * @param {Object} reportItem - Данные одной записи (периода)
     * @returns {Object} - Параметры
     */
    getReportItemOptions : function (reportItem) {

        var Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Контроллер данных фильтра КО
            koDataloader = Report.Modules.KOFilter.params.dataloader,

            // Идентификатор объекта
            objectId = reportItem.IdMonObject,
            // Номер строки объекта в koDataloader
            objectRowNo = koDataloader.get_row_no_by_object_id(objectId),
            // Массив данных для объекта
            object = koDataloader.get_row_data(objectRowNo),

            // Все параметры для передачи в метод обработки одного периода/записи
            options = {
                objectId : objectId,
                objectRowNo : objectRowNo,
                object : object,
            }

        ;

        return options;

    },/*}}}*/

    /** getDefaultCommonTotals ** {{{ Значения общего суммарного коллектора по умолчанию */
    getDefaultCommonTotals : function () {

        // return { count : 0 };
        return {};

    },/*}}}*/

    /** getDefaultTotals ** {{{ Значения суммарного коллектора по умолчанию (инициализация) */
    getDefaultTotals : function () {

        var Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            data = {
                common: this.getDefaultCommonTotals(),
                objects: {},
            }

        ;

        // Собираем параметры отчёта // ???
        // Object.assign(data.common, reportData.reportParams);

        return data;

    },/*}}}*/

    /** assignCommonTotals ** {{{ Дополнить значения общего суммарного коллектора
     * @param {Object} data - Данные для дополнения
     */
    assignCommonTotals : function (data) {

        var Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData

        ;

        if ( !reportData.totals ) {
            reportData.totals = this.getDefaultTotals();
        }

        if ( data ) {
            Object.assign(reportData.totals.common, data);
        }

    },/*}}}*/

    /** initTargetVariables ** {{{ Инициализация свойств в `reportData` для накапливания обработанных данных
     */
    initTargetVariables : function () {

        var Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData

        ;

        // Собираем строки данных для периодов отчёта
        reportData.rows = [];

        // Аккумулируем суммарные значения -- общие и для каждого КО в отдельности.
        // Дополняем пустым набором данных -- инициализируем, если до сих пор не проинициализирован.
        // Может быть установлено значениями раньше (если была необходимость сохранять данные во время получения
        // через assignCommonTotals; см. Report__Data_type_efficiency.js);
        this.assignCommonTotals();

    },/*}}}*/

    /** getKOFilterUsedColumnsData ** {{{ Получить из данных объекта (`options.object`) те параметры, что указаны в списке используемых базового объекта (`Report.params.koFilterUsedColumns`)
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     * @returns {Object} data - Собранные данные
     */
    getKOFilterUsedColumnsData : function (options) {

        var Report__Data = this,
            Report = this.Report
        ;

        if ( Array.isArray(Report.params.koFilterUsedColumns) ) {

            // Забираем нужные поля из данных базового объекта
            return Report.params.koFilterUsedColumns.reduce(function(data, id) {
                if ( options.object[id] !== undefined && options.object[id] !== null && options.object[id] ) {
                    data[id] = options.object[id];
                }
                return data;
            }, {});

        }

    },/*}}}*/

    /** getOwnReportColumnsData ** {{{ Получить данные для элемента отчёта по списку из `Report.params.ownReportColumns`.
     * @param {Object} dataItem - Данные одной записи (периода; могут не содержать информации о КО -- IdMonObject).
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     * @returns {Object} data - Собранные данные
     */
    getOwnReportColumnsData : function (dataItem, options) {

        var Report__Data = this,
            Report = this.Report
        ;

        if ( Array.isArray(Report.params.ownReportColumns) ) {

            // Забираем нужные поля из полученных с сервера данных
            // (список полей -- из описания собственных колонок отчётов.
            return Report.params.ownReportColumns.reduce(function(data, column) {
                var id = column.id;
                // Внимание: могут быть значения вида '0' -- т.е. "пустые" числа, которые не должны отсекаться!
                if ( dataItem[id] !== undefined && dataItem[id] !== null && dataItem[id] !== '' ) {
                    data[id] = dataItem[id];
                }
                return data;
            }, {});

        }

    },/*}}}*/

    /** cleanupRowData ** {{{ Удалить "пустые" параметры из данных строки отчёта
     * @param {Object} rowData - Подготовленные данные строки отчёта
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     */
    cleanupRowData : function (rowData, options) {

        var Report__Data = this,
            Report = this.Report
        ;

        // Ничего не делаем. Переопределяется в detailmove

    },/*}}}*/

    /** getItemRowData ** {{{ Получить обработанные данные строки отчёта
     * @param {Object} dataItem - Данные одной записи (периода; могут не содержать информации о КО -- IdMonObject).
     *   Это то, что приезжает в ответе запроса данных отчёта в параметре `resp` в случае синхронного ответа
     *   или в `DetailResult` в случае асинхронного.
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     * @returns {Object} rowData - Данные строки отчёта
     */
    getItemRowData : function (dataItem, options) {

        var Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Забираем нужные поля из данных базового объекта
            usedColumnsData = this.getKOFilterUsedColumnsData(options),

            // Забираем нужные поля из полученных с сервера данных
            // (список полей -- из описания собственных колонок отчётов.
            ownColumnsData = this.getOwnReportColumnsData(dataItem, options),

            // Базовые данные строки отчёта.
            // Собираем необходимые поля из исходных данных и КО.
            rowData = Object.assign({}, options.object, usedColumnsData, ownColumnsData)

        ;

        this.cleanupRowData(rowData, options);

        // Подсчитываем длительность периода
        if ( rowData.EndTime && rowData.BeginTime ) {
            rowData.PeriodTime = rowData.EndTime - rowData.BeginTime;
        }

        return rowData;

    },/*}}}*/

    /** calcTotalsForObject ** {{{ Рассчитать суммарные значения для строки данных отчёта
     * @param {Object} objectTotals - Суммарные данные для текущего объекта
     * @param {Object} rowData - Подготовленные данные строки отчёта. Объект изменяется.
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     */
    calcTotalsForObject : function (objectTotals, rowData, options) {

        var
            Report__Data = this,
            Report = this.Report
        ;

        // // Увеличиваем счётчик
        // objectTotals.count++;

        // ...Остальной код доопределяется для каждого отчёта...

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

        // // Номер строки данных
        // rowData.n = ( commonTotals.count && ( ++commonTotals.count ) || ( commonTotals.count = 1 ) );

        // ...Остальной код доопределяется для каждого отчёта...

    },/*}}}*/

    /** getDefaultObjectRowData ** {{{ Данные для строки объекта по умолчанию (инициализация)
     * @param {Object} dataItem - Данные одной записи (периода; могут не содержать информации о КО -- IdMonObject)
     * @param {Object} [options] - Параметры текущего объекта данных (обрабатываем либо сам объект, либо массив данных для него)
     * @param {String} options.objectId - Идентификатор объекта: dataItem.IdMonObject
     * @param {String} options.objectRowNo - Номер строки объекта в koDataloader: koDataloader.get_row_no_by_object_id(objectId)
     * @param {String} options.object - Массив данных для объекта: koDataloader.get_row_data(objectRowNo)
     * @returns {Object}
     */
    getDefaultObjectRowData : function (dataItem, options) {

        // Если параметры не заданы, получаем их сейчас
        options = ( options && typeof options === 'object' ) ? options : this.getReportItemOptions(dataItem);

        return {
            id : options.objectId, // Идентификатор объекта
            rowNo : options.objectRowNo, // Номер строки данных (в списке КО)
            name : options.object.name, // Наименование объекта
            // count : 0, // Количество отсчётов (пакетов данных)
        };

    },/*}}}*/

    /** processReceivedDataItem ** {{{ Обработать одну запись отчёта
     * @param {Object} dataItem - Данные одной записи (периода; могут не содержать информации о КО -- IdMonObject)
     * @param {Number} [dataItem.IdMonObject] - Идентификатор объекта (если не задан, должен быть определён `options.objectId`)
     * @param {Object} [options] - Параметры текущего объекта данных (обрабатываем либо сам объект, либо массив данных для него)
     * @param {String} options.objectId - Идентификатор объекта: dataItem.IdMonObject
     * @param {String} options.objectRowNo - Номер строки объекта в koDataloader: koDataloader.get_row_no_by_object_id(objectId)
     * @param {String} options.object - Массив данных для объекта: koDataloader.get_row_data(objectRowNo)
     *
     * Метод по умолчанию. Будет переопределяться соотв. модификаторми (`_type/Report__Data_type_{reportType}.js`).
     *
     * Данные складываются в переменные:
     *  - `Report.params.reportData.rows`
     *  - `Report.params.reportData.totals`
     * (см. иницализацию в `initTargetVariables`).
     *
     */
    processReceivedDataItem : function (dataItem, options) {

        // Если параметры не заданы, получаем их сейчас
        options = ( options && typeof options === 'object' ) ? options : this.getReportItemOptions(dataItem);

        var Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Суммарные данные для конкретного КО (objectTotals)...
            objectTotals = reportData.totals.objects[options.objectId] || ( reportData.totals.objects[options.objectId] = this.getDefaultObjectRowData(dataItem, options) ),

            // Общая статистика (+ см. выше `objectTotals` для каждого объекта)
            commonTotals = reportData.totals.common

        ;

        // Подготавливаемые данные строки отчёта.
        var rowData = this.getItemRowData(dataItem, options);

        // Суммарные данные для конкретного КО (objectTotals)...
        this.calcTotalsForObject(objectTotals, rowData, options);

        // Общие суммарные данные (commonTotals)...
        this.calcCommonTotalsForRow(commonTotals, rowData, options);

        // Добавялем созданную строку
        reportData.rows.push(rowData);

    },/*}}}*/

    /** processReceivedData() ** {{{ Обрабатать полученные данные отчёта
     * @param {Object[]} [receivedData=Report.params.reportData.receivedData] - Массив данных для построения отчёта (описание см. в методе {@link #updateReport})
     * @returns {Promise}
     *
     * Данные накапливаются в `reportData.rows`
     */
    processReceivedData : function (receivedData) {

        // Если данные не переданы, получаем их из объекта отчёта
        receivedData = receivedData || this.Report.params.reportData.receivedData;

        var Report__Data = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData

        ;

        try {

            // Инициализруем переменные под данные...
            this.initTargetVariables();

            // Проходим по набору данных (по списку частей отчёта)...
            Array.isArray(receivedData) && receivedData.map(this.processReceivedDataItem, this);

            // // INFO!!!
            // console.log( 'processReceivedData done --',
            //     'rows:', reportData.rows,
            //     'params:', reportData.reportParams,
            //     'common totals:', reportData.totals.common,
            //     'objects totals:', reportData.totals.objects,
            //     ''
            // );

            // Сообщаем о завершении
            return vow.Promise.resolve({status: 'dataProcessed', description: 'Данные обработаны'});

        }
        catch (error) {
            return this.__error(error, 'processReceivedData');
        }

    },/*}}}*/

    // *** Служебное...

    /** __error ** {{{ Обработка внутренней ошибки
     * @param {Object|*} error - Ошибка
     * @param {String} [methodName] - Имя метода, вызвавшего ошибку. Если не укзан, пробуем определить через `callee.caller`.
     * @returns {Promise} - reject-промис с ошибкой.
     *
     * Вывод сообщения о вызове (модуль, метод) в консоль, останавливает
     * выполнение (debugger), добавляет информацию о вызове в ошибку (если
     * объект), возвращает проваленный (rejected) промис с ошибкой.
     */
    __error : function (error, methodName) {

        methodName = methodName || ( arguments.callee && arguments.callee.caller && arguments.callee.caller.name ) || '(anonymous)'; // jshint ignore:line

        var errorId = __module.name + ':' + methodName;

        console.error( errorId, error );
        /*DEBUG*//*jshint -W087*/debugger;

        ( !Array.isArray(error) && typeof error !== 'object' ) || ( error = {error: error} );
        ( error && !Array.isArray(error) ) && ( error.trace || ( error.trace = [] ) ).push(errorId);

        return vow.Promise.reject(error);

    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__Data = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Data = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Data', __Data)); // provide

}); // module

