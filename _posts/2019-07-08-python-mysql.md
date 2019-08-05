---
layout: post
title:  python操作MySQL
date:   2019-07-08 22:21 +0800
tags:   python
---
Python操作MySQL,需要用到`pymysql`

`pymysql`的安装:
{% highlight python %}
python3 -m pip install PyMySQL
{% endhighlight %}

## 创建数据库
{% highlight python linenos %}
import pymysql

# 打开数据库连接
db = pymysql.connect(host='localhost', port=port, user=user, password=password, charset='utf8')
# 使用 cursor() 方法创建一个游标对象
cursor = db.cursor()
# 使用 execute() 方法执行sql，如果数据库存在则删除
cursor.execute("drop database if exists apidatatime")
# 创建数据库
cursor.execute("create database dbname")
# 切换使用创建的库
cursor.execute("use dbname")
# 关闭游标连接
cursor.close()
# 关闭数据库连接
db.close()
{% endhighlight %}

## 创建表
{% highlight python linenos %}
import pymysql

# 打开数据库连接
db = pymysql.connect(host=localhost, port=port, user=user, password=password, database=dbname charset='utf8')
# 创建一个游标对象
cursor = db.cursor()
# 创建表的sql语句
sql = """CREATE TABLE IF NOT EXISTS tablename (
              col1 INT,
              col2 VARCHAR (200),
              col3 VARCHAR (200),
              col4 datetime
            )ENGINE=InnoDB DEFAULT CHARSET=utf8"""
# 如果表存在则删除
cursor.execute("drop table if exists tablename")
# 执行sql
cursor.execute(sql)
# 关闭游标连接
cursor.close()
# 关闭数据库连接
db.close()
{% endhighlight %}

## 插入数据
{% highlight python linenos %}
import pymysql

# 打开数据库连接
db = pymysql.connect(host=localhost, port=port, user=user, password=password, database=dbname charset='utf8')
# 创建一个游标对象
cursor = db.cursor()
try:
    # 执行sql语句
    cursor.execute("insert into apitime(col1,col2,col3,col4) values(%s,%s,%s,%s)" % (123, 'abc', 'cbd', '2019-07-08 22:31'))
    # executemany方法可以批量插入cursor.executemany("insert into apitime(col1,col2,col3,col4) values(%s,%s,%s,%s)",[(123, 'abc', 'cbd', '2019-07-08 22:31:12'),(234,'bcd','abc','2019-07-09 10:32:30')])
    # 提交到数据库执行,需要commit()才会真正插入数据
    db.commit()
except Exception as e:
    # 如果发生错误则回滚
    db.rollback()
    # 打印异常信息
    print(e)
# 关闭游标连接
cursor.close()
# 关闭数据库连接
db.close()
{% endhighlight %}

## 查询数据
<blockquote>fetchone(): 获取下一个查询结果集。结果集是一个对象。取单条数据。</blockquote>
<blockquote>fetchall(): 接收全部的返回结果行。</blockquote>
<blockquote>fetchmany(n): 取n条数据。</blockquote>
<blockquote>rowcount: 只读属性，返回执行execute()方法后影响的行数。</blockquote>

{% highlight python linenos %}
import pymysql

# 打开数据库连接
db = pymysql.connect(host=localhost, port=port, user=user, password=password, database=dbname charset='utf8')
# 创建一个游标对象
cursor = db.cursor()
# 查询语句
sql = "SELECT * FROM tablename WHERE columnname = %s" % ('abc')
try:
    # 执行SQL语句
    cursor.execute(sql)
    # 获取所有记录列表
    results = cursor.fetchall()
    for row in results:
        col1 = row[0]
        col2 = row[1]
        col3 = row[2]
        col4 = row[3]
        # 打印结果
        print(col1,col2,col3,col4)
except:
    print("Error: unable to fetch data")
# 关闭游标连接
cursor.close()
# 关闭数据库连接
db.close()
{% endhighlight %}

## 更新数据
{% highlight python linenos %}
import pymysql

# 打开数据库连接
db = pymysql.connect(host=localhost, port=port, user=user, password=password, database=dbname charset='utf8')
# 创建一个游标对象
cursor = db.cursor()
# 更新语句
sql = "UPDATE tablename SET col1 = something WHERE col2 = '%s'" % ('abc')
try:
   # 执行SQL语句
   cursor.execute(sql)
   # 提交到数据库执行
   db.commit()
except:
   # 发生错误时回滚
   db.rollback()
# 关闭游标连接
cursor.close()
# 关闭数据库连接
db.close()
{% endhighlight %}

## 删除数据
{% highlight python linenos %}
import pymysql

# 打开数据库连接
db = pymysql.connect(host=localhost, port=port, user=user, password=password, database=dbname charset='utf8')
# 创建一个游标对象
cursor = db.cursor()
# 删除语句
sql = "DELETE FROM tablename WHERE col1 = %d" % (123)
try:
   # 执行SQL语句
   cursor.execute(sql)
   # 提交到数据库执行
   db.commit()
except:
   # 发生错误时回滚
   db.rollback()
# 关闭游标连接
cursor.close()
# 关闭连接
db.close()
{% endhighlight %}