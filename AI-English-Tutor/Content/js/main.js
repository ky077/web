(function ($) {
  "use strict";

  var AUTH_STORAGE_KEY = 'passionGoLoggedIn';

  var isLoggedIn = function () {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch (error) {
      return false;
    }
  };

  var setLoggedIn = function (loggedIn) {
    try {
      if (loggedIn) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        return;
      }

      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      return;
    }
  };

  var applyHeaderAuthState = function () {
    var loggedIn = isLoggedIn();

    $('.nav-user').toggleClass('d-none', !loggedIn);
    $('.nav-register, .nav-login').toggleClass('d-none', loggedIn);
  };

  var applyIndexAuthState = function () {
    if (!$('body').hasClass('index')) {
      return;
    }

    var loggedIn = isLoggedIn();
    var $hero = $('.hero');
    var $pageContent = $('.page-content');
    var $heroStart = $('.btn-hero-start');

    $hero.toggleClass('h-100', !loggedIn);
    $pageContent.toggleClass('d-none', !loggedIn);
    $heroStart.attr('href', loggedIn ? '#page-content' : 'login.html');
  };

  var applyAuthState = function () {
    applyHeaderAuthState();
    applyIndexAuthState();
  };

  //load header
  $('header').load('master-header.html', function () {
    applyAuthState();
  });

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

  applyAuthState();

  $(document).on('click', '.btn-login-submit', function () {
    setLoggedIn(true);
    window.location.href = 'index.html';
  });

  $(document).on('click', '.btn-hero-start', function (event) {
    var $pageContent = $('.page-content');

    if (!isLoggedIn() || !$pageContent.length) {
      return;
    }

    event.preventDefault();
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    $pageContent.removeClass('d-none');
    $pageContent[0].scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  $(document).on('click', '.btn-logout', function (event) {
    event.preventDefault();
    setLoggedIn(false);
    window.location.href = 'index.html';
  });

  //隱藏/顯示密碼
  $('.btn-showHidePD').click(function () {
    var $button = $(this);
    var $input = $button.closest('.input-group-password').find('input[type="password"], input[type="text"]');
    var isHidden = $input.attr('type') === 'password';

    // 切換 icon 和 input 類型
    $input.attr('type', isHidden ? 'text' : 'password');
    $button.attr('aria-pressed', isHidden ? 'true' : 'false');
    $button.find('i').toggleClass('fa-eye', !isHidden).toggleClass('fa-eye-slash', isHidden);
  });

})(jQuery);
