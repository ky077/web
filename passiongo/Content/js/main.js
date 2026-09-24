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

  var isAuthenticatedPage = function () {
    var bodyClass = $("body").attr("class") || "";

    return bodyClass.split(/\s+/).indexOf('index') === -1 &&
      bodyClass.split(/\s+/).indexOf('login') === -1 &&
      bodyClass.split(/\s+/).indexOf('register') === -1;
  };

  var applyHeaderAuthState = function () {
    var loggedIn = isAuthenticatedPage();
    var isLoggedIndex = $('body').hasClass('index-logged');
    var $homeLink = $('.nav-index .nav-link');
    var homeHref = loggedIn ? 'index-logged.html' : 'index.html';

    $('.nav-user').toggleClass('d-none', !loggedIn);
    $('.nav-register, .nav-login').toggleClass('d-none', loggedIn);

    $homeLink.toggleClass('active', isLoggedIndex);
    if (isLoggedIndex) {
      $homeLink.attr('aria-current', 'page');
    } else {
      $homeLink.removeAttr('aria-current');
    }
    $homeLink.attr('href', homeHref);
    $('.navbar-brand').attr('href', homeHref);
  };

  var applyAuthState = function () {
    applyHeaderAuthState();
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
    }, 1500);
  };
  spinner();

  applyAuthState();

  // 課程頁初始不預選冊數；使用者點選後才載入對應課程地圖。
  var initCourseSelector = function () {
    var $courseList = $('#course-list');
    if (!$courseList.length) return;

    var $unselected = $courseList.find('.course-list-unselected');
    var $selected = $courseList.find('.course-list-selected');
    var courseMap = { terms: [] };
    var progressMap = { terms: [] };

    var statusText = {
      done: '已完成',
      active: '進行中',
      pending: '開始練習',
      locked: '尚未解鎖'
    };

    var renderCourse = function (termId) {
      var term = (courseMap.terms || []).find(function (item) { return item.id === termId; });
      if (!term) return;

      var progress = ((progressMap.terms || []).find(function (item) { return item.id === termId; }) || {}).lessons || [];
      var progressByOrder = {};
      progress.forEach(function (item) { progressByOrder[item.order] = item; });

      var completed = progress.filter(function (item) { return item.status === 'done'; }).length;
      var total = term.units.reduce(function (sum, unit) { return sum + unit.lessons.length; }, 0);
      var html = '<h3 class="course-list-title"><i class="fa-solid fa-map" aria-hidden="true"></i>課程地圖' +
        '<div class="course-list-progress">已完成：<span class="mx-1">' + completed + '</span>/<span class="mx-1">' + total + '</span>課</div></h3>';

      term.units.forEach(function (unit) {
        html += '<div class="card-group card-group-gap"><div class="card card-unit"><div class="card-body"><h4 class="card-title">' +
          '<div class="card-title-unit">' + unit.unit + '</div><div class="card-title-unit-text">' + unit.title + '</div></h4></div></div>';
        unit.lessons.forEach(function (lesson) {
          var item = progressByOrder[lesson.order] || {};
          var status = item.status || (lesson.isOpen ? 'pending' : 'locked');
          var href = lesson.isOpen ? lesson.href + '?term=' + encodeURIComponent(termId) + '&lesson=' + lesson.order : '#';
          html += '<a href="' + href + '" class="card" data-card-lesson="' + lesson.order + '" data-card-status="' + status + '">' +
            '<div class="card-body"><small class="card-lesson">Lesson ' + lesson.order + '</small><h5 class="card-title">' + lesson.title + '</h5></div><div class="card-footer"><small class="status-text">' + (statusText[status] || statusText.locked) + '</small></div></a>';
        });
        html += '</div>';
      });
      $selected.html(html);
    };

    $('.course-nav').on('click', '.nav-link', function (event) {
      event.preventDefault();
      var $link = $(this);
      $('.course-nav .nav-link').removeClass('active').removeAttr('aria-current');
      $link.addClass('active').attr('aria-current', 'page');
      renderCourse($link.data('course-term'));
      $unselected.addClass('d-none');
      $selected.removeClass('d-none');
    });

    $.when($.getJSON('Content/js/course-map.json'), $.getJSON('Content/js/student-progress.json'))
      .done(function (map, progress) {
        courseMap = map[0];
        progressMap = progress[0];
        var requestedTerm = new URLSearchParams(window.location.search).get('term');
        var $requestedLink = requestedTerm ? $('.course-nav .nav-link[data-course-term="' + requestedTerm + '"]') : $();
        if ($requestedLink.length) {
          $requestedLink.trigger('click');
        }
      })
      .fail(function () { courseMap = { terms: [] }; progressMap = { terms: [] }; });
  };

  initCourseSelector();

  $(document).on('submit', '#loginForm', function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    setLoggedIn(true);
    window.location.href = 'index-logged.html';
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







