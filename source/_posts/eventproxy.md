layout: post
title: EventProxy.js 源码分析
date: 2017-06-20 19:56:57
tags: 
      - nodejs 
---
[EventProxy](https://github.com/JacksonTian/eventprox)是一个通过控制事件触发顺序来控制业务流程的工具,利用事件机制解耦复杂业务逻辑,减少callback回调函数嵌套问题
<!-- more -->
最近用到 eventproxy, 本着知其然的态度，分析了下其源码，有兴趣的可以看看,代码在github上面。
[详细分析地址](https://github.com/gmailzj/eventproxy)
