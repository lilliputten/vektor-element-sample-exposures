/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, DEBUG, DBG, BEMHTML, app, project, getCookie, setCookie */
/**
 *
 * @module Report
 * @overview Компоненты для создания отчётов - основной клиентский код
 * @author Михаил Греков <mihail-grekov@mail.ru>
 *
 * @since 2016.08.19, 14:00
 * @version 2017.05.05, 20:08
 *
 * $Id: Report.js 8728 2017-07-10 16:23:49Z miheev $
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 *
 * Created by Михаил on 21.11.2016.
 *
 * @class Report
 * @classdesc Клиентский класс компонента создания отчётов
 *
 * TODO
 * ====
 *
 * - Загрузка библиотек.
 * - Попробовать найти rtf.
 * - Рефакторить код, сделать нормальную передачу данных, подключать бибилиотеки когда надо.
 *
 * ОПИСАНИЕ
 * ========
 *
 * (См. Report.md)
 *
 * Подмодули
 * =========
 *
 * См. зависимости, создание сущностей в onInited, соотв. модули.
 *
 * Инициализиурются на текущем DOM (см. инициализацию в onInited по списку из params.useModules, см. _getDefaultParams).
 *
 * (Если в модуле задан метод `asyncInitModule`, он вызывается
 * сразу после после инициализации модуля. Ожидается Promise,
 * дальнейшее выполнение зависит от результа промиса.)
 *
 * - ReportPrint: Подготовка представления отчёта для печати. Разворачивается в открывающемся всплывающем окне. См. Report__Print.printReportAction.
 *
 */

modules.define('Report', [
    'project',
    'popup_controller',
    'store',
    'waiter',
    'vow',
    'i-bem-dom',
    'jquery',
],
function Report(provide,
    project,
    popup_controller,
    store,
    waiter,
    vow,
    BEMDOM,
    $,
__BASE) {

// Ссылка на описание модуля
var __module = this;

var ReportPrototype = /** @lends Report.prototype */ {

    /** _getDefaultParams ** {{{ Параметры (`this.params`) по умолчанию
     * См. initParams -- дополнение параметров в соответствии с типом отчёта
     * (здесь тип отчёта ещё не известен -- параметры по умолчанию).
     */
    _getDefaultParams : function () {
        return {

            // Тип отчёта (по умолчанию).
            // Позже (в initParams или initData) переопределяется из свойств страницы
            // -- `app.params.pageData.data.reportType`).
            // reportType : 'milage',
            // reportType : 'efficiency',
            // reportType : 'detailmove',
            reportType : 'objvisitdetail',

            // Используемые модули (см. метод loadModules; не забывать добавлять в `.deps.js`)
            useModules : [
                'Report__Params',   // Инициализация и получение параметров отчёта.
                'Report__Controls', // Блок-функционал для элементов управления (фильтры и пр.)
                'Report__Content',  // Генерация контента.
                'Report__Dom',      // Элементы DOM.
                'Report__ResultDom', // Элементы DOM для показа отчёта.
                'Report__Loader',   // Загрузка данных отчёта.
                'Report__Data',     // Обработка данных.
                'Report__Show',     // Показ отчёта.
                'Report__KOFilter', // Управление фильтром КО.
                'Report__Export',   // Экспорт отчётов (pdf, rtf).
                'Report__Print',    // Печать отчётов.
            ],

            // Адрес для запроса данных отчёта
            getReportUrl : '{{approot}}element-tcm/TCMAnalytics/Report',

            // Метод запроса данных отчёта
            getReportMethod : 'POST',

            // Размер страницы по умолчанию
            objectsSelectorPageSize : 50,

            // Шаблон по умолчанию для форматирования параметра расстояния
            distTemplate : '%.3f',

            // Шаблон по умолчанию для форматирования параметра периода времени
            durationTemplate : '%t', // милисекунды
            durationSecTemplate : '%T', // секунды

        };
    },/*}}}*/

    /** initParams ** {{{ Расширяем параметры блока в соответствии с типом отчёта.
     * См. _getDefaultParams -- начальная (слепая) инициализация.
     * К моменту запуска этого метода уже знаем тип отчёта (params.reportType)
     * @returns {Promise}
     */
    initParams : function () {

        var Report = this,
            params = this.params
        ;

        // Тип отчёта. Получаем из описания страницы
        // (напр., `WEB_TINTS/release/core/scripts/php/app/config/app/pages/Report.php`)
        if ( !project.config.LOCAL_ENB && app.params.pageData.data && app.params.pageData.data.reportType ) {
            params.reportType = app.params.pageData.data.reportType;
        }

        return vow.Promise.resolve({ status : 'reportParamsInited', description : 'Параметры отчёта установлены ' });

    },/*}}}*/

    /** createModule ** {{{
     * @param {Object|Function} module - Дескриптор модуля
     * @returns {Promise|null}
     */
    createModule : function (module) {

        var Report = this,
            that = this,
            params = this.params,

            // Имя модуля
            name = module.getName(),
            entityName = module.getEntityName(),
            isElem = entityName.includes('__'),

            moduleName = name,
            moduleObj
        ;

        // Если модуль-элемент...
        if ( isElem ) {
            var elemDom = BEMDOM.append(this.domElem, BEMHTML.apply({
                block : 'Report',
                elem : name,
                elemMods : {
                    type : params.reportType,
                },
                js : true,
            }));
            moduleObj = elemDom.bem(module);
            // moduleName = 'Report__' + moduleName; // DEBUG!!!
        }
        // Если модуль-миксин...
        else {
            // Устанавливаем модификатор типа отчёта для каждого модуля
            that.domElem.addClass(name + '_type_' + params.reportType);

            // Инициализируем объект модуля
            moduleObj = that.domElem.bem(BEMDOM.entity(name));
        }

        // Сохраняем объект модуля
        if ( moduleObj ) {
            if ( !this.Modules ) { this.Modules = {}; }
            // this[moduleName] =
            this.Modules[moduleName] = moduleObj;
        }

        // Возвращаем промис на asyncInitModule или null
        return ( moduleObj && typeof moduleObj.asyncInitModule === 'function' ) ? moduleObj.asyncInitModule() : null;

    },/*}}}*/

    /** loadModules ** {{{ Загружаем подмодули (см. params.useModules)
     * @returns {Promise}
     */
    loadModules : function () {

        var Report = this,
            that = this,
            params = this.params,

            // Отложенный промис
            deferred = vow.defer(),

            __modulesLoaded = function () {
                deferred.resolve({ status : 'reportModulesLoaded', description : 'Все модули отчёта загружены' });
            },
            __modulesError = function (error) {
                console.error( 'Report:loadModules:__modulesError', error );
                /*DEBUG*//*jshint -W087*/debugger;
                Array.isArray(error) || ( error = [error] );
                error.push({ error : 'reportModulesError', description : 'Ошибка загрузки модуля отчёта' });
                deferred.reject(error);
            },
            __requireSuccess = function () {
                var loadedModules = Array.prototype.slice.call(arguments),
                    allPromises = loadedModules.map(that.createModule, that)
                ;
                // Промис на все загруженные модули
                return vow.all(allPromises)
                    // Обрабатываем успешное завершение или ошибку...
                    .then(__modulesLoaded)
                    .fail(__modulesError)
                ;
            }

        ;

        try {

            // Загружаем модули, ждём результат в callbacks...
            modules.require(params.useModules,

                // Успешное завершение: обрабатываем загруженные модули...
                __requireSuccess,

                // Ошибка...
                 __modulesError

            );

            return deferred.promise();

        }
        catch (error) {
            return this.__error(error);
        }

    },/*}}}*/

    /** initModules ** {{{ Инициализируем модули */
    initModules : function () {

        var Report = this,
            that = this
        ;

        return vow.cast(null)

            // Инициализируем управляющие элементы
            .then(this.Modules.Controls.init, this.Modules.Controls)

        ;

    },/*}}}*/

    /** startWorking ** {{{ Всё готово, начинаем работу */
    startWorking : function () {

        // Сообщаем о готовности страницы -- можно вызывать
        // после завершения всех подготовительных действий.
        waiter.finish('pageReady');

        // Показываем контент...
        // that.Modules.Dom.params.screenholder.ready();
        // ...или выводим сообщение в поле контента...
        this.error('Не выбраны параметры для построения отчёта.' +
            '<p>Выберите параметры (в панелях вверху) и нажмите кнопку &laquo;<u>Применить</u>&raquo;.',
            'icon ti ti-power-off');

    },/*}}}*/

    /** onPageReady ** {{{ Инициализируем страницу
     * Может вызываться по событию `pageReady`
     */
    onPageReady : function () {

        // Перестраховка: Запускаемся только один раз!
        if ( this.params.pageReadyFlag ) { return; } else { this.params.pageReadyFlag = true; }

        vow.cast(null)

            // Инициализируем данные
            .then(this.initParams, this)

            // Загружаем и инициализируем подмодули отчёта
            .then(this.loadModules, this)

            // Инициализируем клиентские действия подмодулей отчёта
            .then(this.initModules, this)

            // Завершаем прорисовку страницы -- выполняем последние действия...
            .then(this.startWorking, this)

            .fail(function (error) {
                console.error( 'Report:onPageReady error', error );
                /*DEBUG*//*jshint -W087*/debugger;
                app.error(error);
            })
        ;

    },/*}}}*/

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

    /** error ** {{{ Конечный интерфейс для показа сообщения об ошибке пользователю. */
    error : function (error, errorIcon) {

        var errorHtml = app.error2html(error);

        this.Modules.Dom.params.screenholder.error(errorHtml, errorIcon);

    },/*}}}*/

    /** onInited ** {{{ Инициализируем класс блока. */
    onInited : function () {

        // Регистрируем событие на готовность страницы
        app.registerPageReadyAction(this.onPageReady.bind(this));

    },/*}}}*/

    /** onSetMod ** {{{ Состояния... */
    onSetMod: {

        /** (*) ** {{{ Синхронизация модификаторов с внешними panelbox */
        '*': {
            '*' : function (modName, modVal) {
                if ( modName !== 'js' && this.Modules && this.Modules.Dom ) {
                    this.Modules.Dom.getRootbox().setMod(modName, modVal);
                    this.Modules.Dom.getViewbox().setMod(modName, modVal);
                }
            },
        },/*}}}*/

        /** (js:inited) ** {{{ Инициализация системой. */
        'js': {
            'inited' : function () {
                this.onInited();
            },
        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declBlock(this.name, ReportPrototype)); // provide

}); // module
