layout: post
title: git init 项目初始化
date: 2018-06-14 09:56:57
tags: git
---
列举出常用的仓库初始化的操作步骤以及涉及到的Git命令
<!-- more -->

##### Git global setup(*配置命令别名alias*)

```bash
# 日志显示更好看
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.st status
git config --global alias.ci commit
git config --global alias.cm commit
git config --global alias.co checkout
git config --global alias.br branch
```

**Git config (*用户级别配置*)**

config配置有3个层级：

- system（系统级别）
- global（用户级别）
- local（仓库级别）

覆盖优先级为local 》 global 》 system。优先读取local，其次是global，最后是system。

读取system级别的配置：

```bash
$ git config --system --list
```

读取global级别的配置：

```bash
$ git config --global --list
```

读取local级别的配置：

```bash
$ git config --local --list
```

如果想修改配置的话，加上不同的参数就可以在不同的级别上配置了。

比如配置global级别的信息：

```bash
$ git config --global user.name "yourusername"
$ git config --global user.email "youremail@email.com"
```

**Create a new repository**

```bash
git clone git@gitlab.com:lake/wechat.git

cd wechat

touch README.md

git add README.md

git commit -m "add README"

git push -u origin master
```

**Existing folder (*本地文件夹添加到新项目*)**

```bash
cd existing_folder

git init

git remote add origin git@gitlab.com:lake/wechat.git

git add .

git commit -m "Initial commit"

git push -u origin master
```

**Existing Git repository (*本地已经存在git仓库*)**

```bash
cd existing_repo

git remote rename origin old-origin

git remote add origin git@gitlab.com:lake/wechat.git

git push -u origin --all

git push -u origin --tags
```

