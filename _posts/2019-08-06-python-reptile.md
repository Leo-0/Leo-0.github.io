---
layout: post
title:  python简单爬虫程序爬取图片
date:   2019-08-06 01:25 +0800
tags:   python
---
一个简单的Python爬虫程序来爬取网站图片
{% highlight python linenos %}
import urllib.request
import re
import os
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0'}
req = urllib.request.Request(url='https://www.lifeofpix.com/', headers=headers) # 需要加上User-Agent
htmlcode = urllib.request.urlopen(req).read() # 获取网页代码
# page = urllib.request.urlopen('https://www.lifeofpix.com/')
# htmlcode = page.read()
reg = r'<img.*?src="(.*?)".*?\/?>'
reg_com = re.compile(reg, re.IGNORECASE)
imglist = reg_com.findall(str(htmlcode, encoding="utf-8"))
pageFile = open('pageCode.txt', 'w')
i = 0
reg2 = r'//.*' # 用于没有加http或https的网址
reg3 = r'.*\.js$' # 获取结果中可能有js文件的地址,用于跳过该地址
fp = '抓取图片'+str(int(time.time()))
folder = os.path.exists(fp)
if not folder:
    os.makedirs(fp)
    print('新建文件夹成功')
else:
    print('文件夹已经存在')
imglist = {}.fromkeys(imglist).keys() # 去除重复数据
opener = urllib.request.build_opener()
opener.addheaders = [
    ('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0')]
urllib.request.install_opener(opener)
for img in imglist:
    if img != '':
        if re.match(reg2, img):
            img = 'https:' + img
        if re.match(reg3, img):
            print(img)
        else:
            pageFile.write(img+'\n')  # 写入抓取的图片地址
            print("抓取图片%s" % img)
            urllib.request.urlretrieve(img, '%s/%s.jpg' % (fp, i)) # 下载保存图片
            i += 1
print('图片抓取完毕')
pageFile.close()
{% endhighlight %}
# 为何要加上User-Agent:
一开始是直接使用
{% highlight python linenos %}
page = urllib.request.urlopen('https://www.lifeofpix.com/')
htmlcode = page.read()
{% endhighlight %}
在执行的过程中出现过403 forbidden的情况,网上搜索后给出的原因:用 urllib.request.urlopen 方式打开一个URL，服务器端只会收到一个单纯的对于该页面访问的请求，但是服务器并不知道发送这个请求使用的浏览器，操作系统，硬件平台等信息，而缺失这些信息的请求往往都是非正常的访问.

有些网站为了防止这种非正常的访问，会验证请求信息中的UserAgent，如果UserAgent存在异常或者是不存在,那么这次请求将会被拒绝.
添加UA模拟浏览器访问,隐藏用户身份.