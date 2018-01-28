/**
 *
 * PROTOGO; Library for data prototyping
 *
 * Author : jbear; hello.designe@facebook.com
 * Contact : http://jbear.co
 * Copyright @ jbear
 *
**/

window.Protogo = (function() {
    function protogo() {
        var about = {
            VERSION : '0.2',
            AUTHOR : "jbear"
        };
        this.MATCH_THRESHOLD = 2;
        this.raw = null;
        this.fields = {};
        // this.root = {};
    }
    
    protogo.prototype = {
        init: function(_src) {
            this.raw = _src;
            this.fields = {};
            
            return this.add(_src);
            
        },
        add: function(_src) {
            var _field_cnt = 0;
            var _field_idx = {};
            var _field_names = [];
            var _field_order = [];
            //var _field_root = this.root;

            var _MATCH_THRESHOLD = this.MATCH_THRESHOLD;
            for(var _d in _src[0]) {
                // var _src_idx = 0;
                var _value_root;
                var _data_array;
                
                if(this.fields[_d]){
                    _value_root = (typeof this.fields[_d].root == "undefined") ? {} : this.fields[_d].root;
                    _data_array = (typeof this.fields[_d].value_list == "undefined") ? [] : this.fields[_d].value_list;
                } else {
                    _value_root = {};
                    _data_array = [];
                }
                
                _field_names.push(_d);
                _field_idx[_d] = _field_cnt;

                _field_order.push(_field_cnt);
                
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
                        
                        if(_data[j-1] == ' '){ // ROOT ADD CONDITION
                            if(!_value_root[_data[j]])
                                _value_root[_data[j]] = {};
                        
                            var _root_iterator = _value_root[_data[j]];
                            for(var k = j+1; k < _data.length; k++){
                                if(_root_iterator[_data[k]]) {
                                    _root_iterator = _root_iterator[_data[k]];
                                }else {
                                    _root_iterator[_data[k]] = {};
                                    _root_iterator = _root_iterator[_data[k]];
                                }
                            }

                            if(!_root_iterator["raw"]){
                                _root_iterator["raw"] = [];
                                _root_iterator["raw"].push(_src[i]);
                            }
                        }
                    }
                    
                    if(!_current["raw"])
                        _current["raw"] = [];
                    
                    _current["raw"].push(_src[i]);
                }

                this.fields[_d] = {
                    idx : _field_cnt,
                    value_list : _data_array,
                    root : _value_root,
                    search : function(_query){
                        var _queryResult = [];

                        // trie search applied
                        var _current = this.root;

                        if(this.MATCH_THRESHOLD)
                            _MATCH_THRESHOLD = this.MATCH_THRESHOLD;
                        
                        var _idx = 0;
                        for(var i = 0 ; i < _query.length; i++) {
                            if(_current[_query[i]]){
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
                        else if(_idx >= _MATCH_THRESHOLD){
                            var _queue_idx = 0;
                            var _queue_end = 0;
                            var _queue_root = [];
                            for(var _v in _current){
                                _queue_root.push(_current[_v]);
                                _queue_end++;
                            }
                            for(_queue_idx = 0; _queue_idx != _queue_end; _queue_idx++) {
                                for(var _sub in _queue_root[_queue_idx]) {
                                    if(_sub == "raw") {
                                        for(var i = 0 ; i < _queue_root[_queue_idx]["raw"].length; i++)
                                            _queryResult.push(_queue_root[_queue_idx]["raw"][i]);
                                        continue;
                                    } else {
                                        _queue_root.push(_queue_root[_queue_idx][_sub]);
                                        _queue_end++;
                                    }
                                }
                            }
                        } else {
                            console.log("there is no result");
                        }
                        
                        return _queryResult;
                    }
                };

                this[_d] = this.fields[_d];

                _field_cnt++;
            }

            this.fields.names = _field_names;
            this.fields.count = _field_cnt;
            this.fields.get = (_idx) => {
                return this.fields.names[_idx];
            };
            this.fields.order = _field_order;

            console.log(this);

            return this.fields;

        },
        search: function(_query) {
            var result = [];
            console.log(this.fields);

            console.log("field count = " + this.fields.count);
            for(var i = 0; i < this.fields.count; i++) {
                var _idx = this.fields.order[i];
                console.log(_idx);
                console.log(this.fields.names[_idx]);
                var _field_result = this[this.fields.names[_idx]].search(_query);

                console.log(_field_result);
                
                for(var j = 0; j < _field_result.length; j++)
                    result.push(_field_result[j]);
            }

            return result;
        },
        setOrder: function(_order) {
            this.fields.order = _order;
        },
        toString: function() {
            return JSON.stringify(this.fields);
        },
        toHash: function(str) {
            return str.charCodeAt();
        }
    };

    return protogo;   
}());
