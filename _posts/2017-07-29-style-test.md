---
layout: post
title:  style test
date:   2017-07-29
tags:   test
---
Aha,the test post!😀

# heading1
在一个崇高的目标支持下，不停地工作，即使慢，也一定会获得成功。—— 爱因斯坦

## heading2
同样大小~

# 图片
![boy.jpg](/images/fight.gif)
一行字
<img src="https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0A/07/ChMkJ1waFS-IFKycAAD4vnBJX50AAt4CwBzfU4AAPjW497.jpg"/>

### highlight:
{% highlight python linenos %}
import urllib
import json

while True:
    address = raw_input('Enter location: ')
    if(len(address)<1):
        break
    print 'Retrieving', address
    url = urllib.urlopen(address)
    data = url.read()
    info = json.loads(data)
    #print type(info)
    #print dir(info)
    print 'Retrieved',len(data),'characters'
    print 'Count',len(info['comments'])
    sum = 0
    for count in info['comments']:
        sum = sum+int(count['count'])
    print 'Sum',sum
{% endhighlight %}

### 表格

| 标题1 | 标题2 | 标题3 |
|----|----|----|
|row1,col1|row1,col2|row1,col3|
|row2,col1|row2,col2|row2,col3|
|row3,col1|row3,col2|row3,col3|
|row4,col1|row4,col2|row4,col3|

### 列表

- 123
- abc

1. qwe
2. asd

### blockquote

> 在一个崇高的目标支持下，不停地工作，即使慢，也一定会获得成功。—— 爱因斯坦
> 在一个崇高的目标支持下，不停地工作，即使慢，也一定会获得成功。—— 爱因斯坦

<blockquote>在一个崇高的目标支持下，不停地工作，即使慢，也一定会获得成功。—— 爱因斯坦</blockquote>
<blockquote>在一个崇高的目标支持下，不停地工作，即使慢，也一定会获得成功。—— 爱因斯坦</blockquote>