Демонстрация типичных фрагментов проекта "Элемент"
==================================================

Клиентский код:
---------------

- [source/README.md: README оригинального проекта](source/README.project.md)
- [source/blocks: Некоторые компоненты системы](source/blocks/)
- [source/pages/Report/Report.bemjson: Демонстрационная страница (модуль отчётов)](source/pages/Report/Report.bemjson)
- [source/.enb/make.js: Конфигурация сборщика enb](source/.enb/make.js)
- [source/gulpfile](source/gulpfile.js)
- [source/gulpfile.config.yaml: Конфигурация gulp](source/gulpfile.config.yaml)

Серверный код (php/phalcon):
--------------------

- [release/core/scripts/php/app-config: Конфигурация SPA-приложения](release/core/scripts/php/app-config)
- [release/core/scripts/php/app-config/appmenu.php: Описание меню системы](release/core/scripts/php/app-config/appmenu.php)
- [release/core/scripts/php/app-config/tcm: Описание страниц раздела tcm](release/core/scripts/php/app-config/tcm)
- [release/core/scripts/php/app-config/test-pages: Тестовые страницы (в том числе AdminKO)](release/core/scripts/php/app-config/test-pages)

Некоторые демонстрируемые блоки
-------------------------------

Выбраны некторые показательные блоки из не самых запущенных (которые не хочется полностью переделывать, а только чуть поправить).

- [dataloader](source/blocks/controllers/dataloader):
  Загрузчик данных. Требуется рефакторинг.
  Опционально используется в связке с блоками `view_controller`, `filter_controller`, `pager_controller` и т.д.

- [ObjectsSelector](source/blocks/controllers/ObjectsSelector):
  Компонент типа `view_controller` для выбора объектов. Требуется рефакторинг.

- [tableview](source/blocks/controllers/tableview):
  Компонент типа `view_controller` для табличного представления данных.
  Требуется рефакторинг.
  Основные режимы работы (модификаторы):
  [checkable](source/blocks/controllers/tableview/_checkable),
  [hoverable](source/blocks/controllers/tableview/_hoverable),
  [mode](source/blocks/controllers/tableview/_mode),
  [resizable](source/blocks/controllers/tableview/_resizable),
  [selectable](source/blocks/controllers/tableview/_selectable).

- [NavHeader](source/blocks/layout/NavHeader): Шапка страницы.

- [NavMenu](source/blocks/layout/NavMenu): Меню в шапке страницы.

- [Report](source/blocks/custom/Report):
  Основа модуля для показа отчёта.
  Излишне усложнён. По-хорошему, надо бы перепроектировать и сделать более логичным (что вряд ли возможно).
  Включает в себя параметризуемые переопределяемые (по типу отчёта) модули (в виде элементов блока):
  [Content](source/blocks/custom/Report/__Content),
  [Controls](source/blocks/custom/Report/__Controls),
  [Data](source/blocks/custom/Report/__Data),
  [Dom](source/blocks/custom/Report/__Dom),
  [Export](source/blocks/custom/Report/__Export),
  [KOFilter](source/blocks/custom/Report/__KOFilter),
  [Loader](source/blocks/custom/Report/__Loader),
  [Params](source/blocks/custom/Report/__Params),
  [Print](source/blocks/custom/Report/__Print),
  [ResultDom](source/blocks/custom/Report/__ResultDom),
  [Show](source/blocks/custom/Report/__Show).
  Переопределения (на bem'овском стандартном `inherit`) см., напр., для модуля `Params`:
  [source/blocks/custom/Report/__Params/_type](source/blocks/custom/Report/__Params/_type).

- [ReportDisplay](source/blocks/custom/ReportDisplay),
  [ReportDisplayGroup](source/blocks/custom/ReportDisplayGroup),
  [ReportDisplayStat](source/blocks/custom/ReportDisplayStat),
  [ReportDisplayTitleStat](source/blocks/custom/ReportDisplayTitleStat):
  Группа связанных блоков для показа результатов отчётов.

- [ReportPrint](source/blocks/custom/ReportPrint),
  [ReportPrintBody](source/blocks/custom/ReportPrintBody),
  [ReportPrintGroup](source/blocks/custom/ReportPrintGroup),
  [ReportPrintStat](source/blocks/custom/ReportPrintStat):
  Группа связанных блоков для печати отчётов.

