layout: post
title: javascript-inherit
date: 2016-04-27 15:56:57
tags: javascript
---
**javascript 继承**
1 在原型里面拓展方法和属性，一般都是方法，很少属性?
因为prototype里面的属性(也就是数据)是每个实例共享的，有写操作的时候每个实例之间会冲突、污染数据
写操作分为重新赋值(=)和增减数据(push)

2 下面的Class.extend方法可以变一下，添加一个Class.create方法，这样类实例化的时候，就以下面的形式直接调用
var 类名= Class.extend({});//得到类
var obj =  类名.create();//得到实例
不用每次实例化 都new 类名。

```javascript
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  //基类构造函数
  //这里的this只的是window，这样Class就巧妙的变成全局作用域了
  this.Class = function(){};
 
   /*for循环用到的可以替换为一个局部函数func*/
  function func(name, fn) {
      return function() {
          // 将实例方法_super保护起来。
          var tmp = this._super;//比如子类有一个_super方法(一般不要这样定义)
          // 在执行子类的实例方法name时，添加另外一个实例方法_super，此方法指向父类的同名方法
          this._super = _super[name];//因为fn在下面的apply执行的时候里面有用到this._super();这里相当于提前赋值
          // 执行子类的方法name，注意在方法体内this._super可以调用父类的同名方法
          var ret = fn.apply(this, arguments);

          this._super = tmp;//恢复实例方法_super
          
          // 返回执行结果
          return ret;
      };
  }
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {


    //this 基类构造函数 一开始的时候就是全局的Class构造器，以后就代表基类
    //_super指的是基类的原型
    var _super = this.prototype;
   

    initializing = true;

    
    var prototype = new this();
    initializing = false;
    
    //通过将子类的原型指向父类的一个实例对象来完成继承

    for (var name in prop) {


      //下面的逻辑运算部分
      // 如果父类和子类有同名方法，并且子类中此方法（name）通过_super调用了父类方法
      // -- 则重新定义此方法
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?

        /*可以替换为一个局部函数func 开始*/
        (function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = _super[name];           
            var ret = fn.apply(this, arguments);        
            this._super = tmp;//
            return ret;
          };
        })(name, prop[name])
        /* fn(name, prop[name]); 可以替换为一个局部函数func 结束*/
        :
        prop[name];
    }
   
    //构造器
    function Class() {
      // 初始化操作
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // 实现继承：子类的prototype指向父类的实例，最通用的继承手段
    Class.prototype = prototype;
   
    // 修正constructor指向错误
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    // 子类自动获取extend方法，arguments.callee指向当前正在执行的函数，为下一个继承做准备
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

 ```