/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Dom
 * @overview Управление элементами DOM отчёта.
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Dom.js 8728 2017-07-10 16:23:49Z miheev $
 *
 */

modules.define('Report__Dom', [
    'requestor',
    'popup_controller',
    'waiter',
    'vow',
    'i-bem-dom',
    'objects',
    'project',
    'jquery',
],
function(provide,
    requestor,
    popup_controller,
    waiter,
    vow,
    BEMDOM,
    objects,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__Dom
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

var isArray = Array.isArray;

var __Dom = /** @lends Report__Dom.prototype */ {

    /** getViewbox ** {{{ */
    getViewbox : function () {

        return this.params.viewbox || ( this.params.viewbox = this.findParentBlock({block: BEMDOM.entity('panelbox'), modName: 'view', modVal: true}) );

    },/*}}}*/

    /** getRootbox ** {{{ */
    getRootbox : function () {

        return this.params.rootbox || ( this.params.rootbox = this.findParentBlock({block: BEMDOM.entity('panelbox'), modName: 'root', modVal: true}) );

    },/*}}}*/

    /** initDom ** {{{ */
    initDom : function () {

        var
            Report__Dom = this,
            Report = this.Report
        ;

        // Интерфейсные панели
        this.params.box_actions_main = this.getRootbox().findChildBlock({
            block: BEMDOM.entity('box_actions'),
            modName: 'role',
            modVal: 'main'
        });
        this.params.box_actions_controls = this.getRootbox().findChildBlock({
            block: BEMDOM.entity('box_actions'),
            modName: 'role',
            modVal: 'controls'
        });
        this.params.box_actions_actions = this.getRootbox().findChildBlock({
            block: BEMDOM.entity('box_actions'),
            modName: 'role',
            modVal: 'actions'
        });

        var checkedItems = Report.Modules.KOFilter.params.view_controller.get_checked_items();

        this.getRootbox().show_boxes({
            box_group_ko_filter : checkedItems && checkedItems.length ? false : true,
        });

        // TODO:REPORT_OBJECTS!
        // Служебные элементы
        // // this.params.screenholder = $(this.getRootbox().domElem).children('.screenholder');
        // // this.params.screenholder = $(this.domElem).children('.screenholder').bem(BEMDOM.entity('screenholder'));
        // var tableviewScreenholder = $(this.domElem).find('.tableview > .screenholder');
        // this.params.tableview_screenholder = tableviewScreenholder.bem(BEMDOM.entity('screenholder')); // NOT USED?
        this.params.screenholder = $(this.getViewbox().domElem).children('.screenholder').bem(BEMDOM.entity('screenholder'));

        // По умолчанию отчёт пуст
        Report.setMod('report_absent', true);

    },/*}}}*/

    /** createFilters ** {{{ */
    createFilters : function () {

        var Report__Dom = this,
            Report = this.Report,

            filter_controller = this.params.box_actions_main,
            // Используем загрузчик от фильтра КО?
            dataloader = Report.Modules.KOFilter.params.dataloader,

            // Общие настройки контроллеров
            commonOptions = {
                columns : Report.params.koDataColumns,
                // view_controller : this.params.view_controller,
                dataloader : dataloader,
                filter_controller : filter_controller,
                screenholder : this.params.screenholder,
            },

            // Связанные контроллеры
            ctxToPoll = [
                // this.params.dataloader,
                // this.params.view_controller,
                filter_controller,
            ]

        ;

        try {

            // Дополняем описания колонок данных
            Report.params.extendColumnsData && Object.keys(Report.params.extendColumnsData).map(function(id){
                // Ищем объект и расширяем его заданными свойствами
                var result = objects.walkComprisedInContainer(commonOptions.columns, { id : id }, function(column, key) {
                    commonOptions.columns[key] = Object.assign({}, column, Report.params.extendColumnsData[id]);
                }, this);
                // Если объект не найден, добавляем свойства
                if ( result === undefined ) {
                    commonOptions.columns.push(Report.params.extendColumnsData[id]);
                }
            }, this);

            // Добавялем свои собственные данные
            if ( isArray(Report.params.ownColumnsData) ) {
                commonOptions.columns = commonOptions.columns.concat(Report.params.ownColumnsData);
            }

            // Контроллер фильтров -- box_actions_filters
            filter_controller.initialize(
                Object.assign({}, commonOptions, {
                    id: 'mainFilter',
                    show_filters : Report.params.mainFilterColumnsList,
                    // Автоматически инициировать применение фильтров после инициализации или после изменений
                    auto_reapply_filters: true,
                    // Не добавлять автоматически кнопки "Применить/Сбросить фильтры"
                    no_buttons : true,
                    group_containers : {
                        default : filter_controller.findChildElem({ elem : 'group', modName : 'id', modVal : 'mainFilters' }),
                    },
                    // buttons_container : this._filter_buttons_container,
                })
            );

            return vow.cast(null)

                // // .then(dataloader.prefetch_data, dataloader)

                .then(filter_controller.create_filters, filter_controller)

            ;

        }
        catch (error) {
            return this.__error(error, 'createFilters');
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

        ( !isArray(error) && typeof error !== 'object' ) || ( error = {error: error} );
        ( error && !isArray(error) ) && ( error.trace || ( error.trace = [] ) ).push(errorId);

        return vow.Promise.reject(error);

    },/*}}}*/

    /** _onInited ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__Dom = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Dom = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Dom', __Dom)); // provide

}); // module

