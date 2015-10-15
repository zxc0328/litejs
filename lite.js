define([], function () {
    /***
    Litejs_dom v0.0.1
    ***/
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
    var indexOf = function (parent, child) {
        return Array.prototype.indexOf.call(parent, child);
    }

    /***
    Litejs_event 
    ***/
    var addCusEventListener = function (elements, event_name, fn) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener(event_name, fn, false);
        }
    };
    var removeCusEventListener = function (elements, event_name, fn) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeEventListener(event_name, fn, false);
        }
    };
    var dispatchCusEvent = function (element, event_name, detail) {
        //var event = new Event(event_name);
        var event = new CustomEvent(event_name, {
            "detail": detail
        });
        element.dispatchEvent(event);
    };


    /***
    Litejs_touch v0.0.1
    ***/

    var swipe = (function () {


        function _swipe_event_handler(elements, event_name, flag, e_flag) {
            var startPosition, endPosition, deltaX, deltaY, moveLength, direction;

            var touchstart = function _onTouchstart(e) {

                var touch = e.touches[0];
                startPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
            }
            var touchmove = function _onTouchmove(e) {
                e.preventDefault();
                var touch = e.touches[0];
                endPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
                deltaX = endPosition.x - startPosition.x;
                deltaY = endPosition.y - startPosition.y;
                if (!e_flag) {
                    _onSwipeEnd(event_name, deltaX, deltaY, this);
                }
            }
            var touchend = function _onTouchend(e) {

                e.preventDefault();
                if (e_flag) {
                    _onSwipeEnd(event_name, deltaX, deltaY, this);
                }

            }
            if (flag) {
                for (i = 0; i < elements.length; i++) {

                    elements[i].addEventListener('touchstart', touchstart);

                    elements[i].addEventListener('touchmove', touchmove);

                    elements[i].addEventListener('touchend', touchend)
                }
            } else {
                for (i = 0; i < elements.length; i++) {

                    elements[i].removeEventListener('touchstart', touchstart);

                    elements[i].removeEventListener('touchmove', touchmove);

                    elements[i].removeEventListener('touchend', touchend)
                }
            }
        }


        function _onSwipeEnd(event_name, deltaX, deltaY, element) {
            var detail = {
                "deltaX": deltaX,
                "deltaY": deltaY
            }
            if (event_name === "swipe") {
                dispatchCusEvent(element, event_name, detail);
            } else {

                switch (event_name) {
                case "swipeLeft":
                    if (deltaX < 0) {
                        dispatchCusEvent(element, event_name, detail);
                    };
                    break;
                case "swipeRight":
                    if (deltaX > 0) {
                        dispatchCusEvent(element, event_name, detail);
                    };
                    break;
                case "swipeTop":
                    if ((deltaX - deltaY) > 0) {
                        dispatchCusEvent(element, event_name, detail);
                    };
                    break;
                case "swipeBottom":
                    if ((deltaX - deltaY) < 0) {
                        dispatchCusEvent(element, event_name, detail);
                    };
                    break;
                }
            }
        }

        function init(elements, event_name, fn, flag) {
            addCusEventListener(elements, event_name, fn);
            _swipe_event_handler(elements, event_name, true, flag);
        }

        function remove(elements, event_name, fn) {
            removeCusEventListener(elements, event_name, fn);
            _swipe_event_handler(elements, false);
        }


        return {
            init: init,
            remove: remove
        }
    })();

    /***
    Litejs_ajax
    ***/

    var ajax = function (obj) {
        var xhr,setOption,beforeSend;
        setOption = function(obj){
            obj.type = obj.type || "GET";
            obj.isAsync = obj.isAsync || true;
            return obj;
         }
        beforeSend = function(obj){
            for (header in obj.headers){
                xhr.setRequestHeader(header,obj.headers[header]);
            }
        }
        obj = setOption(obj);
        xhr = new XMLHttpRequest;
        if (obj.headers){
            beforeSend(obj);
        }
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4){
                if((xhr.status >= 200 && xhr.status <300) || xhr.status == 304){
                    var data = xhr.responseText || xhr.responseXML;
                    obj.success(data, xhr.status);
                }else{
                    if (obj.error){
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

    return {
        addClass: addClass,
        removeClass: removeClass,
        indexOf: indexOf,
        addSwipe: swipe.init,
        removeSwipe: swipe.remove,
        ajax : ajax
    }
})