---
title: 简单实现Spring
description: 关于Spring
date: 2024-03-07 22:00:00
lang: zh
duration: 30min
---

# Spring 是什么

> 我现在理解的 Spring 就是一个管理 java 对象和切面编程的框架。来解决传统开发中需要手动管理对象和代码耦合的问题。

## Spring 的核心概念

### IOC
IOC 是 Inversion of Control 的缩写，中文翻译为控制反转。在 Spring 中，控制反转是通过依赖注入（DI）实现的。简单来说，控制反转就是将对象的创建和对象之间的调用交给 Spring 容器来管理。

实际中的IOC有两种BeanFactory和ApplicationContext，但是99%的情况下会使用ApplicationContext。

### AOP
AOP 是 Aspect Oriented Programming 的缩写，中文翻译为面向切面编程。在 Spring 中，AOP 是通过动态代理实现的。简单来说，AOP 就是将一些公共的功能抽取出来，然后通过动态代理的方式织入到需要的地方。

> 最大的好处就是通过配置获取需要的对象，而不需要手动创建对象。同时，通过 AOP 可以将一些公共的功能抽取出来，然后通过动态代理的方式织入到需要的地方。

## 原生Spring的使用方式(XML和注解)

> 早期通过XML配置文件的方式来管理对象，后来Spring开始支持注解的方式来管理对象。
> 并且由于引用第三方包是没有办法添加注解的，所以也有工厂模式的方式来管理对象。
> 需要配置扫描的包 有XML和注解两种方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="helloWorld" class="com.example.HelloWorld">
        <property name="message" value="Hello from XML configuration"/>
    </bean>
</beans>
```

> 使用@Component注解

```java
package com.example;

import org.springframework.stereotype.Component;

@Component
public class HelloWorld {
    private String message = "Hello from Annotation configuration";

    public void getMessage(){
        System.out.println("Your Message : " + message);
    }
}

```

加载配置
```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");
        HelloWorld obj = (HelloWorld) context.getBean("helloWorld");
        obj.getMessage();
    }
}
```

## 动手

Spring早期的方式大概是通过Dom4j来解析XML文件，然后通过反射的方式来创建对象。

我们不考虑这种方式，会直接使用注解的方式来创建对象。





