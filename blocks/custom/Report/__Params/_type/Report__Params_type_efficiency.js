/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Params_type_efficiency
 * @overview Расширение модуля загрузки и инициализации параметров отчёта (efficiency)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05 11:34:05
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Params_type_efficiency.js 8728 2017-07-10 16:23:49Z miheev $
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
 * @class Report__Params_type_efficiency
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

var __Params_type_efficiency = /** @lends Report__Params_type_efficiency.prototype */ {

    /** mainFilterColumnsList ** {{{ Список общих фильтров
     * См. описание в TCMAdministrationController.php:$objects_list_columns
     * @return {String[]}
     */
    mainFilterColumnsList : function () {

        var data = this.__base.apply(this, arguments);

        return data.concat([
            'division',     // Подразделение
            'acInfo.channelType', // Тип канала связи АНК
        ]);

    },/*}}}*/

    /** filterParamsTranslate ** {{{ Преобразование параметров фильтров для передачи на сервер (если должны называться по-другому)
     * @return {Object} - Возвращает ассоциативный массив объектов описателей с ключами:
     * - {String} [name] - Имя параметра, которое ожидает серверный компонент (если отличается от идентификатора).
     * - {String} [type] - Тип параметра. Доступные значения:
     *   - 'text' (по умолчанию) - Текстовый параметр.
     *   - 'list': Передаём массив данных как строку с разделёнными запятой значениями (`.join(',')`).
     */
    filterParamsTranslate : function () {

        var data = this.__base.apply(this, arguments);

        project.helpers.extend(data, {
            // Подразделение
            'division' : {
                name : 'listdivision',
                type : 'list',
                // allowEmpty : true,
                // errorIfEmpty : 'Фильтр "Подразделение" является обязательным!',
            },
            // Тип канала связи АНК
            'acInfo.channelType' : {
                name : 'listac',
                type : 'list',
                // allowEmpty : true,
                // errorIfEmpty : 'Фильтр "Тип канал связи АНК" является обязательным!',
            },
        });

        return data;

    },/*}}}*/

    /** showColumnsList ** {{{ Список полей данных, которые показываем в таблице отчётов
     * @returns {String[]}
     */
    showColumnsList : function () {

        var data = this.__base.apply(this, arguments);

        return data.concat([

            'acInfo.channelType',
            'ListIdDivision',
            'ListIdGroup',
            'ServAbility',
            'FirstTime',
            'LastTime',
            'AllPointsCount',
            'NoDataTime',

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

            /*{{{ ListIdDivision */{
                id : 'ListIdDivision',
                show : true,
                title : 'Подразделение',
                dict : 'division',
                // dict_tree_key : 'parentID',
                local : true,
            },/*}}}*/
            /*{{{ ListIdGroup */{
                id : 'ListIdGroup',
                title : 'Группа',
                filter : 'select',
                // no_column_data : true,
                dict : 'statgrplist', // Новый полный словарь для групп -- пока не работает
                dict_name_key : 'NmObject',
                // back_filter_key : 'MOInfo', // Ключ обратной связанности данные/фильтр
                // back_filter_compare_key : 'objID', // Колонка данных для сравнения с данными обратной связанности
                dict_mode : 'check', // Множественный выбор
                show : true,
                local : true,
            },/*}}}*/
            /*{{{ ServAbility */{
                id : 'ServAbility',
                title : 'Работоспособность',
                show : true,
                type : 'boolean',
                local : true,
            },/*}}}*/
            /*{{{ FirstTime */{
                id : 'FirstTime',
                title : 'Время первых данных',
                show : true,
                type : 'datetime',
                local : true,
            },/*}}}*/
            /*{{{ LastTime */{
                id : 'LastTime',
                title : 'Время последних данных',
                show : true,
                type : 'datetime',
                local : true,
            },/*}}}*/
            /*{{{ AllPointsCount */{
                id : 'AllPointsCount',
                title : 'Отсчётов всего',
                show : true,
                type : 'number',
                local : true,
            },/*}}}*/
            /*{{{ NoDataTime (sec) */{
                id : 'NoDataTime',
                title : 'Длительность отсутствия связи',
                show : true,
                type : 'duration_s', // Длительность в секундах
                local : true,
            },/*}}}*/
            /*{{{ WorkTime (sec) */{
                id : 'WorkTime',
                title : 'Время работы',
                show : false,
                type : 'duration_s', // Длительность в секундах
                local : true,
            },/*}}}*/

        ]);

    },/*}}}*/

    /** extendColumnsData ** {{{ Расширяем (или добавялем, если не задано) описания общих колонок (для общих фильтров)
     * См. описание набора по умолчанию в TCMAdministrationController.php:$objects_list_columns
     * @return {String[]}
     */
    extendColumnsData : function () {

        var data = this.__base.apply(this, arguments);

        return Object.assign({}, data, {
            'acInfo.channelType' : {
                id : 'acInfo.channelType',
                // Для Типа канала связи -- по умолчанию включаем всё
                defaultValue : '__ALL__',
            },
        });

    },/*}}}*/

};

provide(__Params.declMod({ modName : 'type', modVal : 'efficiency' }, __Params_type_efficiency)); // provide

}); // module


