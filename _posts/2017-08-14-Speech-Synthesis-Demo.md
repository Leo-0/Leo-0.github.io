---
layout: post
title:  一个Speech Synthesis API的demo
date:  2017-08-14
tags:  JavaScript
---
记得很久前看见张鑫旭的[HTML5语音合成Speech Synthesis API简介](http://www.zhangxinxu.com/wordpress/2017/01/html5-speech-recognition-synthesis-api/)一文，今天搜索着搜索着又看到，突然想：在不同的值下会有什么效果？于是想写一个demo。
## 关于Speech Synthesis API
Speech Synthesis还没得到普遍的支持（戳[这里](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis#Browser_compatibility)查看浏览器的兼容性），一些具体事项可以在[MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)查看。

`SpeechSynthesis`对像有以下方法：
- cancel(): 从话语队列中移除所有话语。
- getVoices(): 返回表示当前设备上所有可用语音的`SpeechSynthesisVoice`对象列表。
- pause(): 将`SpeechSynthesis`对象置于暂停状态。
- resume(): 将`SpeechSynthesis`对象置于非暂停状态：如果对象已暂停，则恢复该状态。
- speak(): 添加utterance到话语队列。

想要将文本转化成语音，需要用到`speak()`方法，该方法接受`SpeechSynthesisUtterance`的参数。

`SpeechSynthesisUtterance`的实例对象属性有：
- lang: 语言，有"zh-CN"、"en-US"等。
- pitch: 发音的音高。
- rate: 发音速率。
- text: 将被合成的文本。
- voice: 说话时的声音。
- volume: 语音的音量。

在测试中我主要通过改变pitch,rate来调整发音，voice和lang则只有Microsoft Huihui Desktop - Chinese (Simplified) (zh-CN) 和Microsoft Zira Desktop - English (United States) (en-US)能起到作用，Microsoft Zira Desktop - English (United States) (en-US)只能说英文的文本。用的是Chrome的最新版。

在使用`SpeechSynthesis`对象的`getVoices()`方法获取声音时，因为该方法的获取是异步的，所以需要添加一个定时器，用一个`setTimeout`来搞定，才能准确获得voices。

js代码如下：
{% highlight javascript linenos %}
var synth = window.speechSynthesis;
var voiceSelect = document.querySelector('select');
var voices = [];
var timer;

function populateVoiceList() {
	voices = synth.getVoices();
	var len = voices.length;
	for (i = 0; i < len; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
		if (voices[i].default) {
			option.textContent += ' -- default';
		}
		option.setAttribute('data-lang', voices[i].lang);
		option.setAttribute('data-name', voices[i].name);
		voiceSelect.appendChild(option);
	}
	if (timer && len > 0) {
		clearTimeout(timer);
		return false;
	}
	timer = setTimeout('populateVoiceList()', 20);
}
populateVoiceList();
var btn = document.getElementById('speak');
btn.onclick = function(evt) {
	var e = evt || event;
	e.preventDefault();
	synth.cancel();
	var txt = document.querySelector('.txt');
	var utterThis = new SpeechSynthesisUtterance(txt.value);
	var vol = document.querySelector('.vol');
	var rate = document.querySelector('.rate');
	var pitch = document.querySelector('.pitch');
	var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
	for (i = 0; i < voices.length; i++) {
		if (voices[i].name === selectedOption) {
			utterThis.voice = voices[i];
		}
	}
	utterThis.volume = vol.value;
	utterThis.rate = rate.value;
	utterThis.pitch = pitch.value;
	synth.speak(utterThis);
}
{% endhighlight %}
可通过此查看[demo](http://htmlpreview.github.io/?https://github.com/Leo-0/SpeechSynthesisDemo/blob/master/demo/index.html)。
## 结语
无聊时就得做些事啊。