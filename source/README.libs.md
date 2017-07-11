>
> $Date: 2017-05-18 12:23:02 +0300 (Чт, 18 май 2017) $
>
> $Id: README.libs.md 8392 2017-05-18 09:23:02Z miheev $
>

Библиотеки и патчи
==================

Библиотечные модули
-------------------

Конфигурация библиотечных модулей задаётся в `project.config.libs` (см. `WEB_TINTS/source/blocks/shared/project/__config/project__config.js`).

### secure_ajax

Исходные файлы модуля лежат в папке

    WEB_TINTS/test/auth_cnt

Расположение модуля для загрузки задаётся в `project.config.libs`, загрузка производится с помощью модуля `loader`. См.

    WEB_TINTS/source/blocks/libs/secureAjax/secureAjax.js
    WEB_TINTS/source/blocks/libs/secureAjax/secureAjax.md

Адреса для локальных тестов:

    http://localhost/source/deps/secure_ajax/ajax.html
    http://localhost:8080/deps/secure_ajax/ajax.html

Изменения в стандартных модулях
-------------------------------

### jquery.nicescroll

Изменения требует библиотечный модуль `jquery.nicescroll`:

    WEB_TINTS/_docs/BEM/!Patches/jquery.nicescroll
    WEB_TINTS/_docs/BEM/!Patches/jquery.nicescroll/jquery.nicescroll.js.diff
    WEB_TINTS/source/libs/jquery.nicescroll/
    WEB_TINTS/source/libs/jquery.nicescroll/changelog_3.6.8.txt
    WEB_TINTS/source/libs/jquery.nicescroll/jquery.nicescroll.js
    WEB_TINTS/source/libs/jquery.nicescroll/jquery.nicescroll.min.js

Используется последняя (на 2017.03.10) версия 3.6.8. Для получения изменённой версии применяем патч в папке модуля. Если отсутствует неминифицированная версия, берём её из ветки master [github пакета](https://github.com/inuyaksa/jquery.nicescroll). Применение патча:

```shell
    WEB_TINTS/source/libs/jquery.nicescroll/$ patch -b < jquery.nicescroll.js.diff
    WEB_TINTS/source/libs/jquery.nicescroll/$ uglifyjs jquery.nicescroll.js -m > jquery.nicescroll.min.js
```

### datetimepicker

См.:

    WEB_TINTS/_docs/BEM/!Patches/datetimepicker/README.md
    WEB_TINTS/source/blocks/root/datetimepicker/
    WEB_TINTS/source/blocks/root/datetimepicker/jquery.datetimepicker.js
    WEB_TINTS/source/blocks/root/datetimepicker/datetimepicker.js

Библиотека [jQuery DateTimePicker plugin v2.5.4](http://xdsoft.net/jqplugins/datetimepicker/)

Приниципиально меняется одна строка (см. `jquery.datetimepicker.no-folds.js` -- изменёныый файл без vim-folds-меток):

```
    $.datetimepicker && ( $.datetimepicker.dateHelper = dateHelper ); // XXX 2016.09.14, 15:50 -- export dateHelper
```

Подключается как ym-модуль -- инкапсулируем внутрь модуля `datetimepicker.js` (`begin include:jquery.datetimepicker.js`)

    WEB_TINTS/source/blocks/root/datetimepicker/datetimepicker.js

