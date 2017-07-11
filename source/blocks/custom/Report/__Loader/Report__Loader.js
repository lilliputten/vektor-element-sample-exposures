/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Loader
 * @overview Блок-функционал для загрузки данных отчёта
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Loader.js 8728 2017-07-10 16:23:49Z miheev $
 *
 */

modules.define('Report__Loader', [
    'requestor',
    'popup_controller',
    'waiter',
    'vow',
    'i-bem-dom',
    'project',
    'jquery',
],
function(provide,
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
 * @class Report__Loader
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

var __Loader = /** @lends Report__Loader.prototype */ {

    /** receiveReportDataPart ** {{{ Принимаем часть данных отчёта
     * @param {Object} receivedData - Данные отчёта (частичные или полные).
     * @param {Object} [dataInfo] - "Сырые" данные ответа от сервера.
     */
    receiveReportDataPart : function (receivedData, dataInfo) {

        var
            Report__Loader = this,
            Report = this.Report,

            reportData = Report.params.reportData
        ;

        if ( !reportData.receivedData ) {
            reportData.receivedData = [];
        }

        if ( Array.isArray(receivedData) ) {
            reportData.receivedData = reportData.receivedData.concat(receivedData);
        }
        else if ( receivedData ) {
            reportData.receivedData.push(receivedData);
        }

    },/*}}}*/

    /** askUserForReceiveUnsafeDataAmount ** {{{ Запрос пользователя, уверен ли он, что хочет получать критически большое кол-во данных отчёта.
     * См. параметр конфигурации maxReportPackets, оценку в методе `receiveReportData`.
     */
    askUserForReceiveUnsafeDataAmount : function () {

        var Report__Loader = this,
            Report = this.Report,
            that = this,

            reportData = Report.params.reportData,

            reportsCountString = reportData.PartCount + ' ' + project.helpers.numeric(reportData.PartCount, 'пакет', 'пакета', 'пакетов')
        ;

        popup_controller.msgbox({
            options: {
                title: 'Предупреждение',
                close_button: true,
                buttons: ['yes', 'no'],
            },
            content: [
                {
                    tag: 'p',
                    content: 'Объём запрошенных данных может быть слишком большим (' + reportsCountString + ').'
                },
                {tag: 'p', content: 'Вы уверены, что хотите продолжить?'},
            ],
            callback : function (id, self) {
                if ( id !== 'yes' ) {
                    that.cancelReportReceiver();
                    return true;
                }
            },
        });

    },/*}}}*/

    /** receiveReportData ** {{{ Принимаем данные в асинхронном режиме.
     * @param {Object} data - Данные от сервера
     * @param {Boolean} data.result - Статус ответа
     * @param {String} [data.error] - Сообщение об ошибке
     * @param {Number} data.QueryId - Идентификатор текущего отчёта
     * @param {Number} data.ReportType - Тип отчёта
     * @param {Object} [data.resp] - Ответ или часть ответа сервера
     * @param {Number} data.resp.AnswerType - Тип ответа
     *  1: Ответ полностью
     *  2: Часть результата
     *  3: Оценка выполнения
     *  4: Ошибка (?)
     *  5: Отмена пользователем
     * @param {Object} data.resp.PartInfo - Информация о текущей части ответа
     * @param {Number} data.resp.PartInfo.PartNumber - Номер текущей части.
     *  Нумерация начинается с 1.
     *  0 означает получение информации об оценке выполнения.
     * @param {Object} [data.RepDetail] - Данные части ответа
     */
    receiveReportData : function (data) {

        var Report__Loader = this,
            Report = this.Report,
            that = this,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Получаем ожидаемые объекты
            resp = data.resp || {},
            QueryId = resp.QueryId || 0,
            PartInfo = resp.PartInfo || {},
            RepDetail = resp.RepDetail || {},
            AnswerType = resp.AnswerType || 0,
            PartCount = PartInfo.PartCount || 0,
            PartNumber = PartInfo.PartNumber || 0,

            // Ожидатель
            waiterId = reportData.waiterId,
            reportWaiter = reportData.waiter
        ;

        // Ошибка?
        if ( !data.result || !data.resp || typeof resp !== 'object' || !AnswerType ) {
            console.error('reportData receiveReportData error', data);
            /*DEBUG*//*jshint -W087*/debugger;
            // Если явно передана ошибка, прекращаем процесс ожидания аварийно
            if ( data.error && waiter.is_waiting(waiterId) ) {
                waiter.error(waiterId, data.error);
            }
        }

        // Получены данные для другого (отменённого отчёта)
        else if ( !QueryId || ( reportData.QueryId && QueryId !== reportData.QueryId ) ) {
            console.warn('reportData receiveReportData invalid QueryId', QueryId, '-', data);
            // /*DEBUG*//*jshint -W087*/debugger;
        }

        // Оценка выполнения. Инициализация ожидателя.
        else if ( AnswerType === 3 ) {
            console.log('reportData receiveReportData estimate', QueryId, '-', PartCount, data);
            // Сохраняем идентификатор сессии запроса
            if ( QueryId ) {
                reportData.QueryId = QueryId;
            }
            // Если указано количество ожидаемых частей
            if ( PartCount > 0 ) {
                // Прогрессбар для асинхронной загрузки в поле заставки.
                reportData.asyncProgressbar || that.initAsyncProgressbar(PartCount);
                this.updateAsyncLoaderInfo(0);
                if ( project.config.maxReportPackets && PartCount >= project.config.maxReportPackets ) {
                    this.askUserForReceiveUnsafeDataAmount();
                }
            }
        }

        // Полные или частичные данные (и сессия соответствует ожидаемой)
        else if ( ( QueryId && QueryId === reportData.QueryId ) && ( AnswerType === 1 || AnswerType === 2 ) ) {
            console.log('reportData receiveReportData data', QueryId, '-', PartNumber, '/', reportData.PartCount, data);
            this.receiveReportDataPart(RepDetail, data);
            // Если указано, какую часть данных принимаем...
            if ( PartNumber > 0 ) {
                if ( PartCount > 0 ) {
                    reportData.asyncProgressbar || that.initAsyncProgressbar(PartCount);
                    reportData.PartsCounter++;
                    this.updateAsyncLoaderInfo();
                }
                // Если приняты все данные...
                if ( PartNumber >= PartCount ) {
                    waiter.done(waiterId, {
                        status: 'asyncReport__DataRecevingDone',
                        description: 'Завершено асинхронное получение данных отчёта'
                    });
                }
            }
        }

        // Неотловленный кейс:
        else {
            // WTF???
            console.error('reportData receiveReportData uncatched', QueryId, '-', data);
            // /*DEBUG*//*jshint -W087*/debugger;
        }

    },/*}}}*/

    /** startReportReceiver ** {{{ Стартуем ожидание получения данных отчёта */
    startReportReceiver : function () {

        var Report__Loader = this,
            Report = this.Report,
            that = this,

            // Объект отчёта
            reportData = Report.params.reportData, // || ( Report.params.reportData = {} ), // ...Инициализируется в `initReport__Dom`

            // Обработчик событий от сокета (привязываем метод к текущему объекту)
            receiveReportData = reportData.receiveReportData = this.receiveReportData.bind(this),

            // Параметры ожидателя. ID храним в объекте отчёта
            waiterId = reportData.waiterId = 'reportReceiver' + Date.now(),
            waiterTitle = 'Приём данных отчёта',

            // Запуск ожидателя
            reportWaiter = reportData.waiter = waiter.start(waiterId, {
                title: waiterTitle,
                // ticks: 100, // Ожидаемые отсчёты (???) Обновим значение при первом ответе сервера через сокет
                // timeout : 30000,
                // timeout_break : false,
                // on_timeout : function () {
                //     done_loading('Превышено время ожидания для загрузки ресурса');
                // },
                on_cancel : function () {
                    // DBG('reportData startReportReceiver on_cancel', reportData.QueryId, '-', reportData, Report.params);
                    that.cancelReportReceiver();
                },
                on_finish : function () {
                    // DBG('reportData startReportReceiver on_finish', reportData.QueryId, '-', reportData, Report.params);
                    delete reportData.waiterId;
                    delete reportData.waiter;
                },
            })

        ;

        // Массив для накопления данных отчётов
        reportData.receivedData = [];

        // Счётчик принятых асинхронно пакетов
        reportData.PartsCounter = 0;

        // Сбрасываем параметры, которые будут инициализированы при первом ответе от сервера...

        // Идентификатор сессии передачи данных отчёта.
        // Нужен при остановке сессии в случае работы через сокеты.
        delete reportData.QueryId;

        // Показываем заставку ожидания
        Report.Modules.Dom.params.screenholder.waiting();

        // Прячем выбор КО
        // Тут внимание: надо будет, видимо, по-другому с новой реализацией box etc...
        Report.Modules.Dom.getRootbox().show_boxes({
            box_group_ko_filter : false,
            // box_actions_controls : true,
        });

        if ( app.socket.isConnected() ) {
            app.socket.transport.on('reportpart', reportData.receiveReportData);
        }

    },/*}}}*/
    /** stopReportReceiver ** {{{ Завершаем ожидание получения данных отчёта */
    stopReportReceiver : function (error, data) {

        var Report__Loader = this,
            Report = this.Report,

            reportData = Report.params.reportData

        ;

        // Если подключён сокет, отсоединеяем прослушку событий
        if ( app.socket.isConnected() ) {
            app.socket.transport.off('reportpart', reportData.receiveReportData);
        }

        // Завершаем ожидатель, если он ещё активен
        if ( reportData.waiterId && waiter.is_waiting(reportData.waiterId) ) {
            waiter.finish(reportData.waiterId, error, data);
            // delete reportData.waiterId;
            // delete reportData.waiter;
        }

        // Если ошибка, показываем в поле заставки
        if ( error ) {
            console.error( 'error catched in stopReportReceiver', error );
            /*DEBUG*//*jshint -W087*/debugger;
            Report.Modules.Dom.params.screenholder.error(error);
        }
        // Иначе снимаем заставку
        else {
            Report.Modules.Dom.params.screenholder.ready();
        }

        // Удаляем блок с информацией об асинхронной загрузке
        this.removeAsyncLoaderInfoDom();

    },/*}}}*/
    /** cancelReportReceiver ** {{{ Принудительно завершаем получение данных отчёта */
    cancelReportReceiver : function () {

        var Report__Loader = this,
            Report = this.Report,
            that = this,

            reportData = Report.params.reportData,

            QueryId = reportData.QueryId,
            socketId = ( project.config.useSockets && app.socket.isConnected() ) ? app.socket.getSocketId() : null,

            // Данные запроса
            ajaxData = {
                op: Report.params.reportType,
                StopReport: 1,     // Останавливаем получение данных
                socketId: socketId,
                QueryId: reportData.QueryId,
            },

            // Отправка запроса на останов передачи данных
            requestWaiter = requestor.waiterRequest({
                request_id: 'Report_cancel_report_receiving' + Date.now(),
                title: 'Отмена получения данных отчёта',
                waiter_timeout: 10000,
                url: project.helpers.expand_path(Report.params.getReportUrl),
                method: Report.params.getReportMethod,
                data: ajaxData,
            }),

            resultError = {error: 'reportCanceled', description: 'Получение данных отчёта отменено!'}

        ;

        requestWaiter
            .fail(function (error) {
                console.error('reportData cancelReportReceiver error', error, 'reportData:', reportData.QueryId, '-', reportData);
                /*DEBUG*//*jshint -W087*/debugger;
                waiter.error(reportData.waiterId, error);
            })
            .done(function (data) {
                DBG('reportData cancelReportReceiver done', reportData.QueryId, '-', reportData);

                // Если в конфигурации указано показывать недозагруженный отчёт, просто останавливаем получение данных.
                if ( project.config.showCanceledReport ) {
                    waiter.done(reportData.waiterId, resultError);
                }
                // Иначе выбрасываем ошибку
                else {
                    waiter.error(reportData.waiterId, resultError);
                }
            })
        ;

    },/*}}}*/

    /** createAsyncLoaderInfoDom ** {{{ Создать dom-элемент для вывода информации об асинхронной загрузке данных отчёта
     * @returns {Object} Созданный DOM-узел
     */
    createAsyncLoaderInfoDom : function () {

        var Report__Loader = this,
            Report = this.Report,

            // screenholder
            screenholder = Report.Modules.Dom.params.screenholder,
            waiting = screenholder._elem('waiting'),

            // Объект отчёта
            reportData = Report.params.reportData

        ;

        // Возвращаем уже сохранённый узёл, если есть
        if ( !reportData.asyncLoaderInfoDom ) {

            var

                bemjson = [
                    {
                        block: 'screenholder',
                        elem: 'container',
                        elemMods: {
                            hidden: true,
                        },
                        attrs: {
                            id: 'asyncLoaderInfo',
                        },
                        content: [
                            {
                                elem: 'info', elemMods: {title: true}, content: [
                                    'Асинхронная загрузка данных отчёта...'
                                ],
                            },
                            {
                                block: 'progressbar',
                                mods : {
                                    noDetails : true,
                                },
                                js: {
                                    minimalWidth: 0,
                                },
                            },
                            {
                                elem: 'info', elemMods: {text: true}, content: [
                                'Принято пакетов: ',
                                { elem: 'info_show', elemMods: { id: 'counter' } },
                                ' из ',
                                { elem: 'info_show', elemMods: { id: 'total' } },
                                ' (',
                                { elem: 'info_show', elemMods: { id: 'percents' } },
                                '%)',
                            ]
                            },
                            {
                                elem: 'info', elemMods: {actions: true}, content: {
                                block: 'button',
                                cls: 'button_no_frame',
                                // cls : 'button_no_frame button_on_dark',
                                mods: {
                                    id: 'cancel',
                                    theme: 'islands',
                                    size: 'm',
                                },
                                icon: {block: 'icon', cls: 'ti-close'},
                                text: 'Отменить',

                            }
                            },
                        ],
                    },
                ],

                html = BEMHTML.apply(bemjson),
                dom = reportData.asyncLoaderInfoDom = BEMDOM.append(waiting && waiting.domElem, html)

            ;

            // screenholder.dropElemCache(); ???
        }

        // Показываем плавно
        $(reportData.asyncLoaderInfoDom).slideDown(500);
        // $(reportData.asyncLoaderInfoDom).css({ opacity : 0, display : 'block' });
        // $(reportData.asyncLoaderInfoDom).animate({ opacity : 1 }, 500);

        // Событие на кнопку отмены
        var cancelButton = screenholder.findChildBlock({block: BEMDOM.entity('button'), modName: 'id', modVal: 'cancel'});
        cancelButton && cancelButton._domEvents().on('click', this.cancelReportReceiver.bind(this));

        // Возвращаем
        return reportData.asyncLoaderInfoDom;

    },/*}}}*/
    /** removeAsyncLoaderInfoDom ** {{{ Удалить dom-элемент вывода информации об асинхронной загрузке */
    removeAsyncLoaderInfoDom : function () {

        var Report__Loader = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData
        ;

        if ( reportData.asyncLoaderInfoDom ) {
            BEMDOM.destruct(reportData.asyncLoaderInfoDom);
            delete reportData.asyncLoaderInfoDom;
        }

        delete reportData.asyncProgressbar;

    },/*}}}*/
    /** updateAsyncLoaderInfo ** {{{ Обновить прогрессбар и информацию в блоке данных асинхронного загрузчика.
     */
    updateAsyncLoaderInfo : function () {

        var Report__Loader = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Ожидатель
            waiterId = reportData.waiterId,
            reportWaiter = reportData.waiter,

            // Информационный блок в заставке
            asyncLoaderInfoDom = this.createAsyncLoaderInfoDom(),

            // screenholder
            screenholder = Report.Modules.Dom.params.screenholder,
            waiting = screenholder._elem('waiting'),

            asyncProgressbar = reportData.asyncProgressbar,

            counter = reportData.PartsCounter,

            percents = reportData.PartCount ? Math.round(100 * counter / reportData.PartCount) : 0

        ;

        asyncProgressbar && asyncProgressbar.set(percents, true);

        BEMDOM.update(screenholder._elem({ elem : 'info_show', modName : 'id', modVal : 'percents' }).domElem, percents);
        BEMDOM.update(screenholder._elem({ elem : 'info_show', modName : 'id', modVal : 'counter' }).domElem, counter);
        BEMDOM.update(screenholder._elem({ elem : 'info_show', modName : 'id', modVal : 'total' }).domElem, reportData.PartCount);

        waiter.tick(waiterId, counter, true);

    },/*}}}*/

    /** initAsyncProgressbar ** {{{ Инициализируем ползунок для показа загрузки данных отчёта.
     * @param {int} PartCount - Количество ожидаемых пакетов
     */
    initAsyncProgressbar : function (PartCount) {

        var Report__Loader = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            reportWaiter = reportData.waiter,

            asyncLoaderInfoDom = this.createAsyncLoaderInfoDom(),

            // screenholder
            screenholder = Report.Modules.Dom.params.screenholder,
            waiting = screenholder._elem('waiting'),

            // Находим объект progressbar. См. создание в createAsyncLoaderInfoDom()
            asyncProgressbar = reportData.asyncProgressbar = reportData.asyncProgressbar || waiting.findChildBlock(BEMDOM.entity('progressbar'))

        ;

        if ( reportWaiter ) {
            reportWaiter.options.ticks = reportData.PartCount = PartCount;
        }

        if ( asyncProgressbar ) {
            asyncProgressbar.activate();
            // ???
            // asyncProgressbar.set(1);
            // asyncProgressbar.set(0);
        }

    },/*}}}*/

    /** requestReportStart ** {{{ Обёртка запуска получения данных отчёта
     * @param {Object} [reportParams=this.Report.Modules.Controls.getReportParams()] - Параметры фильтров
     * @returns {Promise}
     * Запускает синхронный или асинхронный способ получения данных.
     */
    requestReportStart : function (reportParams) {

        reportParams = reportParams || this.Report.params.reportData.reportParams;

        var Report__Loader = this,
            Report = this.Report,
            that = this,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Данные запроса
            ajaxData = Report.Modules.Controls.getReportRequestParams(reportParams),

            // Запрос данных для построения отчёта
            requestWaiter = requestor.waiterRequest({
                request_id: 'Report_get_report' + Date.now(),
                title: 'Подготовка отчёта',
                // request_timeout : waiterTimeout,
                waiter_timeout: 30000,
                url: project.helpers.expand_path(Report.params.getReportUrl),
                method: Report.params.getReportMethod,
                data: ajaxData,
                // timeout_break : false, // Не отваливаемся по таймауту
                // silent_errors: true, // Ошибки сами отработаем ??? OBSOLETTE?
            })

        ;

        return requestWaiter

            // Получаем первый ответ (в случае синхронной передачи -- он же последний;
            // иначе запускаем получение данных через сокеты).
            .then(function (data) {

                // Если получена ошибка...
                if ( !data || typeof data !== 'object' || data.error || !data.result ) {
                    console.warn('requestReportStart requestWaiter error:', data);
                    /*DEBUG*//*jshint -W087*/debugger;
                    return vow.Promise.reject(data);
                }

                // Ловим возврат сообщения о старте асинхронного ответа:
                else if ( data.result && data.QueryId ) {

                    reportData.QueryId = data.QueryId;

                    // ВНИМАНИЕ: Нет смысла делать к.-то отдельную процедуру,
                    // т.к. в ряде случаев асинхронное получение данных к этому моменту уже завершено.
                    // Просто возвращаем промис.
                    // Действия на старт асинхронной сессии выполняем в методе `receiveReportData`
                    // (раздел "Оценка выполнения. Инициализация ожидателя.", `AnswerType === 3`).
                    return reportData.waiter;
                }

                // Синхронная передача: один пакет
                else if ( data && data.resp && Array.isArray(data.resp) ) {

                    // Принимаем данные
                    that.receiveReportDataPart(data.resp, data);

                    // Возвращаем информационное сообщение
                    return {
                        status: 'syncReport__DataReceived',
                        description: 'Данные отчёта получены синхронным способом'
                    };

                }

                // Иначе считаем, что ошибка
                else {
                    return this.__error({error: 'Получены некорректные данные отчёта: ' + JSON.stringify(data)}, 'requestReportStart');
                }

            })
        ;

    },/*}}}*/

    /** clearReportObject ** {{{ Инициализируем объект отчёта для приёма данных
     * @returns {Object} - Объект отчёта (Report.params.reportData)
     */
    clearReportObject : function () {

        // Объект отчёта
        var reportData = this.Report.params.reportData || ( this.Report.params.reportData = {} );

        // Сбрасываем (на всякий случай) параметры, которые могли остаться от предыдущего запроса отчёта
        delete reportData.waiter;
        delete reportData.waiterId;
        delete reportData.QueryId;
        delete reportData.receiveReportData;
        delete reportData.receivedData;
        delete reportData.rows;
        delete reportData.totals;
        delete reportData.ReportTime;
        delete reportData.reportParams;
        delete reportData.PartCount;
        delete reportData.PartsCounter;
        delete reportData.combinedColumns;    // Report__ResultDom:createCombinedDataloader
        delete reportData.combinedColumnsIds; // Report__ResultDom:createCombinedDataloader
        delete reportData.combinedDataloader; // Report__ResultDom:createCombinedDataloader
        // delete reportData.showColumns;    // Report__ResultDom:createShowDataloader
        // delete reportData.showColumnsIds; // Report__ResultDom:createShowDataloader
        // delete reportData.showDataloader; // Report__ResultDom:createShowDataloader
        delete reportData.statItemsDescr; // Report__ResultDom:createPreparedData

        return reportData;

    },/*}}}*/
    /** initReportObject ** {{{ Инициализируем объект отчёта для приёма данных
     * @returns {Object} - Объект отчёта (Report.params.reportData)
     */
    initReportObject : function () {

        this.clearReportObject();

        var reportData = this.Report.params.reportData || ( this.Report.params.reportData = {} );

        // Устанавливаем параметры по умолчанию
        reportData.ReportTime = new Date();
        reportData.reportParams = this.Report.Modules.Controls.getReportParams();
        reportData.reportInfoParams = Object.assign({}, reportData.reportParams, this.Report.Modules.Controls.getReportInfo());

        // Счётчик принятых пакетов
        reportData.PartsCounter = 0;

        return reportData;

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

        var Report__Loader = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Loader = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Loader', __Loader)); // provide

}); // module

