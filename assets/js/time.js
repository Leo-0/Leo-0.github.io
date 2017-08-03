;
(function() {
	function Time() {
		if (!(this instanceof Time)) {
			return new Time();
		}
	}
	Time.prototype = {
		tInit: function(option) {
			var _default = {
				id: '#time',
				hello: [{
					when: '08:00',
					say: '美好的一天，早上好'
				}, {
					when: '12:00',
					say: '该吃午饭啦'
				}, {
					when: '13:00',
					say: '中午不睡，下午崩溃'
				}, {
					when: '22:00',
					say: '不要熬夜哦，该睡觉了'
				}],
				callback: null
			};
			var _option = option;
			this.id = _option.id || _default.id;
			this.hello = _option.hello || _default.hello;
			this.ws = [];
			for (var ws in this.hello) {
				this.ws[this.hello[ws].when] = {
					'say': this.hello[ws].say,
					'said': false
				}
			}
			this.callback = _option.callback || _default.callback;
			this.ele = document.querySelector(this.id);
			this.counter = null;
			this.tSet();
			this.tStart();
			return this;
		},
		tSet: function() {
			var tWrap = document.createElement('div');
			tWrap.className = 'tWrapper';
			this.ele.appendChild(tWrap);
			var bg = document.createElement('div');
			bg.className = 'tBg';
			for (var i = 0; i < 5; i++) {
				var sp = document.createElement('span');
				sp.innerHTML = '88';
				if (i % 2 !== 0) {
					sp.innerHTML = ':';
				}
				bg.appendChild(sp);
			}
			tWrap.appendChild(bg);
			var fg = document.createElement('div');
			fg.className = 'tFg';
			tWrap.appendChild(fg);
			var d = new Date();
			var h = document.createElement('span');
			h.className = 'tHour';
			h.innerHTML = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
			fg.appendChild(h);
			var m = document.createElement('span');
			m.className = 'tMinute';
			m.innerHTML = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
			fg.appendChild(m);
			var s = document.createElement('span');
			s.className = 'tSecond';
			s.innerHTML = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
			fg.appendChild(s);
			var ws = document.createElement('div');
			ws.className = 'whensay';
			tWrap.appendChild(ws);
		},
		tStop: function() {
			this.counter = clearInterval(this.counter);
		},
		tStart: function(callback) {
			var that = this;
			this.counter = setInterval(function(callback) {
				var date = new Date();
				var h = that.ele.querySelector('.tHour');
				var m = that.ele.querySelector('.tMinute');
				var s = that.ele.querySelector('.tSecond');
				var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				h.innerHTML = hh;
				m.innerHTML = mm;
				s.innerHTML = ss;
				if (that.ws[hh + ':' + mm] && !that.ws[hh + ':' + mm].said) {
					var wsn = that.ele.querySelector('.whensay');
					addClass(wsn, 'show');
					wsn.innerHTML = that.ws[hh + ':' + mm].say;
					that.ws[hh + ':' + mm].said = true;
					that.sJudge(wsn);
				}
				(that.callback && typeof that.callback === 'function') && that.callback(); //检测函数存在且是一个函数然后再调用
			}, 1000);
		},
		sJudge: function(obj) {
			var obj1 = obj.parentNode.parentNode;
			var ow1 = obj1.offsetWidth;
			var oh1 = obj1.offsetHeight;
			var ow2 = obj.offsetWidth;
			var oh2 = obj.offsetHeight;
			var cn = obj1.className;
			if (cn.indexOf('down') !== -1) {
				addClass(obj, 'down');
				obj.style.bottom = -(oh2 + 10) + 'px';
				obj.style.left = (ow1 - ow2) / 2 + 'px';
			} else if (cn.indexOf('left') !== -1) {
				addClass(obj, 'left');
				obj.style.top = (oh1 - oh2) / 2 + 'px';
				obj.style.left = -(ow2 + 10) + 'px';
			} else if (cn.indexOf('right') !== -1) {
				addClass(obj, 'right');
				obj.style.top = (oh1 - oh2) / 2 + 'px';
				obj.style.right = -(ow2 + 10) + 'px';
			} else {
				addClass(obj, 'up');
				obj.style.top = -(oh2 + 10) + 'px';
				obj.style.left = (ow1 - ow2) / 2 + 'px';
			}
			hide(obj);
		}
	};
	var hide = (function() {
		var timer;
		var i = 0;
		function change(obj) {
			i++;
			if (i === 10) {
				removeClass(obj, 'show');
				clearTimeout(timer);
				return false;
			}
			timer = setTimeout(function() {
				change(obj);
			}, 1000);
		}
		return change;
	})();

	function removeClass(obj, cn) {
		var patt = new RegExp('\\s' + cn, 'g');
		obj.className = obj.className.replace(patt, '');
	}

	function addClass(obj, cn) {
		if (obj.className.indexOf(cn) < 0) {
			obj.className = obj.className + ' ' + cn;
		}
	}

	function toggleClass(obj, cn) {
		if (obj.className.indexOf(cn) !== -1) {
			removeClass(obj, cn);
		} else {
			addClass(obj, cn);
		}
	}
	window.Time = function(option) {
		var aOption = Array.prototype.slice.call(arguments);
		for (var i = 0; i < aOption.length; i++) {
			var time = new Time();
			time.tInit(aOption[i]);
		}
	}
})(window);