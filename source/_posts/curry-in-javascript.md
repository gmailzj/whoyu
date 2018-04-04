layout: post
title: javascript中的通用currying函数 实现原理
date: 2017-08-02 20:30:57
tags: [javascript,fp,curry]
---

javascript中的currying函数 原理分析
<!-- more -->

## currying(柯里化)

### 基本

Currying是函数式编程的一个特性，将多个参数的处理转化成单个参数的处理，类似链式调用。

函数的柯里化概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

柯里化作用：1. 参数复用；2. 提前返回；3. 延迟计算/运行。

你可以一次性地调用 curry 函数，也可以每次只传一个参数分多次调用。

```js
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = add(1);
var addTen = add(10);

increment(2);
// 3

addTen(2);
// 12
```

定义了一个 `add` 函数，它接受一个参数并返回一个新的函数。调用 `add` 之后，返回的函数就通过闭包的方式记住了 `add` 的第一个参数。但是这种写法是针对特定的某个函数，不够通用。



### 通用用法1

然后上面基本用法那里的例子可以这样来写了

```js
var add = function(x,y) {
	return x + y;
};
var curried = curry(add);
var increment = curried(1);
var addTen = curried(10);
console.log(increment(2))
console.log(addTen(2))
```

curry函数在下面实现

```js
function curry(fn) {
            // 获取需要curry的函数fn的参数个数，闭包存储起来
            // 闭包 1
            var _argLen = fn.length

            // 实际返回的wrap函数
            function wrap() {
                // 第一次 获取到实参
                // 闭包 2
                // 进一步优化，可以将这行提到外面，这样curry函数在执行的时候就能传递fn的参数了, function curry(fn, args)
                var _args = [].slice.call(arguments);

                // 如果实参长度不匹配形参数目，继续返回函数，否则返回结果

                function act() {
                    // 合并参数
                    _args = _args.concat([].slice.call(arguments))
                    if (_args.length === _argLen) {
                        return fn.apply(null, _args)
                    }
                    return act;
                }

                // 如果实际参数和fn函数定义时候的形参数目一样，说明所有的参数都提供了，直接求值
                if (_args.length === _argLen) {
                    return fn.apply(null, _args)
                }

                // 前端console的时候打印显示fn函数
                act.toString = function() {
                    return fn.toString()
                }
                return act
            }

            return wrap
        }

        var abc = function(a, b, c) {
            return [a, b, c]
        }

        var curried = curry(abc)

        console.log(curried(1)(2)(3))
            // => [1, 2, 3]

        console.log(curried(1, 2, 3))
            // => [1, 2, 3]

        console.log(curried(1, 2)(3))
            // => [1, 2, 3]

        console.log(curried(1)(2, 3))
            // => [1, 2, 3]
```

### 通用用法2

```js
// 方式2
var curryN = (fn, length) = > {
	//对原始函数的包装，合并多次调用的柯里化的函数的参数，作为原始函数fn的参数，调用fn
	var _warpFunc = (fn, args) = > (...arguments) = > fn.apply(null, args.concat(Array.prototype.slice.call(arguments)));

	return function() {
		var args = Array.prototype.slice.call(arguments);
		if (args.length < length) {
			return curryN(_warpFunc(fn, args), length - args.length)
		}
		return fn.apply(null, args);
	}
}
var curry = (fn, length = fn.length) = > curryN(fn, length);


// 
var curried = curry(abc)
console.log(curried(1)(2)(3))
// => [1, 2, 3]
console.log(curried(1, 2)(3))
// => [1, 2, 3]
console.log(curried(1)(2, 3))
// => [1, 2, 3]
```

## 反柯里化

```
Function.prototype.uncurring = function() {
  var self = this;
  return function() {
    var obj = Array.prototype.shift.call(arguments);
    return self.apply(obj, arguments);
  };
};
```
把Array.prototype.push方法转换成一个通用的push函数，只需要这样做：


```
var push = Array.prototype.push.uncurring();
```

