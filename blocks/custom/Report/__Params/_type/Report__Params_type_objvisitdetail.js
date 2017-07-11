/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Params_type_objvisitdetail
 * @overview Расширение модуля загрузки и инициализации параметров отчёта (objvisitdetail)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05 11:34:05
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-07-10 21:13:20 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Params_type_objvisitdetail.js 8731 2017-07-10 18:13:20Z miheev $
 *
 */

modules.define('Report__Params', [
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
    __Params) {

/**
 *
 * @exports
 * @class Report__Params_type_objvisitdetail
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

var __Params_type_objvisitdetail = /** @lends Report__Params_type_objvisitdetail.prototype */ {

    /** options ** {{{ Настроечные параметры отчёта
     * @returns {Object}
     */
    options : function () {

        var data = this.__base.apply(this, arguments) || {};

        return Object.assign({}, data, {
            KOFilterMenuMode : 'radio', // Одиночный выбор
        });

    },/*}}}*/

    /** mainFilterColumnsList ** {{{ Список общих фильтров
     * См. описание в TCMAdministrationController.php:$objects_list_columns
     * @return {String[]}
     */
    mainFilterColumnsList : function () {

        var data = this.__base.apply(this, arguments);

        return data.concat([
            'radius', // Радиус
            'listobject', // Объекты посещения
            // 'objTypes',
        ]);

    },/*}}}*/

    /** ownColumnsData ** {{{ Дополняем или добавляем описания собственных колонок (для общих фильтров)
     * См. описание набора по умолчанию в TCMAdministrationController.php:$objects_list_columns
     * @return {String[]}
     */
    ownColumnsData : function () {

        var data = this.__base.apply(this, arguments);

        return data.concat([
            // Радиус
            {
                id : 'radius',
                show : true,
                title : 'Радиус (метры)',
                local : true, // Локальные данные
                filter : 'text', // Текстовый фильтр
                defaultValue : 100,
            },
            // Объекты посещения
            {
                id : 'listobject',
                show : true,
                title : 'Объекты',
                local : true, // Локальные данные
                filter : 'select', // Фильтр-список
                dict : 'uobj', // Словарь источник данных
                // dict : 'Object', // Словарь источник данных
                dict_mode : 'check', // Множественный выбор
            },
            {
                id : 'objTypes',
                show : true,
                title : 'Тип объектов',
                local : true, // Локальные данные
                filter : 'select', // Фильтр-список
                dict : 'ObjTypes', // Словарь источник данных
                dict_mode : 'check', // Множественный выбор
            },
        ]);

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

        var data = this.__base.apply(this, arguments);

        return Object.assign({}, data, {
            listobject : {
                type : 'list',
                errorIfEmpty : 'Необходимо выбрать объекты посещения!',
            },
            radius : {
                type : 'number',
                errorIfEmpty : 'Необходимо указать радиус!',
            },
        });

    },/*}}}*/

    /** showColumnsList ** {{{ Список полей данных, которые показываем в таблице отчётов
     * @returns {String[]}
     */
    showColumnsList : function () {

        var data = this.__base.apply(this, arguments);

        return data.concat([

            'FirstTime',
            'LastTime',
            'count',

        ]);

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
     * @returns {Object[]}
     */
    ownReportColumns : function () {

        var data = this.__base.apply(this, arguments);

        return data.concat([

            /*{{{ count */{
                id : 'count',
                title : 'Количество посещений',
                show : true,
                type : 'number',
                local : true,
            },/*}}}*/
            /*{{{ FirstTime */{
                id : 'FirstTime',
                title : 'Время начала посещения',
                show : true,
                type : 'datetime',
                local : true,
            },/*}}}*/
            /*{{{ LastTime */{
                id : 'LastTime',
                title : 'Время конца посещения',
                show : true,
                type : 'datetime',
                local : true,
            },/*}}}*/

        ]);

    },/*}}}*/

};

provide(__Params.declMod({ modName : 'type', modVal : 'objvisitdetail' }, __Params_type_objvisitdetail)); // provide

}); // module


