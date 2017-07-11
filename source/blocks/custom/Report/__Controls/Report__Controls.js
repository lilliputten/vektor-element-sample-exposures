/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true, laxcomma:true */
/* globals debugger, modules, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Controls
 * @overview Блок-функционал для элементов управления (фильтры и пр.)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.10, 16:42
 * @version 2017.05.10, 16:42
 *
 * $Date: 2017-07-10 17:53:17 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Controls.js 8727 2017-07-10 14:53:17Z miheev $
 *
 */

modules.define('Report__Controls', [
    'popup_controller',
    'vow',
    'i-bem-dom',
    'project',
    'jquery',
],
function(provide,
    popup_controller,
    vow,
    BEMDOM,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__Controls
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

var __Controls = /** @lends Report__Controls.prototype */ {

    /** applyReportProcess ** {{{ Основной процесс создания отчёта: Получаем предварительные данные, начинаем загрузку отчёта
     * @returns {Promise}
     */
    applyReportProcess : function () {

        var Report__Controls = this,
            Report = this.Report,
            that = this,

            // Объект отчёта
            reportData = Report.Modules.Loader.initReportObject()

        ;

        try {

            debugger;
            var

                // У нас есть доступ к данным фильтра по КО. Используем их.
                koDataloader = Report.Modules.KOFilter.params.dataloader,

                // Формируем список необходимых для показа отчёта данных. Нет необходимости?
                // koColumnsList = Report.params.koFilterUsedColumns,
                showColumnsList = Report.params.showColumnsList,

                // Убеждаемся, что все нужные данные загружены
                koColumnsResolvePromise = koDataloader.resolve_columns(showColumnsList, {
                    ignoreUsedStatus : true, // Игнорировать статус 'used' (состояние задейстовванности колонки данных)
                    suppressEvents : true, // Не дёргаем события -- избегаем сброса фильтров в KOFilter
                })

            ;

            // Стартуем общий ожидатель (для стандартных и асинхронных запросов).
            // По окончанию процедуры вызывать метод закрытия -- `Report__Loader.stopReportReceiver`.
            Report.Modules.Loader.startReportReceiver();

            // Возвращаем промис...
            return vow
                // Ожидаем окончание загрузки данных отчёта, других данных и инициализации контроллеров
                .all([

                    // Стартуем запрос данных отчёта (синхронно или асинхронно)
                    Report.Modules.Loader.requestReportStart(),

                    // Запрос или кеш необходимых данных -- Не используем?
                    koColumnsResolvePromise,

                ])

                // Получаем данные
                .spread(function (receiveStatus, ko_columns_data/* , reportControllersData */) {

                    // DBG( 'reportData applyReport 1st stage: received all data, ready to process', reportData );
                    // debugger;

                    // Обрабатываем полученные данные (возвращаем промис)...
                    return Report.Modules.Data.processReceivedData(reportData.receivedData);

                }, null, this)

                // // .then(Report.Modules.ResultDom.createZeroDataloader, Report.Modules.ResultDom)
                .then(Report.Modules.ResultDom.initView, Report.Modules.ResultDom)

                // Если обработка прошла успешно, то показываем результат пользователю:
                .then(function (data) {

                    // DBG( 'reportData applyReport 3nd stage: create dom, show data', reportData );
                    // debugger;

                    // Завершаем показ отчёта
                    Report.Modules.Show.updateReportDone();

                    // Останавливаем получение данных
                    Report.Modules.Loader.stopReportReceiver();

                }, this)

                // Если случилась ошибка, показываем сообщение...
                .fail(function (error) {

                    console.error(error);
                    /*DEBUG*//*jshint -W087*/debugger;

                    // Останавливаем получение данных с ошибкой (показываем в заставке)
                    Report.Modules.Loader.stopReportReceiver(error);

                    // Очищаем данные отчёта
                    Report.Modules.Loader.clearReportObject();

                    // Ошибку не возвращаем -- уже показали сами
                    // return vow.Promise.reject(error);

                })

            ;
        }
        // Отрабатываем пойманные ошибки
        catch (error) {
            return this.__error(error);
        }

    },/*}}}*/

    /** applyReport ** {{{ Применяем параметры, начинаем создавать отчёт
     * @return {Promise}
     */
    applyReport : function () {

        var Report__Controls = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.Modules.Loader.initReportObject()

        ;

        try {

            // Если не прошла проверка готовности данных...
            return this.isReadyToApply(reportData.reportParams, true)

                // Запуск отчёта
                .then(this.applyReportProcess, this)

                // Ошибка
                .fail(function(error){
                    console.error(error);
                    /*DEBUG*//*jshint -W087*/debugger;
                    var messageTitle = 'Невозможно построить отчёт';
                    var messagePrefix = '<h1>' + messageTitle + '</h1>\n';
                    var messageText = app.error2html(error);
                    popup_controller.infobox(messageText, messageTitle);
                })

            ;

        }
        // Отрабатываем пойманные ошибки
        catch (error) {
            this.params.screenholder.error(error);
            return this.__error(error);
        }

    },/*}}}*/

    /** isReadyToApply ** {{{ Проверка готовности к применению фильтров
     * @param {object} reportParams - Параметры фильтров. См. {@see #getReportParams}.
     * @param {boolean} showMessages - Показывать сообщения.
     * @returns {Promise}
     */
    isReadyToApply : function (reportParams, showMessages) {

        var Report__Controls = this,
            Report = this.Report,

            messages = []

        ;

        if ( reportParams.BeginTime >= reportParams.EndTime ) {
            messages.push('Задан некорректный период.');
        }

        // TODO: Проверять allowEmpty из свойств `filterParamsTranslate`
        Object.keys(Report.params.filterParamsTranslate).map(function(id){
            var tr = Report.params.filterParamsTranslate[id];
            if ( tr.errorIfEmpty
              && ( reportParams[id] === undefined || reportParams[id] === null
                   || ( Array.isArray(reportParams[id]) && !reportParams[id].length )
                   || ( ( tr.type === 'number' || tr.type === 'string' ) && !reportParams[id] )
                 )
              ) {
                messages.push(tr.errorIfEmpty);
            }
        });

        if ( messages.length ) {
            return vow.Promise.reject(messages);
        }

        return vow.Promise.resolve({ status : 'reportReadyToApply' });

    },/*}}}*/

    /** initActions ** {{{ Обработка действий пользователя
     */
    initActions : function () {

        var Report__Controls = this,
            Report = this.Report
        ;

        try {

            // Действие на кнопку "Применить" -- Создаём отчёт
            var applyButton = Report.Modules.Dom.params.box_actions_main.findChildBlock({
                block: BEMDOM.entity('button'),
                modName: 'id',
                modVal: 'apply'
            });
            if ( applyButton && this.applyReport ) {
                applyButton._domEvents().on('click', this.applyReport.bind(this));
            }

            if ( Report.Modules.Dom.params.box_actions_controls ) {

                // Действие на кнопку "Сохранить"
                var saveButton = Report.Modules.Dom.params.box_actions_controls.findChildBlock({
                    block: BEMDOM.entity('button'),
                    modName: 'id',
                    modVal: 'save'
                });
                if ( saveButton && Report.Modules.Export.saveReportAction ) {
                    saveButton._domEvents().on('click', Report.Modules.Export.saveReportAction.bind(Report.Modules.Export));
                }

                // Действие на кнопку "Печатать"
                var printButton = Report.Modules.Dom.params.box_actions_controls.findChildBlock({
                    block: BEMDOM.entity('button'),
                    modName: 'id',
                    modVal: 'print'
                });
                if ( printButton && Report.Modules.Print.printReportAction ) {
                    printButton._domEvents().on('click', Report.Modules.Print.printReportAction.bind(Report.Modules.Print));
                }

            }

        }
        catch (error) {
            console.error(error);
            /*DEBUG*//*jshint -W087*/debugger;
        }

    },/*}}}*/

    /** getReportInfo ** {{{ Значения доп. параметров для представления отчёта
     * @return {object}
     */
    getReportInfo : function () {

        var
            Report__Controls = this,
            Report = this.Report,

            reportInfo = {

                // Даты в формате строк
                BeginTimeStr : this.params.BeginTime.getVal('string'),
                EndTimeStr : this.params.EndTime.getVal('string'),

                // Название:
                title : Report.params.reportTitle, // app.params.pageData.title,

                // Информация о пользователе:
                username : app.params.user.username,
                // userID : app.params.user.userID,

                // Дата создания отчёта:
                ReportTime : Report.params.reportData.ReportTime.getTime(), // msec
                ReportTimeStr : project.helpers.dateformatter.formatDate(Report.params.reportData.ReportTime, project.config.formats.datetime), // string

            },

            filterBox = Report.Modules.Dom.params.box_actions_main

        ;

        return reportInfo;

    },/*}}}*/
    /** getReportParams ** {{{ Значения фильтров и переменные для построения отчёта (перенести в Report__Loader?)
     * @return {object}
     */
    getReportParams : function () {

        // Параметры отчёта...
        // TODO Убрать лишнее! Использовать альтернативную структуру ('info').
        var
            Report__Controls = this,
            Report = this.Report,

            reportParams = {

                // Тип отчёта:
                op : Report.params.reportType,

                // Список идентификаторов КО:
                list : Report.Modules.KOFilter.params.view_controller.get_checked_items(),

                // Даты начала и конца периода
                // См. WEB_TINTS/source/blocks/root/input/_date/input_date.js
                BeginTime : this.params.BeginTime.getVal('msec'),
                EndTime : this.params.EndTime.getVal('msec'),

                // Даты в формате строк
                BeginTimeStr : this.params.BeginTime.getVal('string'),
                EndTimeStr : this.params.EndTime.getVal('string'),

                // Информация о пользователе:
                userID : app.params.user.userID,
                username : app.params.user.username,

                // Дата создания отчёта:
                ReportTime : Report.params.reportData.ReportTime.getTime(), // msec
                ReportTimeStr : project.helpers.dateformatter.formatDate(Report.params.reportData.ReportTime, project.config.formats.datetime), // string

            },

            filterBox = Report.Modules.Dom.params.box_actions_main

        ;

        // Собираем параметры из общего фильтра...
        Array.isArray(Report.params.mainFilterColumnsList) && Report.params.mainFilterColumnsList.map(function(id){
            var val = filterBox.get_filter_value(id);
            if ( val !== undefined ) {
                reportParams[id] = val;
            }
        });

        return reportParams;

    },/*}}}*/

    /** getReportRequestParams ** {{{ Сформировать объект с параметрами запроса отчёта.
     * @param {Object} [reportParams] - Параметры фильтров
     * @return {Object}
     */
    getReportRequestParams : function (reportParams) {

        reportParams = reportParams || this.Report.params.reportData.reportParams;

        var
            Report__Controls = this,
            Report = this.Report,

            // Данные запроса
            ajaxData = Object.assign({}, reportParams)

        ;

        // Преобразовываем параметры фильтра...
        Object.keys(Report.params.filterParamsTranslate).map(function(id){
            var
                translate = Report.params.filterParamsTranslate[id],
                name = ( translate && translate.name ) || id,
                val = ajaxData[id]
            ;
            // Если задано преобразование...
            if ( translate ) {
                // Если задано преобразование 'list'...
                if ( translate.type && translate.type === 'list' && Array.isArray(val) ) {
                    val = val.join(',');
                }
            }
            // Если необходимо переименовывать...
            if ( id !== name ) {
                // Убираем старое значение
                delete ajaxData[id];
            }
            var isEmpty = ( val === null || val === undefined );
            if ( translate.allowEmpty && isEmpty ) {
                val = '';
                isEmpty = false;
            }
            // Если значение определено...
            if ( !isEmpty ) {
                // Добавляем новое значение
                ajaxData[name] = val;
            }
        });

        // Если подключены сокеты, пробуем загружать данные с использованием WebSockets. (В отладке!)
        if ( project.config.useSockets && app.socket.isConnected() ) {
            // DEBUG! Пока иногда выключается для стабильности %))
            ajaxData.socketId = app.socket.getSocketId();
        }

        return ajaxData;

    },/*}}}*/

    /** initFilterDates ** {{{ Инициализируем даты фильтра */
    initFilterDates : function () {

        var
            Report__Controls = this,
            Report = this.Report,

            setDebugValues = ( project.config.LOCAL_ENB || project.config.LOCAL_NGINX ),

            BeginTimeValue = app.session.get('ReportBeginTime'),
            EndTimeValue = app.session.get('ReportEndTime'),

            box_actions_main = Report.Modules.Dom.params.box_actions_main,

            today = new Date()
        ;

        // DEBUG DATA!!! Если режим разработки, устанавливаем отладочные параметры
        // См. также `Report__KOFilter:getInitialReportKOList()`.
        if ( setDebugValues ) {
            switch (Report.params.reportType) {
                case 'objvisitdetail':
                    BeginTimeValue = '10.06.2017 00:00';
                    EndTimeValue = '20.06.2017 00:00';
                    // Устанавливаем параметр "Объекты"
                    var listobject = box_actions_main.findChildBlock({ block : BEMDOM.entity('select'), modName : 'select', modVal : 'listobject' });
                    listobject && listobject.setVal([440]); // 440 = "линия старта этапа"
                    // @see Report__KOFilter:getInitialReportKOList
                    break;
                case 'efficiency':
                    BeginTimeValue = '16.04.2017 00:00';
                    EndTimeValue = '20.04.2017 00:00';
                    break;
                case 'milage':
                    BeginTimeValue = '10.04.2017 00:00';
                    EndTimeValue = '10.05.2017 00:00';
                    break;
                default:
                    BeginTimeValue = '28.11.2016 00:00';
                    EndTimeValue = '29.11.2016 00:00';
            }
        }

        // Значения по умолчанию, если нет сохранённых
        if ( !EndTimeValue ) {
            EndTimeValue = today.getTime();
        }
        if ( !BeginTimeValue ) {
            today.setHours(0, 0, 0);
            BeginTimeValue = today.getTime();
        }

        // Находим фильтры с диапазоном дат
        this.params.BeginTime = Report.Modules.Dom.getRootbox().findChildBlock({ block : BEMDOM.entity('input'), modName : 'id', modVal : 'BeginTime' });
        this.params.EndTime = Report.Modules.Dom.getRootbox().findChildBlock({ block : BEMDOM.entity('input'), modName : 'id', modVal : 'EndTime' });

        // Устанавливаем значения
        this.params.BeginTime && this.params.BeginTime.setVal(BeginTimeValue);
        this.params.EndTime && this.params.EndTime.setVal(EndTimeValue);

        // Сохраняем вводимые даты при изменении
        this.params.BeginTime._events().on('change', function(e,data){
            app.session.set('ReportBeginTime', this.params.BeginTime.getVal());
        }, this);
        this.params.EndTime._events().on('change', function(e,data){
            app.session.set('ReportEndTime', this.params.EndTime.getVal());
        }, this);

    },/*}}}*/

    /** initFilterParams ** {{{ Инициализируем параметры фильтров */
    initFilterParams : function () {

        // Выбор типа отчёта
        this.initReportTypeSelector();

        // Даты
        this.initFilterDates();

    },/*}}}*/

    /** initReportTypeSelector ** {{{ Инициализируем элемент выбора типа отчёта */
    initReportTypeSelector : function () {

        try {

            var

                Report__Controls = this,
                Report = this.Report,
                that = this,

                // Получаем меню для текущей страницы (список отчётов)
                currentMenu = app.getLastMenuContainingPage(app.params.pageId),

                reportItems = currentMenu.map(function (item) {
                    return {val: item.id, text: item.title};
                }),

                // Тип текущего отчёта (из свойств страницы, см. initData)
                reportType = Report.params.reportType, // store.get('Report_select_report_type'),

                bemjson = {
                    block: 'box_actions',
                    elem: 'select',
                    id: 'reportType',
                    hint: 'Выбрать вид отчёта',
                    text: 'Выбрать вид отчёта',
                    options: reportItems,
                    val: app.params.pageId,
                },
                html = BEMHTML.apply(bemjson),
                groupElem = Report.Modules.Dom.params.box_actions_main._elem({ elem : 'group', modName : 'id', modVal : 'type' }),
                dom = BEMDOM.update(groupElem && groupElem.domElem, html),
                select = dom.length ? dom.bem(BEMDOM.entity('select')) : null

            ;

            select && select._events().on('change', function (e, data) {
                var newPageId = select.getVal();
                app.openPage(newPageId);
            });

        }
        catch (error) {
            console.error('initReportTypeSelector error', error);
            /*DEBUG*//*jshint -W087*/debugger;
        }

    },/*}}}*/

    /** init ** {{{ Инициализируем экранные компоненты */
    init : function () {

        var Report__Controls = this,
            Report = this.Report
        ;

        try {

            return vow.cast()

                // После инициализации парметров...
                .then(Report.Modules.Params.asyncInitModule())

                // Инициализруем элементы
                .then(Report.Modules.Dom.initDom, Report.Modules.Dom)

                // Создаём фильтры
                .then(Report.Modules.Dom.createFilters, Report.Modules.Dom)

                // Параметры фильтров
                .then(this.initFilterParams, this)

                // Устанавливаем обработчики событий интерфейса
                .then(this.initActions, this)

            ;

        }
        catch (error) {
            console.error(error);
            /*DEBUG*//*jshint -W087*/debugger;
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

    /** _onInited ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__Controls = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Controls = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Controls', __Controls)); // provide

}); // module

