;
(function() {
	function Wff() {
		if (!(this instanceof Wff)) {
			return new Wff();
		}
	}

	function getMinHeightPos(arr) { // 获取最低高度的索引
		var min = Math.min.apply(null, arr);
		for (var key in arr) {
			if (arr[key] === min) {
				return key;
			}
		}
	}
	Wff.prototype = {
		init: function(option) {
			var _default = {
				pSelector: '',
				itemSelector: '',
				all: false // all for all the pSelector
			};
			var opt = option;
			this.pSelector = opt.pSelector || _default.pSelector;
			this.itemSelector = opt.itemSelector || _default.itemSelector;
			if (opt.all) {
				this.all = opt.all;
			} else {
				this.all = _default.all;
			}
			var that = this;
			if (!this.all) {
				this.container = document.querySelector(this.pSelector);
				if (this.container) {
					this.container.style.position = 'relative';
					this.setPos(this.container, this.itemSelector);
					this.addEvent(window, 'resize', function() {
						that.setPos(that.container, that.itemSelector);
					});
					this.addEvent(window, 'load', function() {
						that.setPos(that.container, that.itemSelector);
					});
				}
			} else {
				this.container = document.querySelectorAll(this.pSelector);
				this.container.forEach(function(con) {
					con.style.position = 'relative';
					that.setPos(con, that.itemSelector);
					that.addEvent(window, 'resize', function() {
						that.setPos(con, that.itemSelector);
					});
					that.addEvent(window, 'load', function() {
						that.setPos(con, that.itemSelector);
					});
				});
			}
		},
		setPos: function(ele, selector) {
			var sel = ele.querySelector(selector);
			if (!sel) {
				return false;
			}
			var sels = ele.querySelectorAll(selector);
			var pw = ele.offsetWidth;
			var w = sel.offsetWidth;
			var col = Math.round(pw / w);
			var pos_arr = new Array(col);
			var a = getMinHeightPos(pos_arr);
			sels.forEach(function(s, i) {
				var h = s.offsetHeight;
				s.style.position = 'absolute';
				if (Math.floor(i / col) === 0) { // 第一行
					s.style.left = i % col * w + 'px';
					s.style.top = 0 + 'px';
					pos_arr[i % col] = h + s.offsetTop;
				} else { // 其他行总是从距容器最短的位置插入
					s.style.left = a * w + 'px';
					s.style.top = pos_arr[a] + 'px';
					pos_arr[a] = h + s.offsetTop;
				}
				a = getMinHeightPos(pos_arr); // 每插入一次重新获取最小位置
			});
			var ha = pos_arr.sort(function(a, b) {
				return b - a;
			});
			ele.style.height = ha[0] + 'px';
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