$(function() {
	var d = $('#home-div');
	var svg = $('#svg');
	var inp = $('#trickinput');
	var nav = $('#nav');
	var items = $('.menu-item');
	var name = '';
	var sda = 10;
	var sdo = 200;
	var dur = 3;
	var tf = 'linear';
	var sc = '#fff';
	var fc = '#fff';
	var op = 0;
	svg.mouseover(function(event) {
		$('#rangewrap').fadeIn();
	});
	svg.click(function() {
		d.fadeOut(function() {
			d.remove();
			$('#trick-outter').fadeIn(function() {
				$('#trickinput').focus();
			});
		});
	});
	inp.keyup(function(event) {
		var e = event || window.event;
		if(e.keyCode === 13 && $(this).val().trim() !== '') {
			name = $(this).val().trim();
			var to = $('#trick-outter');
			to.slideUp(function() {
				showAvatarAndNav();
				to.remove();
			});
		}
	});
	function showAvatarAndNav() {
		$('.topwrap').fadeIn();
		$('.msg-content').html('Hello ' + name);
		nav.fadeIn();
	}
	items.click(function(event) {
		var e = event || window.event;
		var $this = $(this);
		var msg = ['不要点我','点了也不给你跳转，不信你试其他的','为什么不跳转呢？','因为','我正在重做→_→','哈哈哈哈哈'];
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