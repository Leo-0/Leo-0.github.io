$(function() {
	var hd = $('#home-div');
	var svg = $('#svg');
	var to = $('#trick-outter');
	var inp = $('#trickinput');
	var nav = $('#dock');
	var items = $('.menu-item');
	var name = '';
	var sda = 10;
	var sdo = 200;
	var dur = 3;
	var tf = 'linear';
	var sc = '#fff';
	var fc = '#fff';
	var op = 0;
	var curHref = '';
	$(window).load(function() {
		var hashTagContent = window.location.hash;
		curHref = window.location.pathname;
		if(hashTagContent === '#input') {
			showTrickInput(true);
		} else if(hashTagContent === '#welcome') {
			showAvatarAndNav(true);
		}
	});
	svg.mouseover(function(event) {
		$('#rangewrap').fadeIn();
	});
	svg.click(function() {
		showTrickInput(false);
	});
	inp.keyup(function(event) {
		var e = event || window.event;
		if(e.keyCode === 13 && $(this).val().trim() !== '') {
			name = $(this).val().trim();
			showAvatarAndNav(false);
		}
	});
	function showTrickInput(isAppended) {
		if(!isAppended) {
			window.location.href = curHref + '#input'
		}
		hd.fadeOut(function() {
			hd.remove();
			to.fadeIn(function() {
				inp.focus();
			});
		});
	}
	function showAvatarAndNav(isAppended) {
		if(!isAppended) {
			window.location.href = curHref+'#welcome';
		}
		hd.fadeOut(function() {
			hd.remove();
			to.slideUp(function() {
				to.remove();
				$('.topwrap').fadeIn(function() {
					nav.fadeIn();
				});
				if(name === '') {
					$('.msg-content').html('Hello somebody');
				} else {
					$('.msg-content').html('Hello ' + name);
				}
			});			
		});
	}
	items.click(function(event) {
		var e = event || window.event;
		var $this = $(this);
		var aHref = $this.children('a').attr('href');
		if(aHref !== undefined && aHref !== '') {
			window.location.href = aHref;
		}
		var msg = ['不要点我','点了也不给你跳转，不信你试其他的','为什么不跳转呢？','','因为','我正在重做→_→','哈哈哈哈哈'];
		$('.msg-content').html(msg[$this.index()]);
	});
	$('input[name="dasharray"]').on('input propertychange', function(event) {
		event.preventDefault();
		var t = $(this);
		sda = t.val();
		$('#dasharray').html('('+sda+')');
		svgAnimate(sda, sdo, dur, tf, sc, fc);
	});
	$('input[name="dashoffset"]').on('input propertychange', function(event) {
		event.preventDefault();
		var t = $(this);
		sdo = t.val();
		$('#dashoffset').html('('+sdo+')');
		svgAnimate(sda, sdo, dur, tf, sc, fc);
	});
	$('input[name="duration"]').on('input propertychange', function(event) {
		event.preventDefault();
		var t = $(this);
		dur = t.val() / 1000;
		$('#duration').html('('+dur+'s)');
		svgAnimate(sda, sdo, dur, tf, sc, fc);
	});
	$('input[name="opacity"]').on('input propertychange', function(event) {
		event.preventDefault();
		var t = $(this);
		op = t.val() / 10;
		$('#opacity').html('('+op+')');
		svgAnimate(sda, sdo, dur, tf, sc, fc, op);
	});
	$('input[name="function"]').change(function(event) {
		 tf = $('input[name="function"]:checked').val();
		 svgAnimate(sda, sdo, dur, tf, sc, fc);
	});
	$('input[name="stroke"]').change(function(event) {
		 sc = $(this).val();
		 svgAnimate(sda, sdo, dur, tf, sc, fc);
	});
	$('input[name="fill"]').change(function(event) {
		 fc = $(this).val();
		 svgAnimate(sda, sdo, dur, tf, sc, fc);
	});
	function svgAnimate(strokeDasharray,strokeDashoffset,duration,timingfunc,strokecolor,fillcolor,fillopacity) {
		var svg = $('.svg-path');
		// svg.animate({
		// 	'stroke-dasharray': strokeDasharray,
		// 	'stroke-dashoffset': strokeDashoffset},
		// 	400, function() {
		// 		svgAnimate(strokeDasharray,strokeDashoffset);
		// 		// var ele = $(this)[0];
		// 		// console.log(ele.getTotalLength());
		// });
		svg.css('strokeDasharray',strokeDasharray);
		svg.css('strokeDashoffset',strokeDashoffset);
		svg.attr({
			'stroke': strokecolor,
			'fill': fillcolor,
			'fill-opacity': fillopacity
		});
		var animateStr = 'draw ' + duration + 's ' + timingfunc + ' infinite';
		svg.css('animation',animateStr);
	}
});