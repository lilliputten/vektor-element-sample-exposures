// $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
// $Id: Report__Data.deps.js 8728 2017-07-10 16:23:49Z miheev $
({
    shouldDeps : [

        // Расширения для модификаторов по типу отчётов...
        { mods : { type : [
            'detailmove',
            'milage',
            'efficiency',
            'objvisitdetail',
        ] } },

        // Основной блок отчёта
        { block : 'Report' },
        { block : 'ReportDisplay' },
        { block : 'ReportDisplayGroup' },
    ],
})
