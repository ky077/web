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

  //隱藏/顯示密碼
  $('.btn-showHidePD').click(function () { 
    var $button = $(this);
    var $input = $button.siblings('input');

    // 切換 icon 和 input 類型
    $button.find('i').toggleClass('fa-eye-slash');
    $input.attr('type', $input.attr('type') === 'password' ? 'text' : 'password');
  });

})(jQuery);
