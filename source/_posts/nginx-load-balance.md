layout: post
title: nginx配置负载均衡和CGI 缓存
date: 2016-08-15 15:56:57
tags: 
      - nginx
---
如果有多台webapp服务器，常常要用到nginx的反向代理负载均衡;同时有些页面就算是动态的，只要是实时性要求不高的，
也可以使用缓存策略，比如没有登录的用户看到的首页, 局部不想缓存的通过ajax来渲染。
<!-- more -->
```nginx
# !缓存文件存放目录
# levels    缓存层次
# keys_zone 缓存空间名和共享内存大小(热点内容放在内存)
# inactive  失效时间, 1d = 1天
# max_size  最大缓存空间(硬盘占用)
proxy_cache_path /data/vhosts/xxx.com/cache/cache_dir/ levels=1:2 keys_zone=xiu:10m inactive=2h max_size=2g;

upstream server_self {
    server localhost:8081 fail_timeout=0;
}

upstream server_multi {
    server 61.128.196.xxx:80  weight=4;
    server 61.128.196.xxx:80  weight=2;
    server 113.207.31.xxx:80   weight=4;
}

server {
    listen 80;
    server_name xxx.com;

    rewrite ^(.*) http://www.xxx.com$1 permanent;
}

server {
    listen 80;
    server_name www.xxx.com;

    proxy_read_timeout      300s;
    proxy_send_timeout      300s;
    proxy_connect_timeout   300s;
    proxy_redirect          off;

    proxy_set_header    Host                $http_host;
    proxy_set_header    X-Real-IP           $remote_addr;
    proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
    proxy_set_header    X-Forwarded-Proto   $scheme;
    proxy_set_header    X-Frame-Options     SAMEORIGIN;

    proxy_cache             xiu;
    # 缓存触发的方法 HEADER, GET, POST 中的一个或多个
    proxy_cache_methods     GET;
    # 生成的缓存名称的 key 的名字
    # $scheme https/http
    # $request_method 请求方法,基于上面的设置,这里为GET
    # $host 主机
    # $request_uri 请求地址
    proxy_cache_key         "$scheme$request_method$host$request_uri";
    # 生效值: 即代理目标的状态码以及缓存时间
    proxy_cache_valid       200 302 1h;
    # 确定缓存成为过期数据的情况
    proxy_cache_use_stale   error timeout invalid_header http_500;
    # 请求过多少次相同的URL后, 缓存将开始
    proxy_cache_min_uses    1;
    # 关闭缓存
    proxy_cache_bypass      $cookie_userid;
    # proxy_no_cache          $cookie_nocache;
    # 发送头信息到客户端 - 一般是浏览器
    add_header              X-Cache "$upstream_cache_status";

    location / {
        proxy_pass http://server_multi;
    }

    location /user/ {
        proxy_pass http://server_self;
    }

    location /detect-speed/start {
        proxy_pass http://server_self;
    }

    access_log  off;
}

server {
    listen       8081;
    server_name  www.xxx.com;
    index index.html index.htm index.php;
    root /data/vhosts/xxx.com/frontend/web;

    location / {
        #auth_basic "name and passwd";
        #auth_basic_user_file htpasswd; 
        #rewrite favicon favicon.ico  last;
        #rewrite favicon.ico  favicon.ico  last;
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ .*\.(php)?$
    {
        #fastcgi_pass  127.0.0.1:9000;
        fastcgi_pass  unix:/tmp/php-fpm.sock;
        fastcgi_index index.php;

        add_header    X-Cluster "77";
        fastcgi_intercept_errors on;

        include fastcgi.conf;
    }

    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires 30d;
    }

    location ~ .*\.(js|css)?$
    {
        expires 1h;
    }

    error_page 404 /404.html;

    access_log  logs/access/www.xxx.com.log proxy;

 ```
