$(function() {
	var $pre = $('#img_pre');
	var $next = $('#img_next');
	var $loading = $('.loading');
	var loaded = 0;
	var $wall = $('.photo-wall');
	var $kids;
	var col = 6;
	var row = 4;
	var wrapperWidth, wrapperHeight;
	var $kidWidth, $kidHeight;
	var $imgwrapper = $('.album-container');
	var $imgs = $imgwrapper.find('img');
	var $len = $imgs.length;
	var srcs = new Array($len);
	var imgSize = [];
	var clickflag = false;
	var current = 0;
	var positionsArray = [];
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
	var space_w, space_h;
	var mouse_down = false;
	var mouseX = 0,
		mouseY = 0;
	var dx = 0,
		dy = 0;
	var cur_pos = new curPos();
	var middle_posx = 0,
		middle_posy = 0;
	var imgsrc;

	function init() {
		if ($kids) {
			$kids.detach();
		}
		$kidWidth = Math.round($wall.width() / col);
		$kidHeight = Math.round($wall.height() / row);
		appendKids($wall, col, row);
		wrapperWidth = $kidWidth * col;
		wrapperHeight = $kidHeight * row;
		cur_pos.init();
		initPositionArr();
		if (loaded === $len) {
			start();
		} else {
			$imgs.each(function() {
				var $this = $(this);
				$('<img/>').load(function() {
					srcs[loaded] = $this.attr('src');
					imgSize[$this.attr('src')] = {
						width: $this.width(),
						height: $this.height()
					};
					++loaded;
					if (loaded === $len)
						start();
				}).error(function() {
					srcs[loaded] = $this.attr('src');
					imgSize[$this.attr('src')] = {
						width: $this.width(),
						height: $this.height()
					};
					++loaded;
					if (loaded === $len)
						start();
				}).attr('src', $this.attr('src'));
			});
		}
	}
	$pre.bind('click', function() {
		if (clickflag) {
			return;
		}
		setflag();
		--current;
		if (current < 0)
			current = $len - 1;
		imgsrc = srcs[current];
		calImgMiddlepos(wrapperWidth, wrapperHeight, imgsrc);
		var posarr = shuffle2(positionsArray.slice(0));
		var index = 0;
		var l = $kids.length;
		$kids.each(function(i) {
			var t = $(this);
			var d = Math.random() > 0.5 ? true : false;
			if (d) {
				t.css({
					'transform': 'rotateY(360deg)'
				});
			} else {
				t.css({
					'transform': 'rotateX(360deg)'
				});
			}
			setTimeout(function() {
				setBackground(t, i);
				if (d) {
					t.css({
						'transform': 'rotateY(0)'
					});
				} else {
					t.css({
						'transform': 'rotateX(0)'
					});
				}
				index++;
				if (index === l) {
					setflag();
				}
			}, posarr.shift() * 25);
		});
	});
	$next.bind('click', function() {
		if (clickflag) {
			return;
		}
		setflag();
		++current;
		if (current > $len - 1)
			current = 0;
		imgsrc = srcs[current];
		calImgMiddlepos(wrapperWidth, wrapperHeight, imgsrc);
		var posarr = shuffle2(positionsArray.slice(0));
		var index = 0;
		var l = $kids.length;
		$kids.each(function(i) {
			var t = $(this);
			var d = Math.random() > 0.5 ? true : false;
			if (d) {
				t.css({
					'transform': 'rotateY(360deg)'
				});
			} else {
				t.css({
					'transform': 'rotateX(360deg)'
				});
			}
			setTimeout(function() {
				setBackground(t, i);
				if (d) {
					t.css({
						'transform': 'rotateY(0)'
					});
				} else {
					t.css({
						'transform': 'rotateX(0)'
					});
				}
				index++;
				if (index === l) {
					setflag();
				}
			}, posarr.shift() * 25);
		});
	});
	$wall.bind('mousedown', function(event) {
		mouse_down = true;
		var x = getMousePos(event).x;
		var y = getMousePos(event).y;
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
	$wall.bind('mousemove', function(event) {
		if (mouse_down) {
			var x2 = getMousePos(event).x;
			var y2 = getMousePos(event).y;
			var mouseX2 = getPosInObj($(this)[0], x2, y2).x;
			var mouseY2 = getPosInObj($(this)[0], x2, y2).y;
			dx = mouseX - mouseX2;
			dy = mouseY - mouseY2;
			$kids.each(function(index, el) {
				var back_pos = calMoveBackPos(index, dx, dy);
				$(el).css('background-position', back_pos.horizontalPos + "px " + back_pos.verticalPos + "px");
			});
		}
	});
	$wall.mouseover(addNavigation);
	$wall.mouseout(removeNavigation);

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
					'background-color': 'white',
					'transition': 'transform .6s',
					'position': 'absolute',
					'top': i * $kidHeight + 'px',
					'left': j * $kidWidth + 'px'
				}).on('selectstart', false);
				$kid.appendTo($parent);
			}
		}
	}

	function start() {
		$loading.hide();
		$kids = $wall.find('div.wall-kid');
		imgsrc = srcs[current];
		calImgMiddlepos(wrapperWidth, wrapperHeight, imgsrc);
		$kids.each(function(index) {
			var $kid = $(this);
			setBackground($kid, index);
		});
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

	function calspace(pl, pc) {
		space_w = $(window).width() / (pl + 1);
		space_h = $(window).height() / (pc + 1);
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
	$(window).bind('resize', function() {
		init();
	});
	$(document).ready(init);
});