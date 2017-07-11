/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true, laxcomma:true */
/* globals debugger, modules, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__KOFilter
 * @overview Блок-функционал для обслуживания фильтра по КО
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date: 2017-07-10 20:03:07 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__KOFilter.js 8730 2017-07-10 17:03:07Z miheev $
 *
 */

modules.define('Report__KOFilter', [
    'vow',
    'i-bem-dom',
    'project',
    'jquery',
],
function(provide,
    vow,
    BEMDOM,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__KOFilter
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

var __KOFilter = /** @lends Report__KOFilter.prototype */ {

    /** initDom() ** {{{ Инициализация элементов DOM для фильтра КО
     */
    initDom : function () {

        var Report__KOFilter = this,
            Report = this.Report
        ;

        // Фильтр выбора КО:
        this.params.filterBox = Report.Modules.Dom.getRootbox().findChildBlock({
            block: BEMDOM.entity('box_group'),
            modName: 'id',
            modVal: 'ko_filter'
        });

        // Контроллеры для выбора КО:
        this.params.filter_controller = this.params.filterBox.findChildBlock({
            block: BEMDOM.entity('box_actions'),
            modName: 'id',
            modVal: 'filters'
        });

        // Контроллер вывода
        this.params.view_controller = this.params.filterBox.findChildBlock(BEMDOM.entity('ObjectsSelector'));
        // Если задан параметр "режим меню"
        if ( Report.params.options.KOFilterMenuMode ) {
            this.params.view_controller.setMod('mode', Report.params.options.KOFilterMenuMode);
            this.params.filterBox.setMod('mode', Report.params.options.KOFilterMenuMode);
        }
        // Если установлен флаг "не создавать меню автоматически"...
        // Создаём меню
        if ( this.params.filterBox.getMod('noAutoMenu') ) {
            this.params.view_controller.initMenu(true);
        }

        // Создаём объект контроллера данных на dom узле фильтра
        this.params.dataloader = this.params.view_controller.domElem.bem(BEMDOM.entity('dataloader'));

        /* Управление профилями наборов данных на контейнере фильтра
         * (в отличие от AdminKO -- упарвляем единым контейнером, --
         * и список результатов и фильтры одновременно). */
        this.params.datasets_container = this.params.filterBox.domElem.bem(BEMDOM.entity('datasets'));

    },/*}}}*/
    /** initData(data) ** {{{ Инициализируем данные фильтра КО
     * @param {object} data - Данные инициализации (см. TCMAdministrationController:get_ControlObjects_InitialData_Action)
     */
    initData : function (data) {

        var Report__KOFilter = this,
            Report = this.Report
        ;

        Report.params.dataColumns = data.columns;

        // Колонки данных.
        // "Включаем" те данные, которые используются для фильтров КО и общих фильтров
        // См. описания данных в Report__Params
        Report.params.koDataColumns = data.columns.map(function (column) {
            var id = column.id;
            var show = ( Report.params.mainFilterColumnsList.includes(id) || Report.params.koFilterUsedColumns.includes(id) );
            return project.helpers.extend({}, column, {
                show : show || column.required,
                filter : show ? column.filter : false,
            });
        }, this);

        // Элемент поиска
        this.params.search_filter = data.search_filter;
        // Вставляем вторым -- после переключателя типа КО
        this.params.search_filter.insert_pos = 1;

        // Инициализируем наборы данных для фильтра
        this.params.datasets_container.init_datasets(data.datasets);

    },/*}}}*/
    /** initEvents() ** {{{ Инициализируем контроллеры фильтра КО
     */
    initEvents : function () {

        var Report__KOFilter = this,
            Report = this.Report,
            that = this,

            /* При создании и изменении фильтра "Тип объекта"
             * устанавливаем модификаторы на родительском контейнере (panelbox).
             * См. update_datasets
             */
            update_typeID_filter = function () {
                if ( that.params.datasets_changed ) {
                    that.params.datasets_container.update_datasets(that.params.datasets);
                    delete that.params.datasets_changed;
                }
            },
            check_typeID_filter = function (data, is_init) {
                if ( data.filter_id === 'typeID' ) {
                    that.params.datasets = that.params.dataloader.get_processed_data_value(data.filter_id, data.filter_val, 'data');
                    that.params.datasets_changed = true;
                }
                update_typeID_filter();
            }

        ;

        try {

            // Обновления фильтров
            this.params.filter_controller._events().on('filter_inited', function (e, data) {
                check_typeID_filter(data, true);
            });
            this.params.filter_controller._events().on('filter_changed', function (e, data) {
                check_typeID_filter(data, false);
            });
            this.params.filter_controller._events().on('apply_filters', function (e, data) {
                update_typeID_filter();
            });

            // Изменены выбранные элементы
            this.params.view_controller._events().on('change', function(e,data){
                var ReportKOList = this.params.view_controller.get_checked_items();
                app.session.set('ReportKOList', ReportKOList);
            }, this);
        }
        catch (error) {
            console.error(error);
            /*DEBUG*//*jshint -W087*/debugger;
        }

    },/*}}}*/
    /** getInitialReportKOList ** {{{ Получить значения для инициализации списка КО */
    getInitialReportKOList : function () {

        var Report__KOFilter = this,
            Report = this.Report,

            // Сохранённый список (или null|undefined)
            ReportKOList = app.session.get('ReportKOList'),

            setDebugValues = ( project.config.LOCAL_ENB || project.config.LOCAL_NGINX )
        ;

        // Значения по умолчанию (пустой список или отсладочный список)
        if ( !ReportKOList ) {
            ReportKOList = [];
            // DEBUG DATA!!! Если режим разработки, устанавливаем отладочные параметры
            // TODO 2017.05.16, 20:05 -- Вынести в метод и расширять модификатором?
            // См. также `Report__Controls:initFilterDates()`.
            if ( setDebugValues ) {
                switch (Report.params.reportType) {
                    case 'objvisitdetail':
                        ReportKOList.push(5585); // юво-2811
                        // @see Report__Controls:initFilterDates: выбор элемента из `listobject`
                        break;
                    case 'efficiency':
                        ReportKOList.push(7680);//,7681,7682);
                        break;
                    case 'milage':
                        ReportKOList.push(7680,7681,7682);
                        break;
                    // Иначе x101xx180
                    default:
                        ReportKOList.push(2,3);
                }
            }
        }

        return ReportKOList;

    },/*}}}*/
    /** initControllers() ** {{{ Инициализируем контроллеры фильтра КО
     */
    initControllers : function () {

        var Report__KOFilter = this,
            Report = this.Report,
            that = this,

            // Общие настройки контроллеров
            commonControllerOptions = {
                columns: Report.params.koDataColumns,
                view_controller: this.params.view_controller,
                dataloader: this.params.dataloader,
                filter_controller: this.params.filter_controller,
                screenholder: this.params.view_controller.screenholder,
            },

            // Связанные контроллеры
            ctxToPoll = [
                this.params.dataloader,
                this.params.view_controller,
                this.params.filter_controller,
            ]

        ;

        try {

            // Устанавливаем выбранные элементы (по умолчанию или отладочные)
            this.params.dataloader._events().once('after_prefetch_data', function(e,data){
                var ReportKOList = this.getInitialReportKOList();
                this.params.view_controller.setInitList(ReportKOList);
            }, this);

            // Контроллер данных -- `dataloader` на собственном dom-узле
            this.params.dataloader.initialize(
                project.helpers.extend({}, commonControllerOptions, {
                    request_url : '{{approot}}element-tcm/TCMAdministration/get_ControlObjects_DataColumns_',
                })
            );

            // Контроллер взаимодействия с пользователем (показа данных) -- ObjectsSelector
            this.params.view_controller.initialize(
                project.helpers.extend({}, commonControllerOptions, {
                    info_container : this._box_actions_actions,
                    page_size : Report.params.objectsSelectorPageSize,
                })
            );

            // Контроллер фильтров -- box_actions_filters
            this.params.filter_controller.initialize(
                project.helpers.extend({}, commonControllerOptions, {
                    id : 'ko_filter',
                    show_filters : Report.params.koFilterUsedColumns,
                    search : this.params.search_filter,//this.ko_filters_search,
                    // Автоматически инициировать применение фильтров после инициализации или после изменений
                    auto_reapply_filters : true,
                    // Не добавлять автоматически кнопки "Применить/Сбросить фильтры"
                    // no_buttons : true,
                    // group_containers : {
                    //     separated : this._separated_filters_container,
                    // },
                    // buttons_container : this._filter_buttons_container,
                })
            );

            // Запускаем все контроллеры...
            return app.startControllers(ctxToPoll);

        }
        catch (error) {
            return this.__error(error, 'initControllers');
        }

    },/*}}}*/

    // Интерфейс...

    /** initAll ** {{{ Инициализируем фильтр КО
     * Получаем данные описания КО и инициализируем контроллеры ({@link #initControllers}).
     */
    initAll : function () {

        var Report__KOFilter = this,
            Report = this.Report,
            that = this,

            // Получаем описания колонок данных для КО
            dataId = 'data:ControlObjects_InitialData',
            initialDataPromise = app.resolve_assets([
                {
                    id: dataId,
                    url: '{{approot}}element-tcm/TCMAdministration/get_ControlObjects_InitialData_',    //?admin=true',
                    method: 'GET',
                    expires: app.config.cache.lifetime_long,
                },
            ])
        ;

        try {

            // var promise = vow.all([ initialDataPromise, /* ... */ ]) // - Если делаем несколько ожиданий...
            return vow.all([
                    initialDataPromise,
                    Report.Modules.Params.asyncInitModule(),
                ])
                .spread(function (data) {
                    // DOM-элементы
                    this.initDom();
                    // Данные для фильтра КО
                    this.initData(data[dataId]);
                    // Устанавливаем события контроллеров -- до их инициализации
                    this.initEvents();
                    // Контроллеры
                    return this.initControllers();
                }, function (error) {
                    // console.error( 'initKOFilter:Promise error', error );
                    // /*DEBUG*//*jshint -W087*/debugger;
                    return this.__error(error, 'initKOFilter:Promise');
                }, this)
            ;

        }
        catch (error) {
            return this.__error(error, 'initKOFilter');
        }

    },/*}}}*/

    /** asyncInitModule ** {{{ Асинхронная инициализация модуля отчёта
     * Сюда можно включить загрузку данных с сервера, если нужно.
     * @returns {Promise}
     */
    asyncInitModule : function () {

        if ( !this.params.asyncInitPromise ) {
            this.params.asyncInitPromise = this.initAll();
        }

        return this.params.asyncInitPromise;

    },/*}}}*/

    // ***

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

        var Report__KOFilter = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__KOFilter = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'KOFilter', __KOFilter)); // provide

}); // module

