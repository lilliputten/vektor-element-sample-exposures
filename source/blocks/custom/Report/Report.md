# Report

Ведущий блок, управляющий подготовкой и показом отчётов

"Рабочий" отчёт:
================

Адреса запросов:
----------------

Локальный (dev) enb сервер:

 http://localhost:8080/pages/Report/Report.html

Локальный (dev) nginx-сервер:

 http://localhost:5590/WEB_TINTS/release/core/App.html#tcm_Reports_Consolidated_detailmove

Youcomp:

 http://youcomp.geyser.ru:8082/WEB_TINTS/release/core/App.html#tcm_Reports_Consolidated_detailmove

Внешний сервер:

 http://195.133.216.10:8082/WEB_TINTS/release/core/App.html#tcm_Reports_Consolidated_detailmove

Файл описания:
--------------

 WEB_TINTS/release/core/scripts/php/app/config/app/tcm/tcm_Reports_Consolidated_detailmove.php

Тестовые данные:
================

Для запроса

 http://vektor.local/WEB_TINTS/element-tcm/TCMAnalytics/get

с параметрами:

list: [1] // КО: x101xx180
BeginTime: 28.11.2016 00:00
EndTime: 29.11.2016 00:00

См. файл демо-данных `get_POST_op_detailmove_BeginTime_1480280400000_EndTime_1480366800000_list_2.json`:

 WEB_TINTS/source/fake-data/element-tcm/TCMAnalytics/get_POST_op_detailmove_BeginTime_1480280400000_EndTime_1480366800000_list_2.json

См.:
- WEB_TINTS/source/blocks/custom/Report/__Controls/Report__Controls.js (`::initFilterDates:setDebugValues`),
- WEB_TINTS/source/blocks/custom/Report/__KOFilter/Report__KOFilter.js (`::getInitialReportKOList`).

