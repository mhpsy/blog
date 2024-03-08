---
title: SICP:4.过程和它们产生的计算
description: 4.过程和它们产生的计算
date: 2023-12-25 06:66:66
lang: zh
duration: 10min
---

> 我最近发生了好多事情，我以后还是要每天都看一点 lisp 的东西

### factorial

1. 递归
```lisp
(define (factorial num)
    (if ( = num 1) 1
    (* num (factorial (- num 1)))))
```

2. 迭代(lisp说法中的迭代)
```lisp
(define (factorial num)
(define (face-iter product counter)
(if(> counter num) product
    (face-iter (* counter product) (+ counter 1))))
    (face-iter 1 1))
```

> 这里的迭代其实就是我只听说过的尾递归，这是我第一次接触到尾递归
> 我不是很明白这是为什么这样就可以实现尾递归，因为相同的手法在常规的编程语言中肯定是不会尾递归的

书中有一个很专业的名词`迭代计算过程`，

递归是一个语法上的概念，而迭代是一个计算过程上的概念

```lisp
;; 我看不出来哪里的问题 总之我连(+ 1 2)都没执行成功 后面懂了再来看吧
(define (inc a)(+ a 1))
(define (dec a)(- a 1))
(define (+ a b)
    (if (= a 0)
        b
        (+ (dec a) (inc b))))
```

## Ackermann

[阿克曼函数](https://zh.wikipedia.org/wiki/%E9%98%BF%E5%85%8B%E6%9B%BC%E5%87%BD%E6%95%B8)

> 下面的程序我最开始以为很简单，但是脑内运行了一下才发现
> 真的复杂，于是在纸上面写了很久，我手工推出来了(A 1 10)的结果
> 但是真的无力退出来(A 2 4)的结果，纸太小了

```lisp
(define (A x y)
    ;;如果y=0 返回0
    (cond ((= y 0) 0)
        ;;如果x = 0 返回y*2
        ((= x 0)(* 2 y))
        ;; 如果 y=1 返回2 
        ((= y 1) 2)
        ;; 否则返回A(x-1,A(x,y-1))
        ;; 先算(A x ( - y 1)) 假设是T
        ;; 也就是x 和 y-1 的结果继续递归
        ;; 在组合成(A ( - x 1) T)
        ;; 再算(A ( - x 1) T)
        (else (A (- x 1)
            (A x (- y 1))))))

;;test1 (A 1 10)
;; 1. 都不会进入 进入else y-1 一直进入 知道 y = 1了 直接全部返回
;; 所以会一直递归到 (A 1 1) 返回2 然后X-1 返回2 也就是4
;;(A 1 1)是2 那么(A 1 2)是4因为相当于 2 * A(1 1) 因为 x - 1 = 0
;; 然后递归上去 结果是2**10 = 1024
;;test2 (A 2 4)
;; 这个递归太牛了 真给我CPU干烧了 总之结果是65536
;;test3 (A 3 3) 这个结果也是65536
```

书中有一个常规的斐波那契数列的递归和递推实现，很常规，略过

## 换零钱
我说实话我是真没想到，第一章节都没没看完就换零钱了，老一辈程序员确实厉害
这个问题我用java和js写过好多次了，开干

```lisp
(define (count-change amount)
    (cc amount 5))
(define (cc amount kinds-of-coins)
    (cond ((= amount 0) 1)
        ((or (< amount 0) (= kinds-of-coins 0)) 0)
        ;;不使用当前这种硬币，只考虑剩下的硬币种类（kinds-of-coins 减1）。
        ;;使用一枚当前种类的硬币，然后继续计算剩余金额（amount 减去这种硬币的面值）
        (else (+ (cc amount
            (- kinds-of-coins 1))
            (cc (- amount
                (first-denomination kinds-of-coins))
                kinds-of-coins)))))
(define (first-denomination kinds-of-coins)
    (cond ((= kinds-of-coins 1) 1)
        ((= kinds-of-coins 2) 5)
        ((= kinds-of-coins 3) 10)
        ((= kinds-of-coins 4) 25)
        ((= kinds-of-coins 5) 50)))
```

```lisp
(count-change 100)
```

## test1.11
函数f由如下规则定义：如果x小于3，那么f(x)的值为x；如果x大于等于3，那么f(x)的值为f(x-1)+2f(x-2)+3f(x-3)。请分别编写递归和迭代的过程

### 递归
```lisp
(define (f x)
    (if (< x 3) x
    (+ (f (- x 1)) (* 2 (f (- x 2))) (* 3 (f (- x 3))))))
```

### 迭代
```lisp
(define (f x)
    (define (f-iter a b c counter)
        (if (= counter 0) a
        (f-iter (+ a (* 2 b) (* 3 c)) a b (- counter 1))))
    (f-iter 2 1 0 x))
```



