---
title: SICP:2.程序设计的基本元素1
description: 程序设计的基本元素1
date: 2023-12-24 04:44:44
lang: zh
duration: 10min
---

# 程序设计的基本元素1

## 基本表达形式
### 表达式
lisp中的表达式将运算符放在所有运算对象之前，这种表示法称为**前缀表示法**。好处就是可以设用于任意数量的运算对象，而不需要括号来标识运算对象的组合方式。

```lisp
(+ 1 2 3 4 5)
```

### 命名和环境
在lisp中，我们可以使用`define`来给一个值起一个名字，这个名字就是一个变量，而这个变量的值就是这个名字所代表的值。

```lisp
(define size 2)
```

接下来就可以用size表示2了
    
```lisp
(* 5 size)
```
## 组合的方法
> 实际上,构造一个复杂的程序实际上就是一步步地创建出来越来越复杂的计算性对象

### 复合过程(函数/方法)
就是定义方法
```lisp
(define (square x) (* x x))
(define (sum-of-squares x y) (+ (square x) (square y)))
```

### 条件表达式和谓词
相当于现代编程语言的if else
有三种方式 cond cond和else if和else
```lisp
(define (abs x)
    (cond ((> x 0) x)
          ((= x 0) 0)
          ((< x 0) (- x))))
```

```lisp
(define (abs x)
    (cond ((< x 0)(-x))
        (else x)))
```

```
(define (abs x)
    (if (< x 0)
        (- x)
        x))
```

并且也存在and or not这三个常规的逻辑运算符
eg:求一个数位于5-10之间
```lisp
(define (between x)
    (and (> x 5) (< x 10)))
```

eg:定义一个谓词,用于检测某个数是否大于或者等于另一个数
```lisp
(define (>= x y)
    (or (> x y) (= x y)))
```
> 我好奇的问了一下gpt-4,他说真的可以这样重新定义这个符号,我晚点搞个环境去试一试


## test1.2-1.4
### 1.2
```lisp
(/ (+ 5 
      4 
      (- 2 
         (- 3 
            (+ 6 
               (/ 4 5)))))
   (* 3 
      (- 6 2)
      (- 2 7)))
```

### 1.3
> 获取三个数中最大的两个数的和
我的思路是先获取最大的第一个数 然后获取最大的两个数的和
```lisp
(define (get-max x y)
    (cond ((> x y ) x)
            (else y)))

(define (get-min x y)
    (cond ((< x y ) x)
            (else y)))

(define (get-max-two-sum x y z)
    (+ (get-max (get-max x y) z) 
    (get-max (get-min x (get-max y z)) (get-min y (get-max x z)))
))
```

更好的方式是获取最小的值,然后三个数字的和减去最小值的和
```lisp
(define (min-number x y z)
  (cond ((and (< x y) (< x z)) x)
        ((and (< y x) (< y z)) y)
        (else z)))

(define (sum-of-two-largest x y z)
    (-(+ x y z)(min-number x y z))
)
```

### 1.4 运算符作为组合式的求值模型
真的是很新奇的一种东西,我第一次见到这种,好像没什么语言可以这样搞
```lisp
;; 计算表达式
(define (f x y)
    ((if (> x 0) + -) x y))
```
- 如果x大于0,那么就是(+ x y)
- 如果x小于0,那么就是(- x y)

### 1.5正则序和应用序

#### 正则序
先求值参数,然后将参数代入函数体中

#### 应用序
先将函数体和参数代入,需要的时候才求值

> 于是下面这个函数带有死递归,既可以判断出来是正则序还是应用序
```lisp
(define (p) (p))

(define (test x y)
    (if(= x 0)0 y))
```

这个确实过于理论了,可能跟尾递归之类的有关联吧

## 抽象的方法
1. 函数于过程之间的矛盾,不过是在描述一件事情的特征,与描述如何去做这件事情之间的普遍性差异的一个具体反映
2. 你知道根号x=y和y大于等于0而且y的平方等于x是等价的,但是你不知道如何去计算根号x=y
3. 在数学中,人们通常关心的是说明性的描述(是什么),eg:根号x=y
4. 在计算机中,人们通常关心行动性的描述(如何做),eg:计算根号x=y

> 理论上如果存在一个很强大的解释器,那么程序员只需要描述做什么,解释器就可以自动产生出来怎么做

### 牛顿法求平方根
> 计算机计算平方根常用的方法就有牛顿法,牛顿法的思路就是通过迭代的方式,不断的逼近平方根的值,直到误差足够小,就认为这个值就是平方根的值

1. 先要有一个猜测的值
2. 用要求的值除以猜测的值,得到一个新的值
3. 用新的值和猜测的值求平均值,得到一个新的猜测值
4. 重复2,3步骤,直到误差足够小

先用js来一个简单的实现
```js
const square = x => x * x;
const goodEnough = (guess, x) => Math.abs(square(guess) - x) < 0.001;
const improve = (guess, x) => (guess + x / guess) / 2;
function sqrtIter(guess, x) {
    return goodEnough(guess, x)
        ? guess
        : sqrtIter(improve(guess, x), x);
}
```

```lisp
(define (square x)(* x x))
(define (average x y)(/ (+ x y) 2))

(define (improve guess x)(
    average guess (/ x guess)))

(define (abs x)
    (if (< x 0)
        (- x) 
        x))

(define (good-enough? guess x)
    (< (abs (- (square guess) x)) 0.001))

(define (sqrtiter guess x)
    (if (good-enough? guess x)
    guess
    (sqrtiter (improve guess x) x)))

(define (sqrt x)(sqrtiter 1.0 x))
```
> ;The object #f is not applicable. 
> 如果遇到这个报错就说明有一个地方把boolean值当作函数调用了 找bug就完事了 
> 找起来真的很费劲 gpt也看不出来

**很夸张**,甚至还有没有到循环就已经可以做出来在其他语言中写出来的任何东西了,这门语言的表达能力太强大了

### new-if
```lisp
(define (new-if predicate then-clause else-clause)
    (cond (predicate then-clause)
          (else else-clause)))
```
```lisp
(define (new-if predicate then-clause else-clause)
    (if predicate then-clause else-clause))
```

这个就不是按需求值了 因为调用new-if前所有的值都会被求值

### 过程作为黑箱抽象
> 一些理论知识 形参实参 略过了 写过其他语言都能很容易的理解

### 局部定义
可能现在更常见的叫法是闭包了

```lisp
(define (sqrt x)
(define (square x)(* x x))
(define (abs x)(if (< x 0)(- x) x))
(define (average x y)(/ (+ x y) 2))
(define (good-enough? guess x)
    (< (abs (- (square guess) x)) 0.001))
(define (improve guess x)(
    average guess (/ x guess)))
(define (sqrtiter guess x)
    (if (good-enough? guess x)
    guess
    (sqrtiter (improve guess x) x)))
(sqrtiter 1.0 x))
```

可以很容易的实现模块开发,很不错,甚至这个时候就有词法作用域的说法了

好像就这么点语法,没了,我往后面翻了翻 也没看到出现新的语法 太可以了
