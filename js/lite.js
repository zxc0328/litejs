/***
Litejs_dom v0.0.1
***/
define([], function () {
    var _hasClass = function (elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }

    var addClass = function (elem, className) {
        if (!_hasClass(elem, className)) {
            elem.className += ' ' + className;
        }
    }

    var removeClass = function (elem, className) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if (_hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }
    var indexOf = function (parent,child) {
         return Array.prototype.indexOf.call(parent,child);
    }
    return {
        addClass : addClass,
        removeClass : removeClass,
        indexOf :indexOf
    }
})