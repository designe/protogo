/**
 *
 * PROTOGO; Machine Learning Library for Prototype on Javascript
 *
 * Author : jbear; hello.designe@facebook.com
 * Contact : http://jbear.co
 * Copyright @ jbear
 *
**/

MATCH_THRESHOLD = 3;

window.Protogo = (function() {
    function protogo() {
        var about = {
            VERSION : '0.1',
            AUTHOR : "jbear"
        };
        var MATCH_THRESHOLD = 3;
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
            var _field_root = {};

            this.fields = {};

            console.log(_src);
            for(var _d in _src[0]) {
                var _src_idx = 0;
                var _data_array = [];
                var _value_root = _field_root;
                
                _field_names.push(_d);
                _field_idx[_d] = _field_cnt;

                for(var i = 0; i < _src.length; i++) {
                    var _data = _src[i][_d];
                    _data_array.push(_data);

                    /*
                      * TRIE ROOT SETTING
                      */
                    if(!_value_root[_data[0]])
                        _value_root[_data[0]] = {};

                    var _current = _value_root[_data[0]];

                    for(var j = 1; j < _data.length; j++) {
                        if(!_current[_data[j]])
                            _current[_data[j]] = {};
                        _current = _current[_data[j]];
                    }

                    if(!_current["raw"])
                        _current["raw"] = [];
                    
                    _current["raw"].push(_src[i]);

                    console.log(_value_root);
                }

                this.fields[_d] = {
                    idx : _field_cnt,
                    value_list : _data_array,
                    root : _value_root,
                    search : function(_query){
                        var _queryResult = [];

                        // trie search applied
                        var _current = this.root;
                        var _idx = 0;
                        for(var i = 0 ; i < _query.length; i++) {
                            if(_current[_query[i]]){
                                console.log(_idx);
                                console.log(_current);
                                _current = _current[_query[i]];
                                _idx++;
                                continue;
                            }
                            else
                                break;
                        }

                        if(_current.raw) {
                            _queryResult = _current.raw;
                        }
                        else if(_idx >= MATCH_THRESHOLD){
                            var _queue_idx = 0;
                            var _queue_end = 0;
                            var _queue_root = [];
                            for(var _v in _current){
                                _queue_root.push(_current[_v]);
                                _queue_end++;
                            }
                            for(_queue_idx = 0; _queue_idx != _queue_end; _queue_idx++) {
                                if(_queue_root[_queue_idx]["raw"]){
                                    for(var i = 0 ; i < _queue_root[_queue_idx]["raw"].length; i++)
                                        _queryResult.push(_queue_root[_queue_idx]["raw"][i]);
                                    continue;
                                }

                                for(var _sub in _queue_root[_queue_idx]){
                                    console.log(_sub);
                                    _queue_root.push(_queue_root[_queue_idx][_sub]);
                                    _queue_end++;
                                }
                            }
                        } else {
                            console.log("there is no result");
                        }
                        
                        
                        // linear search 1
                        /*
                        //console.log(this.value_list);
                        for(var i = 0 ; i < this.value_list.length; i++) {
                            //console.log(this.value_list[i]);
                            if(this.value_list[i].indexOf(_query) >= 0)
                                _queryResult.push(this.value_list[i]);
                        }*/
                        
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
