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
        var raw = null;
        var fields = {};
    }
    
    protogo.prototype = {
        init: function(_src) {
            raw = _src;
            console.log("Load data source ;)");

            var _field_cnt = 0;
            var _field_idx = {};
            var _field_names = [];

            this.fields = {};

            console.log(_src);
            for(var _d in _src[0]) {
                var _src_idx = 0;
                var _data_array = [];
                _field_names.push(_d);
                _field_idx[_d] = _field_cnt;

                for(var i = 0; i < _src.length; i++) {
                    _data_array.push(_src[i][_d]);
                }

                this.fields[_d] = {
                    idx : _field_cnt,
                    value_list : _data_array,
                    search : function(_query){
                        var _queryResult = [];
                        //console.log(this.value_list);
                        for(var i = 0 ; i < this.value_list.length; i++) {
                            //console.log(this.value_list[i]);
                            if(this.value_list[i].indexOf(_query) >= 0)
                                _queryResult.push(this.value_list[i]);
                        }
                        
                        return _queryResult;
                    }
                };

                _field_cnt++;
            }

            this.fields.names = _field_names;
            this.fields.count = _field_cnt;
            this.fields.get = (_idx) => {
                return this.fields.names[_idx];
            };

            return this.fields;
            
        },
        search: function(_query) {
            console.log("total query : " + _query);

            
        },
        toString: function() {
            return JSON.stringify(this.fields);
        }
    };

    return protogo;   
}());
