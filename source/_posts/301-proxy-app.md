layout: post
title: fiddler 301 跳转设置
date: 2016-11-25 15:56:57
tags: fiddler
---
**fiddler 301 跳转设置**
有时候我们需要在某个客户端的webview打开我们的网页地址来测试一些功能，但是app没有提供这个入口给你，这种场景可以用到fiddler代理返回301或者302
<!-- more -->

第一种 在app的某个列表入口
断点 修改response的值，在app里面的某个入口请求json或者页面里面修改返回值

第二种
autoResponder

简单的版本就是通过*redir
*redir:http://192.168.0.132:3000/android/
这种情况的httpcode就是307，一般都支持(有些webview可能不支持)

复杂一点的就需要修改文件

修改fiddler安装所在目录的ResponseTemplates
302_Redirect.dat,需要管理员权限(或者已这个为模板，自己新建一个文件，随便放哪)

HTTP/1.1 301 Moved Permanently
FiddlerTemplate: True
Date: Fri, 25 Nov 2016 07:51:26 GMT
Location: http://192.168.0.132:3000/android/
Content-Length: 0

HTTP/1.1 302 Moved Temporarily
FiddlerTemplate: True
Date: Fri, 25 Nov 2016 07:51:26 GMT
Location: http://192.168.0.132:3000/android/
Content-Length: 0

第三种
```javascript
fiddler script custom 脚本
点击菜单Rules->Customize Rules
在如下函数中修改http应答：
static function OnBeforeResponse(oSession: Session) {
    if (m_Hide304s && oSession.responseCode == 304) {
        oSession["ui-hide"] = "true";
    }
    if (oSession.host.indexOf("p.21kunpeng.com") > -1) {
        //oSession.responseCode = 301
        //oSession.oResponse.headers["Status Code"] = "301 Moved Permanently";
        //oSession.oResponse.headers["Location"] = "http://m.163.com";

    }
}

如果还需要修改请求的参数 OnBeforeRequest 方法中

在如下函数中修改http请求头：
static function OnBeforeRequest(oSession: Session)
if (oSession.host.indexOf("xx.com") > -1) {
 // 修改session中的显示样式
 oSession["ui-color"] = "orange";
 // 移除http头部中的MQB-X5-Referer字段
 oSession.oRequest.headers.Remove("MQB-X5-Referer");
 // 修改http头部中的Cache-Control字段
 oSession.oRequest["Cache-Control"] = "no-cache";
 // 修改host
 oSession.host = "xx.com";
 // 修改Origin字段
 oSession.oRequest["Origin"] = "xx.com";
 // 删除所有的cookie
 oSession.oRequest.headers.Remove("Cookie");
 // 新建cookie
 oSession.oRequest.headers.Add("Cookie", "username=yulesyu;");
 // 修改Referer字段
 oSession.oRequest["Referer"] = "http:www.163.com/index.php";

 // 获取Request中的body字符串
 var strBody=oSession.GetRequestBodyAsString();
 // 用正则表达式或者replace方法去修改string
 strBody=strBody.replace("1111","2222");
 // 弹个对话框检查下修改后的body
 FiddlerObject.alert(strBody);
 // 将修改后的body，重新写回Request中
 oSession.utilSetRequestBody(strBody);
}
```

