$(window).on('resize',function() {	
	$('body').css('margin-bottom', $('.footer').height()); 
});	
$(document).ready(function() {
    $(window).trigger('resize');
});
$(window).on('load',function() {
    $(window).trigger('resize');
});