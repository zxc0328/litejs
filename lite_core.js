define([], function() {
    'use strict'
    /***
    Litejs_core_utility 
    ***/
    var _dataTypeOf = function(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    }
    var _hasClass = function(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }
    var _mixin = function(sourceObj, targetObj) {
        for (var key in sourceObj) {
            if (!(key in targetObj)) {
                targetObj[key] = sourceObj[key];
            }
        }
    }

    /***
    lite_core_selector
    ***/

    var l = function(selector) {
        return new _l(selector);
    }

    var _l = function(s) {
        this.elements = document.querySelectorAll(s);
    }

    /***
    lite-core-dom
    ***/
    _l.prototype.addClass = function(classNameArray) {
        el = this.elements;
        for (var i = 0; i < el.length; i++) {
            if (_dataTypeOf(classNameArray) !== "Array") {
                throw new TypeError("The classname should be an array instead of " +
                    _dataTypeOf(classNameArray))
            }
            for (var j = 0; j < classNameArray.length; j++) {
                if (!_hasClass(el[i], classNameArray[j])) {
                    el[i].className += ' ' + classNameArray[j];
                }
            }
        }
    }

    _l.prototype.removeClass = function(classNameArray) {
        el = this.elements;
        for (var i = 0; i < el.length; i++) {
            if (_dataTypeOf(classNameArray) !== "Array") {
                throw new TypeError("The classname should be an array instead of " +
                    _dataTypeOf(classNameArray))
            }
            for (var j = 0; j < classNameArray.length; j++) {
                var newClass = ' ' + el[i].className.replace(/[\t\r\n]/g, ' ') + ' ';
                if (_hasClass(elem, classNameArray[j])) {
                    while (newClass.indexOf(' ' + classNameArray[j] + ' ') >= 0) {
                        newClass = newClass.replace(' ' + classNameArray[j] + ' ', ' ');
                    }
                    el[i].className = newClass.replace(/^\s+|\s+$/g, '');
                }
            }
        }

    }

    _l.prototype.indexOf = function(parentNode) {
        return Array.prototype.indexOf.call(parentNode, this.elements[0]);
    }

    /***
    Litejs_core_class_factory
    ***/

    function extendsClass(parent, child) {

        var callSuper = parent.prototype;
        var newChild = function() {

            parent.call(this);
            child.call(this);
        }
        newChild.prototype = Object.create(parent.prototype, {
            constructor: {
                configurable: true,
                enumberable: true,
                value: newChild,
                writable: true
            },
            super: {
                configurable: true,
                enumberable: true,
                value: callSuper,
                writable: true
            }
        })

        newChild.callSuper = newChild.prototype.super

        return newChild;
    }

    /***
    Litejs_core_UI_component
    ***/

    //constructor for liteUI component base class
    function liteComponent() {
        this.defaults = {};
        this.prototype.init = function(options) {
            this.options = mixin(this.defaults, this.options);
        }
    }

    /***
    Litejs_ajax
    ***/

    var ajax = function(obj) {
        var xhr, setOption, beforeSend;
        setOption = function(obj) {
            obj.type = obj.type || "GET";
            obj.isAsync = obj.isAsync || true;
            return obj;
        }
        beforeSend = function(obj) {
            for (header in obj.headers) {
                xhr.setRequestHeader(header, obj.headers[header]);
            }
        }
        obj = setOption(obj);
        xhr = new XMLHttpRequest;
        if (obj.headers) {
            beforeSend(obj);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    var data = xhr.responseText || xhr.responseXML;
                    obj.success(data, xhr.status);
                } else {
                    if (obj.error) {
                        obj.error(xhr.status);
                    }
                }
            }
        };
        xhr.open(obj.type, obj.url, obj.isAsync);
        if (xhr.data) {
            xhr.send(null);
        } else {
            xhr.send(xhr.data)
        }
        return xhr;
    }

    l.ajax = ajax;

    return l;
})
