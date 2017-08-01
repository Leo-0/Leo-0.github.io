;
(function() {
	function Calendar() {
		if (!(this instanceof Calendar)) {
			return new Calendar();
		}
	}
	Calendar.prototype = {
		_init: function(option) {
			var _default = {
				id: '',
				animated: false,
				speed: 50
			};
			var _option = option;
			this.id = _option.id || _default.id;
			this.animated = _option.animated || _default.animated;
			var s = _option.speed || _default.speed;
			this.speed = s > 90 ? 90 : s;
			this.counter = null;
			this.date = new Date();
			this.ele = document.querySelector(this.id);
			this.ele.innerHTML = '';
			this.calId = 'cal' + this.date.getTime();
			this.cal = document.createElement('div');
			this.cal.id = this.calId;
			this.cal.className = 'calendar';
			this.ele.appendChild(this.cal);
			this.hId = 'yearmonth' + this.date.getTime();
			this.yId = 'year' + this.date.getTime();
			this.mId = 'month' + this.date.getTime();
			this.wId = 'weekday' + this.date.getTime();
			this._renderHeader(this.date.getFullYear(), this.date.getMonth() + 1, this.hId, this.yId, this.mId, this.wId);
			this._renderPage(this.date.getFullYear(), this.date.getMonth() + 1);
			return this;
		},
		_isLeapYear: function(year) {
			var isLeapYear;
			isLeapYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? true : false;
			return isLeapYear;
		},
		_dayOfMonth: function(year, month) {
			var that = this;
			var amount;
			switch (month) {
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					amount = 31;
					break;
				case 2:
					amount = that._isLeapYear(year) ? 29 : 28;
					break;
				case 4:
				case 6:
				case 9:
				case 11:
					amount = 30;
					break;
				default:
					amount = 0;
					break;
			}
			return amount;
		},
		_getDay: function(y, m, d) {
			m = m < 3 ? m + 12 : m;
			var y = (m > 12) ? y - 1 : y;
			var k = y % 100; //世纪的年数
			var j = parseInt(y / 100); //世纪数
			//h: 0 星期六，1 星期日，2 星期一，3 星期二，4 星期三，5 星期四，6 星期五
			var h = (d + parseInt(26 * (m + 1) / 10) + k + parseInt(k / 4) + parseInt(j / 4) + 5 * j) % 7;
			//换成 0 星期日，1 星期一，2 星期二，3 星期三，4 星期四，5 星期五，6 星期六
			return h - 1 < 0 ? h + 6 : h - 1;
		},
		_renderHeader: function(y, m, hId, yId, mId, wId) {
			var that = this;
			var calHead = document.createElement('div');
			calHead.id = hId;
			calHead.className = 'calheader';
			this.cal.appendChild(calHead);
			var ym = document.createElement('div');
			ym.className = 'ym';
			calHead.appendChild(ym);
			var yPre = document.createElement('div');
			yPre.className = 'calbtn yearpre';
			ym.appendChild(yPre);
			var year = document.createElement('div');
			year.id = yId;
			year.className = 'year';
			year.innerHTML = y;
			ym.appendChild(year);
			var yNext = document.createElement('div');
			yNext.className = 'calbtn yearnext';
			ym.appendChild(yNext);
			var yt = document.createElement('span');
			yt.innerHTML = '年';
			ym.appendChild(yt);
			var mPre = document.createElement('div');
			mPre.className = 'calbtn monthpre';
			ym.appendChild(mPre);
			var month = document.createElement('div');
			month.id = mId;
			month.className = 'month';
			month.innerHTML = m;
			ym.appendChild(month);
			var mNext = document.createElement('div');
			mNext.className = 'calbtn monthnext';
			ym.appendChild(mNext);
			var mt = document.createElement('span');
			mt.innerHTML = '月';
			ym.appendChild(mt);
			var todayDot = document.createElement('div');
			todayDot.className = 'calbtn totoday';
			todayDot.setAttribute('title', '跳到今天');
			ym.appendChild(todayDot);
			var week = document.createElement('div');
			week.id = wId;
			week.className = 'week';
			calHead.appendChild(week);
			var wc = ['日', '一', '二', '三', '四', '五', '六'];
			for (var i = 0; i < 7; i++) {
				var w = document.createElement('span');
				w.setAttribute('class', 'weekday');
				if (i === 0 || i === 6) {
					w.className += ' weekend';
				}
				w.innerHTML = wc[i];
				week.appendChild(w);
			}
			var date = document.createElement('div');
			date.className = 'date';
			this.cal.appendChild(date);
			this._util._addEvent(this.cal, 'click', function(evt) {
				var e = evt || event;
				var tar = e.srcElement || e.target;
				if (!that.counter) {
					if (tar.className.indexOf('pre') !== -1) {
						var prefix = tar.className.indexOf('pre');
						var start = prefix - 5 < 0 ? 0 : prefix - 5;
						var name = tar.className.substring(start, prefix).replace(/\s/g, '');
						var pEle = that.cal.querySelector('.' + name);
						var v = parseInt(pEle.innerHTML) - 1;
						var val;
						if (name === 'month') {
							val = parseInt(that.cal.querySelector('.year').innerHTML);
							if (v < 1) {
								v = 12;
								val = val - 1;
							}
							that.cal.querySelector('.year').innerHTML = val;
						} else {
							v = v < 1 ? 1 : v;
						}
						pEle.innerHTML = v;
						var direction = 'leftToRight';
						that._util._addPage(that, direction);
					} else if (tar.className.indexOf('next') !== -1) {
						var prefix = tar.className.indexOf('next');
						var start = prefix - 5 < 0 ? 0 : prefix - 5;
						var name = tar.className.substring(start, prefix).replace(/\s/g, '');
						var nEle = that.cal.querySelector('.' + name);
						var v = parseInt(nEle.innerHTML) + 1;
						var val;
						if (name === 'month') {
							val = parseInt(that.cal.querySelector('.year').innerHTML);
							if (v > 12) {
								v = 1;
								val = val + 1;
							}
							that.cal.querySelector('.year').innerHTML = val;
						}
						nEle.innerHTML = v;
						var direction = 'rightToLeft';
						that._util._addPage(that, direction);
					} else if (tar.className.indexOf('totoday') !== -1) {
						var y = parseInt(that.cal.querySelector('.year').innerHTML);
						var d = parseInt(that.cal.querySelector('.month').innerHTML);
						that.date = new Date();
						that.cal.querySelector('.year').innerHTML = that.date.getFullYear();
						that.cal.querySelector('.month').innerHTML = that.date.getMonth() + 1;
						var direction;
						if (y < that.date.getFullYear()) {
							direction = 'rightToLeft';
						} else if (y > that.date.getFullYear()) {
							direction = 'leftToRight';
						} else {
							if (d < that.date.getMonth() + 1) {
								direction = 'rightToLeft';
							} else if (d > that.date.getMonth() + 1) {
								direction = 'leftToRight';
							}
						}
						that._util._addPage(that, direction);
					}
				}
			});
		},
		_renderPage: function(year, month, direction) {
			var date = this.cal.querySelector('.date');
			var days = document.createElement('div');
			days.className = 'days';
			if (this.animated && date.querySelector('.days')) {
				if (direction === 'leftToRight') {
					days.style.left = '-100%';
				} else if (direction === 'rightToLeft') {
					days.style.left = '100%';
				} else {
					days.style.left = '0';
				}
			} else {
				date.innerHTML = '';
				days.style.left = '0';
			}
			date.appendChild(days);
			var amount = this._dayOfMonth(year, month);
			var empty = this._getDay(year, month, 1);
			for (var i = 0; i < empty; i++) {
				var eSpan = document.createElement('span');
				eSpan.className = 'calempty';
				days.appendChild(eSpan);
			}
			for (var j = 0; j < amount; j++) {
				var span = document.createElement('span');
				span.className = 'calday calday' + (j + 1);
				if (this._getDay(year, month, j + 1) % 6 === 0) {
					span.className += ' weekend';
				}
				span.innerHTML = j + 1;
				days.appendChild(span);
			}
			if (year === new Date().getFullYear() && month === new Date().getMonth() + 1) {
				days.querySelector('.calday' + new Date().getDate()).className += ' today';
			} else {
				days.querySelector('.calday' + new Date().getDate()).className += ' nottoday';
			}
			date.style.height = days.offsetHeight + 'px';
			if (this.animated) {
				this._util._move(this, days, days.offsetWidth, direction);
			}
		},
		_util: {
			_addEvent: function(obj, evt, fn) {
				if (document.addEventListener) {
					obj.addEventListener(evt, fn, false);
				} else if (document.attachEvent) {
					obj.attachEvent('on' + evt, fn);
				}
			},
			_addPage: function(obj, direction) {
				var y = obj.cal.querySelector('.year').innerHTML;
				var m = obj.cal.querySelector('.month').innerHTML;
				obj._renderPage(parseInt(y), parseInt(m), direction);
			},
			_move: function(obj, ele, w, direction) {
				obj.counter = setInterval(function() {
					var fc = ele.parentNode.firstChild;
					if (ele.offsetLeft === 0) {
						if (fc !== ele) {
							ele.parentNode.removeChild(fc);
						}
						obj.counter = clearInterval(obj.counter);
						return false;
					}
					var fcl, ell;
					var delta = w / obj.speed * 5;
					if (direction === 'leftToRight') {
						fcl = fc.offsetLeft + delta;
						ell = ele.offsetLeft + delta > 0 ? 0 : ele.offsetLeft + delta;
					} else if (direction === 'rightToLeft') {
						fcl = fc.offsetLeft - delta;
						ell = ele.offsetLeft - delta < 0 ? 0 : ele.offsetLeft - delta;
					}
					fc.style.left = fcl + 'px';
					ele.style.left = ell + 'px';
				}, obj.speed);
			}
		}
	}
	window.Calendar = function(option) {
		var aOption = Array.prototype.slice.call(arguments);
		for (var i = 0; i < aOption.length; i++) {
			var calendar = new Calendar();
			calendar._init(aOption[i]);
		}
	}
})(window);