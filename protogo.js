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
        _proto = this;
        this.MATCH_THRESHOLD = 2;
        this.raw = null;
        this.fields = {};
        // this.root = {};
    }
    
    protogo.prototype = {
        init: function(_src) {
            var self = this;
            
            _proto.raw = _src;
            _proto.fields = {};
            
            return this.add(_src);
        },
        /* Analyzing part of source data structure */
        add: function(_src) {
            var self = this;
            // case of Array
            if(_src.constructor === Array) {
                var _field_cnt = 0;
                var _field_idx = {};
                var _field_names = [];
                var _field_order = [];

                var _MATCH_THRESHOLD = self.MATCH_THRESHOLD;
                
                var _ks = Object.keys(_src[0]);

                console.log(_ks);
                
                _ks.some(function(_key) {
                    var _value_root;
                    var _data_array;

                    console.log(_key);
                    
                    if(typeof _proto.fields[_key] != 'undefined'){
                        console.log(self.fields[_key]);
                        _value_root = (typeof _proto.fields[_key].root == 'undefined') ? {} : _proto.fields[_key].root;
                        _data_array = (typeof _proto.fields[_key].value_list == 'undefined') ? [] : _proto.fields[_key].value_list;
                    } else {
                        _value_root = {};
                        _data_array = [];
                    }

                    _field_names.push(_key);
                    _field_idx[_key] = _field_cnt;
                    _field_order.push(_field_cnt);

                    var word_count = _src.length;

                    for(var i = 0;  i < word_count; i++) {
                        var _word = _src[i][_key];
                        _data_array.push(_word);
                        self.addOnBasicTrie(_value_root, _word, _src[i]);
                    }

                    _proto.fields[_key] = {
                        idx : _field_cnt,
                        value_list : _data_array,
                        root : _value_root,
                        search : function(_query){
                            
                            var _queryResult = [];

                            // trie search applied
                            var _current = this.root;
                            
                            if(self.MATCH_THRESHOLD)
                                _MATCH_THRESHOLD = self.MATCH_THRESHOLD;
                        
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
                            if(_idx >= _MATCH_THRESHOLD){
                                var _queue_idx = 0;
                                var _queue_end = 0;
                                var _queue_root = [];
                                for(var _v in _current){
                                    if(_v == "raw"){
                                        for(var i = 0; i < _current[_v].length; i++)
                                            _queryResult.push(_current[_v][i]);
                                    } else {
                                        _queue_root.push(_current[_v]);
                                        _queue_end++;
                                    }
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

                    _proto[_key] = _proto.fields[_key];
                    _field_cnt++;
                });

                _proto.fields.names = _field_names;
                _proto.fields.count = _field_cnt;
                _proto.fields.get = (_idx) => {
                    return _proto.fields.names[_idx];
                };
                _proto.fields.order = _field_order;

                return _proto.fields;
            }    /* end of source array */
            else {
                return null;
            }
            
            //return this.addOnBasicTrie(_src);
        },
        search: function(_query) {
            return this.searchOnBasicTrie(_query);
        },
        addOnMoebiousTrie: function(_src) {
            /* should be implemented */
        },
        addOnBasicTrie: function(_root, _word, _what) {
            var _data = _word;
            /*
             * TRIE ROOT SETTING
             */

            if(!_root[_data[0]])
                _root[_data[0]] = {};

            var _current = _root[_data[0]];

            for(var j = 1; j < _data.length; j++) {
                if(!_current[_data[j]])
                    _current[_data[j]] = {};
                
                _current = _current[_data[j]];
                        
                if(_data[j-1] == ' '){ // ROOT ADD CONDITION
                    if(!_root[_data[j]])
                        _root[_data[j]] = {};
                    
                    var _root_iterator = _root[_data[j]];
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
                        _root_iterator["raw"].push(_what);
                    }
                }
            }
            
            if(!_current["raw"])
                _current["raw"] = [];
                    
            _current["raw"].push(_what);
        },
        searchOnBasicTrie: function(_query) {
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
        compare: function(_a, _b) {
            /* _first's length is longer than _second's length */
            var _first, _second;
            if(_a.length > _b.length) {
                _first = _a;
                _second = _b;
            }else {
                _first = _b;
                _second = _a;
            }

            var _table = new Array(_first.length + 1);
            for(var i = 0; i <= _first.length; i++)
                _table[i] = new Array(_second.length + 1);

            for(var i = 0; i < _first.length + 1; i++) {
                _table[i][0] = i;
                if(_second.length >= i)
                    _table[0][i] = i;
            }

            for(var i = 1; i < _first.length + 1; i++) {
                for(var j = 1; j < _second.length + 1; j++) {
                    if(_first[i-1] == _second[j-1]) {
                        _table[i][j] = _table[i-1][j-1];
                    } else {
                        var _min = _table[i-1][j-1];
                        if(_table[i-1][j] > _table[i][j-1]) {
                            if(_min > _table[i][j-1])
                                _min = _table[i][j-1];
                        } else {
                            if(_min > _table[i-1][j])
                                _min = _table[i-1][j];
                        }
                        _table[i][j] = _min + 1;
                    }
                }
            }

            return _table[_first.length][_second.length];
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
