/**
 *
 * PROTOGO; Machine Learning Library for Prototype on Javascript
 *
 * Author : jbear; hello.designe@facebook.com
 * Contact : http://jbear.co
 * Copyright @ jbear
 *
**/

window.Protogo = (function() {
    function protogo() {
        var about = {
            VERSION : '0.1',
            AUTHOR : "jbear"
        };
    }
    protogo.prototype = {
        src: function(_src) {
            console.log("Load data source ;)");
            var _field_cnt = 0;
            var _field_name = [];
            for(var _d in _src[0]) {
                _field_name.push(_d);
                _field_cnt++;
            }
            var result = {
                fields: _field_name,
                field_count: _field_cnt
            };
            
            return result;
        }
    };

    return protogo;   
}());
