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
                            return self.searchOnBasicTrie(this.root, _query);
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
        addOnMoebiousTrie: function(_root, _word, _what) {
            var self = this;
            var current = _root;

            console.log(`log : ${_root}, ${_word}, ${_what}`);
            var prefix = null;
            var prefix_length = 0;
            for(var i = _word.length; i >= 1; i--) {
                var subword = _word.substr(0, i);
                if(current[subword]) {
                    prefix = subword;
                    prefix_length = i;
                    break;
                }
            }

            if(prefix) {
                //console.log(`1 log : ${prefix}`);
                self.addOnMoebiousTrie(current[prefix], _word.substr(prefix_length, _word.length), _what);
            }
            else {
                //console.log(`2 log : ${_word}`);
                var rootKeys = null;//Object.keys(current);
                if(current.__object$) {
                    var current_temp = Object.assign({}, current);
                    delete current_temp.__object$;
                    rootKeys = Object.keys(current_temp);
                } else {
                    rootKeys = Object.keys(current);
                }

                var found_check = false;
                if(rootKeys.length > 0) {
                    rootKeys.some(function(_key) {
                        if(_key[0] == _word[0]) {
                            found_check = true;
                            
                            prefix = _key[0];
                            prefix_length = 1;
                            for(; prefix_length < _key.length; prefix_length++) {
                                if(_key[prefix_length] != _word[prefix_length]){
                                    prefix = _word.substr(0, prefix_length);
                                    break;
                                }
                            }

                            console.log(`${prefix}, ${_key}, ${_word}`);
                            current[prefix] = {};
                            current[prefix][_key.substr(prefix_length, _key.length - prefix_length)] = current[_key];
                            delete current[_key];

                            if(prefix.localeCompare(_word)){
                                current[prefix][_word.substr(prefix_length, _word.length - prefix_length)] = {};
                                current[prefix][_word.substr(prefix_length, _word.length - prefix_length)].__object$ = _what;
                            }else
                                current[prefix].__object$ = _what;
                            
                        }
                    });
                }

                if(!found_check){
                    current[_word] = {};
                    current[_word].__object$ = _what;
                }
            }
        },
        searchOnMoebiousTrie: function(_root, _query) {
            var _queryResult = [];

            var _current = _root;
            var _query_instance = _query;
            var _query_instance_length = _query_instance.length;

            var found_check = false;
            
            while(_query_instance_length != 0){
                var prefix = _query_instance.substr(0, _query_instance_length);
                if(_current[prefix]) {
                    _current = _current[prefix];

                    _query_instance = _query_instance.substr(prefix.length, _query_instance.length - prefix.length);
                    _query_instance_length = _query_instance.length;
                    
                    if(_query_instance_length == 0){
                        found_check = true;
                        console.log(`${prefix}, ${_current.__object$}`);
                        break;
                    }
                } else {
                    _query_instance_length--;
                }
            }

            if(!found_check) {
                _current = _root;

                var keysArray = Object.keys(_current);
                keysArray.some(function(_key) {
                    if(_query[0] == _key[0]) {
                        found_check = true;

                        var min_length = (_query.length > _key.length) ? _key.length : _query.length;
                        for(var i = 1; i < min_length; i++) {
                            if(_query[i] != _key[i])
                                found_check = false;
                        }

                        console.log(`${min_length}, ${found_check}`);

                        if(found_check) {
                            // full search on prefix
                            var queue_result = [];
                            var front = 0;
                            var end = 1;
                            queue_result.push(_key);
                            if(_current[_key].__object$)
                                _queryResult.push(_current[_key].__object$);
                            
                            do {
                                for(var k in _current[queue_result[front]]) {
                                    console.log(k);
                                    console.log(queue_result);
                                    if(k.localeCompare("__object$")) {
                                        queue_result.push(k);
                                        if(_current[queue_result[front]][k].__object$)
                                            _queryResult.push(_current[queue_result[front]][k].__object$);
                                        
                                        end++;
                                    }
                                }

                                _current = _current[queue_result[front]];
                                console.log(`${front} , ${end}, ${_current}`);

                                front++;
                            } while(front != end);

                            console.log(_queryResult);
                        }
                    }
                });
            }
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
        searchOnBasicTrie: function(_root, _query) {
            var _queryResult = [];

            // trie search applied
            var _current = _root;

            if(_proto.MATCH_THRESHOLD)
                _MATCH_THRESHOLD = _proto.MATCH_THRESHOLD;

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
