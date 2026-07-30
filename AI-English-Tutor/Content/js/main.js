(function ($) {
  "use strict";

  //load header
  $('header').load('master-header.html');
	
  //load header
  $('footer').load('master-footer.html');
	
	 //Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 500);
  };
  spinner();

})(jQuery);
