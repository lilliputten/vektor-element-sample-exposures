/* jshint camelcase:false, unused:false, laxcomma:true, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Content_type_detailmove
 * @overview Расширение модуля обработки полученных данных отчёта (detailmove)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.10, 16:42
 * @version 2017.05.10, 16:42
 *
 * $Date: 2017-06-13 19:21:13 +0300 (Вт, 13 июн 2017) $
 * $Id: Report__Content_type_detailmove.js 8587 2017-06-13 16:21:13Z miheev $
 *
 */

modules.define('Report__Content', [
    'i-bem-dom',
    'vow',
    'project',
    'objects',
    'jquery',
],
function(provide,
    BEMDOM,
    vow,
    project,
    objects,
    $,
__Content) {

/**
 *
 * @exports
 * @class Report__Content_type_detailmove
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

var __Content_type_detailmove = /** @lends Report__Content_type_detailmove.prototype */ {

    // Переопределяемые методы для отчёта detailmove...

    /** _getObjectReportGroup ** {{{ Создаём описание одной группы отчёта */
    _getObjectReportGroup : function (id) {

        id = Number(id); // !!!

        var Report__Content_type_detailmove = this,
            Report = this.Report,

            reportData = Report.params.reportData,

            // Статистика
            totals = reportData.totals || {},

            // Объект
            object = totals.objects[id],

            objectStat = this.getReportStatBemjson(object),

            objectRows = reportData.preparedRows
                .filter(function(row){
                    return ( row.objID === id );
                })
            ,

            // Прячем указанные колонки (см. Report__Params:reportParamsData)
            hiddenColumns = Report.params.hiddenColumns,
            columns = reportData.combinedColumns.map(function(column){
                if ( Array.isArray(hiddenColumns) && hiddenColumns.includes(column.id) ) {
                    return Object.assign({}, column, { show : false });
                }
                return column;
            }),

            // firstRow = objectRows[0] || {},

            title = ''
                + this.getReportStatBemjsonItemValue(objectStat, 'typeID')
                + ' '
                + this.getReportStatBemjsonItemValue(objectStat, 'name')
                + ' ('
                + this.getReportStatBemjsonItemValue(objectStat, 'acInfo.typeID')
                + ')'
            ,

            undef
        ;

        // Если нет записей, то возвращаем пустую секцию
        if ( !objectRows.length ) {
            return {};
        }

        return {
            elem : 'Group',
            id : Report.params.reportType + '_object_' + id,
            title : title,
            // Описание элементов статистики с данными (bemjson)
            Stat : objectStat,
            // Список колонок, показываемых в заголовке-таблице
            titleStatColumns : Report.params.titleStatColumns,
            // Описание всех элементов статистики (на случай,
            // если элемент указан в `titleStatColumns`,
            // но отсутствует в `Stat` -- тогда надо будет создать пустую ячейку)
            statItemsDescr : reportData.statItemsDescr,
            // Объединённые колонки для получения отсутствующих в `statItemsDescr` данных
            combinedColumns : reportData.combinedColumns,
            Table : {
                columns : columns,
                rows : objectRows,
            },
            mods : {
                hideIfEmpty : true,
                showTitle : true,
                expandable : true,
                expanded : false,
                showStat : !objects.isEmpty(object),
                titleStat : 'row',
                showTable : !!( Array.isArray(objectRows) && objectRows.length ),
                // tableFirst : true,
            },
        };

    },/*}}}*/

    /** getObjectsDomContent ** {{{ Получить структуру данных для представления объектов */
    getObjectsDomContent : function () {

        var Report__Content_type_detailmove = this,
            Report = this.Report,

            reportData = Report.params.reportData,

            // Статистика
            totals = reportData.totals || {}

        ;

        // Данные от "родителя"
        // var content = this.__base.apply(this, arguments);

        // Добавляем секции для всех объектов (см. _getObjectReportGroup)
        var content = Object.keys(totals.objects)
                .filter(function(id){
                    return totals.objects[id] && !objects.isEmpty(totals.objects[id]) && totals.objects[id].show;
                }, this)
                .map(function(id){
                    return this._getObjectReportGroup(id);
                }, this)
        ;

        return content;

    },/*}}}*/

    /** getReportDisplayBlock ** {{{ Описание блока показа отчёта  */
    getReportDisplayBlock : function () {

        var Report__Content = this,
            Report = this.Report,

            reportData = Report.params.reportData,

            undef
        ;

        // Контент от "родителя"
        var block = this.__base.apply(this, arguments);

        // Добавляем блок заголовка колонок-таблиц
        Array.isArray(block.content) || ( block.content = [block.content] );
        block.content.unshift(
            {
                elem : 'Group',
                id : Report.params.reportType + '_header',
                // Список колонок, показываемых в заголовке-таблице
                titleStatColumns : Report.params.titleStatColumns,
                // Описание всех элементов статистики (на случай,
                // если элемент указан в `titleStatColumns`,
                // но отсутствует в `Stat` -- тогда надо будет создать пустую ячейку)
                statItemsDescr : reportData.statItemsDescr,
                // Объединённые колонки для получения отсутствующих в `statItemsDescr` данных
                combinedColumns : reportData.combinedColumns,
                mods : {
                    // hideIfEmpty : true,
                    showTitle : true,
                    // expandable : true,
                    // expanded : false,
                    // showStat : !objects.isEmpty(object),
                    titleStat : 'header',
                    paddedTitle : true, // Отступ у заголовка -- выравнивание по линии отступа для кнопки ("раскрыть")
                    // showTable : !!( Array.isArray(objectRows) && objectRows.length ),
                    // tableFirst : true,
                },
            }
        );
        // ...И модификатор в `ReportDisplay`
        block.mods = Object.assign({}, block.mods, {
            withTitleStat : true,
            titleStat : 'header',
        });

        return block;

    },/*}}}*/

};

provide(__Content.declMod({ modName : 'type', modVal : 'detailmove' }, __Content_type_detailmove)); // provide

}); // module


