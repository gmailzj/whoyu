layout: post
title: linux 中的find命令常用用法
date: 2016-05-02 15:56:57

tags: linux, find
---
linux 中的find命令常用用法
<!-- more -->



## 使用格式

**$ find <指定目录> <指定条件> <指定动作>**

  - <指定目录>： 所要搜索的目录及其所有子目录。默认为当前目录。

  - <指定条件>： 所要搜索的文件的特征。

  - <指定动作>： 对搜索结果进行特定的处理。

###常用例子
**$ find . -name 'my*'**

搜索当前目录（含子目录，以下同）中，所有文件名以my开头的文件。

**$ find . -name 'my\*' -ls**

搜索当前目录中，所有文件名以my开头的文件，并显示它们的详细信息

**$ find . -name 'my\*' -ls 2>/dev/null**

有些目录没有权限，会打印错误信息，将错误重定向到/dev/null



### type类型

  - ​             -b       block special 块（缓存）特殊 


  - ​             c       character special  字符（未缓存）特殊


  - ​             d       directory   目录


  - ​             f       regular file  普通文件


  - ​             l       symbolic link  链接


  - ​             p       FIFO 命名管道 (FIFO) 


  - ​             s       socket 套接字

**$ find . -name 'my\*' -type d**

搜索当前目录中，所有以my开头的文件夹名字



### 查找时间

###按天

*•* mtime *—* 文件内容上次修改时间 
*•* atime — 文件被读取或访问的时间 
*•* ctime — 文件状态变化时间

这些时间选项都需要与一个值 *n* 结合使用，指定为 *-n、n* 或 *+n*。时间是以24小时为单位的

*• -n* 返回项小于 *n*，            列出在n天之内（含n天本身）被更改过内容的文件名
*• +n* 返回项大于 *n*，           列出在n天之前（不含n天本身）被更改过内容的文件名
*• n* 返回项正好与 *n* 相等,   意思为在n天之前的“一天之内”被更改过内容的文件

返回最近24小时内修改过的文件

```
find . -mtime 0
```

返回的是前48~24小时修改过的文件。而不是48小时以内修改过的文件
```
find . -mtime 1
```

查找在最近 1 天内修改的所有文件

```
find . -mtime -1
```

找 “5天之内被更改过的档案名” 就是   find / -mtime -5 ，找“5天前的那一天被更改过的档案名” 就是   find / -mtime 5 ，找“5天之前被更改过的档案名” 就是   find / -mtime +5。我们可以看出有没有 “+，-”的差别是很大的。下面用图来说明一下：

/

![](/images/find.png)　　　　　　　　　　

　　由这个时光轴我们可以知道，最右边为当前时，+5 代表大于等于 6 天前的档案名， -5 代表小于等于 5 天内的档案名，5 则是代表 5-6 那一天的档案名。

### 按分钟查找

查找当前目录下.p文件中，最近30分钟内修改过的文件。

```
find . -name '*.p' -type f -mmin -30
```

### 时间对比查找

还可以使用 -newer、-anewer 和 –cnewer 选项查找已修改或访问过的文件与特定的文件比较

• -newer 指内容最近被修改的文件 
• -anewer 指最近被读取过的文件 
• -cnewer 指状态最近发生变化的文件

```
find . -newer  backup.tar.gz
```

### 按大小查找文件

查找当前目录下小于100M的文件

```
find .  -size -100M
```
查找当前目录下大于100K的文件
```
find .  -size +100k
```
### 按权限和所有者查找

```
find . -type f  -perm a=rwx -exec ls -l {} \;
```

```
find . -type f  -perm 777 -exec ls -l {} \;
```


查找当前目录中文件权限的0755的文件

```
$ find . -perm 0755 -maxdepth 1 

$ find . -perm 0755  -d 1 (mac)
```

 \# 与用户或用户组名有关的参数：  可以通过 命令 id 来查询相关用户参数
- -user name : 列出文件所有者为name的文件  
- -group name : 列出文件所属用户组为name的文件  
- -uid n : 列出文件所有者为用户ID为n的文件  
- -gid n : 列出文件所属用户组为用户组ID为n的文件  


列出文件所属用户组为staff的文件 
`find . -group staff`

### 按文件夹层级

find 不需要 -r 或 -R 选项即可下到子目录中 ，可以通过参数 -depth、-maxdepth 和 -mindepth 来控制层级

```
find / -maxdepth 3  -name "*log"
find / -d 3  -name "*log" (Mac)
```


### 用ls命令来过滤文件或者文件夹

只显示文件夹     **ls -l | grep ^d**

只显示文件         **ls -l | grep ^-**