---
title: git的一些事情
description: 可算是不用迷迷糊糊的用了
date: 2023-12-10 14:34:26
lang: zh
duration: 10min
---

# base

> 之前一直是迷迷糊糊的用 git ，一直很不舒服，这次抽时间看了半本《精通Git》感觉良好的很，终于能够自信的驾驭 Git 了。

## 其实不用每次都 `git add . `
可以使用 `git commit -am "xxx"` ，这样就不用每次都 `git add .` 了

## git rm
如果想把文件从暂存区和工作区都删除，可以使用 `git rm` 命令。如果手动从工作区删除了文件，那么暂存区其实还是有这个文件的，也就是未跟踪的列表中还是会有这个文件。

### git rm --cached
如果想把文件从暂存区删除，但是保留工作区的文件，可以使用 `git rm --cached` 命令。

有几种情况下会使用，我最常用的情况是更改了 `.gitignore` 文件之后，想把之前已经跟踪的文件从暂存区删除，但是保留工作区的文件。

### git rm --force
用于删除一个已经被修改过并且已经放到暂存区的文件，如果不加 `--force`

## git mv
相当于三条命令的组合
```bash
mv README.md README
git rm README.md
git add README
```
一般都是使用ide直接修改文件名，然后git会自动识别

## git log
### git log -p
查看每次提交的内容差异
### git log --oneline
只显示一行，我最常用的log命令

## 撤销
### git commit --amend
修改最后一次提交的信息，常用于忘记提交文件或者提交信息写错的情况
```bash
git commit -am "xxx"
git add xxx
git commit --amend
```
这样只会有一次提交，而不是两次

### git reset
比如想给一批文件分两次提交但是一不小心执行了 `git add .` ，这时候就可以使用 `git reset` 命令来把暂存区的文件移出，但是不会影响工作区的文件

### git checkout -- file
真正的丢弃工作区的修改
这个命令会把工作区的文件恢复到和暂存区(也就是上一次提交的状态)一模一样，但是会丢失工作区的修改

## 标记
### 轻量标签
只是一个指向某个提交的引用，类似于分支，但是不会改变，不会移动
```bash
git tag v1.0
```

### 附注标签
可以添加标签信息，比如标签说明，标签本身也是一个对象，有自己的校验和信息，包含标签名，标签说明，标签本身也可以被签名与验证，但是轻量标签不行
```bash
git tag -a v1.0 -m "xxx"
```
只要加上 `-a` 参数就可以创建附注标签，使用 `-m` 参数添加标签说明

### 查看标签
```bash
# 查看全部
git tag
# 查看某个标签
git show v1.0
```

### 删除标签
```bash
git tag -d v1.0
```

### 补加标签
```bash
git tag -a v1.0 -m "xxx" 9fbc3d0
```
`9fbc3d0` 是提交的校验和，可以通过 `git log` 查看

### 共享标签
默认情况下，`git push` 命令并不会传送标签到远程仓库服务器上，只有通过显式命令才能分享标签到远程仓库服务器上
```bash
# 推送单个标签
git push origin v1.0
# 推送全部标签
git push origin --tags
```

## 别名
> 这个真的很实用
```bash
# 常规的别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
# 扩展的别名
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.logo 'log --oneline'
```

# 分支

## 分支的新建与合并
明白一些概念，HEAD指针、远程分支、本地分支，并且能够分清 merge 和 rebase 的区别，就很到位了
### git branch
```bash
# 查看分支
git branch
# 新建分支
git branch testing
# 切换分支
git checkout testing
# 新建并切换分支
git checkout -b testing
```

### git merge
```bash
git checkout master
git merge testing
```

### 远程分支和本地分支
```bash
# 查看远程分支
git branch -r
# 查看全部分支
git branch -a
```

### git push
```bash
# 推送本地分支到远程分支
git push origin testing
# 推送本地分支到远程分支并且建立关联
git push -u origin testing
```

### git pull
其实是 `git fetch` 和 `git merge` 的组合
如果有通过 `-u` 参数建立关联的话，可以直接使用 `git pull` 命令 不需要指定分支

### git rebase
变基，可以把分支的提交信息放到另一个分支上，但是 **不要对已经存在于本地仓库之外的提交执行变基操作**

# 开源项目

## 远程仓库
> 如果想给开源项目提交代码，首先要做的就是把开源项目的仓库克隆到本地，这样才能够在本地修改代码并且提交到自己的仓库(因为只有这样子才有写的权限)，然后再发起一个 pull request 请求，等待开源项目的维护者合并代码。
### git remote
可以把开开源项目的仓库也添加到本地，也就是本地同时有开源项目的仓库和自己的仓库，这样子就可以直接从开源项目的仓库拉取代码，然后合并到自己的工作中继续开发。
```bash
# 查看远程仓库
git remote
# 查看远程仓库的详细信息
git remote -v
# 添加远程仓库
git remote add pb
# 从远程仓库抓取数据
git fetch pb
```