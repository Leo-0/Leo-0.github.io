---
layout: post
title:  python操作SQL Server
date:   2019-07-08 22:30 +0800
tags:   python
---
Python操作SQL server,需要用到`pymssql`或者`pyodbc`

`pymssql`的安装:
{% highlight python %}
python3 -m pip install pymssql
{% endhighlight %}
`pyodbc`的安装:
{% highlight python %}
python3 -m pip install pyodbc
{% endhighlight %}

## pymssql连接数据库
{% highlight python linenos %}
import pymssql
serverName = '127.0.0.1'
userName = 'admin'
pwd = 'admin'
db = 'tempdb' # 指定默认数据库
# 打开数据库连接
conn = pymssql.connect(serverName, userName, pwd, db)  # => conn = pymssql.connect(server=serverName, user=userName, password=pwd, database=db)  可加上charset='utf8'
# 获取cursor
cursor = conn.cursor()
{% endhighlight %}

## pyodbc连接数据库
{% highlight python linenos %}
import pyodbc
driverClient = 'SQL Server Native Client 11.0' # sql server驱动
serverName = '127.0.0.1'
userName = 'admin'
pwd = 'admin'
db = 'tempdb' # 指定默认数据库
# 打开数据库连接
conn = pyodbc.connect(driver=driverClient, server=serverName, user=userName, password=pwd, database=db) 
# 获取cursor
cursor = conn.cursor()
{% endhighlight %}

## 执行sql语句
sql语句的执行需使用execute方法,大致就是相当于写好sql语句,然后调用execute系列的方法来执行:
### 查询并获取结果
{% highlight python linenos %}
# 连接数据库并获取游标cursor
...
# 查询
cursor.execute('select top 1 * from tempdb')
# pymssql参数查询
cursor.execute('select * from tempdb where col = %s','name')
cursor.execute('select * from tempdb where col1 = %s and col2 = %s',['name1','name2']) # 参数序列
# pyodbc的传参使用问号传递
cursor.execute('select * from tempdb where col = ?','name')
cursor.execute('select * from tempdb where col1 = ? and col2 = ?',['name1','name2']) # 参数序列
# 获取一行
row = cursor.fetchone()
# 获取结果
print(row['name']) # pymssql
print(row[0]) # pyodbc
# print(row.name)
# 获取全部行
rows = cursor.fetchall()
for r in rows:
    dosomething()
# 也可使用cursor本身:
for row in cursor:
    dosomething()
{% endhighlight %}

### 创建表
{% highlight python linenos %}
cursor.execute("""
    IF OBJECT_ID(N'tableName', 'U') IS NOT NULL
    DROP TABLE tableName
    CREATE TABLE tableName (
        id INT NOT NULL,
        name VARCHAR(100),
        PRIMARY KEY(id)
    )
""")
{% endhighlight %}

### 数据插入,修改和删除
{% highlight python linenos %}
# 插入一条数据
cursor.execute("insert into table(id, name) values (%d, %s)" , (12,'abc'))
conn.commit() # 增删改都需要commit来提交才会执行
# 插入多条数据
cursor.executemany("insert into table(id, name) values (%d, %s)" ,[(12,'abc'),(13,'bcd')])
conn.commit()
# 修改
cursor.execute("update table set name = %s where id = %d " ,('abc',12))
conn.commit()
# 删除
cursor.execute("delete from table where id = %d " ,12)
conn.commit()
# 如果出现意外可以使用rollback()回滚到之前的状态
try:
    cursor.execute(sql)
    conn.commit()
except Exception as e:
    print(e)
    conn.rollback()
{% endhighlight %}

## 关闭数据库连接
操作完成之后需记得关闭连接来释放资源:
{% highlight python linenos %}
conn.close()
{% endhighlight %}
