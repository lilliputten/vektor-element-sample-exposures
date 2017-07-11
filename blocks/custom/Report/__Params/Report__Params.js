/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Params
 * @overview Блок-функционал для иницализации и получения настроек отчётов.
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05, 16:13
 * @version 2017.05.05, 16:13
 *
 * $Date: 2017-07-10 21:13:20 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Params.js 8731 2017-07-10 18:13:20Z miheev $
 *
 */

modules.define('Report__Params', [
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
 * @class Report__Params
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

var __Params = /** @lends Report__Params.prototype */ {

    // koDataColumns -- получаем с сервера запросом '{{approot}}element-tcm/TCMAdministration/get_ControlObjects_InitialData_'.
    // См. Report__KOFilter:initData

    /** getDefaultStatOptions ** {{{ OBSOLETE? */
    getDefaultStatOptions : function (plusOptions) {
        return Object.assign({
            // // Название элемента одиночного пункта в bemjson
            // itemElemName : 'item',
            // // Название элемента списка в bemjson
            // listElemName : 'list',
            // // Название элемента группы в bemjson
            // groupElemName : 'group',
            // // Данные отчёта
            // reportData : this.Report.params.reportData,
        }, plusOptions);
    },/*}}}*/

    /** mainFilterColumnsList ** {{{ Список общих фильтров
     * См. описание в TCMAdministrationController.php:$objects_list_columns -- это то, что приходит по умолчанию.
     * Кроме того, в будущем будут фильтры, не связанные с КО (напр., "Зона связи") -- надо будет добавить описание 'own'-колонок
     */
    mainFilterColumnsList : function () {

        return [];

    },/*}}}*/
    /** ownColumnsData ** {{{ Добавляем описания собственных колонок (для общих фильтров)
     * См. описание набора по умолчанию в TCMAdministrationController.php:$objects_list_columns
     * @return {Object[]}
     */
    ownColumnsData : function () {

        return [];

    },/*}}}*/
    /** extendColumnsData ** {{{ Расширяем (или добавялем, если не задано) описания общих колонок (для общих фильтров)
     * См. описание набора по умолчанию в TCMAdministrationController.php:$objects_list_columns
     * @return {Object}
     */
    extendColumnsData : function () {

        return {};

    },/*}}}*/
    /** filterParamsTranslate ** {{{ Преобразование параметров фильтров для передачи на сервер (если должны называться по-другому)
     * @return {Object} - Возвращает ассоциативный массив объектов описателей с ключами:
     * - {String} name - Имя параметра, которое ожидает серверный компонент.
     * - {String} [type] - Тип параметра. Доступные значения:
     *   - 'text' (по умолчанию) - Текстовый параметр.
     *   - 'number' - Число.
     *   - 'list': Передаём массив данных как строку с разделёнными запятой значениями (`.join(',')`).
     */
    filterParamsTranslate : function () {

        return {
            list : {
                type : 'list',
                errorIfEmpty : 'Необходимо выбрать контролируемые объекты!',
            },
        };

    },/*}}}*/

    /** reportTitle ** {{{ Название отчёта
     * @returns {String}
     */
    reportTitle : function () {

        var title = app.params.pageData.title;

        title = title.replace(/^.*?:\s+/, '');

        return title;

    },/*}}}*/

    /** options ** {{{ настроечные параметры отчёта
     * @returns {Object}
     */
    options : function () {

        return {
            KOFilterMenuMode : 'check', // Множественный выбор (по умолчанию)
        };

    },/*}}}*/

    /** showColumnsList ** {{{ Список полей данных, которые показываем в таблице отчётов
     * @returns {String[]}
     */
    showColumnsList : function () {

        return [

            'typeID',            // КО : Тип
            'name',              // КО : Имя
            'acInfo.typeID',     // КО : Тип АНК

        ];

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
     * Версия описания от 2016.11.30, 12:00:
     *  - {string} id : Идентификатор поля.
     *  - {string} title : Название.
     *  - {string} datasets : Наборы данных по типу КО (typeID, objType, ...) для показа данных в зависимости от выбранного значения типа КО.
     *  - {string} filter : select|text : Тип фильтра : text (текстовый) или select (выбор по словарю).
     *  - {string} filters_id : Идентификтор фильтра. Если нет, участвует во всех фильтрах. Можно указывать несколько фильтров в массиве.
     *  - {string} dict :  ID словаря для показа данных и фильтрации данных.
     *  - {string} post_dict : Словарь для постобработки полученных данных. (TODO 2016.11.21, 14:15 -- М.б., заменить на цепочку преобразований по шаблону?)
     *  - {string} object_key : Ключ поля значения для комплексного объекта
     *  - {string} dict_tree_key : dict.field_name : Иерархическая структура данных (ключ родителя в элементе списка словаря).
     *  - {string} back_filter_key : Ключ обратной связанности данные/фильтр
     *  - {string} back_filter_compare_key : Колонка данных для сравнения с данными обратной связанности
     *  - {boolean|string} dict_mode : check|radio|radio-check' : Способ выбора данных в контроле фильтра (если селект)
     *  - {boolean} key : Поле является ключевым (аналог индекса)
     *  - {boolean} show : Показывать столбец
     *  - {boolean} hidden : Столбец спрятан (перекрывает `show`)
     *  - {boolean} required : Столбец обязателен (перекрывает `show`)
     *
     * @returns {Object[]} */
    ownReportColumns : function () {

        return [

            /*{{{ n: Номер записи отсчёта */
            {
                id : 'n',
                title : 'Период',
                hidden : false,
                show : true,
                key : true,
                local : true,
            },
            /*}}}*/

        ];

    },/*}}}*/
    /** koFilterUsedColumns ** {{{ Список используемых в фильтре КО данных
     * См. описание в TCMAdministrationController.php:$objects_list_columns
     * @return {String[]}
     */
    koFilterUsedColumns : function () {

        return [
            'objID',        // Идентификатор
            'typeID',       // Тип КО
            'name',         // Имя
            'statgrplist',  // Группа
            'division',     // Подразделение
            'monObjSession.IdTaskCarting', // Задача
        ];

    },/*}}}*/
    /** deleteZeroRowDataParams ** {{{ Список полей данных, подлежащих удалению, если оказываются пустыми или равны нулю
     * (для некоторых случаев -- см. проверку в теле метода `Report__Data:cleanupRowData`)
     * TODO: Описывать условие параметрически?
     * TODO: Аналогично реализовывать `deleteEmptyRowDataParams`?
     * @returns {String[]}
     */
    deleteZeroRowDataParams : function () {

        return [
            'Distance',
            'SpeedAvg',
            // 'SumSpeedAvg',
            'SpeedMax',
        ];

    },/*}}}*/

    /** reportParamsData ** {{{ Получить данные параметров отчёта (объект)
     * Предполагается переопределение для каждого типа отчёта по модицификатору `type`.
     * Можно получать асинхронно с сервера при необходимости.
     * @returns {Object}
     */
    reportParamsData : function () {

        var Report__Params = this,
            Report = this.Report
        ;

        // Данные для расширения параметров
        var data = {

            // Название отчёта
            reportTitle : this.reportTitle(),

            // Прочие параметры отчёта
            options : this.options(),

            // Список общих фильтров
            mainFilterColumnsList : this.mainFilterColumnsList(),

            // Описание собственных данных
            ownColumnsData : this.ownColumnsData(),

            // Преобразование параметров общих фильтров для передачи на сервер
            filterParamsTranslate : this.filterParamsTranslate(),

            // Поля данных, которые показываем в таблице отчётов
            showColumnsList : this.showColumnsList(),

            // Описание данных для показа отчёта
            ownReportColumns : this.ownReportColumns(),

            // Используемые в фильтре КО данные
            koFilterUsedColumns : this.koFilterUsedColumns(),

            // Поля данных, подлежащие удалению, если оказываются пустыми или равны нулю
            deleteZeroRowDataParams : this.deleteZeroRowDataParams(),

        };

        return data;

    },/*}}}*/
    /** reportParamsAsync ** {{{ Получить данные параметров отчёта (через Promise)
     * Предполагается переопределение для каждого типа отчёта по модицификатору `type`.
     * Можно получать асинхронно с сервера при необходимости.
     * @returns {Promise}
     */
    reportParamsAsync : function () {

        var Report__Params = this,
            Report = this.Report
        ;

        // Данные для расширения параметров
        var reportParams = this.reportParamsData();

        return vow.Promise.resolve(reportParams);

    },/*}}}*/

    /** initReport__Params ** {{{ Инициализация параметров (Promise)
     * @returns {Promise}
     */
    initReport__Params : function () {

        var Report__Params = this,
            that = this,
            Report = this.Report
        ;

        // Получаем данные параметров и расширяем ими параметры блока (Report__Params и основного)
        return this.reportParamsAsync()
            .then(function(data){
                Object.assign(that.params, data);
                Object.assign(Report.params, data);
                return data;
            }, this)
        ;

    },/*}}}*/

    /** asyncInitModule ** {{{ Асинхронная инициализация модуля отчёта
     * Сюда можно включить загрузку данных с сервера, если нужно.
     * @returns {Promise}
     */
    asyncInitModule : function () {

        if ( !this.asyncInitPromise ) {
            this.asyncInitPromise = this.initReport__Params();
        }

        return this.asyncInitPromise;

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

        var Report__Params = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Params = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Params', __Params)); // provide

}); // module

