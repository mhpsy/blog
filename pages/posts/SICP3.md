---
title: SICP:3.运行LISP的环境
description: 运行LISP的环境
date: 2023-12-24 05:55:55
lang: zh
duration: 10min
---

> 我没研究怎么在windows下面跑,相比会很麻烦,我实在wsl中跑的

我是使用的wsl中的archlinux,我没有使用emacs,我是用的vscode远程链接上去开发

## install
是很简单的过程,没有多么麻烦
1. 先安装yay
2. 用yay安装mit-scheme
3. 开跑

## 开跑
1. 终端输入scheme可以进入交互式环境
2. 终端输入scheme --load xxx.scm可以加载文件
   1. 这个时候就可以用文件中的方法了
   2. 也可以用(load "xxx.scm")来加载文件
   3. 不挑文件后缀名 我的后缀名都叫做lisp

### 注意实现
wsl下面配置代理
```bash
export http_proxy=http://
export https_proxy=http://
```

要注意wsl中通过宿主机去代理使用
```bash
#!/bin/bash
host_ip=$(cat /etc/resolv.conf |grep "nameserver" |cut -f 2 -d " ")
export ALL_PROXY="http://$host_ip:7890"
```
运行这个脚本,然后source一下就可以了 这个脚本可以弄到宿主机的ip