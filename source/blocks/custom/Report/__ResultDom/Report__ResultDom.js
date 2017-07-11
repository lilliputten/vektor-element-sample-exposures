/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__ResultDom
 * @overview Управление элементами DOM показа отчёта.
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date: 2017-06-22 15:21:55 +0300 (Чт, 22 июн 2017) $
 * $Id: Report__ResultDom.js 8619 2017-06-22 12:21:55Z miheev $
 *
 */

modules.define('Report__ResultDom', [
    'nicescroll',
    'requestor',
    'popup_controller',
    'waiter',
    'vow',
    'i-bem-dom',
    'project',
    'jquery',
],
function(provide,
    nicescroll,
    requestor,
    popup_controller,
    waiter,
    vow,
    BEMDOM,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__ResultDom
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

var __ResultDom = /** @lends Report__ResultDom.prototype */ {

    /** populateData ** {{{ */
    populateData : function () {

        var Report__Controls = this,
            Report = this.Report,

            reportData = Report.params.reportData
        ;

    },/*}}}*/

    /** initView ** {{{ Инициализация экранных элементов и контроллеров.
     * return {Promise|null} - ???
     */
    initView : function () {

        var Report__Controls = this,
            Report = this.Report,

            reportData = Report.params.reportData

        ;

        return vow.cast()
            .then(this.createCombinedDataloader, this)
            .then(this.createPreparedData, this)
            .then(this.createDom, this)
            .then(this.initDom, this)
            // .then(this.initReportControllers, this)
        ;

    },/*}}}*/

    /** createDom ** {{{ BEMHTML-шаблон блока показа отчёта */
    createDom : function () {

        var Report__ResultDom = this,
            Report = this.Report,

            reportData = Report.params.reportData || ( Report.params.reportData = {} ),

            bemjson = Report.Modules.Content.getReportDisplayBlock(),
            html = BEMHTML.apply(bemjson),
            container = Report._elem('container'),
            dom = BEMDOM.update(container && container.domElem, html),

            undef
        ;

    },/*}}}*/

    /** initDom ** {{{ Инициализируем DOM-элементы отчёта (после создания контроллеров и до их инициализации)
     * TODO:REPORT_OBJECTS! Уже не актуально в связи с новой схемой генерации контента отчётов?
     */
    initDom : function () {

        var Report__ResultDom = this,
            Report = this.Report,
            reportData = Report.params.reportData || ( Report.params.reportData = {} )
        ;

        try {

            // Основные контроллеры:
            // reportData.pager_controller = this.domElem.bem(BEMDOM.entity('pager_controller')); // Создаём объект пагинатора на нашем же dom узле
            // reportData.view_controller = this.findChildBlock(BEMDOM.entity('tableview')); // Табличный просмотр -- добавить позже, после создания
            // reportData.dataloader = reportData.view_controller && reportData.view_controller.domElem.bem(BEMDOM.entity('dataloader'));

            // Вспомогательные элементы:
            reportData.infoContainer = Report.Modules.Dom.params.box_actions_controls._elem('group', 'info'); // Контейнер информации/статистики
            reportData.pagerContainer = Report.Modules.Dom.params.box_actions_controls._elem('group_id_pager'); // Расположение пейджера

            if ( !this.params.nicescroll ) {
                this.params.nicescroll = nicescroll.init(Report._elem('container'), {
                    zindex : 30,
                });
            }

            return;

        }
        catch (error) {
            console.error(error);
            /*DEBUG*//*jshint -W087*/debugger;
        }

    },/*}}}*/

    /** createCombinedDataloader ** {{{ */
    createCombinedDataloader : function () {

        var Report__ResultDom = this,
            Report = this.Report,

            reportData = Report.params.reportData,

            id = 'Report_' + Report.params.reportType,

            /* Описание колонок для объединённых данных из запроса и списка КО.
             * Для разных отчётов список будет либо разный, либо с разными
             * параметрами (как минимум, show или hidden) -- т.е., надо будет
             * фильтровать список либо подстраивать данные.
             */
            columns = reportData.combinedColumns = Report.Modules.Data.combineReportColumns(Report.params.showColumnsList),
            columnsIds = reportData.combinedColumnsIds = columns.map(function(column){ return column.id; }),

            dataloader = reportData.combinedDataloader = this.domElem.bem(BEMDOM.entity('dataloader')),

            // Общие настройки контроллеров
            options = {
                id: id, // Идентификатор (для внутренних нужд: напр., для сохранения данных офлайн на клиенте именно для этого набора компонент)
                columns: columns,     // Описание используемых данных (столбцов таблицы)
                dataloader: reportData.dataloader,
                screenholder: Report.Modules.Dom.params.screenholder,
            }

        ;

        try {

            if ( dataloader ) {

                // Устанавливаем источник данных (локальный массив)
                dataloader.set_local_data(reportData.rows);

                // Инициализация
                dataloader.initialize(options);

                // Загрузка отсутствующих данных -> Promise
                return dataloader.prefetch_data();

            }
            else {
                throw new Error ('Отсутствует объект загрузчика данных (dataloader)');
            }

        }
        catch (error) {
            console.error(error);
            /*DEBUG*//*jshint -W087*/debugger;
            return this.__error(error, 'createCombinedDataloader');
        }

    },/*}}}*/

    /** createPreparedData ** {{{ */
    createPreparedData : function () {

        var Report__ResultDom = this,
            Report = this.Report,

            reportData = Report.params.reportData,

            // Подготавливаем и сохраняем описания элементов статистики
            statItemsDescr = reportData.statItemsDescr || ( reportData.statItemsDescr = Report.Modules.Data.getStatItemsDescription() ),

            /* Описание колонок для объединённых данных из запроса и списка КО.
             * Для разных отчётов список будет либо разный, либо с разными
             * параметрами (как минимум, show или hidden) -- т.е., надо будет
             * фильтровать список либо подстраивать данные.
             */
            columns = reportData.combinedColumns,
            columnsIds = reportData.combinedColumnsIds,

            dataloader = reportData.combinedDataloader,

            // rowsCount = dataloader.get_total_items_count(),
            rows = reportData.rows

        ;

        try {

            var preparedRows = rows.map(function(row,row_no){
                return columns.reduce(function(data,column,n){
                    data[column.id] = dataloader.get_row_column_value(column.id, row_no); // get_resolved_data_value_by_row_no(column.id, row_no, true);
                    return data;
                }, { objID : row.objID });
            });

            reportData.preparedRows = preparedRows;

            return vow.Promise.resolve({ status : 'preparedRowsCreated', preparedRows : preparedRows });

        }
        catch (error) {
            console.error(error);
            /*DEBUG*//*jshint -W087*/debugger;
            return this.__error(error, 'createPreparedData');
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

        if ( error === null || Array.isArray(error) || typeof error !== 'object' ) { error = { error : error }; } // = new Error(error); }
        ( error.trace || ( error.trace = [] ) ).push(errorId);

        return vow.Promise.reject(error);

    },/*}}}*/

    /** _onInited ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__ResultDom = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__ResultDom = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'ResultDom', __ResultDom)); // provide

}); // module

