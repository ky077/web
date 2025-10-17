$(window).on('resize',function() {
	if( $(window).width()>992 ){
		$("#modal-nav, .modal-backdrop").removeClass("in");
	}
});
$(document).ready(function() {
    $(window).trigger('resize');
});