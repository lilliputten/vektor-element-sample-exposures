// $Date: 2017-05-22 20:29:39 +0300 (Пн, 22 май 2017) $
// $Id: ReportDisplayGroup.deps.js 8405 2017-05-22 17:29:39Z miheev $
({
    mustDeps : [
    ],
    shouldDeps : [
        { mod : 'expandable' },
        { mods : { titleStat : 'header' } },
        // { mod : '00mod' },
        { elem : 'TitleBar' },
        { elem : 'TitleExpand' },
        { elem : 'TitleText' },
        { elem : 'Details' },
        { elem : 'Stat' },
        { elem : 'Table' },
        { elem : 'DetailsContent' },
        // { elem : '00elem' },
        // { block : '_' },
        { block : 'ReportDisplayTitleStat' },
        { block : 'ReportDisplayStat' },
        { block : 'tableview' },
    ],
})
