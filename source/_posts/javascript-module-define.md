layout: post
title: javascript 模块定义几种方式
date: 2016-11-02 11:56:57
tags: [javascript,commonjs,define]
---

兼容Commonjs、AMD 模块加载的写法
<!-- more -->

如果模块定义包装很复杂，一般是工具生成的，比如webpack、browserify等。

```javascript
/*********** 定义模块的几种方式 *************/
// 方式1
(function(define) {
    define(["jquery"], function($) {
        return (function() {
            var toastr = {
                a: 1
            };

            return toastr
        })();
    })
}(
    typeof define === "function" && define.amd ? define : function(deps, factory) {
        if (typeof module !== "undefined" && module.exports) {
            module.exports = factory(require("jquery"))
        } else {
            window["toastr"] = factory(window["jQuery"])
        }
    }
));

// 方式2

!function(e, t) {
    typeof module != "undefined" && module.exports ? module.exports = t() : typeof define == "function" && define.amd ? define(e, t) : this[e] = t()
}("bowser", function() {

  var n = {a:1}

  return n;
});

// 方式3

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory)
    } else {
        if (typeof exports === "object") {
            module.exports = factory()
        } else {
            root.YUVCanvas = factory()
        }
    }
}(this, function() {

  function YUVCanvas(){

  }
  return YUVCanvas
}));


// 方式4
(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else {
        if (typeof define === "function" && define.amd) {
            define([], f)
        } else {
            var g;
            if (typeof window !== "undefined") {
                g = window
            } else {
                if (typeof global !== "undefined") {
                    g = global
                } else {
                    if (typeof self !== "undefined") {
                        g = self
                    } else {
                        g = this
                    }
                }
            }
            g.AV = f()
        }
    }
})(function() {
    var define, module, exports;
    return (function e(list, cache, start) {//start =>自动加载 [1,2]
        function load(o, u) {
            console.log(o);
            if (!cache[o]) {// 缓存容器
                if (!list[o]) {// 如果下面的列表中没有定义，

                    // 如果require已经定义了
                    var require = typeof require == "function" && require;
                    if (!u && require) {
                        return require(o, !0)
                    }
                    if (i) {
                        return i(o, !0)
                    }
                    var error = new Error("Cannot find module '" + o + "'");
                    throw error.code = "MODULE_NOT_FOUND",
                    error
                }
                var l = cache[o] = {
                    exports: {}
                };
                list[o][0].call(l.exports, function(key) {
                    // 加载依赖
                    var n = list[o][1][key];
                    return load(n ? n : key)
                }, l, l.exports, e, list, cache, start)
            }
            return cache[o].exports
        }
        // 如果require已经定义了
        var i = typeof require == "function" && require;
        for (var o = 0; o < start.length; o++) {
            load(start[o])
        }
        
        return load
    })({
        1: [function(require, module, exports) {
            var key, val, _ref;

            _ref = require("./src/base");
            for (key in _ref) {
                val = _ref[key];
                exports[key] = val
            }
            console.log(exports);
        }
        , {// 在这里处理依赖
            "./src/base": 2,

        }],
        2: [function(require, module, exports) {
            exports.BufferList = require("./core/bufferlist");

        },{
            "./core/bufferlist": 3,
        }],
        3: [function(require, module, exports) {
            var BufferList;
            BufferList = (function() {
                function BufferList() {
                    this.first = null ;
                    this.last = null ;
                    this.numBuffers = 0;
                    this.availableBytes = 0;
                    this.availableBuffers = 0
                }
                return BufferList
            })();
            module.exports = BufferList
        }
        , {}]
               
    }, {}, [1])(1);  //最后一个1 表示手动load 模块1
});

 ```
