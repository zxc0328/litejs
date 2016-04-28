;
(function() {
    'use strict'
    

    /**
     *  export the moudule in one of commonjs || AMD || window way
     */
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = l;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return l;
        });
    } else {
        this.$ = this.lite = l;
    }
}).call(function() {
    return this || (typeof window !== 'undefined' ? window : global);
});
