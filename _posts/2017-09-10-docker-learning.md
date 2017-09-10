---
layout: post
title:  解决使用docker时permission denied的方案
date:   2017-09-10
tags:   docker
---
最近在学docker，因为安装docker时使用的是sudo来安装的，当以普通用户身份使用docker的命令时会遇到以下问题：
{% highlight nolang %}
dial unix /var/run/docker.sock: connect: permission denied
{% endhighlight %}
通过网上搜索，主要是将当前用户添加到docker group中，这里记录一下解决方案备用。
解决方案如下：

1.添加docker group（如果已经有该group则跳过该步骤）
{% highlight nolang %}
sudo groupadd docker
{% endhighlight %}
2.将用户加入该group中
{% highlight nolang %}
sudo gpasswd -a ${USER} docker
{% endhighlight %}
3.重启docker服务
{% highlight nolang %}
sudo service docker restart
{% endhighlight %}
4.切换当前会话到新group
{% highlight nolang %}
newgrp - docker
{% endhighlight %}