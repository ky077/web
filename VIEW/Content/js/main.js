(function ($) {
	"use strict";
	
	//load header
	$('header').load('master-header.html', function () {
		//logState();
		
		toggleDropdownByScreenWidth(); 
		$(window).on('resize', toggleDropdownByScreenWidth);
	});

	//load header
	$('footer').load('master-footer.html');
	
})(jQuery);