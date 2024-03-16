---
title: go 语言光速入门
description: go 语言光速入门
date: 2024-03-16T13:38:26
lang: zh
duration: 30min
---

### 执行 go 程序

```bash
go run main.go
```

读取参数，可以使用 `os.Args`，它是一个字符串切片，其中第一个元素是程序的路径，随后的元素是程序的参数。

### 输出传入的参数
```go
	var s, sep string
	for i := 0; i < len(os.Args); i++ {
		if i == 0 {
			continue
		}
		s += sep + os.Args[i]
		sep = " "
	}
```

### rang循环
```go
	for _, arg := range os.Args[1:] {
		s += sep + arg
		sep = " "
	}
```

### 切片

#### 字符串切片和字符串的区别
字符串切片是一个数组的引用，它的元素是不可变的字节序列。字符串是一个不可变的字节序列。

互相转换
```go
//切片转字符串
str := string([]byte{'h', 'e', 'l', 'l', 'o'})
//字符串转切片
stt := []byte("hello")
```

拼接字符串的两种方式 直接拼接和使用Join函数
```go
//方式一
s := ""
for _, arg := range os.Args[1:] {
    s += sep + arg
    sep = " "
}
//方式二
strings.Join(os.Args[1:], " ")
```

#### 分析Join源码

```go
func Join(elems []string, sep string) string {
	switch len(elems) {
	case 0:
		return ""
	case 1:
		return elems[0]
	}

	var n int
	//sep是要放到切片中间的值
	if len(sep) > 0 {
		//const maxInt = int(^uint(0) >> 1)
		if len(sep) >= maxInt/(len(elems)-1) {
			//如果sep的长度大于maxInt/(len(elems)-1)的话，就会溢出
			//也就是不能大于 最大的int值除以切片的长度-1
			//这里只是判断sep的长度 没有判断拼接起来的总长度
			panic("strings: Join output length overflow")
		}
		//sep的长度乘以切片的长度-1 也就是拼接之后间隔符的总长度
		n += len(sep) * (len(elems) - 1)
	}
	//判断拼接之后的总长度是否会溢出
	for _, elem := range elems {
		if len(elem) > maxInt-n {
			panic("strings: Join output length overflow")
		}
		n += len(elem)
	}

	// A Builder is used to efficiently build a string using [Builder.Write] methods.
	// It minimizes memory copying. The zero value is ready to use.
	// Do not copy a non-zero Builder.
	//type Builder struct {
	//	addr *Builder // of receiver, to detect copies by value
	//	buf  []byte
	//}
	var b Builder
	// Grow grows b's capacity, if necessary, to guarantee space for
	// another n bytes. After Grow(n), at least n bytes can be written to b
	// without another allocation. If n is negative, Grow panics.
	//func (b *Builder) Grow(n int) {
	//	b.copyCheck()
	//	if n < 0 {
	//		panic("strings.Builder.Grow: negative count")
	//	}
	//  cap是容量 len是长度 如果容量减去长度小于n的话 就需要扩容
	//	if cap(b.buf)-len(b.buf) < n {
	//		b.grow(n)
	//	}
	//}

	//func (b *Builder) grow(n int) {
	// 先创建一个容量为2*cap(b.buf) + n的切片 然后初始化长度为len(b.buf)
	//	buf := bytealg.MakeNoZero(2*cap(b.buf) + n)[:len(b.buf)]
	// 给新的切片赋值原来的切片的值 然后改变原来的切片的指向
	//	copy(buf, b.buf)
	//	b.buf = buf
	//}
	b.Grow(n)
	//拼接
	// WriteString appends the contents of s to b's buffer.
	// It returns the length of s and a nil error.
	//func (b *Builder) WriteString(s string) (int, error) {
	//	b.copyCheck()
	// s... 就是把s变成一个切片
	//	b.buf = append(b.buf, s...)
	//	return len(s), nil
	//}
	b.WriteString(elems[0])
	for _, s := range elems[1:] {
		b.WriteString(sep)
		b.WriteString(s)
	}
	return b.String()
}
```

> 根据上面的分析可以看出来，Join函数的实现是通过创建一个Builder对象，然后通过WriteString方法来拼接字符串的。
> 所以最佳实践并不是直接代替+号，而是应该拼接在一个切片中然后使用Join函数来拼接字符串。

```go
	s, sep := "", " "
	for i := 0; i < 100; i++ {
		s += "a"
		if i != 99 {
			s += sep
		}
	}
	sArr := make([]string, 100)
	for i := 0; i < 100; i++ {
		sArr[i] = "a"
	}
	join := strings.Join(sArr, sep)
	fmt.Println(s)
	fmt.Println(join)
```

### 读取文件

简单实现uniq
```go
func main() {
	counts := make(map[string]int)
	files := os.Args[1:]
	if len(files) == 0 {
		countLines(os.Stdin, counts)
		fmt.Println("dont have file")
	} else {
		for _, arg := range files {
			f, err := os.Open(arg)
			if err != nil {
				fmt.Println(err)
				continue
			}
			countLines(f, counts)
			err = f.Close()
			if err != nil {
				return
			}
		}
	}
	for line, n := range counts {
		if n > 1 {
			fmt.Printf("%d\t%s\n", n, line)
		}
	}
	fmt.Println(counts)
}
func countLines(f *os.File, counts map[string]int) {
	input := bufio.NewScanner(f)
	for input.Scan() {
		counts[input.Text()]++
	}
}
```

打印有重复的文件
```go
func main() {
	counts := make(map[string]map[string]int)
	for _, filename := range os.Args[1:] {
		counts[filename] = make(map[string]int)
		//读取文件
		file, err := os.ReadFile(filename)
		if err != nil {
			fmt.Println("发生了错误", err)
			continue
		}
		for _, line := range strings.Split(string(file), "\n") {
			counts[filename][line]++
		}
	}

	for filename, lines := range counts {
		for line, n := range lines {
			if n > 1 {
				fmt.Printf("Count: %d, File: %s, Line: %s\n", n, filename, line)
			}
		}
	}
}
```

### 发送请求
```go
func main() {
	for _, url := range os.Args[1:] {
		println(url)
		if !strings.HasPrefix(url, "https://") {
			url = "https://" + url
		}
		resp, err := http.Get(url)
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		fmt.Printf("Status: %s\n", resp.Status)
		_, err = io.Copy(os.Stdout, resp.Body)
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		err = resp.Body.Close()
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
	}
}
```

### 并发请求多个url

go 就是开启一个新的goroutine

```go
func main() {
	now := time.Now()
	ch := make(chan string)
	for _, url := range os.Args[1:] {
		go fetch(url, ch)
	}
	for s := range ch {
		println(s)
	}
	println(time.Since(now).Seconds())
}
func fetch(url string, ch chan<- string) {
	start := time.Now()
	resp, err := http.Get(url)
	if err != nil {
		//Spring 的返回值就是传入的
		ch <- fmt.Sprint(err)
		return
	}
	bodySize, copyErr := io.Copy(io.Discard, resp.Body)
	errClose := resp.Body.Close()
	if errClose != nil {
		return
	}
	if copyErr != nil {
		ch <- fmt.Sprintf("while reading %s: %v", url, copyErr)
		return
	}
	secs := time.Since(start).Seconds()
	ch <- fmt.Sprintf("%.2fs %7d %s", secs, bodySize, url)
}
```

通过 `go run .\httpall.go https://bilibili.com/ https://www.baidu.com` 执行但是可以看到程序是不会自动结束的

#### 使用sync.WaitGroup和defer来实现任务完成关闭channel

```go
func main() {
	now := time.Now()
	ch := make(chan string)

	var wg sync.WaitGroup

	for _, url := range os.Args[1:] {
		//这里每次开启就加上一个1
		wg.Add(1)
		go func(url string) {
			//defer 的作用是在函数结束的时候执行 这里执行wg.Done()也就是释放
			defer wg.Done()
			fetch(url, ch)
		}(url)
	}
	// 这个协程的意思是等待 然后关闭 channel 这样for循环就能够结束了
	go func() {
		wg.Wait()
		close(ch)
	}()
	for s := range ch {
		println(s)
	}
	fmt.Printf("%.2fs elapsed\n", time.Since(now).Seconds())
}
```

### 启动一个web服务

```go
func main() {
	http.HandleFunc("/", gotoIndex)
	http.ListenAndServe("localhost:8000", nil)
}
func gotoIndex(r http.ResponseWriter, w *http.Request) {
	r.Write([]byte("<h1>web server</h1>"))
}
```

> 不需要任何配置 原生就可以这么简单的启动一个web服务








