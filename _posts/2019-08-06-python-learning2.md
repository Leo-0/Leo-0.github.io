---
layout: post
title:  pymysql/pymssql查询sql结果后输出表的字段名
date:   2019-08-06 00:16 +0800
tags:   python
---
`cursor.description`方法存有每个字段的字段名,字段类型等属性.
{% highlight python linenos %}
# 查询sql结果后输出表的字段名
for cd in cursor.description:
    print(cd[0],end=" ") # print()默认打印一行,结尾换行,加上end=" ",可使末尾不换行,结尾接空格
{% endhighlight %}