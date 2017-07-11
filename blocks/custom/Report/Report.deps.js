/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/*
 * $Id: Report.deps.js 8482 2017-06-02 18:02:56Z miheev $
 * $Date: 2017-06-02 21:02:56 +0300 (Пт, 02 июн 2017) $
 */
({
    shouldDeps : [

        // { mod : '00mod' },

        // Подмодули (автоматическая загрузка из loadModules, см. params.useModules):
        { elem : 'Params' },
        { elem : 'Controls' },
        { elem : 'Loader' },
        { elem : 'ResultDom' },
        { elem : 'Content' },
        { elem : 'Dom' },
        { elem : 'Show' },
        { elem : 'Data' },
        { elem : 'KOFilter' },
        { elem : 'Export' },
        { elem : 'Print' },

        // { elem : '00elem' },

        // { block : '_' },

        // Используемые зависимости:
        // { block : 'PrintReport' },
        // { block : 'ReportPrint' },
        // { block : 'ReportDisplay' },
        // { block : 'ReportDisplayGroup' },
        // { elem : 'Group' },

    ],
});
