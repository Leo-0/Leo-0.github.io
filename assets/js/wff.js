;
(function() {
	function Wff() {
		if (!(this instanceof Wff)) {
			return new Wff();
		}
	}

	function orderedPos(arr) { // 获取排序后每个值的原来位置
		var len = arr.length;
		var a = [];
		var t = [];
		for (var m = 0; m < len; m++) {
			a[m] = m;
			t[m] = arr[m];
		}
		var temp;
		for (var i = 0; i < len; i++) {
			var flag = 0;
			for (var j = 0; j < len - 1 - i; j++) {
				if (t[j] > t[j + 1]) {
					flag = 1;
					temp = t[j];
					t[j] = t[j + 1];
					t[j + 1] = temp;
					temp = a[j];
					a[j] = a[j + 1];
					a[j + 1] = temp;
				}
			}
			if (flag === 0) {
				break;
			}
		}
		return a;
	}
	Wff.prototype = {
		init: function(option) {
			var _default = {
				pSelector: '',
				itemSelector: '',
			};
			var opt = option;
			this.pSelector = opt.pSelector || _default.pSelector;
			this.itemSelector = opt.itemSelector || _default.itemSelector;
			this.container = document.querySelector(this.pSelector);
			if (this.container) {
				this.container.style.position = 'relative';
				this.setPos(this.container, this.itemSelector);
				var that = this;
				this.addEvent(window, 'resize', function() {
					that.setPos(that.container, that.itemSelector);
				});
				this.addEvent(window, 'load', function() {
					that.setPos(that.container, that.itemSelector);
				});
			}
		},
		setPos: function(ele, selector) {
			var sel = ele.querySelector(selector);
			var sels = ele.querySelectorAll(selector);
			var pw = ele.offsetWidth;
			var w = sel.offsetWidth;
			var col = Math.round(pw / w);
			var pos_arr = new Array(col);
			var a = orderedPos(pos_arr);
			sels.forEach(function(s, i) {
				var h = s.offsetHeight;
				s.style.position = 'absolute';
				if (Math.floor(i / col) === 0) {
					s.style.left = i % col * w + 'px';
					s.style.top = 0 + 'px';
				} else {
					s.style.left = a[0] * w + 'px';
					s.style.top = pos_arr[a[0]] + 'px';
				}
				if (Math.floor(i / col) === 0) { // 第一行
					pos_arr[i % col] = h + s.offsetTop;
				} else {
					pos_arr[a[0]] = h + s.offsetTop; // 其他行总是从距容器最短的位置插入
				}
				a = orderedPos(pos_arr); // 每插入一次重新获取最小位置
			});
			var ha = pos_arr.sort(function(a, b) {
				return b - a;
			});
			this.container.style.height = ha[0] + 'px';
		},
		addEvent: function(obj, evt, fn) {
			if (document.addEventListener) {
				obj.addEventListener(evt, fn, false);
			} else if (document.attachEvent) {
				obj.attachEvent('on' + evt, fn);
			}
		}
	};
	window.Wff = function(option) {
		var aOption = Array.prototype.slice.call(arguments);
		for (var i = 0; i < aOption.length; i++) {
			var wff = new Wff();
			wff.init(aOption[i]);
		}
	}
})(window);