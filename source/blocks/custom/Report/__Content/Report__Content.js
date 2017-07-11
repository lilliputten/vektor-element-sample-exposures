/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Content
 * @overview Генерация контента
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date: 2017-06-22 15:21:55 +0300 (Чт, 22 июн 2017) $
 * $Id: Report__Content.js 8619 2017-06-22 12:21:55Z miheev $
 *
 */

modules.define('Report__Content', [
    'requestor',
    'popup_controller',
    'waiter',
    'vow',
    'i-bem-dom',
    'project',
    'objects',
    'jquery',
],
function(provide,
    requestor,
    popup_controller,
    waiter,
    vow,
    BEMDOM,
    project,
    objects,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__Content
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

var __Content = /** @lends Report__Content.prototype */ {

    /** getCommonDomContent ** {{{ Получить структуру данных для представления общей информации отчёта
     * @returns {Array}
     */
    getCommonDomContent : function () {

        var Report__Content = this,
            Report = this.Report,

            reportData = this.Report.params.reportData,

            // Данные информации об отчёте
            reportInfoData = this.Report.params.reportData.reportInfoParams,

            // Данные общей статистики отчёта
            commonStatData = this.Report.params.reportData.totals.common,

            reportInfoItems = this.getReportStatBemjson(reportInfoData),
            commonStatItems = this.getReportStatBemjson(commonStatData),

            content
        ;

        content = [
            {
                elem : 'Title',
                content : Report.params.reportTitle, // app.params.pageData.title,
            },
            {
                elem : 'Group',
                id : Report.params.reportType + '_reportInfo',
                title : 'Информация об отчёте',
                mods : {
                    hideIfEmpty : true,
                    showTitle : true,
                    expandable : true,
                    expanded : true,
                    showStat : true,
                    // showTable : true,
                    // tableFirst : true,
                },
                Stat : reportInfoItems,
            },
            /*{{{ commonStat */{
                elem : 'Group',
                id : Report.params.reportType + '_commonStat',
                title : 'Общая статистика',
                Stat : commonStatItems,
                mods : {
                    hideIfEmpty : true,
                    showTitle : true,
                    expandable : true,
                    expanded : true,
                    showStat : true,
                    // showTable : true,
                    // tableFirst : true,
                },
            },/*}}}*/
        ];

        return content;

    },/*}}}*/
    /** getObjectsDomContent ** {{{ Получить структуру данных для представления объектов отчёта
     * @returns {Array}
     */
    getObjectsDomContent : function () {

        var Report__Content = this,
            Report = this.Report,

            reportData = this.Report.params.reportData,

            objectsStatData = reportData.totals.objects,

            objectsStatItems = this.getReportStatBemjson(objectsStatData),

            content
        ;

        content = [
            /*{{{ objectsInfo */{
                elem : 'Group',
                id : Report.params.reportType + 'objectsInfo',
                title : 'Информация по объектам',
                mods : {
                    hideIfEmpty : true,
                    showTitle : true,
                    expandable : true,
                    expanded : true,
                    showStat : true,
                    showTable : true,
                    // tableFirst : true,
                },
                Stat : objectsStatItems,
                Table : {
                    columns : reportData.combinedColumns,
                    rows : reportData.preparedRows,
                },
            },/*}}}*/
        ];

        return content;

    },/*}}}*/
    /** getReportDisplayContent ** {{{ Содержимое блока показа отчёта */
    getReportDisplayContent : function () {

        var Report__Content = this,
            Report = this.Report
        ;

        var content = []
            .concat(this.getCommonDomContent())
            .concat(this.getObjectsDomContent())
        ;

        return content;

    },/*}}}*/

    /** getReportDisplayBlock ** {{{ Описание блока показа отчёта  */
    getReportDisplayBlock : function () {

        var Report__Content = this,
            Report = this.Report
        ;

        var content = this.getReportDisplayContent();

        return {
            block : 'ReportDisplay',
            content : content,
        };

    },/*}}}*/

    /** getReportStat_processTotalsItem ** {{{ Хелпер: Подготавливаем один элемент по описанию и значению */
    getReportStat_processTotalsItem : function (itemDescr, val) {

        var
            Report__Content = this,
            Report = this.Report,

            reportData = Report.params.reportData,

            result = Object.assign({}, itemDescr)
        ;

        // Если ожидается значение...
        if ( itemDescr.elem === 'Item' ) {
            // Если указано брать данные из объединённого загрузчика (combinedDataloader)...
            if ( itemDescr.fromCombined ) {
                var columnId = ( typeof itemDescr.fromCombined === 'string' ) ? itemDescr.fromCombined : itemDescr.id,
                    columnInfo = reportData.combinedDataloader.column_info(columnId)
                ;
                val = reportData.combinedDataloader.get_processed_data_value(columnId, val, true);
                if ( !result.title && columnInfo && columnInfo.title ) {
                    result.title = columnInfo.title;
                }
            }
            // Рассчитываем среднее (для получения средней скорости, напр.; ожидается массив значений)
            if ( itemDescr.average && Array.isArray(val) ) {
                val = project.helpers.average(val);
            }
            // Если задан шаблон, подготавливаем значение через sformat
            if ( itemDescr.template ) {
                val = project.helpers.sformat(itemDescr.template, val);
            }
            if ( Array.isArray(val) ) {
                val = val.join(', ');
            }
            // Сохраняем значение
            result.val = val;
        }
        // Если ожидается список и в значении хэш, рекурсивно обрабатываем его через вложенное описание
        else if ( itemDescr.elem === 'List' || itemDescr.elem === 'Group' && typeof val === 'object' ) {
            // Рекурсивный вызов `getReportStat_processTotals` для вложенного списка. Напр., для `MovePeriodType`.
            result.content = this.getReportStat_processTotals(itemDescr.content, val);
            if ( itemDescr.inline ) {
                result = result.content;
            }
        }

        return result;

    },/*}}}*/
    /** getReportStat_processTotals ** {{{ Хелпер: Подготавливаем все элементы из массива описаний и данных
     * @param {Array} statItemsDescr - Описание данных. Ожидается массив описаний параметров.
     * @param {String} statItemsDescr[].id - Идентификатор параметра. Обязательный параметр.
     * @param {Object} data - Данные для параметров.
     */
    getReportStat_processTotals : function (statItemsDescr, data) {

        var items = [];

        Array.isArray(statItemsDescr) && statItemsDescr.map(function (item) {
            var id = item.id;
            if ( data[id] !== undefined ) {
                var newData = this.getReportStat_processTotalsItem(item, data[id]);
                // Если массив и указан режим слияния (`inline`), добавляем е текущему списку
                if ( item.inline && Array.isArray(newData) ) {
                    items = items.concat(newData);
                }
                // Иначе добавляем объект
                else {
                    items.push(newData);
                }
            }
        }, this);

        return items;

    },/*}}}*/

    /** getReportStat_processGroups ** {{{ Хелпер: Обрабатываем группы данных статистики. См. {@link #getStatReportStructure}.
     * @param {Object|Array} descr - Описание структуры блока статистики.
     */
    getReportStat_processGroups : function (descr, statItemsDescr) {

        var content;

        // Если не объект или пустой объект
        if ( typeof descr !== 'object' || objects.isEmpty(descr) ) {
            return {};
        }
        // Если массив
        else if ( Array.isArray(descr) ) {
            content = descr.map(function(item){
                return this.getReportStat_processGroups(item);
            }, this);
        }
        // Если вложенная группа...
        else if ( typeof descr === 'object' && Array.isArray(descr.data) ) {
            // Контент для вложенной группы или набора пунктов отчёта
            content = descr.data.map(function(item){
                    return this.getReportStat_processGroups(item);
                }, this);
        }
        // Если элемент с набором данных...
        else if ( typeof descr === 'object' && descr.data ) {
            // Проходим по элементам в соответствии с описанием данных (statItemsDescr
            content = this.getReportStat_processTotals(statItemsDescr, descr.data);
        }
        // Если собственно набор данных
        else {
            content = this.getReportStat_processTotals(statItemsDescr, descr);
        }

        return content;

    },/*}}}*/

    /** getReportStatBemjsonItemValue ** {{{ Найти значение элемента в наборе данных, полученных от `getReportStatBemjson`
     * @param {Object} bemjson
     * @param {*} id
     * @param {*} [defaultValue]
     */
    getReportStatBemjsonItemValue : function (bemjson, id, defaultValue) {

        var val = defaultValue;

        objects.walkComprisedInContainer(bemjson, { elem : 'Item', id : id }, function(item, key){
            val = item.val;
        }, this);

        return val;

    },/*}}}*/

    /** getReportStatBemjson ** {{{ Создаёт структуру, описывающую элементы и данные статистики отчёта
     * @param {Object} [struct] - Описание структуры представления данных (см. методы get*Structure)
     * @returns {Object} BEMJSON
     */
    getReportStatBemjson : function (struct) {

        var
            Report__Content = this,
            Report = this.Report,

            reportData = Report.params.reportData,

            // Описание элементов статистики
            // Подготавливаем и сохраняем описания элементов статистики
            statItemsDescr = reportData.statItemsDescr, // См. Report_ResultDom:createPreparedData / Report__Data:getStatItemsDescription

            // Совмещаем структуру и данные
            bemjson = this.getReportStat_processGroups(struct, statItemsDescr)
        ;

        return bemjson;

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

    /** _onInited ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__Content = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Content = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Content', __Content)); // provide

}); // module

