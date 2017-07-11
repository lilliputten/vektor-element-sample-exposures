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
  Переопределения (на bem'овском стандартном `inherit`) см., напр., для модуля
  [Params](source/blocks/custom/Report/__Params/_type).

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

Текущая структура папки *blocks*
--------------------------------

```
blocks
├── .includes
├── controllers
│   ├── dataloader
│   │   └── _src
│   ├── filter
│   ├── ObjectsSelector
│   │   ├── __container
│   │   └── __menu
│   └── tableview
│       ├── _checkable
│       ├── _hoverable
│       ├── _mode
│       ├── _resizable
│       ├── _selectable
│       ├── _vpadded
│       ├── __body
│       ├── __bodycell
│       ├── __bodyrow
│       ├── __container
│       ├── __head
│       ├── __headcell
│       ├── __headrow
│       ├── __table
│       └── __underlay
├── custom
│   ├── objects_list
│   │   ├── __body
│   │   ├── __cell
│   │   ├── __cell_head
│   │   ├── __foot
│   │   ├── __head
│   │   ├── __loader
│   │   ├── __row
│   │   ├── __row_head
│   │   ├── __selector
│   │   └── __table
│   ├── otchet_ko
│   ├── Report
│   │   ├── __Content
│   │   │   └── _type
│   │   ├── __Controls
│   │   │   └── _type
│   │   ├── __Data
│   │   │   └── _type
│   │   ├── __Dom
│   │   ├── __Export
│   │   ├── __KOFilter
│   │   ├── __Loader
│   │   │   └── _type
│   │   ├── __Params
│   │   │   └── _type
│   │   ├── __Print
│   │   ├── __ResultDom
│   │   └── __Show
│   ├── ReportDisplay
│   │   ├── _titleStat
│   │   ├── __Group
│   │   └── __Title
│   ├── ReportDisplayGroup
│   │   ├── _expandable
│   │   ├── _titleStat
│   │   ├── __Details
│   │   ├── __DetailsContent
│   │   ├── __Stat
│   │   ├── __Table
│   │   ├── __TitleBar
│   │   ├── __TitleExpand
│   │   └── __TitleText
│   ├── ReportDisplayStat
│   │   └── __Item
│   ├── ReportDisplayTitleStat
│   │   ├── _mode
│   │   ├── __Content
│   │   ├── __Delim
│   │   ├── __Item
│   │   └── __Text
│   ├── ReportPrint
│   │   ├── __Group
│   │   └── __Title
│   ├── ReportPrintBody
│   │   └── __Holder
│   ├── ReportPrintGroup
│   │   ├── __Stat
│   │   ├── __Table
│   │   ├── __TableBody
│   │   ├── __TableCell
│   │   ├── __TableHead
│   │   ├── __TableRow
│   │   └── __Title
│   ├── ReportPrintStat
│   │   ├── __Item
│   │   ├── __ItemLabel
│   │   └── __ItemValue
│   ├── split_objects_list
│   └── test_controller
│       └── __show
├── design
│   ├── NavHeader
│   │   ├── __Container
│   │   ├── __Expand
│   │   ├── __InfoBox
│   │   ├── __Logo
│   │   ├── __MainBox
│   │   ├── __MenuBox
│   │   ├── __PlusBox
│   │   ├── __SideMenu
│   │   ├── __SideMenuContainer
│   │   ├── __Status
│   │   ├── __TitleBox
│   │   ├── __TitleBrief
│   │   ├── __TitleFull
│   │   ├── __TitlePlus
│   │   ├── __ToggleCollapsed
│   │   ├── __UserBox
│   │   ├── __UserName
│   │   └── __UserRole
│   ├── NavMenu
│   │   ├── __Expand
│   │   ├── __Item
│   │   ├── __ItemWrap
│   │   ├── __RootMenu
│   │   └── __Submenu
│   └── page_message
│       ├── __text
│       └── __title
├── helpers
│   ├── bootstrap-components
│   │   ├── styles
│   │   │   └── mixins
│   │   ├── __navbar
│   │   └── __normalize
│   ├── datasets
│   ├── popup_controller
│   ├── popup_dialog
│   │   ├── __actions_container
│   │   ├── __actions_group
│   │   ├── __close_button
│   │   ├── __container
│   │   ├── __input
│   │   ├── __input_edit
│   │   ├── __input_label
│   │   ├── __popup
│   │   ├── __text
│   │   ├── __title
│   │   └── __wrapper
│   ├── request_controller
│   └── waiter
├── interface
│   ├── appholder
│   │   ├── __container
│   │   ├── __credits
│   │   ├── __header
│   │   ├── __layout
│   │   └── __screen
│   ├── box
│   │   └── _layout
│   ├── boxing
│   ├── boxing_sync
│   ├── boxset
│   ├── box_actions
│   │   ├── _filters
│   │   ├── __action
│   │   ├── __button
│   │   ├── __button_nav
│   │   ├── __container
│   │   ├── __group
│   │   ├── __input
│   │   ├── __item
│   │   ├── __itemsgroup
│   │   ├── __select
│   │   ├── __selector_group
│   │   ├── __tabs_group
│   │   └── __text
│   ├── box_columns_selector
│   │   └── __container
│   ├── box_group
│   │   └── _type
│   ├── columns_selector
│   │   └── __container
│   ├── content_box
│   │   ├── _padding
│   │   ├── _spacing
│   │   ├── _theme
│   │   ├── __group
│   │   ├── __item
│   │   └── __list
│   ├── object_details
│   │   ├── __array
│   │   ├── __array_edit_buttons
│   │   ├── __array_item
│   │   ├── __array_item_content
│   │   ├── __array_item_ribbon
│   │   ├── __array_title
│   │   ├── __comment
│   │   ├── __curtain
│   │   ├── __group
│   │   ├── __group_title
│   │   ├── __info
│   │   ├── __input
│   │   ├── __input_edit
│   │   ├── __input_hidden
│   │   ├── __input_label
│   │   ├── __input_show
│   │   └── __tab
│   ├── pager_controller
│   ├── panelbox
│   │   └── _datasets
│   ├── progressbar
│   │   ├── __details
│   │   ├── __details_item
│   │   ├── __details_title
│   │   ├── __progress
│   │   └── __progress_glow
│   ├── screenholder
│   │   ├── __error
│   │   └── __info_show
│   ├── splashform
│   │   ├── __action
│   │   ├── __errors
│   │   └── __input
│   ├── split_view
│   ├── tabswitch
│   │   └── __item
│   └── vlayout
├── layout
├── libs
│   ├── dateformatter
│   ├── datetimepicker
│   ├── i-bem-dom
│   ├── loader
│   │   └── _type
│   ├── objects
│   ├── querystring
│   ├── requestor
│   ├── SecureAjax
│   ├── session
│   ├── socket
│   └── uri
│       └── __querystring
├── loaders
│   ├── bemhtml_loader
│   ├── browserdetect
│   ├── datetimepicker_loader
│   ├── FileSaver
│   ├── fontawesome
│   ├── jquery
│   │   └── __config
│   ├── md5
│   ├── mousewheel
│   ├── nicescroll
│   ├── resizable_columns
│   ├── socketio
│   ├── store
│   ├── themifyicons
│   └── WordExport
├── pages
├── root
│   ├── a
│   ├── body
│   ├── button
│   │   └── _theme
│   ├── checkbox
│   │   └── _theme
│   ├── input
│   │   ├── _date
│   │   └── _theme
│   ├── link
│   ├── menu
│   │   ├── _nicescroll
│   │   ├── _popup
│   │   ├── _theme
│   │   ├── _tree
│   │   └── __item
│   │       ├── _theme
│   │       └── _tree
│   ├── popup
│   │   ├── _menu
│   │   └── _theme
│   ├── radio
│   │   └── _theme
│   ├── radio-group
│   │   └── _theme
│   ├── select
│   │   ├── _nicescroll
│   │   ├── _theme
│   │   └── _tree
│   ├── spin
│   │   ├── _gif
│   │   └── _theme
│   └── textarea
│       └── _theme
├── shared
│   ├── app
│   │   ├── _controllers
│   │   └── _NavMenu
│   ├── BEMHTML
│   │   └── bem-xjst@~0.6.0
│   ├── page
│   │   └── styles
│   └── project
│       ├── __config
│       ├── __helpers
│       └── __root
└── test
    ├── b0
    ├── b1
    ├── b2
    ├── test
    └── test2
```
