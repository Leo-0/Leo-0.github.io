$(function() {
	var $albumName = $('.album-name');
	var $imgName = $('.img-name');
	var $builtTime = $('.built-time');
	var $pre = $('#img_pre');
	var $next = $('#img_next');
	var loaded = false;
	var $wall = $('.photo-wall');
	var $kids;
	var $len = 0; // $kids length
	var col = 6;
	var row = 4;
	var wrapperWidth, wrapperHeight;
	var $kidWidth, $kidHeight;
	var $imgwrapper = $('.album-container');
	var $imgs;
	var $imgslen;
	var imgSize = [];
	var clickflag = false;
	var current = 0;
	var positionsArray = []; // 使每个$kid块设置背景时间不同
	var curPos = function() {
		this.x = [];
		this.y = [];
	};
	curPos.prototype.init = function() {
		for (var i = 0; i < $len; i++) {
			this.x[i] = 0;
			this.y[i] = 0;
		}
	};
	var cur_pos = new curPos(); // 当前背景位置
	var mouse_down = false;
	var mouseX = 0,
		mouseY = 0;
	var middle_posx = 0, //  计算使背景居中需要的偏移量
		middle_posy = 0;
	var imgsrc;

	function init() {
		if ($kids) {
			$kids.detach();
		}
		$imgs = $imgwrapper.find('img');
		$imgslen = $imgs.length;
		$kidWidth = Math.round($wall.width() / col);
		$kidHeight = Math.round($wall.height() / row);
		appendKids($wall, col, row);
		$kids = $wall.find('div.wall-kid');
		$len = $kids.length;
		wrapperWidth = $kidWidth * col;
		wrapperHeight = $kidHeight * row;
		cur_pos.init();
		initPositionArr();
		imgsrc = $imgs[current].getAttribute('data-path');
		var info = {
			aName: $imgs[current].getAttribute('data-album'),
			iName: $imgs[current].getAttribute('data-name'),
			bTime: $imgs[current].getAttribute('data-time')
		}
		loadImg(imgsrc, info, start);
	}

	function loadImg(src, info, callback) {
		$('<img/>').load(function() {
			imgSize[src] = {
				width: this.width,
				height: this.height
			};
			$albumName.text(info.aName);
			$imgName.text(info.iName);
			$builtTime.text(info.bTime);
			loaded = true;
			(callback && typeof callback === 'function') && callback(); //检测函数存在且是一个函数然后再调用
		}).error(function() {
			imgSize[src] = {
				width: this.width,
				height: this.height
			};
			$albumName.text(info.aName);
			$imgName.text(info.iName);
			$builtTime.text(info.bTime);
			loaded = false;
			(callback && typeof callback === 'function') && callback();
		}).attr('src', src);
	}

	function start() {
		$imgs.each(function(index, el) {
			if (index === current) {
				$(el).parent('.thumbnail').addClass('focus');
			} else {
				$(el).parent('.thumbnail').removeClass('focus');
			}
		});
		if (loaded) {
			calImgMiddlepos(wrapperWidth, wrapperHeight, imgsrc);
			var posarr = shuffle(positionsArray.slice(0));
			var index = 0;
			var l = $kids.length;
			$kids.each(function(i) {
				var $kid = $(this);
				var d = Math.random() > 0.5 ? true : false;
				if (d) {
					$kid.css({
						'transform': 'rotateY(180deg)'
					});
				} else {
					$kid.css({
						'transform': 'rotateX(180deg)'
					});
				}
				setTimeout(function() {
					setBackground($kid, i);
					if (d) {
						$kid.css({
							'transform': 'rotateY(0)'
						});
					} else {
						$kid.css({
							'transform': 'rotateX(0)'
						});
					}
					index++;
					if (index === l && clickflag) {
						setflag();
					}
				}, posarr.shift() * 25);
			});
		}
	}

	$pre.bind('click', function() {
		if (clickflag) {
			return;
		}
		setflag();
		loaded = false;
		--current;
		if (current < 0)
			current = $imgslen - 1;
		imgsrc = $imgs[current].getAttribute('data-path');
		var info = {
			aName: $imgs[current].getAttribute('data-album'),
			iName: $imgs[current].getAttribute('data-name'),
			bTime: $imgs[current].getAttribute('data-time')
		}
		loadImg(imgsrc, info, start);
	});
	$next.bind('click', function() {
		if (clickflag) {
			return;
		}
		setflag();
		loaded = false;
		++current;
		if (current > $imgslen - 1)
			current = 0;
		imgsrc = $imgs[current].getAttribute('data-path');
		var info = {
			aName: $imgs[current].getAttribute('data-album'),
			iName: $imgs[current].getAttribute('data-name'),
			bTime: $imgs[current].getAttribute('data-time')
		}
		loadImg(imgsrc, info, start);
	});
	$wall.bind('mousedown', function(event) {
		mouse_down = true;
		var x = getMousePos(event).x;
		var y = getMousePos(event).y;
		mouseX = getPosInObj($(this)[0], x, y).x;
		mouseY = getPosInObj($(this)[0], x, y).y;
	});
	$wall.bind('touchstart', function(event) {
		mouse_down = true;
		var touch = event.originalEvent.touches[0];
		var x = getMousePos(touch).x;
		var y = getMousePos(touch).y;
		mouseX = getPosInObj($(this)[0], x, y).x;
		mouseY = getPosInObj($(this)[0], x, y).y;
	});
	$(window).bind('mouseup', function(event) {
		mouse_down = false;
		$kids.each(function(index, el) {
			var arr = $(el).css('background-position').split(/px[\s]?/);
			recordCurPos(index, arr);
		});
	});
	$(document).bind('touchend', function(event) {
		mouse_down = false;
		$kids.each(function(index, el) {
			var arr = $(el).css('background-position').split(/px[\s]?/);
			recordCurPos(index, arr);
		});
	});
	$wall.bind('mousemove', function(event) {
		if (mouse_down) {
			var x2 = getMousePos(event).x;
			var y2 = getMousePos(event).y;
			var mouseX2 = getPosInObj($(this)[0], x2, y2).x;
			var mouseY2 = getPosInObj($(this)[0], x2, y2).y;
			var dx = mouseX - mouseX2;
			var dy = mouseY - mouseY2;
			$kids.each(function(index, el) {
				var back_pos = calMoveBackPos(index, dx, dy);
				$(el).css('background-position', back_pos.horizontalPos + "px " + back_pos.verticalPos + "px");
			});
		}
	});
	$wall.bind('touchmove', function(event) {
		event.preventDefault();
		if (mouse_down) {
			var touch = event.originalEvent.touches[0];
			var x2 = getMousePos(touch).x;
			var y2 = getMousePos(touch).y;
			var mouseX2 = getPosInObj($(this)[0], x2, y2).x;
			var mouseY2 = getPosInObj($(this)[0], x2, y2).y;
			var dx = mouseX - mouseX2;
			var dy = mouseY - mouseY2;
			$kids.each(function(index, el) {
				var back_pos = calMoveBackPos(index, dx, dy);
				$(el).css('background-position', back_pos.horizontalPos + "px " + back_pos.verticalPos + "px");
			});
		}
	});
	$wall.mouseover(addNavigation);
	$wall.mouseout(removeNavigation);
	$('.album-container').on('click', function(event) {
		var e = event || window.event;
		var tar = e.srcElement || e.target;
		if (tar.className.indexOf('athumb') !== -1) {
			if ($(window).width() <= 480) {
				$('.main').stop().animate({
					'right': '-100%'
				});
				$('body').addClass('full');
				$('.navbar-toggle').show();
			}
			current = $('.album-container .thumbnail').index(tar.offsetParent);
			imgsrc = $imgs[current].getAttribute('data-path');
			var info = {
				aName: $imgs[current].getAttribute('data-album'),
				iName: $imgs[current].getAttribute('data-name'),
				bTime: $imgs[current].getAttribute('data-time')
			}
			loaded = false;
			loadImg(imgsrc, info, start);
		}
	});

	function appendKids($parent, col, row) {
		$parent.css({
			'position': 'relative',
			'overflow': 'hidden',
			'perspective': '1000px',
			'perspective-origin': '10% 10%'
		});
		for (var i = 0; i < row; i++) {
			for (var j = 0; j < col; j++) {
				var $kid = $('<div class="wall-kid"></div>');
				$kid.css({
					'width': $kidWidth + 'px',
					'height': $kidHeight + 'px',
					'background-repeat': 'no-repeat',
					'transition': 'transform .4s',
					'position': 'absolute',
					'top': i * $kidHeight + 'px',
					'left': j * $kidWidth + 'px'
				}).on('selectstart', false);
				$kid.appendTo($parent);
			}
		}
	}

	function setBackground($el, index) {
		var back_pos = calBackPos(index);
		$el.css({
			'background-image': 'url(' + imgsrc + ')',
			'background-position': back_pos.horizontalPos + 'px ' + back_pos.verticalPos + 'px',
		});
		var arr = $el.css('background-position').split(/px[\s]?/);
		recordCurPos(index, arr);
	}

	function calBackPos(index) {
		return {
			horizontalPos: -1 * $kidWidth * (index % col) + middle_posx,
			verticalPos: -1 * $kidHeight * Math.floor(index / col) + middle_posy
		};
	}

	function calImgMiddlepos(wrapw, wraph, imgsrc) {
		var w = imgSize[imgsrc].width;
		var h = imgSize[imgsrc].height;
		middle_posx = (wrapw - w) / 2;
		middle_posy = (wraph - h) / 2;
	}

	function calMoveBackPos(index, dx, dy) {
		return {
			horizontalPos: cur_pos.x[index] - dx,
			verticalPos: cur_pos.y[index] - dy
		};
	}

	function recordCurPos(index, arr) {
		cur_pos.x[index] = parseInt(arr[0]);
		cur_pos.y[index] = parseInt(arr[1]);
	}
	//获取鼠标在屏幕中的坐标
	function getMousePos(event) {
		var e = event || window.event;
		return {
			x: e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
			y: e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop))
		};
	}
	//获取鼠标相对于对象的坐标
	function getPosInObj(el, x, y) {
		return {
			x: x - el.offsetLeft,
			y: y - el.offsetTop
		};
	}

	function initPositionArr() {
		for (var i = 0; i < $len; i++) {
			positionsArray[i] = i;
		}
	}
	// randommize the array
	function shuffle(array) {
		for (var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
		return array;
	};
	//seconde method to randommize the array
	function shuffle2(array) {
		return array.sort(function() {
			return 0.5 - Math.random()
		});
	}

	function addNavigation() {
		$next.stop().animate({
			'right': '0px'
		}, 300);
		$pre.stop().animate({
			'left': '0px'
		}, 300);
	}

	function removeNavigation() {
		$next.stop().animate({
			'right': '-100%'
		}, 300);
		$pre.stop().animate({
			'left': '-100%'
		}, 300);
	}

	function setflag() {
		clickflag = !clickflag;
	}
	$('.close').on('click', function() {
		$('.main').stop().animate({
			'right': '-100%'
		});
		$('body').addClass('full');
		init();
		$('.navbar-toggle').show();
	});
	$('.navbar-toggle').on('click', function() {
		var $this = $(this);
		$('.main').stop().animate({
			'right': 0
		}, function() {
			$this.hide();
		});
		$('body').removeClass('full');
		init();
	})
	$(window).bind('resize', function() {
		init();
	});
	$(document).ready(init);
});