layout: post
title: git commit 提交代码
date: 2018-06-14 10:30:00
tags: git
---
列举出常用的提交代码的操作步骤以及涉及到的Git命令
<!-- more -->

**文件的三种状态**

对于任何一个文件，在 Git 内都只有三种状态：

1、已修改（modified）    --> Git 的工作目录

2、已暂存（staged）        -->暂存区域

3、已提交（committed） -->本地仓库

已修改表示修改了某个文件，但还没有提交保存；

已暂存表示把已修改的文件放在下次提交时要保存的清单中。

已提交表示该文件已经被安全地保存在本地数据库中了；

由此我们看到 Git 管理项目时，文件流转的三个工作区域：Git 的工作目录，暂存区域，以及本地仓库。

![](/images/git-states.svg)

### 提交代码基本流程

`git add` 和 `git commit` 这两个命令组成了最基本的 Git 工作流

首先，你要在工作目录中编辑你的文件。当你准备备份项目的当前状态时，你通过 `git add` 来缓存更改。当你对缓存的快照满意之后，你通过 `git commit` 将它提交到你的项目历史中去。

## git add

`git add` 命令将工作目录中的变化添加到缓存区。它告诉 Git 你想要在下一次提交时包含这个文件的更新。但是，`git add` 不会怎么影响你的仓库——在你运行 `git commit` 前更改都不会被记录。

使用这些命令之时，你还需要 `git status` 来查看工作目录和缓存区的状态。

git add 有几种用法

1. `git add -A` stages All 添加所有
2. `git add .` stages new and modified, without deleted  添加新文件和修改过的，不包括删除的
3. `git add -u` stages modified and deleted, without new  添加修改的和删除的，不包括新建的

## git commit

`git commit`命令将缓存的快照提交到项目历史。

```bash
git commit -m "<message>"
```

提交已经缓存的快照到本地仓库

## git commit --amend

`git commit --amend` 命令是修复最新提交的便捷方式。它允许你将缓存的修改和之前的提交合并到一起，而不是提交一个全新的快照。它还可以用来简单地编辑上一次提交的信息而不改变快照

但是，amend 不只是修改了最新的提交——它进行了一次替换。对于 Git 来说，这看上去像一个全新的提交，

在公共仓库工作时一定要牢记这一点

```bash
git commit --amend
```

合并缓存的修改和上一次的提交，用新的快照替换上一个提交。缓存区没有文件时运行这个命令可以用来编辑上次提交的提交信息，而不会更改快照。