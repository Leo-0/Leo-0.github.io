$(function() {
	var d = $('#home-div');
	var svg = $('#svg');
	var inp = $('#trickinput');
	var nav = $('#nav');
	var items = $('.menu-item');
	var name = '';
	svg.click(function() {
		// $(this).slideUp();
		d.fadeOut('slow',function() {
			d.remove();
			$('#trickinput').focus();
		});
	});
	inp.keyup(function(event) {
		var e = event || window.event;
		if(e.keyCode === 13 && $(this).val().trim() !== '') {
			name = $(this).val().trim();
			var to = $('#trick-outter');
			to.slideUp('slow', function() {
				showAvatarAndNav();
				to.remove();
			});
		}
	});
	function showAvatarAndNav() {
		$('.topwrap').fadeIn('slow');
		$('.msg-content').html('Hello ' + name);
		nav.fadeIn('slow');
	}
	items.click(function(event) {
		var e = event || window.event;
		var $this = $(this);
		var msg = ['不要点我','点了也不给你跳转，不信你试其他的','为什么不跳转呢？','因为','我正在重做→_→','哈哈哈哈哈'];
		// console.log($(this).offset().top+' '+$(this).offset().left+' '+$this.width()+' '+$this.height());
		// console.log($(this).offset().top+$this.height() / 2);
		// console.log($(this).offset().left+$this.width() / 2);
		$('.msg-content').html(msg[$this.index()]);
	});
});