(function ($) {
	"use strict";
	
	//load header
	$('header').load('master-header.html', function () {
		logState();
	});

	//load header
	$('footer').load('master-footer.html');  
})(jQuery);