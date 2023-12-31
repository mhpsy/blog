---
title: 从递归到动态规划
description: 从递归到动态规划
date: 2023-11-17T12:00:00.000+00:00
lang: zh
duration: 10min
---

> 本文汲取自《算法之禅》一书，外加自己的理解。
> 注：有大批概念性的描述来自 chatgpt

### Haskell

大多人已经习惯用循环语句来解决这个问题了，对于用递归解决这个问题来说有点不太习惯(起码我是这个样子的)。

闲来无事的我去研究了下这个问题的现实意义，发现这个世界上存在一些没有for循环的编程语言，比如Haskell。在这种语言中，入门的遍历数组就要使用递归。

```haskell
arrayTraversal :: [Int] -> IO ()
arrayTraversal [] = return ()
arrayTraversal (x:xs) = do
    putStrLn (show x)
    arrayTraversal xs
```

上面的代码就是使用Haskell遍历输出一个数组的方法。

> 注：(x:xs)其中的x是数组的第一个元素，xs是剩下的元素组成的数组。


- 用java实现一个递归遍历数组并求和的方法

```java
public static int sum(int[] array, int l) {
    if (l == array.length) return 0;
    return array[l] + sum(array, l + 1);
}
```

### 创建树和路径和

- 构建树

```java
public class Node {
    public int data;
    public Node left, right;
    public Node(int data) {this.data = data;}
}

public static Node buildTree(int[] arr, int li, int hi) {
    if (li > hi) return null;
    int mid = (li + hi) / 2;
    var root = new Node(arr[mid]);
    root.left = buildTree(arr, li, mid - 1);
    root.right = buildTree(arr, mid + 1, hi);
    return root;
}

int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15};
var root = Node.buildTree(arr, 0, arr.length - 1);
```

> 先构建子树，再构建父树。

- 求路径和

```java
public static Map<Node, Integer> getPathSumMap(Node root) {
    if (root == null) return new HashMap<>();
    HashMap<Node, Integer> sums = new HashMap<>();
    LinkedList<Node> nodeQ = new LinkedList<>();
    nodeQ.offer(root);
    sums.put(root, root.data);
    while (!nodeQ.isEmpty()) {
        Node node = nodeQ.poll();
        if (node.left != null) {
            nodeQ.offer(node.left);
            sums.put(node.left, sums.get(node) + node.left.data);
        }
        if (node.right != null) {
            nodeQ.offer(node.right);
            sums.put(node.right, sums.get(node) + node.right.data);
        }
    }
    return sums;
}
```

> 用队列来实现广度优先遍历，用哈希表来存储每个节点的路径和。

- 递归求路径和

```java
public static List<Integer> collectSums(Node root) {
    var res = new ArrayList<Integer>();
    if (root == null) return res;//如果为空 也要返回一个空的list
    res.addAll(collectSums(root.left));
    res.addAll(collectSums(root.right));
    res.replaceAll(x -> x + root.data);//这里是把每个节点的值都 加上当前节点的值
    if (root.right == null && root.left == null) res.add(root.data);
    return res;
}
```

> 用递归来实现深度优先遍历，用列表来存储每个节点的路径和。

### 回溯

- 简单理解

```java
public static void action(int start, int end, Stack<Integer> stack) {
    stack.push(start);
    System.out.println(stack.size());
    if (start < end) action(start + 1, end, stack);//相当于递归的push
    stack.pop();//相当于递归的pop
    System.out.println(stack.size());
}
public static void main(String[] args) {
    Stack<Integer> stack = new Stack<>();
    stack.push(1);
    System.out.println(stack.size());
    action(98, 100, stack);
    System.out.println(stack.size());
}
```

> 这就是一个简单的回溯，回溯的本质就是递归的 push 和 pop 。用 pop 来消除“递归的副作用”。

- 作者给出了一个迷宫的题目，data的值是21的约数的叶子结点就是迷宫的出口。

```java
public static void findPaths(Node node, List<Node> path, List<List<Node>> paths) {
    if (node == null) return;
    path.add(node); //把当前节点加入到路径中
    if (node.left == null && node.right == null && 21 % node.data == 0) paths.add(path);
    findPaths(node.left, new ArrayList<Node>(path), paths);
    findPaths(node.right, new ArrayList<Node>(path), paths);
}
```

> 其中的List < List < Node > > paths参数就是最终的结果集，List < Node > path参数就是当前的路径。
> 注：我没有判断node是否为空，因为我的例子都是平衡二叉树。

同理这个题目也可以改成使用栈来实现。

### 找零钱

这个例子引出了Dijkstra算法，这个算法是用来求最短路径的，这里的最短路径就是最少的硬币数。

- 常规动态规划

```java
public static ChangeRes change(int[] coins, int num) {
    int[] optimal = new int[num + 1];//先创建一个数组 用来存储全部的最优解
    int[] useCoin = new int[num + 1];//用来存储使用的硬币
    ArrayList<Integer> res = new ArrayList<>();
    Arrays.fill(optimal, -1);//先全部填充为-1 代表没有解
    for (int coin : coins) {
        optimal[coin] = 1;//初始化 我们兑现2，3，5这样的（coins的值）时候最优解一定是1
        useCoin[coin] = coin;
    }
    for (int i = 1; i <= num; i++) { //要从1开始 到num
        for (int coin : coins) {
            int uesCoin = i - coin;//需要的coin
            if (0 > uesCoin || optimal[uesCoin] == -1) continue;
            //要替换的值一定要小于这个值 不然就不替换了 因为要替换为需要的硬币数量 +1 所以就要小于
            if (optimal[i] == -1 || optimal[i] > optimal[uesCoin] + 1) {
                optimal[i] = optimal[uesCoin] + 1;
                useCoin[i] = coin;
            }
        }
    }
    int i = num;
    while (i > 0) {
        int useCoinNum = useCoin[i];
        res.add(useCoinNum);
        i -= useCoinNum;
    }
    return new ChangeRes(res, optimal[num]);
}
```

- 递归版本

```java
public static int change(int[] coins, int num) {
    if (num < 0) return -1;
    if (cache.containsKey(num)) return (int) cache.get(num);
    int optimal = -1;
    for (int coin : coins) {
        if (num == coin) return 1;//如果是硬币的面值 则返回1
        int subOptimal = change(coins, num - coin);
        if (subOptimal == -1) continue;//如果是无效的值就continue 直接去试下一个硬币
        //只给赋值正确的值
        if (optimal == -1 || optimal > subOptimal + 1) {
            optimal = subOptimal + 1;
        }
    }
    cache.put(num, optimal);
    return optimal;
}
```

- Dijkstra算法

```java
public static int change2(int[] coins, int n) {
    int[] optimal = new int[n + 1];
    Arrays.fill(optimal, -1);
    optimal[0] = 0;
    LinkedList<Integer> q = new LinkedList<>();
    q.offer(0);
    while (!q.isEmpty()) {
        int to = q.poll();
        for (int coin : coins) {
            int newTo = to + coin;
            if (newTo > n) continue;
            q.offer(newTo);
            if (optimal[newTo] == -1 || optimal[newTo] > optimal[to] + 1) {
                optimal[newTo] = optimal[to] + 1;
            }
        }
    }
    return optimal[n];
}
```

### 切年糕问题

- 常规

```java
public static int cut2(int[] prices, int n) {
    int[] optimal = new int[n + 1];
    for (int i = 1; i <= n; i++) {//直接遍历每一个价格
        if (i < prices.length) optimal[i] = prices[i];//如果价格是有一斤的几个 那么先默认给上一斤的价格
        for (int j = 1; j < i; j++) {
            //依次遍历每一个可能的切法 比如 6 就要 依次遍历 1-5 2-4 3-3
            int sum = optimal[j] + optimal[i - j];
            //如果 optimal[i] 是小于 optimal[j] + optimal[i - j] 那么就更新
            if (sum > optimal[i]) optimal[i] = sum;
        }
    }
    return optimal[n];
}
```

> 大概思想就是先把每一斤的价格都存储起来，然后依次遍历每一种切法，如果切法的价格大于当前的价格，就更新当前的价格。

- 递归

```java
public static int cut(int[] prices, int w, int[] cache) {
    if (w < 0) return 0;
    if (cache[w] != -1) return cache[w]; //如果缓存中有了 就直接返回
    int max = w < prices.length ? prices[w] : 0; //如果有一斤的价格 就先默认为一斤的价格
    for (int dw = 1; dw < w; dw++) {
        int sub = cut(prices, dw, cache) + cut(prices, w - dw, cache);//还是一次求一遍
        if (sub > max) max = sub;
    }
    return max;
}
```

### 接订单和选课问题

> 这个问题我至少卡了十个小时，我一直在各种研究，鉴于我表达能力低下(对于复杂问题我只能说废话)，直接贴一些代码

```java
public static int choose4(Invitation[] invitations, int limit) {
    // hour >= invitations[invIndex].hour
    // 一定要理解这个 这个的意思实际就是
    // 检查当前考虑的时间(for循环到了的值)是否大于或等于当前邀请所需要的时间 也就代表这个是可以试一试的
    // 如果当前考虑的时间 小于当前邀请所需要的时间 那么就不可能选择这个邀请
    int[][] optimal = new int[invitations.length][limit + 1];
    //row是inv column是hour
    for (int invIndex = 0; invIndex < invitations.length; invIndex++) {
        for (int hour = 0; hour <= limit; hour++) {
            if (invIndex == 0) {
                if (hour >= invitations[invIndex].hour) optimal[invIndex][hour] = invitations[invIndex].reward;
            } else {
                if (hour >= invitations[invIndex].hour) {
                    //optimal[invIndex - 1][hour] 就是上一个的最优解
                    //optimal[invIndex - 1][hour - invitations[invIndex].hour] + invitations[invIndex].reward
                    //分开解释[hour - invitations[invIndex].hour] 这个是 去上一个最优解中的哪一个里面去获取
                    //invitations[invIndex].reward 这个是当前的邀请的reward
                    //其实就是先获取上一个最优解中的减去当前邀请所需要的时间的那个最优解 然后 加上当前的邀请的reward
                    optimal[invIndex][hour] = Math.max(
                            optimal[invIndex - 1][hour],
                            optimal[invIndex - 1][hour - invitations[invIndex].hour] + invitations[invIndex].reward
                    );
                } else {
                    //如果当前考虑的时间 小于当前邀请所需要的时间 那么就不可能选择这个邀请
                    //所以直接用上一个的最优解就行了
                    optimal[invIndex][hour] = optimal[invIndex - 1][hour];
                }
            }
        }
    }
    return optimal[invitations.length - 1][limit];
}
```

```java
public static Map<Integer, Integer> choose5(Invitation[] invs, int i, int limit) {
    if (i >= invs.length) return new HashMap<>();//如果已经没有邀请了 那么就返回一个空的map
    Map<Integer, Integer> subOptimal = choose5(invs, i + 1, limit);//先获取下一个的最优解
    Map<Integer, Integer> optimal = new HashMap<>(subOptimal);//浅拷贝一份
    if (optimal.isEmpty()) {
        //如果是第一次 并且当前的邀请的时间小于等于limit 那么就放进去 总是就是初始化第一个
        if (invs[i].hour <= limit) optimal.put(invs[i].hour, invs[i].reward);
    } else {
        for (Integer h : subOptimal.keySet()) {
            int newHour = h + invs[i].hour;
            int newReward = subOptimal.get(h) + invs[i].reward;
            //如果新的时间小于等于limit 并且新的reward大于之前的reward 那么就放进去
            if (newHour <= limit && (!optimal.containsKey(newHour) || optimal.get(newHour) < newReward))
                optimal.put(newHour, newReward);
        }
        //如果没有这个hour 或者这个hour的reward更大 那么就放进去
        if (!optimal.containsKey(invs[i].hour)
                || invs[i].reward > optimal.get((invs[i].hour)))
            optimal.put(invs[i].hour, invs[i].reward);
    }
    return optimal;
}
```

```java
public static int attend1(int[][] lectures) {
    HashMap<Integer, Integer> optimal = new HashMap<>();
    for (int[] lect : lectures) {
        int start = lect[0];
        int end = lect[0] + lect[1] - 1;
        int value = lect[2];
        if (optimal.isEmpty())
            optimal.put(end, value);
        else {
            HashMap<Integer, Integer> temp = new HashMap<>(optimal);
            //e is end
            for (Integer e : optimal.keySet()) {
                if (e >= start) continue;
                //也就是可以上当前的课
                int newValue = optimal.get(e) + value;//新的价值
                //要注意要put的不是newEnd 而是end
                if (!temp.containsKey(end) || temp.get(end) < newValue)
                    temp.put(end, newValue);
            }
            if (!temp.containsKey(end) || temp.get(end) < value)
                temp.put(end, value);
            optimal = temp;
        }
    }
    return optimal.values().stream().max(Integer::compareTo).orElse(-1);
}
```
