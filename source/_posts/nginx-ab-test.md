layout: post
title: nginx 配置模块 实现A/B测试
date: 2017-03-02 19:56:57
tags: 
      - nginx
---
 nginx 安装set-misc-nginx-module模块 实现A/B测试
<!-- more -->

[TOC]
# 1 需求：
给定一个URL，通过nginx 301跳转到不同的APK下载
比如xxx.com/abc.apk 跳转到两个URL:
>    1.  url.com/abc.one.apk
>    2.  url.com/abc.two.apk
> 





## 1.1 方案1：通过split_clients。

```bash
   #http段
   # 方案2
   split_clients "${remote_addr}HASH" $variant {
           50%               .one;
           *                 .two;
   }
   #server段
   location = /abc.apk {
        return 301 http://url.com/abc${variant}.apk;
   }
```

## 1.2 方案2：通过map。


```bash
    #http段
    # 方案2
    map $loc_rnd $ab_test_value{
        1  ".one";
        2  ".two";
    }
    #server段
   location = /abc.apk {
        set_random $loc_rnd 1 2;
        return 301 http://url.com/abc${ab_test_value}.apk;
   }
```
需要用到[set-misc-nginx-module](https://github.com/openresty/set-misc-nginx-module)模块

### 1.2.1 安装 set-misc-nginx-module

如果nginx之前是通过源码编译安装的：
找到源码位置，比如**/usr/local/src**
或者找不到源码位置，则全新安装升级nginx

```bash
    cd /usr/local/src
    # 下载nginx
    wget 'http://nginx.org/download/nginx-1.11.2.tar.gz'
    tar -xzvf nginx-1.11.2.tar.gz
    
    # 下载 ngx_devel_kit
    wget 'https://github.com/simpl/ngx_devel_kit/archive/v0.3.0.tar.gz'
    tar -zxvf v0.3.0.tar.gz
    
    # 下载 set-misc-nginx-module
    wget 'https://github.com/openresty/set-misc-nginx-module/archive/v0.31.tar.gz'
    tar -zxvf v0.31.tar.gz
    
    # 开始升级nginx
    # 查看nginx编译安装时的命令，安装了哪些模块
    cd /usr/local/nginx/sbin/
    ./nginx -V 
    
    # config输出如下：
     --prefix=/usr/local/nginx --user=www --group=www \
     --with-http_stub_status_module --with-http_ssl_module \
     --with-http_gzip_static_module \
     --with-ipv6 --with-http_sub_module --with-http_geoip_module
     
    # 这里需要用到上面的config参数 
     cd /usr/local/src/nginx-1.11.2
     
     # 重新configure
     ./configure --prefix=/usr/local/nginx --user=www --group=www \
     --with-http_stub_status_module --with-http_ssl_module \
     --with-http_gzip_static_module \
     --with-ipv6 --with-http_sub_module --with-http_geoip_module
      --add-module=../ngx_devel_kit-0.3.0/ \
      --add-module=../set-misc-nginx-module-0.31
    
    # make
    make 
    
    #执行完后，这里不用在 make install 了
    #备份原先的nginx执行文件
    cd /usr/local/nginx/sbin
    cp nginx nginx_bak
    #复制编译后objs目录下的nginx文件到nginx的安装目录sbin/下
    cd -
    # 如果复制不了，加-p参数
    cp -p objs/nginx /usr/local/nginx/sbin/ 
    
    # 测试一下新的nginx 是否正常
    /usr/local/nginx/sbin/nginx -t
    
    # 开始平滑升级
    
    # 找到nginx.pid 文件
    ps aux |grep nginx 
    # 或者
    cat /usr/local/nginx/conf/nginx.conf | grep pid
    # 输出如下
    # pid        /usr/local/nginx/logs/nginx.pid;
    
    kill -USR2 `cat /usr/local/nginx/logs/nginx.pid`
    kill  -WINCH `cat /usr/local/nginx/logs/nginx.pid.oldbin`
    kill -QUIT `cat /usr/local/nginx/logs/nginx.pid.oldbin`
    
```



